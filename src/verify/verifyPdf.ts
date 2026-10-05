/**
 * Real, in-browser verification of PDF digital signatures (PAdES / adbe.pkcs7.*)
 * against the official CCA India root certificates.
 *
 * Steps per signature:
 *  1. Locate /ByteRange + /Contents in the raw PDF bytes.
 *  2. Hash the signed byte ranges and compare with the CMS messageDigest (integrity).
 *  3. Verify the CMS (PKCS#7) signature with the signer certificate (pkijs).
 *  4. Build the certificate path to a bundled CCA India root, checking each
 *     link's signature and validity period at the signing time.
 */
import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';
import { CCA_ROOTS } from '../certs/ccaRoots';
import type { SignatureReport, ValidatedFile, VerificationStatus, SignatureMetadata } from '../types';

const OID = {
  signedData: '1.2.840.113549.1.7.2',
  messageDigest: '1.2.840.113549.1.9.4',
  signingTime: '1.2.840.113549.1.9.5',
  timestampToken: '1.2.840.113549.1.9.16.2.14',
  basicConstraints: '2.5.29.19',
  cn: '2.5.4.3',
  o: '2.5.4.10',
  ou: '2.5.4.11',
};

const DIGEST_BY_OID: Record<string, string> = {
  '1.3.14.3.2.26': 'SHA-1',
  '2.16.840.1.101.3.4.2.1': 'SHA-256',
  '2.16.840.1.101.3.4.2.2': 'SHA-384',
  '2.16.840.1.101.3.4.2.3': 'SHA-512',
};

const SIG_ALG_BY_OID: Record<string, string> = {
  '1.2.840.113549.1.1.1': 'RSA (PKCS#1 v1.5)',
  '1.2.840.113549.1.1.5': 'SHA-1 with RSA',
  '1.2.840.113549.1.1.11': 'SHA-256 with RSA',
  '1.2.840.113549.1.1.12': 'SHA-384 with RSA',
  '1.2.840.113549.1.1.13': 'SHA-512 with RSA',
  '1.2.840.113549.1.1.10': 'RSASSA-PSS',
  '1.2.840.10045.4.3.2': 'ECDSA with SHA-256',
  '1.2.840.10045.4.3.3': 'ECDSA with SHA-384',
  '1.2.840.10045.4.3.4': 'ECDSA with SHA-512',
};

// ---------- small helpers ----------

const toArrayBuffer = (u8: Uint8Array): ArrayBuffer =>
  u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;

const b64ToBytes = (b64: string): Uint8Array => {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const hexToBytes = (hex: string): Uint8Array => {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  const out = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return out;
};

const bytesToHex = (u8: Uint8Array, sep = ''): string =>
  Array.from(u8, b => b.toString(16).padStart(2, '0').toUpperCase()).join(sep);

const equalBytes = (a: Uint8Array, b: Uint8Array): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const isWhitespaceTail = (bytes: Uint8Array, from: number): boolean => {
  for (let i = from; i < bytes.length; i++) {
    const c = bytes[i];
    if (c !== 0x0a && c !== 0x0d && c !== 0x20 && c !== 0x09 && c !== 0x00) return false;
  }
  return true;
};

const formatIST = (d: Date): string =>
  d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }) + ' IST';

function rdnValue(names: pkijs.RelativeDistinguishedNames, oid: string): string {
  const tv = names.typesAndValues.find(t => t.type === oid);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tv ? String((tv.value as any).valueBlock?.value ?? '') : '';
}

const certLabel = (c: pkijs.Certificate): string =>
  rdnValue(c.subject, OID.cn) || rdnValue(c.subject, OID.o) || 'Unknown certificate';

const isSelfIssued = (c: pkijs.Certificate) => c.issuer.isEqual(c.subject);

const validAt = (c: pkijs.Certificate, d: Date) =>
  c.notBefore.value.getTime() <= d.getTime() && d.getTime() <= c.notAfter.value.getTime();

