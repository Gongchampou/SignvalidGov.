import React from 'react';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { TRUSTED_AUTHORITIES } from '../data/authorities';

interface AuthoritiesPageProps {
  onNavigateToValidate: () => void;
}

export const AuthoritiesPage: React.FC<AuthoritiesPageProps> = ({ onNavigateToValidate }) => {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            <Award size={14} />
            <span>Root Trust Directory</span>
          </div>
          <h1 className="page-hero-title">
            CCA India Trusted Certifying Authorities
          </h1>
          <p className="page-hero-desc">
            SignValid validates digital signatures directly against the root public keys of licensed Certifying Authorities operating under the Controller of Certifying Authorities, Ministry of Electronics & IT (MeitY).
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* Authorities Grid */}
        <div className="authorities-grid">
          {TRUSTED_AUTHORITIES.map((ca, idx) => (
            <div key={idx} className="authority-card">
              <div className="authority-top">
                <div
                  className="ca-logo-circle"
                  style={{ backgroundColor: ca.accentColor }}
                >
                  {ca.logoText}
                </div>
                <span className={`ca-status-badge ${ca.status.toLowerCase()}`}>
                  ✓ {ca.status}
                </span>
              </div>

              <div>
                <h4 className="authority-name">{ca.name}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 600, marginTop: 2 }}>
                  {ca.type}
                </div>
              </div>

              <p className="authority-desc">{ca.accreditation}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--color-muted)', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                <CheckCircle2 size={13} color="var(--primary-green)" />
                <span>Verified in CCA 2014 Trust Store</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="guide-cta-banner" style={{ marginTop: 48 }}>
          <div>
            <h3>Verify Against the Official CCA Root</h3>
            <p>Test your PDF digital certificate against the bundled Indian CCA Root trust store.</p>
          </div>
          <button
            type="button"
            className="download-cta-btn"
            onClick={onNavigateToValidate}
          >
            <span>Validate PDF Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
