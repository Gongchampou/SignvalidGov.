import React from 'react';
import { Lock, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface PrivacyBannerProps {
  onScrollToValidate: () => void;
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ onScrollToValidate }) => {
  return (
    <section className="section-wrapper" id="privacy">
      <div className="container">
        <div className="privacy-banner-card">
          <div className="privacy-content-inner">
            <div className="privacy-pill">
              <Lock size={14} />
              <span>Cryptographic Privacy Guarantee</span>
            </div>

            <h2 className="privacy-title">
              Your document never leaves the request
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: 660, lineHeight: 1.6 }}>
              We know Indian citizen documents contain sensitive personal and financial identifiers. SignValid is engineered with uncompromising privacy by design.
            </p>

            <div className="privacy-points-grid">
              <div className="privacy-point-card">
                <div className="privacy-point-title">
                  <Cpu size={18} />
                  <span>Zero Data Retention</span>
                </div>
                <div className="privacy-point-desc">
                  Files are evaluated strictly in volatile RAM. Buffers are purged from memory as soon as verification completes. No files or images are ever saved to disk.
                </div>
              </div>

              <div className="privacy-point-card">
                <div className="privacy-point-title">
                  <ShieldCheck size={18} />
                  <span>Signature Inspection Only</span>
                </div>
                <div className="privacy-point-desc">
                  We only inspect signature directory offsets, hashes, and public X.509 certificates. Your Aadhaar number, photo, address, and personal details remain completely private.
                </div>
              </div>

              <div className="privacy-point-card">
                <div className="privacy-point-title">
                  <Lock size={18} />
                  <span>No Data Monetization</span>
                </div>
                <div className="privacy-point-desc">
                  SignValid does not build user profiles, track documents across sessions, or sell analytical telemetry to third-party brokers.
                </div>
              </div>
            </div>

            <button
              type="button"
              className="privacy-cta-btn"
              onClick={onScrollToValidate}
            >
              <span>Validate your document now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
