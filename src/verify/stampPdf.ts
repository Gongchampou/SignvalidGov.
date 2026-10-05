/**
 * Produces a "display copy" of a VERIFIED PDF in which the signature widget's
 * yellow "?" (Adobe legacy layer n1) is replaced by a green tick.
 *
 * - Only runs for files whose status is 'valid' (verified against CCA India roots).
 * - The signature field is flattened into the page (otherwise Adobe would re-check
 *   the now-modified file and show a red X), so the copy is NOT digitally signed.
 *   A small footer note on the page states this explicitly.
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

// Green tick polygon in a unit square (x right, y up).
const TICK: [number, number][] = [[0.04, 0.52], [0.19, 0.67], [0.40, 0.46], [0.81, 0.90], [0.96, 0.75], [0.40, 0.16]];
const GREEN: [number, number, number] = [0.13, 0.69, 0.30];
const OUTLINE: [number, number, number] = [0.02, 0.16, 0.08];

function tickPath(x: number, y: number, w: number, h: number, fraction: number) {
  const s = Math.min(w, h) * fraction;
  const ox = x + (w - s) / 2;
  const oy = y + (h - s) / 2;
  return { pts: TICK.map(([px, py]) => [ox + px * s, oy + py * s] as [number, number]), size: s };
}

/** Content-stream text that draws a green tick filling the given box. */
function tickContent(x: number, y: number, w: number, h: number): string {
  const { pts, size } = tickPath(x, y, w, h, 0.9);
  const f = (n: number) => n.toFixed(3);
  const path = pts.map(([px, py], i) => `${f(px)} ${f(py)} ${i === 0 ? 'm' : 'l'}`).join('\n');
  return `q\n${GREEN.join(' ')} rg\n${OUTLINE.join(' ')} RG\n${f(Math.max(0.5, size * 0.03))} w\n1 j\n${path}\nh\nB\nQ\n`;
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

/** Replace a stream object's content while keeping its dictionary (BBox, Resources, Matrix…). */
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
 * - Replaces the Adobe validity layer "n1" (the "?") with a green tick.
 * - Clears layer "n3" (the red X / invalid layer).
 * - Rewrites the literal text "(Signature Not Verified)" -> "(Signature Verified)".
 *   (All glyphs of the new text exist in the old one, so subset fonts still work.)
 * Returns true if an n1 layer was found.
 */
function rewriteAppearance(context: PDFContext, ref: PDFRef, depth = 0, seen = new Set<string>()): boolean {
  if (depth > 5 || seen.has(ref.toString())) return false;
  seen.add(ref.toString());

  const stream = context.lookup(ref);
  if (!(stream instanceof PDFStream)) return false;
  let foundN1 = false;

  // Text replacement inside this stream.
  try {
    const text = latin1.decode(streamBytes(stream));
    const replaced = text.replace(/\(Signature\s+Not\s+Verified\)/gi, '(Signature Verified)');
    if (replaced !== text) replaceStream(context, ref, stream.dict, toLatin1Bytes(replaced));
  } catch { /* undecodable filter — leave as is */ }

  const current = context.lookup(ref) as PDFStream;
  const resources = current.dict.lookupMaybe(N('Resources'), PDFDict);
  const xobjects = resources?.lookupMaybe(N('XObject'), PDFDict);
  if (!xobjects) return false;

  for (const [name, value] of xobjects.entries()) {
    if (!(value instanceof PDFRef)) continue;
    const layer = context.lookup(value);
    if (!(layer instanceof PDFStream)) continue;
    const key = name.asString();

    if (key === '/n1') {
      const [x0, y0, x1, y1] = numbers(layer.dict.lookupMaybe(N('BBox'), PDFArray), [0, 0, 100, 100]);
      replaceStream(context, value, layer.dict, toLatin1Bytes(tickContent(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0))));
      foundN1 = true;
    } else if (key === '/n3') {
      replaceStream(context, value, layer.dict, new Uint8Array());
    } else if (rewriteAppearance(context, value, depth + 1, seen)) {
      foundN1 = true;
    }
  }
  return foundN1;
}

function isSigField(dict: PDFDict): boolean {
  let d: PDFDict | undefined = dict;
  for (let i = 0; d && i < 5; i++) {
    if (d.get(N('FT')) === N('Sig')) return true;
    d = d.lookupMaybe(N('Parent'), PDFDict);
  }
  return false;
}