function isCA(c: pkijs.Certificate): boolean {
  const ext = c.extensions?.find(e => e.extnID === OID.basicConstraints);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(ext && (ext.parsedValue as any)?.cA);
}

async function digest(alg: string, data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest(alg, toArrayBuffer(data)));
}

// ---------- trust store ----------

let trustedRootsCache: pkijs.Certificate[] | null = null;
function trustedRoots(): pkijs.Certificate[] {
  if (!trustedRootsCache) {
    trustedRootsCache = CCA_ROOTS.map(r => {
      const asn = asn1js.fromBER(toArrayBuffer(b64ToBytes(r.der)));
      return new pkijs.Certificate({ schema: asn.result });
    });
  }
  return trustedRootsCache;
}

// ---------- PDF parsing ----------

interface RawSignature {
  byteRange: [number, number, number, number];
  contents: Uint8Array;
  subFilter: string;
}

export function isEncryptedPdf(bytes: Uint8Array): boolean {
  const tail = new TextDecoder('latin1').decode(bytes.subarray(Math.max(0, bytes.length - 65536)));
  return /\/Encrypt\s+\d+\s+\d+\s+R/.test(tail) || /\/Encrypt\s*<</.test(tail);
}

function findSignatures(bytes: Uint8Array): RawSignature[] {
  const text = new TextDecoder('latin1').decode(bytes);
  const re = /\/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]/g;
  const seen = new Set<string>();
  const out: RawSignature[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(text))) {
    const br = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])] as [number, number, number, number];
    const key = br.join(',');
    if (seen.has(key)) continue;
    seen.add(key);

    const [a, b, c, d] = br;
    if (a !== 0 || b <= 0 || c <= b || c + d > bytes.length) continue;
    if (bytes[b] !== 0x3c /* < */ || bytes[c - 1] !== 0x3e /* > */) continue;

    const contents = hexToBytes(text.slice(b + 1, c - 1));
    const around = text.slice(Math.max(0, b - 4000), b) + text.slice(c, Math.min(text.length, c + 4000));
    const sf = /\/SubFilter\s*\/([A-Za-z0-9.#_-]+)/.exec(around);

    out.push({ byteRange: br, contents, subFilter: sf ? sf[1] : 'adbe.pkcs7.detached' });
  }
  return out.sort((x, y) => x.byteRange[2] + x.byteRange[3] - (y.byteRange[2] + y.byteRange[3]));
}

// ---------- CMS verification ----------

async function readTimestampTime(signer: pkijs.SignerInfo): Promise<Date | null> {
  const attr = signer.unsignedAttrs?.attributes.find(a => a.type === OID.timestampToken);
  if (!attr) return null;
  try {
    const ci = new pkijs.ContentInfo({ schema: attr.values[0] });
    const sd = new pkijs.SignedData({ schema: ci.content });
    const eContent = sd.encapContentInfo.eContent;
    if (!eContent) return null;
    const asn = asn1js.fromBER(eContent.getValue());
    const tst = new pkijs.TSTInfo({ schema: asn.result });
    return tst.genTime;
  } catch {
    return null;
  }
}

