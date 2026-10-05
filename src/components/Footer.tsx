import React from 'react';
import { ShieldCheck, Check, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenGuides: (topic?: string) => void;
  onOpenAbout: () => void;
  onScrollToValidate: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenGuides,
  onOpenAbout,
  onScrollToValidate
}) => {
  return (
    <footer className="footer-main">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & Mission */}
          <div>
            <div className="brand-wrapper" style={{ marginBottom: 14 }}>
              <div className="brand-logo-badge">
                <Check size={22} strokeWidth={3} />
              </div>
              <div className="brand-name">
                Sign<span>Valid</span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6, maxWidth: 360, marginBottom: 16 }}>
              The independent cryptographic verification utility for Indian digital government documents. Validating PKCS#7 signatures against the Controller of Certifying Authorities (CCA) root hierarchy.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Official CCA India 2014 Trust Store Root</span>
            </div>
          </div>

          {/* Column 2: Guides */}
          <div>
            <h4 className="footer-col-title">Verification Guides</h4>
            <ul className="footer-nav-list">
              <li>
                <span className="footer-nav-link" onClick={() => onOpenGuides('eaadhaar')}>
                  e-Aadhaar validation
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onOpenGuides('edistrict')}>
                  State e-District certificates
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onOpenGuides('adobe')}>
                  Fixing "Validity Unknown" in Adobe
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onOpenGuides('digilocker')}>
                  DigiLocker signatures & marksheets
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={onScrollToValidate}>
                  Batch PDF validation
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: About & Legal */}
          <div>
            <h4 className="footer-col-title">About & Legal</h4>
            <ul className="footer-nav-list">
              <li>
                <span className="footer-nav-link" onClick={onOpenAbout}>
                  About SignValid
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={onOpenAbout}>
                  Zero-Retention Privacy Policy
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={onOpenAbout}>
                  Terms of Service & IT Act 2000
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={onOpenAbout}>
                  What's New in v2.4
                </span>
              </li>
              <li>
                <a
                  href="https://cca.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <span>CCA India Registry</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Legal Notice */}
        <div className="footer-disclaimer-card">
          <strong>Mandatory Notice: </strong>
          SignValid is an independent tool and is not affiliated with UIDAI, the Government of India, or any state government. Files are processed in memory and never stored.
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="footer-bottom-row">
          <div>
            © {new Date().getFullYear()} SignValid. Public interest cryptographic verification utility.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Built for Indian citizens with respect for digital sovereignty & privacy.
          </div>
        </div>
      </div>
    </footer>
  );
};
