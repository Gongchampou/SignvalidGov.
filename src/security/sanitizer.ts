/**
 * SignValid Security Engine — Input Sanitizer, Magic Byte Verification & Timeout Defense
 */

/**
 * Sanitizes untrusted strings extracted from X.509 certificates (e.g. Signer Name, O, OU, Issuer).
 * Strips HTML control tags and non-printable control characters to prevent Stored DOM XSS.
 */
export function sanitizeCertString(input: string | undefined | null): string {
  if (!input) return '';
  return String(input)
    .replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return c;
      }
    })
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove ASCII control characters
    .trim();
}

/**
 * Validates PDF Magic Bytes (%PDF-) within the initial header bytes.
 * Rejects polyglot attacks (e.g. HTML, script, or executable binaries disguised as PDFs).
 */
export function validatePdfBytes(bytes: Uint8Array): { valid: boolean; reason?: string } {
  if (bytes.length < 32) {
    return { valid: false, reason: 'File is too small to be a legitimate PDF.' };
  }

  // Inspect first 1024 bytes for PDF header
  const headerSlice = bytes.subarray(0, Math.min(1024, bytes.length));
  const headerText = new TextDecoder('latin1').decode(headerSlice);

  // Reject files with HTML / script tags embedded in the header
  const lowerHeader = headerText.toLowerCase();
  if (
    lowerHeader.includes('<html') ||
    lowerHeader.includes('<script') ||
    lowerHeader.includes('<!doctype') ||
    lowerHeader.includes('<?xml')
  ) {
    return { valid: false, reason: 'Security alert: Disguised HTML/script detected. File rejected.' };
  }

  // Must contain valid %PDF- header
  if (!headerText.includes('%PDF-')) {
    return { valid: false, reason: 'Invalid file format: Missing %PDF- magic signature.' };
  }

  return { valid: true };
}

/**
 * Wraps long-running cryptographic operations in a strict timeout to prevent
 * Denial of Service (DoS) via malicious decompression bombs or parser loops.
 */
export function runWithSecurityTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 25000,
  timeoutMessage: string = 'Security Timeout: Processing exceeded 25 seconds. Operation halted.'
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Sanitizes password input for encrypted PDF unlocking.
 * Enforces maximum length and strips dangerous escape characters.
 */
export function sanitizeDocumentPassword(pwd: string): string {
  if (!pwd) return '';
  return pwd.slice(0, 64).replace(/[\r\n\t\0]/g, '');
}
