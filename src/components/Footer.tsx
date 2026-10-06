import React from 'react';
import { ShieldCheck, Check, ExternalLink } from 'lucide-react';
import type { NavPage } from './Header';

interface FooterProps {
  onNavigate: (page: NavPage, topic?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="footer-main">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & Mission */}
          <div>
            <div
              className="brand-wrapper"
              style={{ marginBottom: 14, cursor: 'pointer' }}
              onClick={() => onNavigate('validate')}
            >
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
            <div
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => onNavigate('authorities')}
            >
              <ShieldCheck size={16} />
              <span>Official CCA India Root Trust Store</span>
            </div>
          </div>

          {/* Column 2: Quick Pages Navigation */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-list">
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('validate')}>
                  Validate Digital Signature
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('documents')}>
                  Supported Government Documents
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('authorities')}>
                  CCA Trusted Authorities
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('how-it-works')}>
                  How It Works & Adobe Explainer
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('faq')}>
                  Frequently Asked Questions (FAQ)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Guides & Compliance */}
          <div>
            <h4 className="footer-col-title">Verification Guides</h4>
            <ul className="footer-nav-list">
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('guides', 'eaadhaar')}>
                  e-Aadhaar validation guide
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('guides', 'edistrict')}>
                  State e-District certificates
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('how-it-works')}>
                  Fixing "Validity Unknown" in Adobe
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('guides', 'digilocker')}>
                  DigiLocker marksheets & degrees
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('guides', 'passwords')}>
                  Encrypted PDF password formats
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('guides', 'printing')}>
                  Paper printout green tick guide
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: About & Legal */}
          <div>
            <h4 className="footer-col-title">About & Legal</h4>
            <ul className="footer-nav-list">
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('about')}>
                  About SignValid
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('about')}>
                  Zero-Retention Privacy Guarantee
                </span>
              </li>
              <li>
                <span className="footer-nav-link" onClick={() => onNavigate('about')}>
                  Information Technology Act 2000
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
          SignValid is an independent cryptographic verification utility and is not affiliated with UIDAI, MeitY, the Government of India, or any state government. All files are processed strictly in volatile memory and never stored.
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="footer-bottom-row">
          <div>
            © {new Date().getFullYear()} SignValid. Public interest cryptographic verification utility.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('about')}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('about')}>Terms of Service</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('faq')}>Help</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
