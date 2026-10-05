import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  Layers,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import type { ValidatedFile } from '../types';
import { generateValidatedPdf } from '../utils/pdfGenerator';

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
  const currentDoc = files[activeFileIndex] || files[0];

  if (!currentDoc) return null;

  const meta = currentDoc.metadata;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = () => {
    generateValidatedPdf(currentDoc);
  };

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
          <div className="doc-type-icon">
            <CheckCircle2 size={26} strokeWidth={2.5} />
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
          <div className="status-badge-pass">
            <Check size={16} strokeWidth={3} />
            <span>Pass: Valid Signature</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Comparison: Adobe vs SignValid Universal */}
      <div className="preview-comparison-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)' }}>
            VISUAL SIGNATURE REPRESENTATION
          </span>
          <div className="comparison-toggle-tabs">
            <button
              type="button"
              className={`comp-tab-btn ${previewTab === 'universal' ? 'active' : ''}`}
              onClick={() => setPreviewTab('universal')}
            >
              <CheckCircle2 size={14} />
              <span>SignValid Universal Copy</span>
            </button>
            <button
              type="button"
              className={`comp-tab-btn ${previewTab === 'adobe' ? 'active' : ''}`}
              onClick={() => setPreviewTab('adobe')}
            >
              <AlertCircle size={14} />
              <span>Adobe Acrobat Default</span>
            </button>
          </div>
        </div>

        <div className="stamp-preview-display">
          {previewTab === 'universal' ? (
            <>
              <div className="stamp-box-styled">
                <div className="stamp-icon-large valid">
                  ✓
                </div>
                <div>
                  <div className="stamp-text-title" style={{ color: 'var(--success-text)' }}>
                    Signature Valid · Verified by SignValid
                  </div>
                  <div className="stamp-text-desc">
                    Digitally signed by <strong>{meta.signerIdentity}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: 2 }}>
                    CA: {meta.certificateAuthority} · Timestamp: {meta.timestamp}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="state-pill valid" style={{ fontSize: '0.78rem' }}>
                  Works on all viewers & printouts
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="stamp-box-styled">
                <div className="stamp-icon-large unknown">
                  ?
                </div>
                <div>
                  <div className="stamp-text-title" style={{ color: 'var(--warning-text)' }}>
                    Validity Unknown · At least one signature has problems
                  </div>
                  <div className="stamp-text-desc">
                    Adobe Reader warning triggered by missing Indian CCA Root 2014 in default AATL.
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: 2 }}>
                    Document integrity is actually intact; only Adobe’s certificate bundle is missing trust.
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="state-pill unknown" style={{ fontSize: '0.78rem' }}>
                  Confusing to recipients
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metadata Breakdown Grid */}
      <div className="metadata-grid-wrapper">
        <div className="metadata-grid-title">
          <ShieldCheck size={18} style={{ color: 'var(--primary-green)' }} />
          <span>Cryptographic Signature Metadata</span>
        </div>

        <div className="metadata-grid">
          <div className="metadata-cell">
            <span className="meta-label">Document Classification</span>
            <span className="meta-value highlight">{meta.documentType}</span>
          </div>

          <div className="metadata-cell">
            <span className="meta-label">Signer Identity / Common Name</span>
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
            <span className="meta-label">Revocation Status (CRL & OCSP)</span>
            <span className="meta-value" style={{ color: 'var(--success-text)' }}>
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
          {meta.ccaTrustChain.map((step, idx) => (
            <div key={idx} className="chain-item">
              <span className="chain-step-num">L{idx + 1}</span>
              <span>{step}</span>
              {idx === 0 && <span style={{ fontSize: '0.72rem', color: 'var(--primary-green)', fontWeight: 600 }}>[Official Root]</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Action CTAs Bar */}
      <div className="results-actions-bar">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="download-cta-btn"
            onClick={handleDownload}
          >
            <Download size={18} />
            <span>Download Validated PDF</span>
          </button>

          <button
            type="button"
            className="secondary-action-btn"
            onClick={() => onOpenReportModal(currentDoc)}
          >
            <Eye size={16} />
            <span>View Full Verification Report</span>
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
    </div>
  );
};
