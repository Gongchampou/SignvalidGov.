import { jsPDF } from 'jspdf';
import type { ValidatedFile } from '../types';

export function generateValidatedPdf(doc: ValidatedFile): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Top header banner (Primary Green #126B44)
  pdf.setFillColor(18, 107, 68);
  pdf.rect(0, 0, pageWidth, 28, 'F');

  // Header Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('SignValid — Digital Signature Verification Certificate', 14, 13);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Universal Verified Copy · Accredited under CCA India Root Trust Store (IT Act 2000)', 14, 21);

  // Mint callout box for signature status
  pdf.setFillColor(244, 248, 245);
  pdf.setDrawColor(167, 243, 208);
  pdf.roundedRect(14, 34, pageWidth - 28, 38, 3, 3, 'FD');

  // Green tick circle indicator
  pdf.setFillColor(220, 252, 231);
  pdf.setDrawColor(21, 128, 61);
  pdf.circle(28, 53, 9, 'FD');

  // Green checkmark text
  pdf.setTextColor(21, 128, 61);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('✓', 25.5, 57);

  // Status text
  pdf.setTextColor(18, 107, 68);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('SIGNATURE VALID · INTEGRITY VERIFIED (PASS)', 42, 48);

  pdf.setTextColor(75, 85, 99);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text('All digital signatures in this document have been cryptographically validated against the official root certificates', 42, 55);
  pdf.text('of the Controller of Certifying Authorities (CCA), Ministry of Electronics & IT (MeitY), Government of India.', 42, 60);

  // Section: Document & Signature Metadata
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('CRYPTOGRAPHIC VERIFICATION SUMMARY', 14, 82);

  pdf.setDrawColor(229, 231, 235);
  pdf.line(14, 85, pageWidth - 14, 85);

  const meta = doc.metadata;
  const fields = [
    { label: 'Document Name:', val: doc.name },
    { label: 'Document Type:', val: meta.documentType },
    { label: 'Signer Identity:', val: meta.signerIdentity },
    { label: 'Certifying Authority (CA):', val: meta.certificateAuthority },
    { label: 'Signing Timestamp:', val: meta.timestamp },
    { label: 'Hash & Encryption Alg:', val: `${meta.hashAlgorithm} | ${meta.signatureAlgorithm}` },
    { label: 'Revocation (CRL/OCSP):', val: meta.crlOcspStatus },
    { label: 'Certificate Serial Number:', val: meta.certificateSerial },
    { label: 'Validity Period Until:', val: meta.validUntil }
  ];

  let yPos = 94;
  fields.forEach(field => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(75, 85, 99);
    pdf.text(field.label, 14, yPos);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(17, 24, 39);
    // Wrap long text
    const splitText = pdf.splitTextToSize(field.val, pageWidth - 80);
    pdf.text(splitText, 72, yPos);

    const linesCount = Array.isArray(splitText) ? splitText.length : 1;
    yPos += Math.max(7, linesCount * 4.5);
  });

  // Trust chain box
  yPos += 4;
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.text('CCA INDIA HIERARCHICAL TRUST PATH', 14, yPos);
  yPos += 3;
  pdf.line(14, yPos, pageWidth - 14, yPos);
  yPos += 7;

  meta.ccaTrustChain.forEach((chainItem: string, idx: number) => {
    pdf.setFillColor(243, 244, 246);
    pdf.roundedRect(14, yPos - 4.5, pageWidth - 28, 7.5, 1.5, 1.5, 'F');

    pdf.setTextColor(18, 107, 68);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(`[Level ${idx + 1}]`, 18, yPos);

    pdf.setTextColor(31, 41, 55);
    pdf.setFont('helvetica', 'normal');
    pdf.text(chainItem, 35, yPos);

    yPos += 9.5;
  });

  // Document SHA-256 Fingerprint Box
  yPos += 3;
  pdf.setFillColor(249, 250, 251);
  pdf.setDrawColor(229, 231, 235);
  pdf.roundedRect(14, yPos, pageWidth - 28, 16, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(75, 85, 99);
  pdf.text('Document SHA-256 Digest:', 18, yPos + 6);

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(17, 24, 39);
  pdf.text(meta.docFingerprint, 18, yPos + 12);

  // Footer Disclaimer
  pdf.setDrawColor(229, 231, 235);
  pdf.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(107, 114, 128);
  pdf.text(
    'Notice: SignValid is an independent verification tool. This document certifies digital cryptographic integrity under Section 3 of the Information Technology Act, 2000.',
    14,
    pageHeight - 14
  );
  pdf.text(
    `Validated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-IN')} IST · Powered by SignValid Universal Verification Service`,
    14,
    pageHeight - 9
  );

  // Download PDF file
  const filename = `signvalid_${doc.name.replace(/\.pdf$/i, '')}_verified.pdf`;
  pdf.save(filename);
}
