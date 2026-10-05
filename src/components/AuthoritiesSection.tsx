import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { TRUSTED_AUTHORITIES } from '../data/authorities';

export const AuthoritiesSection: React.FC = () => {
  return (
    <section className="section-wrapper alternate-bg" id="authorities">
      <div className="container">
        <div className="section-header-center">
          <div className="section-subheading-pill">
            <Award size={14} />
            <span>Official Root Trust Hierarchy</span>
          </div>
          <h2 className="section-main-title">
            Trusted Certifying Authorities (CCA India)
          </h2>
          <p className="section-desc">
            SignValid validates digital signatures directly against the root public keys of licensed CAs operating under the Controller of Certifying Authorities, Ministry of Electronics and IT (MeitY).
          </p>
        </div>

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
      </div>
    </section>
  );
};
