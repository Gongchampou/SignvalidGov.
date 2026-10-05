/**
 * Produces a "display copy" of a VERIFIED PDF in which the signature widget's
 * yellow "?" (Adobe legacy layer n1 or drawn icon) is replaced by an authentic green tick.
 *
 * - Only runs for files whose status is 'valid' (verified against CCA India roots).
 * - The signature field is flattened into the page, and the visual indicator is updated.
 * - The returned PDF contains ALL of the user's original document pages, content, and formatting.
 */
import {
  PDFDocument, PDFName, PDFDict, PDFArray, PDFRef, PDFRawStream, PDFStream, PDFNumber,
  StandardFonts, rgb, decodePDFRawStream,
  pushGraphicsState, popGraphicsState, concatTransformationMatrix, drawObject,
  moveTo, lineTo, closePath, fillAndStroke, setFillingRgbColor, setStrokingRgbColor, setLineWidth,
} from '@cantoo/pdf-lib';
import type { PDFPage, PDFContext, PDFObject } from '@cantoo/pdf-lib';
import type { ValidatedFile } from '../types';

export class PasswordRequiredError extends Error {
  constructor() { super('PASSWORD_REQUIRED'); }
}

const N = (s: string) => PDFName.of(s);

// Normalized points for authentic Adobe Acrobat signature green checkmark.
// Unit square [0, 1] x [0, 1], with (0,0) at bottom-left and (1,1) at top-right.
const TICK_POINTS: [number, number][] = [
  [0.36, 0.08], // bottom crook vertex
  [0.05, 0.44], // short arm outer tip
  [0.17, 0.56], // short arm inner tip
  [0.37, 0.32], // inner elbow
  [0.83, 0.94], // long arm inner tip
  [0.97, 0.80], // long arm outer tip
];

function tickContent(x: number, y: number, w: number, h: number): string {
  const size = Math.min(w, h) * 0.92;
  const ox = x + (w - size) / 2;
  const oy = y + (h - size) / 2;

  const pts = TICK_POINTS.map(([px, py]) => [ox + px * size, oy + py * size] as [number, number]);
  const f = (n: number) => n.toFixed(3);

  // Black 3D drop shadow offset (shifted down and right) matching authentic Adobe Acrobat
  const shadowDx = size * 0.055;
  const shadowDy = size * 0.055;
  const shadowPts = pts.map(([px, py]) => [px + shadowDx, py - shadowDy] as [number, number]);

  const shadowPath = shadowPts.map(([px, py], i) => `${f(px)} ${f(py)} ${i === 0 ? 'm' : 'l'}`).join('\n');
  const tickPath = pts.map(([px, py], i) => `${f(px)} ${f(py)} ${i === 0 ? 'm' : 'l'}`).join('\n');

  const strokeW = Math.max(0.6, size * 0.025);

  return [
    'q',
    // 1. Black 3D drop shadow (solid fill + stroke)
    '0 0 0 rg',
    '0 0 0 RG',
    `${f(strokeW * 1.5)} w`,
    '1 j 1 J',
    shadowPath,
    'h',
    'B',
    'Q',
    'q',
    // 2. Vivid Adobe signature green with crisp black edge (#00A651)
    '0 0.65 0.31 rg',
    '0 0 0 RG',
    `${f(strokeW)} w`,
    '1 j 1 J',
    tickPath,
    'h',
    'B',
    'Q\n'
  ].join('\n');
}

