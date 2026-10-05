export type VerificationStatus =
  | 'valid'      // integrity OK + signature OK + chains to an official CCA India root
  | 'untrusted'  // integrity & signature OK, but issuer does not chain to a CCA India root
  | 'modified'   // signature OK but the file was changed after signing
  | 'invalid'    // digest mismatch or cryptographic signature failure
  | 'unsigned'   // no digital signature found in the PDF
  | 'error';     // file could not be processed

export interface SignatureReport {
  index: number;
  subFilter: string;
  signerName: string;
  signerOrg: string;
  issuerName: string;
  signingTime: string | null;
  signingTimeSource: 'timestamp' | 'signer-claimed' | 'none';
  digestAlgorithm: string;
  signatureAlgorithm: string;
  certSerial: string;
  certValidFrom: string;
  certValidTo: string;
  integrityOk: boolean;
  signatureOk: boolean;
  chainOk: boolean;
  coversWholeDocument: boolean;
  trustedRoot: string | null;
  chain: string[];
  problems: string[];
}

export interface SignatureMetadata {
  documentType: string;
  signerIdentity: string;
  certificateAuthority: string;
  timestamp: string;
  hashAlgorithm: string;
  signatureAlgorithm: string;
  crlOcspStatus: string;
  certificateSerial: string;
  validUntil: string;
  ccaTrustChain: string[];
  docFingerprint: string;
}

export interface ValidatedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: VerificationStatus;
  summary: string;
  encrypted: boolean;
  sha256: string;
  signatures: SignatureReport[];
  metadata: SignatureMetadata;
  bytes: Uint8Array;
  sampleType?: string;
  originalFile?: File;
}

export interface SupportedDocCategory {
  category: string;
  description: string;
  iconName: string;
  items: {
    name: string;
    authority: string;
    portal: string;
    tag: string;
  }[];
}

export interface CertifyingAuthority {
  name: string;
  shortName: string;
  type: string;
  status: 'Active' | 'Government' | 'Licensed';
  accreditation: string;
  logoText: string;
  accentColor: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