/** Draw a widget's normal appearance onto the page at its /Rect (flattening). */
function flattenWidget(page: PDFPage, context: PDFContext, widget: PDFDict, drawTickBehind: boolean) {
  const [r0, r1, r2, r3] = numbers(widget.lookupMaybe(N('Rect'), PDFArray), [0, 0, 0, 0]);
  const rx = Math.min(r0, r2), ry = Math.min(r1, r3), rw = Math.abs(r2 - r0), rh = Math.abs(r3 - r1);
  const flags = (widget.lookupMaybe(N('F'), PDFNumber)?.asNumber() ?? 0);
  if (rw < 1 || rh < 1 || (flags & 2) || (flags & 32)) return false; // invisible / hidden

  const ap = widget.lookupMaybe(N('AP'), PDFDict);
  let apRef = ap?.get(N('N'));
  if (apRef && !(apRef instanceof PDFRef)) apRef = context.register(apRef as PDFObject);
  const apStream = apRef ? context.lookup(apRef) : undefined;

  if (drawTickBehind) {
    const { pts, size } = tickPath(rx, ry, rw, rh, 0.85);
    page.pushOperators(
      pushGraphicsState(),
      setFillingRgbColor(...GREEN), setStrokingRgbColor(...OUTLINE), setLineWidth(Math.max(0.5, size * 0.03)),
      moveTo(pts[0][0], pts[0][1]),
      ...pts.slice(1).map(([x, y]) => lineTo(x, y)),
      closePath(), fillAndStroke(),
      popGraphicsState(),
    );
  }

  if (apRef instanceof PDFRef && apStream instanceof PDFStream) {
    const dict = apStream.dict;
    if (!dict.get(N('Subtype'))) dict.set(N('Subtype'), N('Form'));
    if (!dict.get(N('Type'))) dict.set(N('Type'), N('XObject'));
    const [b0, b1, b2, b3] = numbers(dict.lookupMaybe(N('BBox'), PDFArray), [0, 0, rw, rh]);
    const [ma, mb, mc, md, me, mf] = numbers(dict.lookupMaybe(N('Matrix'), PDFArray), [1, 0, 0, 1, 0, 0]);
    // Transformed bounding box of BBox under Matrix (PDF 32000 §12.5.5).
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
      popGraphicsState(),
    );
  }
  return true;
}

async function loadDecrypted(file: ValidatedFile, password?: string): Promise<PDFDocument> {
  const opts = { updateMetadata: false } as const;
  if (!file.encrypted) return PDFDocument.load(file.bytes, opts);
  try {
    // Many government PDFs only have an owner password (open without a password).
    return await PDFDocument.load(file.bytes, { ...opts, password: password ?? '' });
  } catch {
    throw new PasswordRequiredError();
  }
}

export async function createGreenTickCopy(file: ValidatedFile, password?: string): Promise<Uint8Array> {
  if (file.status !== 'valid') {
    throw new Error('A green-tick copy can only be produced for documents whose signature was verified.');
  }

  const doc = await loadDecrypted(file, password);
  const context = doc.context;
  const font = await doc.embedFont(StandardFonts.Helvetica);
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
      const hasN1 = apN instanceof PDFRef ? rewriteAppearance(context, apN) : false;
      if (flattenWidget(page, context, widget, !hasN1)) pagesWithSig.add(pageIndex);

      annots.remove(i);
      if (entry instanceof PDFRef) removedRefs.add(entry.toString());
      const parent = widget.get(N('Parent'));
      if (parent instanceof PDFRef) removedRefs.add(parent.toString());
    }
  });

  // Remove signature fields from the AcroForm so viewers don't re-validate a modified file.
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

  // Honest footer note on each page that carried a signature (or page 1 for invisible signatures).
  const sig = file.signatures[0];
  const date = new Date().toLocaleDateString('en-GB');
  const note = `Display copy by SignValid (${date}): original digital signature of "${sig.signerName}" verified against ${sig.trustedRoot}. This copy itself is not digitally signed.`
    .replace(/[^\x20-\x7E]/g, '');
  const targets = pagesWithSig.size ? [...pagesWithSig] : [0];
  for (const idx of targets) {
    const page = doc.getPage(idx);
    const { width } = page.getSize();
    let size = 6;
    while (size > 3.5 && font.widthOfTextAtSize(note, size) > width - 24) size -= 0.25;
    page.drawText(note, { x: 12, y: 6, size, font, color: rgb(0.35, 0.38, 0.42) });
  }

  return doc.save({ useObjectStreams: false });
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