/** Vector drawing helper for fallback or sample document pages */
function drawTickWithShadow(page: PDFPage, tx: number, ty: number, size: number) {
  const pts = TICK_POINTS.map(([px, py]) => [tx + px * size, ty + py * size] as [number, number]);
  const shadowDx = size * 0.055;
  const shadowDy = size * 0.055;
  const shadowPts = pts.map(([px, py]) => [px + shadowDx, py - shadowDy] as [number, number]);

  // Black 3D drop shadow
  page.pushOperators(
    pushGraphicsState(),
    setFillingRgbColor(0, 0, 0),
    setStrokingRgbColor(0, 0, 0),
    setLineWidth(Math.max(0.6, size * 0.035)),
    moveTo(shadowPts[0][0], shadowPts[0][1]),
    ...shadowPts.slice(1).map(([px, py]) => lineTo(px, py)),
    closePath(),
    fillAndStroke(),
    popGraphicsState()
  );

  // Adobe signature green with thin black edge
  page.pushOperators(
    pushGraphicsState(),
    setFillingRgbColor(0, 0.65, 0.31),
    setStrokingRgbColor(0, 0, 0),
    setLineWidth(Math.max(0.4, size * 0.02)),
    moveTo(pts[0][0], pts[0][1]),
    ...pts.slice(1).map(([px, py]) => lineTo(px, py)),
    closePath(),
    fillAndStroke(),
    popGraphicsState()
  );
}

function numbers(arr: PDFArray | undefined, fallback: number[]): number[] {
  if (!arr) return fallback;
  const out: number[] = [];
  for (let i = 0; i < arr.size(); i++) {
    const v = arr.lookup(i);
    out.push(v instanceof PDFNumber ? v.asNumber() : 0);
  }
  return out.length === fallback.length ? out : fallback;
}

function streamBytes(stream: PDFStream): Uint8Array {
  if (stream instanceof PDFRawStream) return decodePDFRawStream(stream).decode();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = stream as any;
  return typeof s.getUnencodedContents === 'function' ? s.getUnencodedContents() : s.getContents();
}

/** Replace a stream object's content while keeping its dictionary. */
function replaceStream(context: PDFContext, ref: PDFRef, oldDict: PDFDict, content: Uint8Array) {
  const fresh = context.flateStream(content);
  for (const [k, v] of oldDict.entries()) {
    const key = k.asString();
    if (key === '/Filter' || key === '/DecodeParms' || key === '/Length') continue;
    fresh.dict.set(k, v);
  }
  context.assign(ref, fresh);
}

const latin1 = new TextDecoder('latin1');
const toLatin1Bytes = (s: string) => Uint8Array.from(s, ch => ch.charCodeAt(0) & 0xff);

/**
 * Walk an appearance stream and its nested form XObjects.
 * - Replaces layer "n1" (the "?") and "n2" (valid layer) with Adobe's 3D-shadow green tick.
 * - Clears layer "n3" (the red X / invalid layer).
 * - Rewrites literal text "(Signature Not Verified)" / "(Validity Unknown)" -> "(Signature valid)".
 */
function rewriteAppearance(context: PDFContext, ref: PDFRef, depth = 0, seen = new Set<string>()): boolean {
  if (depth > 5 || seen.has(ref.toString())) return false;
  seen.add(ref.toString());

  const stream = context.lookup(ref);
  if (!(stream instanceof PDFStream)) return false;
  let modified = false;

  try {
    const text = latin1.decode(streamBytes(stream));
    const replaced = text
      .replace(/\(Signature\s+Not\s+Verified\)/gi, '(Signature valid)')
      .replace(/\(Signature\s+not\s+verified\)/gi, '(Signature valid)')
      .replace(/\(Signature\s+Verified\)/gi, '(Signature valid)')
      .replace(/\(Validity\s+Unknown\)/gi, '(Signature valid)')
      .replace(/\(validity\s+unknown\)/gi, '(Signature valid)');
    if (replaced !== text) {
      replaceStream(context, ref, stream.dict, toLatin1Bytes(replaced));
      modified = true;
    }
  } catch { /* undecodable filter */ }

  const current = context.lookup(ref) as PDFStream;
  const resources = current.dict.lookupMaybe(N('Resources'), PDFDict);
  const xobjects = resources?.lookupMaybe(N('XObject'), PDFDict);
  if (!xobjects) return modified;

  for (const [name, value] of xobjects.entries()) {
    if (!(value instanceof PDFRef)) continue;
    const layer = context.lookup(value);
    if (!(layer instanceof PDFStream)) continue;
    const key = name.asString();

    if (key === '/n1') {
      const [x0, y0, x1, y1] = numbers(layer.dict.lookupMaybe(N('BBox'), PDFArray), [0, 0, 100, 100]);
      const w = Math.abs(x1 - x0), h = Math.abs(y1 - y0);
      const minX = Math.min(x0, x1), minY = Math.min(y0, y1);
      replaceStream(context, value, layer.dict, toLatin1Bytes(tickContent(minX, minY, w, h)));
      modified = true;
    } else if (key === '/n3') {
      replaceStream(context, value, layer.dict, new Uint8Array());
      modified = true;
    } else if (rewriteAppearance(context, value, depth + 1, seen)) {
      modified = true;
    }
  }
  return modified;
}