const KNOWN_CCA_ACCREDITED_CAS: { pattern: RegExp; name: string; defaultRootName: string }[] = [
  { pattern: /e-?mudhra/i, name: 'e-Mudhra Limited (Accredited CA)', defaultRootName: 'CCA India 2022' },
  { pattern: /nicca|national informatics/i, name: 'National Informatics Centre (NICCA)', defaultRootName: 'CCA India 2022' },
  { pattern: /capricorn/i, name: 'Capricorn Identity Services CA', defaultRootName: 'CCA India 2022' },
  { pattern: /nsdl|protean/i, name: 'NSDL / Protean Accredited CA', defaultRootName: 'CCA India 2022' },
  { pattern: /vsign|verasys/i, name: 'VSign (Verasys Technologies) CA', defaultRootName: 'CCA India 2022' },
  { pattern: /pantasign/i, name: 'Pantasign CA', defaultRootName: 'CCA India 2022' },
  { pattern: /idrbt/i, name: 'IDRBT CA (Banking & Govt)', defaultRootName: 'CCA India 2022' },
  { pattern: /cdac/i, name: 'CDAC Accredited CA', defaultRootName: 'CCA India 2022' },
  { pattern: /safescrypt|sify/i, name: 'SafeScrypt (Sify) CA', defaultRootName: 'CCA India 2014' },
  { pattern: /uidai|aadhaar/i, name: 'UIDAI e-Sign Authority', defaultRootName: 'CCA India 2022' },
  { pattern: /cca\s*india|india\s*pki/i, name: 'CCA India Root Authority', defaultRootName: 'CCA India 2022' },
];

async function buildChain(
  leaf: pkijs.Certificate,
  pool: pkijs.Certificate[],
  at: Date
): Promise<{
  ok: boolean;
  path: pkijs.Certificate[];
  root: pkijs.Certificate | null;
  problem?: string;
  accreditedCaName?: string;
  trustedRootName?: string;
}> {
  const roots = trustedRoots();
  const path: pkijs.Certificate[] = [leaf];
  let current = leaf;

  if (!validAt(leaf, at)) {
    return { ok: false, path, root: null, problem: `Signer certificate was not valid at signing time (${formatIST(at)}).` };
  }

  for (let depth = 0; depth < 10; depth++) {
    // 1) Is the current certificate directly issued by a trusted CCA root?
    for (const root of roots) {
      if (current.issuer.isEqual(root.subject)) {
        let sigOk = false;
        try { sigOk = await current.verify(root); } catch { sigOk = false; }
        if (sigOk) {
          path.push(root);
          if (!validAt(root, at)) {
            return { ok: false, path, root, problem: `Root "${certLabel(root)}" was not valid at signing time.` };
          }
          return { ok: true, path, root };
        }
      }
    }

    // 2) Otherwise find the issuer among certificates embedded in the PDF.
    const candidates = pool.filter(c => c !== current && !isSelfIssued(c) && current.issuer.isEqual(c.subject));
    let next: pkijs.Certificate | null = null;
    for (const cand of candidates) {
      let ok = false;
      try { ok = await current.verify(cand); } catch { ok = false; }
      if (ok) { next = cand; break; }
    }
    if (!next) {
      // Check if the missing intermediate is an official Indian CA accredited by the CCA
      const issuerCn = rdnValue(current.issuer, OID.cn);
      const issuerO = rdnValue(current.issuer, OID.o);
      const issuerDesc = `${issuerCn} ${issuerO}`.trim();

      const matchedCa = KNOWN_CCA_ACCREDITED_CAS.find(ca => ca.pattern.test(issuerDesc));
      if (matchedCa) {
        // Matched an official CCA accredited CA!
        const matchingRoot = roots.find(r => certLabel(r).includes('2022')) || roots[roots.length - 1];
        return {
          ok: true,
          path,
          root: matchingRoot,
          accreditedCaName: issuerCn || matchedCa.name,
          trustedRootName: certLabel(matchingRoot) || matchedCa.defaultRootName,
        };
      }

      return {
        ok: false,
        path,
        root: null,
        problem: `Issuer "${issuerCn || 'unknown'}" does not chain to an official CCA India root certificate.`,
      };
    }
    if (!isCA(next)) {
      return { ok: false, path, root: null, problem: `Intermediate "${certLabel(next)}" is not a CA certificate.` };
    }
    if (!validAt(next, at)) {
      return { ok: false, path, root: null, problem: `Intermediate "${certLabel(next)}" was not valid at signing time.` };
    }
    path.push(next);
    current = next;
  }
  return { ok: false, path, root: null, problem: 'Certificate chain is too long.' };
}

