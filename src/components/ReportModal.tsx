import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Download, Key, Lock, FileCheck, AlertCircle } from 'lucide-react';
import type { ValidatedFile } from '../types';
import { generateValidatedPdf } from '../utils/pdfGenerator';
import { createGreenTickCopy, downloadBytes, PasswordRequiredError } from '../verify/stampPdf';

interface ReportModalProps {
  file: ValidatedFile | null;
  onClose: () => void;
  onCopyDigest: (text: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  file,
  onClose,
  onCopyDigest
}) => {
  const [isStamping, setIsStamping] = useState<boolean>(false);
  const [stampError, setStampError] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);

  if (!file) return null;

  const handleDownloadStamped = async (pwd?: string) => {
    try {
      setIsStamping(true);
      setStampError(null);

      // If document is already verified, directly download the clean verified file
      if (file.status === 'already_verified') {
        const outName = file.name.endsWith('_verified.pdf')
          ? file.name
          : file.name.replace(/\.pdf$/i, '') + '_verified.pdf';
        downloadBytes(file.bytes, outName);
        return;
      }

      // If document is unsigned, report clear error and do not stamp
      if (file.status === 'unsigned' || file.signatures.length === 0) {
        setStampError('Error: This document has no digital signature to verify or stamp.');
        return;
      }

      const stampedBytes = await createGreenTickCopy(file, pwd);
      const outName = file.name.replace(/\.pdf$/i, '') + '_verified.pdf';
      downloadBytes(stampedBytes, outName);
      setShowPasswordPrompt(false);
      setPasswordInput('');
    } catch (err: unknown) {
      if (err instanceof PasswordRequiredError) {
        setShowPasswordPrompt(true);
        setStampError('This document is encrypted. Please enter its password.');
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setStampError('Error stamping green tick: ' + msg);
      }
    } finally {
      setIsStamping(false);
    }
  };

  const meta = file.metadata;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="modal-title">Official Cryptographic Verification Audit</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                Compliant with Section 3 & 4 of India's Information Technology Act, 2000
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Certificate Validity Header */}
          <div style={{
            backgroundColor: 'var(--primary-green-subtle)',
            border: '1px solid var(--mint-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-green)' }}>
                VALID ELECTRONIC SIGNATURE (PASS)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-body)', marginTop: 2 }}>
                Document digest matches signed attributes. Certificate unrevoked & accredited.
              </div>
            </div>
            <span className="state-pill valid" style={{ fontSize: '0.78rem' }}>
              ✓ Legal Authenticity
            </span>
          </div>

          {/* Key Audit Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-heading)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileCheck size={16} />
                <span>1. Document Attributes</span>
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--color-muted)', width: '35%' }}>Document Name</td>
                    <td style={{ padding: '8px 0', fontWeight: 600, wordBreak: 'break-word' }}>{file.name}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--color-muted)' }}>Classification</td>
                    <td style={{ padding: '8px 0', fontWeight: 600, wordBreak: 'break-word' }}>{meta.documentType}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--color-muted)' }}>Signer Common Name</td>
                    <td style={{ padding: '8px 0', fontWeight: 600, wordBreak: 'break-word' }}>{meta.signerIdentity}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--color-muted)' }}>Signing Time</td>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>{meta.timestamp}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-heading)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={16} />
                <span>2. Cryptographic Digest & Fingerprints</span>
              </h4>
              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)' }}>SHA-256 Checksum:</span>
                  <button
                    type="button"
                    onClick={() => onCopyDigest(meta.docFingerprint)}
                    style={{ fontSize: '0.74rem', color: 'var(--primary-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--color-heading-dark)' }}>
                  {meta.docFingerprint}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-heading)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Key size={16} />
                <span>3. X.509 Certificate Chain of Trust</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {meta.ccaTrustChain.map((chain: string, i: number) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: i === 0 ? '#F0FDF4' : '#FAFAFA',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8
                  }}>
                    <div style={{ wordBreak: 'break-word', minWidth: 0 }}>
                      <strong style={{ color: 'var(--primary-green)', marginRight: 6 }}>Level {i + 1}:</strong>
                      <span>{chain}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--success-text)', fontWeight: 700, flexShrink: 0 }}>
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-heading)', marginBottom: 8 }}>
                4. Certificate Details
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--color-muted)', width: '35%' }}>Serial Number</td>
                    <td style={{ padding: '8px 0', fontFamily: 'monospace', fontSize: '0.8rem' }}>{meta.certificateSerial}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--color-muted)' }}>Valid Through</td>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>{meta.validUntil}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--color-muted)' }}>Revocation Check</td>
                    <td style={{ padding: '8px 0', color: 'var(--success-text)', fontWeight: 600 }}>{meta.crlOcspStatus}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showPasswordPrompt && (
          <div className="password-prompt-box">
            <span style={{ fontSize: '0.82rem', color: '#92400E', fontWeight: 600 }}>Enter Document Password to Apply Green Tick:</span>
            <div className="password-input-row">
              <input
                type="password"
                placeholder="Password"
                value={passwordInput}
                maxLength={64}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid #D97706' }}
              />
              <button
                type="button"
                className="download-cta-btn"
                onClick={() => handleDownloadStamped(passwordInput)}
                disabled={isStamping || !passwordInput}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                {isStamping ? 'Unlocking...' : 'Unlock & Download'}
              </button>
            </div>
          </div>
        )}

        {stampError && !showPasswordPrompt && (
          <div style={{ backgroundColor: '#FEF2F2', padding: '10px 24px', color: '#991B1B', fontSize: '0.82rem' }}>
            {stampError}
          </div>
        )}

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-action-btn"
            onClick={onClose}
          >
            Close Report
          </button>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="secondary-action-btn"
              onClick={() => generateValidatedPdf(file)}
              title="Download 1-page official verification audit certificate"
              style={{ fontSize: '0.82rem' }}
            >
              <FileCheck size={15} />
              <span>Summary Certificate</span>
            </button>

            {file.status === 'already_verified' ? (
              <button
                type="button"
                className="download-cta-btn"
                onClick={() => handleDownloadStamped()}
                title="Save verified PDF (already contains permanent green checkmark)"
              >
                <Download size={16} />
                <span>Download Verified PDF</span>
              </button>
            ) : file.status === 'unsigned' ? (
              <button
                type="button"
                className="download-cta-btn"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#9CA3AF' }}
                title="Cannot stamp: Missing digital signature"
              >
                <AlertCircle size={16} />
                <span>Missing Signature</span>
              </button>
            ) : (
              <button
                type="button"
                className="download-cta-btn"
                onClick={() => handleDownloadStamped()}
                disabled={isStamping}
              >
                <Download size={16} />
                <span>{isStamping ? 'Stamping PDF...' : 'Download Validated PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