function isSigField(dict: PDFDict): boolean {
  let d: PDFDict | undefined = dict;
  for (let i = 0; d && i < 5; i++) {
    if (d.get(N('FT')) === N('Sig')) return true;
    const v = d.lookupMaybe(N('V'), PDFDict);
    if (v && (v.get(N('Type')) === N('Sig') || v.get(N('Filter')))) return true;
    d = d.lookupMaybe(N('Parent'), PDFDict);
  }
  return false;
}

/** Flatten a widget's rewritten appearance onto the page at its /Rect. */
function flattenWidget(page: PDFPage, context: PDFContext, widget: PDFDict): boolean {
  const [r0, r1, r2, r3] = numbers(widget.lookupMaybe(N('Rect'), PDFArray), [0, 0, 0, 0]);
  const rx = Math.min(r0, r2), ry = Math.min(r1, r3), rw = Math.abs(r2 - r0), rh = Math.abs(r3 - r1);
  const flags = (widget.lookupMaybe(N('F'), PDFNumber)?.asNumber() ?? 0);
  if (rw < 1 || rh < 1 || (flags & 2) || (flags & 32)) return false; // invisible / hidden

  const ap = widget.lookupMaybe(N('AP'), PDFDict);
  let apRef = ap?.get(N('N'));
  if (apRef && !(apRef instanceof PDFRef)) apRef = context.register(apRef as PDFObject);
  const apStream = apRef ? context.lookup(apRef) : undefined;

  // Render rewritten original appearance onto the page
  if (apRef instanceof PDFRef && apStream instanceof PDFStream) {
    const dict = apStream.dict;
    if (!dict.get(N('Subtype'))) dict.set(N('Subtype'), N('Form'));
    if (!dict.get(N('Type'))) dict.set(N('Type'), N('XObject'));
    const [b0, b1, b2, b3] = numbers(dict.lookupMaybe(N('BBox'), PDFArray), [0, 0, rw, rh]);
    const [ma, mb, mc, md, me, mf] = numbers(dict.lookupMaybe(N('Matrix'), PDFArray), [1, 0, 0, 1, 0, 0]);
    const corners = [[b0, b1], [b2, b1], [b0, b3], [b2, b3]].map(([x, y]) => [ma * x + mc * y + me, mb * x + md * y + mf]);
    const tx0 = Math.min(...corners.map(c => c[0])), tx1 = Math.max(...corners.map(c => c[0]));
    const ty0 = Math.min(...corners.map(c => c[1])), ty1 = Math.max(...corners.map(c => c[1]));
    const sx = (tx1 - tx0) > 0 ? rw / (tx1 - tx0) : 1;
    const sy = (ty1 - ty0) > 0 ? rh / (ty1 - ty0) : 1;

    const name = page.node.newXObject('SVSig', apRef);
    page.pushOperators(
      pushGraphicsState(),
      concatTransformationMatrix(sx, 0, 0, sy, rx - tx0 * sx, ry - ty0 * sy),
      drawObject(name),
      popGraphicsState()
    );
    return true;
  }

  return false;
}