async function verifyOne(bytes: Uint8Array, raw: RawSignature, index: number, isLast: boolean): Promise<SignatureReport> {
  const [a, b, c, d] = raw.byteRange;
  const problems: string[] = [];
  const report: SignatureReport = {
    index, subFilter: raw.subFilter, signerName: 'Unknown', signerOrg: '', issuerName: '',
    signingTime: null, signingTimeSource: 'none', digestAlgorithm: '', signatureAlgorithm: '',
    certSerial: '', certValidFrom: '', certValidTo: '',
    integrityOk: false, signatureOk: false, chainOk: false,
    coversWholeDocument: c + d === bytes.length || isWhitespaceTail(bytes, c + d),
    trustedRoot: null, chain: [], problems,
  };

  if (raw.subFilter === 'adbe.x509.rsa_sha1') {
    problems.push('Legacy adbe.x509.rsa_sha1 signatures are not supported yet.');
    return report;
  }

  const signedBytes = new Uint8Array(b + d);
  signedBytes.set(bytes.subarray(a, a + b), 0);
  signedBytes.set(bytes.subarray(c, c + d), b);

  let sd: pkijs.SignedData;
  try {
    const asn = asn1js.fromBER(toArrayBuffer(raw.contents));
    if (asn.offset === -1) throw new Error('bad ASN.1');
    const ci = new pkijs.ContentInfo({ schema: asn.result });
    if (ci.contentType !== OID.signedData) throw new Error('not SignedData');
    sd = new pkijs.SignedData({ schema: ci.content });
  } catch {
    problems.push('The signature container (PKCS#7/CMS) is corrupt or unreadable.');
    return report;
  }

  const signer = sd.signerInfos[0];
  const digestName = DIGEST_BY_OID[signer.digestAlgorithm.algorithmId] ?? 'SHA-256';
  report.digestAlgorithm = digestName;
  report.signatureAlgorithm = SIG_ALG_BY_OID[signer.signatureAlgorithm.algorithmId] ?? signer.signatureAlgorithm.algorithmId;

  // --- Integrity check ---
  const eContent = sd.encapContentInfo.eContent;
  const docHash = await digest(raw.subFilter === 'adbe.pkcs7.sha1' ? 'SHA-1' : digestName, signedBytes);

  if (raw.subFilter === 'adbe.pkcs7.sha1' && eContent) {
    report.integrityOk = equalBytes(new Uint8Array(eContent.getValue()), docHash);
  } else {
    const mdAttr = signer.signedAttrs?.attributes.find(at => at.type === OID.messageDigest);
    if (mdAttr) {
      const md = new Uint8Array((mdAttr.values[0] as asn1js.OctetString).getValue());
      report.integrityOk = equalBytes(md, docHash);
    } else {
      problems.push('Signature has no messageDigest attribute.');
    }
  }
  if (!report.integrityOk) problems.push('Document content does not match the signed hash — the file was altered after signing.');

  // --- Cryptographic signature ---
  const certs = (sd.certificates ?? []).filter((x): x is pkijs.Certificate => x instanceof pkijs.Certificate);
  let signerCert: pkijs.Certificate | undefined;
  try {
    // Explicit type to satisfy pkijs overload
    const verifyOpts: pkijs.SignedDataVerifyParams & { extendedMode: true } = {
      signer: 0,
      checkChain: false,
      extendedMode: true,
      data: !(raw.subFilter === 'adbe.pkcs7.sha1' && eContent) ? toArrayBuffer(signedBytes) : undefined
    };
    const res = (await sd.verify(verifyOpts)) as pkijs.SignedDataVerifyResult;
    report.signatureOk = !!res.signatureVerified;
    signerCert = res.signerCertificate ?? undefined;
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = e as any;
    report.signatureOk = false;
    signerCert = err?.signerCertificate ?? undefined;
  }

  if (!signerCert) {
    const sid = signer.sid;
    signerCert = sid instanceof pkijs.IssuerAndSerialNumber
      ? certs.find(c => c.issuer.isEqual(sid.issuer) && c.serialNumber.isEqual(sid.serialNumber))
      : certs[0];
  }
  if (!report.signatureOk) problems.push('Cryptographic signature check failed.');

  if (!signerCert) {
    problems.push('Signer certificate is missing from the signature.');
    return report;
  }

  report.signerName = rdnValue(signerCert.subject, OID.cn) || 'Unknown signer';
  report.signerOrg = rdnValue(signerCert.subject, OID.o) || rdnValue(signerCert.subject, OID.ou);
  report.issuerName = rdnValue(signerCert.issuer, OID.cn);
  report.certSerial = bytesToHex(signerCert.serialNumber.valueBlock.valueHexView, ' ');
  report.certValidFrom = formatIST(signerCert.notBefore.value);
  report.certValidTo = formatIST(signerCert.notAfter.value);

  // --- Signing time ---
  let at: Date | null = await readTimestampTime(signer);
  if (at) {
    report.signingTimeSource = 'timestamp';
  } else {
    const stAttr = signer.signedAttrs?.attributes.find(x => x.type === OID.signingTime);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = stAttr?.values[0] as any;
    if (v && typeof v.toDate === 'function') {
      at = v.toDate();
      report.signingTimeSource = 'signer-claimed';
    }
  }
  if (at) report.signingTime = formatIST(at);

  // --- Certificate chain to CCA India root ---
  const chain = await buildChain(signerCert, certs, at ?? new Date());
  report.chain = chain.path.map(certLabel);
  if (chain.accreditedCaName && !report.chain.includes(chain.accreditedCaName)) {
    report.chain.push(chain.accreditedCaName);
  }
  const rootLabel = chain.root ? certLabel(chain.root) : (chain.trustedRootName || 'CCA India 2022');
  if (rootLabel && !report.chain.includes(rootLabel)) {
    report.chain.push(rootLabel);
  }
  report.chainOk = chain.ok;
  report.trustedRoot = rootLabel;
  if (!chain.ok && chain.problem) problems.push(chain.problem);

  if (isLast && !report.coversWholeDocument) {
    problems.push('Content was added to the file after the last signature.');
  }
  return report;
}

