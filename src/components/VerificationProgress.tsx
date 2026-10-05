import React from 'react';
import { Cpu } from 'lucide-react';

interface VerificationProgressProps {
  fileName: string;
  stepMessage: string;
  progressPercent: number;
}

export const VerificationProgress: React.FC<VerificationProgressProps> = ({
  fileName,
  stepMessage,
  progressPercent
}) => {
  return (
    <div className="processing-card">
      <div className="spinner-ring" />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-heading-dark)', marginBottom: 6 }}>
        Verifying Cryptographic Digital Signature
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', marginBottom: 16 }}>
        Inspecting: <strong style={{ color: 'var(--color-heading)' }}>{fileName}</strong>
      </p>

      <div className="progress-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'var(--mint-bg)',
        border: '1px solid var(--mint-border)',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--primary-green)'
      }}>
        <Cpu size={15} />
        <span>{stepMessage}</span>
      </div>

      <div style={{ fontSize: '0.78rem', color: 'var(--color-light)', marginTop: 14 }}>
        Memory-only inspection · Zero disk retention · SHA-256 validation
      </div>
    </div>
  );
};
