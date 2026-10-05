import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  Layers,
  RefreshCw,
  Eye,
  Check,
  FileCheck,
  Key
} from 'lucide-react';
import type { ValidatedFile } from '../types';
import { generateValidatedPdf } from '../utils/pdfGenerator';
import { createGreenTickCopy, downloadBytes, PasswordRequiredError } from '../verify/stampPdf';

interface ResultsCardProps {
  files: ValidatedFile[];
  activeFileIndex: number;
  onSelectFileIndex: (idx: number) => void;
  onOpenReportModal: (file: ValidatedFile) => void;
  onReset: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  files,
  activeFileIndex,
  onSelectFileIndex,
  onOpenReportModal,
  onReset
}) => {
  const [previewTab, setPreviewTab] = useState<'universal' | 'adobe'>('universal');
  const [isStamping, setIsStamping] = useState<boolean>(false);
  const [stampError, setStampError] = useState<string | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');

  const currentDoc = files[activeFileIndex] || files[0];

  if (!currentDoc) return null;

  const meta = currentDoc.metadata;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownloadStampedPdf = async (pwd?: string) => {
    try {
      setIsStamping(true);
      setStampError(null);

      const stampedBytes = await createGreenTickCopy(currentDoc, pwd);
      const outName = currentDoc.name.replace(/\.pdf$/i, '') + '_verified.pdf';
      downloadBytes(stampedBytes, outName);

      setShowPasswordPrompt(false);
      setPasswordInput('');
    } catch (err: unknown) {
      if (err instanceof PasswordRequiredError) {
        setShowPasswordPrompt(true);
        setStampError('This document is encrypted. Please enter its password (e.g. e-Aadhaar password is first 4 letters of name in CAPITAL + birth year).');
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setStampError('Error applying green tick: ' + msg);
      }
    } finally {
      setIsStamping(false);
    }
  };

  const handleDownloadSummaryCertificate = () => {
    generateValidatedPdf(currentDoc);
  };

  const isPass = currentDoc.status === 'valid';

  return (
    <div className="results-card" id="results-view">
      {/* If multiple files uploaded, display file tabs */}
      {files.length > 1 && (
        <div style={{
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 24px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {files.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelectFileIndex(i)}
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: i === activeFileIndex ? 'var(--primary-green)' : 'var(--border-subtle)',
                backgroundColor: i === activeFileIndex ? 'var(--primary-green)' : '#FFFFFF',
                color: i === activeFileIndex ? '#FFFFFF' : 'var(--color-body)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <CheckCircle2 size={13} />
              <span>{f.name.length > 20 ? f.name.substring(0, 18) + '...' : f.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Header Banner */}
      <div className="results-header-banner">
        <div className="doc-info-left">
          <div className="doc-type-icon" style={{
            backgroundColor: isPass ? 'var(--success-bg)' : 'var(--warning-bg)',
            color: isPass ? 'var(--success-text)' : 'var(--warning-text)'
          }}>
            {isPass ? <CheckCircle2 size={26} strokeWidth={2.5} /> : <AlertCircle size={26} strokeWidth={2.5} />}
          </div>
          <div>
            <h3 className="doc-title-name">{currentDoc.name}</h3>
            <div className="doc-meta-sub">
              <span>{formatFileSize(currentDoc.size)}</span>
              <span>•</span>
              <span>{meta.documentType}</span>
              <span>•</span>
              <span>Inspected {currentDoc.uploadDate}</span>
            </div>
          </div>
        </div>

        <div>
          {isPass ? (
            <div className="status-badge-pass">
              <Check size={16} strokeWidth={3} />
              <span>Pass: Valid Digital Signature</span>
            </div>
          ) : (
            <div className="state-pill unknown">
              <AlertCircle size={16} />
              <span>Status: {currentDoc.status.toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Visual Comparison: Adobe vs SignValid Universal */}
      <div className="preview-comparison-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)' }}>
            VISUAL SIGNATURE TRANSFORMATION
          </span>
          <div className="comparison-toggle-tabs">
            <button
              type="button"
              className={`comp-tab-btn ${previewTab === 'universal' ? 'active' : ''}`}
              onClick={() => setPreviewTab('universal')}
            >
              <CheckCircle2 size={14} />
              <span>SignValid Green Tick Copy</span>
            </button>
            <button
              type="button"
              className={`comp-tab-btn ${previewTab === 'adobe' ? 'active' : ''}`}
              onClick={() => setPreviewTab('adobe')}
            >
              <AlertCircle size={14} />
              <span>Original Adobe "?" Display</span>
            </button>
          </div>
        </div>

        <div className="stamp-preview-display" style={{ padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {previewTab === 'universal' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ fontSize: '1.28rem', fontWeight: 700, color: '#111827', fontFamily: 'serif, Georgia, "Times New Roman"', marginBottom: 6 }}>
                  Signature valid
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1F2937', lineHeight: 1.5 }}>
                  Digitally signed by <strong>{meta.signerIdentity}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.5 }}>
                  Date: {meta.timestamp}
                </div>
                <div style={{ fontSize: '0.80rem', color: '#4B5563', lineHeight: 1.5 }}>
                  Reason: Permanent Resident / Digital Verification
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.5 }}>
                  Location: India · CCA Root Accredited
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                {/* Authentic Adobe 3D green checkmark SVG with black drop shadow */}
                <svg width="78" height="78" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(2px 3px 0px #000000)' }}>
                  <path
                    d="M 36 8 L 5 44 L 17 56 L 37 32 L 83 94 L 97 80 Z"
                    fill="#00A651"
                    stroke="#000000"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="state-pill valid" style={{ fontSize: '0.74rem' }}>
                  ✓ Authentic Adobe-style tick
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#B45309', marginBottom: 6 }}>
                  Validity Unknown · Signature Not Verified
                </div>
                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>
                  Digitally signed by <strong>{meta.signerIdentity}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#4B5563', lineHeight: 1.5 }}>
                  Date: {meta.timestamp}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#92400E', marginTop: 4, fontStyle: 'italic' }}>
                  Missing Indian CCA root anchor in default Adobe AATL store causes Adobe Reader to display a yellow question mark.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  border: '2.5px solid #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: 'bold',
                  color: '#B45309',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)'
                }}>
                  ?
                </div>
                <span className="state-pill unknown" style={{ fontSize: '0.74rem' }}>
                  ? Unverified question mark
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Prompt if Encrypted */}
      {showPasswordPrompt && (
        <div style={{
          backgroundColor: '#FFFBEB',
          borderBottom: '1px solid #FCD34D',
          padding: '16px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#B45309', fontWeight: 600, fontSize: '0.9rem' }}>
            <Key size={16} />
            <span>PDF Password Required</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#92400E' }}>
            {stampError || 'This document is protected with a password (e.g. e-Aadhaar password is first 4 letters of name in CAPITAL + year of birth).'}
          </p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 420 }}>
            <input
              type="password"
              placeholder="Enter document password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #D97706',
                outline: 'none'
              }}
            />
            <button
              type="button"
              className="download-cta-btn"
              onClick={() => handleDownloadStampedPdf(passwordInput)}
              disabled={isStamping || !passwordInput}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {isStamping ? 'Unlocking...' : 'Unlock & Download'}
            </button>
          </div>
        </div>
      )}

      {stampError && !showPasswordPrompt && (
        <div style={{ backgroundColor: '#FEF2F2', padding: '12px 28px', color: '#991B1B', fontSize: '0.85rem' }}>
          {stampError}
        </div>
      )}

      {/* Metadata Breakdown Grid */}
      <div className="metadata-grid-wrapper">
        <div className="metadata-grid-title">
          <ShieldCheck size={18} style={{ color: 'var(--primary-green)' }} />
          <span>Real Cryptographic Signature Metadata (Extracted from your PDF)</span>
        </div>

        <div className="metadata-grid">
          <div className="metadata-cell">
            <span className="meta-label">Document Classification</span>
            <span className="meta-value highlight">{meta.documentType}</span>
          </div>

          <div className="metadata-cell">
            <span className="meta-label">Signer Common Name / Authority</span>
            <span className="meta-value">{meta.signerIdentity}</span>
          </div>

          <div className="metadata-cell">
            <span className="meta-label">Accredited Certifying Authority (CA)</span>
            <span className="meta-value">{meta.certificateAuthority}</span>
          </div>

          <div className="metadata-cell">
            <span className="meta-label">Signing Timestamp (IST)</span>
            <span className="meta-value">{meta.timestamp}</span>
          </div>

          <div className="metadata-cell">
            <span className="meta-label">Hash Integrity & Signature Scheme</span>
            <span className="meta-value">{meta.hashAlgorithm} · {meta.signatureAlgorithm}</span>
          </div>

          <div className="metadata-cell">
            <span className="meta-label">CCA Root Validation</span>
            <span className="meta-value" style={{ color: isPass ? 'var(--success-text)' : 'var(--warning-text)' }}>
              {meta.crlOcspStatus}
            </span>
          </div>
        </div>

        {/* CCA India Trust Chain Path */}
        <div className="trust-chain-chips">
          <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={14} />
            <span>Controller of Certifying Authorities (CCA) Trust Path</span>
          </span>
          {meta.ccaTrustChain.map((step: string, idx: number) => (
            <div key={idx} className="chain-item">
              <span className="chain-step-num">L{idx + 1}</span>
              <span>{step}</span>
              {idx === 0 && <span style={{ fontSize: '0.72rem', color: 'var(--primary-green)', fontWeight: 600 }}>[Root Trust Anchor]</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Action CTAs Bar */}
      <div className="results-actions-bar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* PRIMARY BUTTON: Downloads the user's actual PDF with the green checkmark stamped! */}
              <button
                type="button"
                className="download-cta-btn"
                onClick={() => handleDownloadStampedPdf()}
                disabled={isStamping}
                title={`Download ${currentDoc.name} with all pages preserved and yellow '?' replaced by green tick ✓`}
              >
                <Download size={18} />
                <span>{isStamping ? 'Stamping Green Tick...' : 'Download Validated PDF (with Green Tick ✓)'}</span>
              </button>

              <button
                type="button"
                className="secondary-action-btn"
                onClick={() => onOpenReportModal(currentDoc)}
              >
                <Eye size={16} />
                <span>View Full Verification Audit</span>
              </button>

              <button
                type="button"
                className="secondary-action-btn"
                onClick={handleDownloadSummaryCertificate}
                title="Download 1-page standalone verification report & audit sheet"
                style={{ fontSize: '0.82rem' }}
              >
                <FileCheck size={15} />
                <span>1-Page Summary Certificate</span>
              </button>
            </div>

            <button
              type="button"
              className="secondary-action-btn"
              onClick={onReset}
              style={{ color: 'var(--color-muted)' }}
            >
              <RefreshCw size={15} />
              <span>Validate Another Document</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-muted)', paddingLeft: 4 }}>
            <CheckCircle2 size={13} style={{ color: 'var(--primary-green)' }} />
            <span>
              <strong>Primary Download:</strong> Exports your actual original document (<em>{currentDoc.name.replace(/\.pdf$/i, '')}_verified.pdf</em>) with all pages preserved and the unverified '?' replaced with a permanent green checkmark.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