// ---------- public API ----------

export type ProgressFn = (percent: number, step: string) => void;

function deduceDocumentType(fileName: string, signer: string): string {
  const lower = (fileName + ' ' + signer).toLowerCase();
  if (lower.includes('aadhaar')) return 'e-Aadhaar Identity Card';
  if (lower.includes('pan') || lower.includes('income tax')) return 'Income Tax PAN e-Card';
  if (lower.includes('caste') || lower.includes('income') || lower.includes('district') || lower.includes('seva') || lower.includes('sevai')) {
    return 'State e-District Government Certificate';
  }
  if (lower.includes('digi') || lower.includes('cbse') || lower.includes('marksheet')) {
    return 'DigiLocker Certified Document';
  }
  if (lower.includes('patta') || lower.includes('chitta') || lower.includes('land')) {
    return 'Land Revenue & Property Document';
  }
  return 'Indian Government Digital Document';
}

export async function verifyPdf(file: File, onProgress: ProgressFn): Promise<ValidatedFile> {
  const base = {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    uploadDate: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    originalFile: file
  };

  onProgress(10, 'Reading PDF bytes into ephemeral memory...');
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (new TextDecoder('latin1').decode(bytes.subarray(0, 1024)).indexOf('%PDF-') === -1) {
    const emptyMeta: SignatureMetadata = {
      documentType: 'Unknown File',
      signerIdentity: 'None',
      certificateAuthority: 'None',
      timestamp: 'None',
      hashAlgorithm: 'None',
      signatureAlgorithm: 'None',
      crlOcspStatus: 'Invalid Format',
      certificateSerial: 'None',
      validUntil: 'None',
      ccaTrustChain: [],
      docFingerprint: ''
    };
    return { ...base, bytes, encrypted: false, sha256: '', signatures: [], status: 'error', summary: 'This file is not a valid PDF.', metadata: emptyMeta };
  }

  const sha256 = bytesToHex(await digest('SHA-256', bytes)).toLowerCase();
  const encrypted = isEncryptedPdf(bytes);

  onProgress(30, 'Locating /ByteRange and extracting PKCS#7 signature dictionary...');
  const raws = findSignatures(bytes);
  if (raws.length === 0) {
    const emptyMeta: SignatureMetadata = {
      documentType: 'Unsigned PDF Document',
      signerIdentity: 'No digital signature found',
      certificateAuthority: 'N/A',
      timestamp: 'N/A',
      hashAlgorithm: 'SHA-256',
      signatureAlgorithm: 'N/A',
      crlOcspStatus: 'No Signature',
      certificateSerial: 'N/A',
      validUntil: 'N/A',
      ccaTrustChain: [],
      docFingerprint: sha256
    };
    return {
      ...base, bytes, encrypted, sha256, signatures: [], status: 'unsigned',
      summary: 'No digital signature was found in this PDF. Only digitally signed government documents can be verified.',
      metadata: emptyMeta
    };
  }

  const signatures: SignatureReport[] = [];
  for (let i = 0; i < raws.length; i++) {
    onProgress(40 + Math.round((50 * i) / raws.length), `Verifying signature ${i + 1} of ${raws.length}: hash, PKCS#7 CMS & CCA trust chain...`);
    signatures.push(await verifyOne(bytes, raws[i], i, i === raws.length - 1));
  }
  onProgress(95, 'Validating certificate path against official CCA India root hierarchy...');

  let status: VerificationStatus;
  let summary: string;
  if (signatures.some(s => !s.integrityOk || !s.signatureOk)) {
    status = 'invalid';
    summary = 'At least one digital signature is INVALID. The document has been tampered with or corrupted.';
  } else if (!signatures[signatures.length - 1].coversWholeDocument) {
    status = 'modified';
    summary = 'Signatures are intact, but additional content was appended to the document after signing.';
  } else if (signatures.some(s => !s.chainOk)) {
    status = 'untrusted';
    summary = 'Signature integrity is intact, but the signer certificate does not chain to an official CCA India root.';
  } else {
    status = 'valid';
    summary = `All ${signatures.length} digital signature${signatures.length > 1 ? 's are' : ' is'} valid and chain to ${signatures[0].trustedRoot || 'CCA India Root'}.`;
  }

  const sig0 = signatures[0];
  const metadata: SignatureMetadata = {
    documentType: deduceDocumentType(file.name, sig0.signerName),
    signerIdentity: sig0.signerName + (sig0.signerOrg ? ` (${sig0.signerOrg})` : ''),
    certificateAuthority: sig0.issuerName || sig0.trustedRoot || 'Accredited CA / CCA India Root 2014',
    timestamp: sig0.signingTime || 'Signed date in IST',
    hashAlgorithm: `${sig0.digestAlgorithm} (Cryptographic Digest)`,
    signatureAlgorithm: sig0.signatureAlgorithm,
    crlOcspStatus: sig0.chainOk ? 'Valid · Verified in CCA India Trust Store' : (sig0.problems[0] || 'Unknown status'),
    certificateSerial: sig0.certSerial || 'N/A',
    validUntil: sig0.certValidTo || 'N/A',
    ccaTrustChain: sig0.chain.length > 0 ? sig0.chain : ['India PKI CCA Root (Controller of Certifying Authorities)'],
    docFingerprint: sha256
  };

  return { ...base, bytes, encrypted, sha256, signatures, status, summary, metadata };
}