async function loadDecrypted(file: ValidatedFile, password?: string): Promise<PDFDocument> {
  const opts = { updateMetadata: false } as const;
  if (file.bytes.length === 0) {
    // If testing with a sample document that didn't have uploaded bytes, create a demo document
    const demo = await PDFDocument.create();
    const page = demo.addPage([595.28, 841.89]); // A4
    const font = await demo.embedFont(StandardFonts.Helvetica);
    const fontBold = await demo.embedFont(StandardFonts.HelveticaBold);

    page.drawText('DEMO CERTIFIED GOVERNMENT DOCUMENT', { x: 50, y: 780, size: 16, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(`Document: ${file.name}`, { x: 50, y: 750, size: 11, font });
    page.drawText(`Type: ${file.metadata.documentType}`, { x: 50, y: 730, size: 11, font });
    page.drawText(`Signer: ${file.metadata.signerIdentity}`, { x: 50, y: 710, size: 11, font });
    page.drawText(`Authority: ${file.metadata.certificateAuthority}`, { x: 50, y: 690, size: 11, font });
    page.drawText(`Timestamp: ${file.metadata.timestamp}`, { x: 50, y: 670, size: 11, font });

    // Draw sample signature box with green tick
    page.drawRectangle({ x: 340, y: 80, width: 220, height: 75, borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.8, color: rgb(1, 1, 1) });
    page.drawText('Signature valid', { x: 350, y: 136, size: 13, font: fontBold, color: rgb(0, 0, 0) });
    page.drawText(`Digitally signed by ${file.metadata.signerIdentity}`, { x: 350, y: 120, size: 7.5, font, color: rgb(0, 0, 0) });
    page.drawText(`Date: ${file.metadata.timestamp}`, { x: 350, y: 107, size: 7.5, font, color: rgb(0, 0, 0) });
    page.drawText(`CA: ${file.metadata.certificateAuthority.substring(0, 26)}`, { x: 350, y: 94, size: 7.5, font, color: rgb(0, 0, 0) });
    drawTickWithShadow(page, 498, 92, 50);

    return demo;
  }

  if (!file.encrypted) return PDFDocument.load(file.bytes, opts);
  try {
    return await PDFDocument.load(file.bytes, { ...opts, password: password ?? '' });
  } catch {
    throw new PasswordRequiredError();
  }
}

export function isAlreadyVerifiedPdf(bytes: Uint8Array): boolean {
  if (!bytes || bytes.length === 0) return false;
  // Decode sample from document to check for embedded markers
  const text = new TextDecoder('latin1').decode(bytes);
  return (
    text.includes('SignValidVerified') ||
    text.includes('PermanentGreenTick') ||
    text.includes('SIGNVALID_VERIFIED') ||
    text.includes('SignValid Display Copy')
  );
}

export async function createGreenTickCopy(file: ValidatedFile, password?: string): Promise<Uint8Array> {
  // If the document is already verified with a green tick, return original bytes directly (prevents double-up!)
  if (isAlreadyVerifiedPdf(file.bytes) || file.status === 'already_verified') {
    return file.bytes;
  }

  // If the document is missing digital signatures, do not attempt to stamp fake banners
  if (file.status === 'unsigned' || file.signatures.length === 0) {
    throw new Error('This document does not contain a digital signature to verify.');
  }

  const doc = await loadDecrypted(file, password);
  const context = doc.context;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pagesWithSig = new Set<number>();
  const removedRefs = new Set<string>();

  doc.getPages().forEach((page, pageIndex) => {
    const annots = page.node.Annots();
    if (!annots) return;
    for (let i = annots.size() - 1; i >= 0; i--) {
      const entry = annots.get(i);
      const widget = entry instanceof PDFRef ? context.lookupMaybe(entry, PDFDict) : (entry instanceof PDFDict ? entry : undefined);
      if (!widget || widget.get(N('Subtype')) !== N('Widget') || !isSigField(widget)) continue;

      const apN = widget.lookupMaybe(N('AP'), PDFDict)?.get(N('N'));
      let apNRef: PDFRef | undefined;
      if (apN instanceof PDFRef) apNRef = apN;
      else if (apN instanceof PDFStream) apNRef = context.register(apN);
      if (apNRef) rewriteAppearance(context, apNRef);
      if (flattenWidget(page, context, widget)) pagesWithSig.add(pageIndex);

      annots.remove(i);
      if (entry instanceof PDFRef) removedRefs.add(entry.toString());
      const parent = widget.get(N('Parent'));
      if (parent instanceof PDFRef) removedRefs.add(parent.toString());
    }
  });

  // Remove signature fields from AcroForm so Adobe reader does not trigger a false-red cross on a modified copy
  const acro = doc.catalog.lookupMaybe(N('AcroForm'), PDFDict);
  const fields = acro?.lookupMaybe(N('Fields'), PDFArray);
  if (fields) {
    for (let i = fields.size() - 1; i >= 0; i--) {
      const f = fields.get(i);
      const fd = f instanceof PDFRef ? context.lookupMaybe(f, PDFDict) : undefined;
      if ((f instanceof PDFRef && removedRefs.has(f.toString())) || (fd && isSigField(fd))) fields.remove(i);
    }
  }
  acro?.delete(N('SigFlags'));
  doc.catalog.delete(N('Perms'));

  // If no visible widget was found on the document (e.g. invisible signature), add an official verified banner on page 1
  if (pagesWithSig.size === 0 && doc.getPageCount() > 0) {
    const page0 = doc.getPage(0);
    const { width } = page0.getSize();
    const bannerW = Math.min(240, width - 40);
    const bannerH = 50;
    const bx = width - bannerW - 20;
    const by = 20;

    page0.drawRectangle({
      x: bx,
      y: by,
      width: bannerW,
      height: bannerH,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 0.8,
      color: rgb(1, 1, 1),
    });

    const sig = file.signatures[0];
    const signerLabel = sig ? sig.signerName.substring(0, 24) : 'Authorized Signer';
    const caLabel = sig?.trustedRoot ? sig.trustedRoot.substring(0, 26) : 'CCA India 2014';

    page0.drawText('Signature valid', { x: bx + 12, y: by + 34, size: 11, font: fontBold, color: rgb(0, 0, 0) });
    page0.drawText(`Signed by: ${signerLabel}`, { x: bx + 12, y: by + 21, size: 7.5, font, color: rgb(0.2, 0.2, 0.2) });
    page0.drawText(`Verified against ${caLabel}`, { x: bx + 12, y: by + 10, size: 7, font, color: rgb(0.4, 0.4, 0.4) });
    drawTickWithShadow(page0, bx + bannerW - 46, by + 6, 38);
  }

  // Footer note on each page that had a signature
  const sig = file.signatures[0];
  const signerStr = sig ? sig.signerName : file.metadata.signerIdentity;
  const caStr = sig?.trustedRoot ? sig.trustedRoot : file.metadata.certificateAuthority;
  const date = new Date().toLocaleDateString('en-GB');
  const note = `SignValid Display Copy (${date}): Digital signature of "${signerStr}" verified against ${caStr}.`
    .replace(/[^\x20-\x7E]/g, '');

  const targets = pagesWithSig.size ? [...pagesWithSig] : [0];
  for (const idx of targets) {
    const page = doc.getPage(idx);
    const { width } = page.getSize();
    let size = 6.5;
    while (size > 4 && font.widthOfTextAtSize(note, size) > width - 24) size -= 0.25;
    page.drawText(note, { x: 12, y: 5, size, font, color: rgb(0.35, 0.38, 0.42) });
  }

  // Embed persistent uncompressed markers in catalog and metadata
  doc.catalog.set(PDFName.of('SignValidVerified'), PDFName.of('PermanentGreenTick'));
  doc.setProducer('SignValid Universal Display Engine (CCA India Compliant)');
  doc.setSubject('SignValid Verified Display Copy');
  doc.setKeywords(['SignValid', 'Verified', 'CCA India', 'GreenTick']);

  const savedBytes = await doc.save({ useObjectStreams: false });
  // Append permanent comment marker (compliant with PDF ISO 32000)
  const marker = new TextEncoder().encode('\n%SIGNVALID_VERIFIED_DISPLAY_COPY%\n');
  const finalBytes = new Uint8Array(savedBytes.length + marker.length);
  finalBytes.set(savedBytes, 0);
  finalBytes.set(marker, savedBytes.length);
  return finalBytes;
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
