import React, { useState } from 'react';
import { ShieldCheck, Check, Menu, X, ArrowRight } from 'lucide-react';

export type NavPage = 'validate' | 'documents' | 'authorities' | 'how-it-works' | 'guides' | 'faq' | 'about';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage, topic?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: NavPage, topic?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, topic);
  };

  return (
    <header className="header-fixed">
      <div className="container">
        <div className="header-inner">
          {/* Brand Logo & Name */}
          <div
            className="brand-wrapper"
            onClick={() => handleNavClick('validate')}
            style={{ cursor: 'pointer' }}
            title="Go to SignValid Home / Validator"
          >
            <div className="brand-logo-badge">
              <Check size={18} strokeWidth={3} />
            </div>
            <div>
              <div className="brand-name">
                Sign<span>Valid</span>
              </div>
            </div>
            <div className="cca-tag">
              <ShieldCheck size={12} />
              <span>CCA India 2014</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <button
              type="button"
              className={`nav-link ${currentPage === 'validate' ? 'active' : ''}`}
              onClick={() => handleNavClick('validate')}
            >
              Validate
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'documents' ? 'active' : ''}`}
              onClick={() => handleNavClick('documents')}
            >
              Documents
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'authorities' ? 'active' : ''}`}
              onClick={() => handleNavClick('authorities')}
            >
              Authorities
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'how-it-works' ? 'active' : ''}`}
              onClick={() => handleNavClick('how-it-works')}
            >
              How It Works
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'guides' ? 'active' : ''}`}
              onClick={() => handleNavClick('guides')}
            >
              Guides
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'faq' ? 'active' : ''}`}
              onClick={() => handleNavClick('faq')}
            >
              FAQ
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => handleNavClick('about')}
            >
              About
            </button>

            <button
              type="button"
              className="nav-action-btn"
              onClick={() => handleNavClick('validate')}
            >
              <span>Validate PDF</span>
              <ArrowRight size={14} />
            </button>
          </nav>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            padding: '16px 0 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button
              type="button"
              className={`nav-link ${currentPage === 'validate' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '10px 12px', fontSize: '1rem', borderRadius: 8, backgroundColor: currentPage === 'validate' ? 'var(--primary-green-subtle)' : 'transparent' }}
              onClick={() => handleNavClick('validate')}
            >
              Validate Digital Signatures
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'documents' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '10px 12px', fontSize: '1rem', borderRadius: 8, backgroundColor: currentPage === 'documents' ? 'var(--primary-green-subtle)' : 'transparent' }}
              onClick={() => handleNavClick('documents')}
            >
              Supported Government Documents
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'authorities' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '10px 12px', fontSize: '1rem', borderRadius: 8, backgroundColor: currentPage === 'authorities' ? 'var(--primary-green-subtle)' : 'transparent' }}
              onClick={() => handleNavClick('authorities')}
            >
              CCA Trusted Authorities
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'how-it-works' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '10px 12px', fontSize: '1rem', borderRadius: 8, backgroundColor: currentPage === 'how-it-works' ? 'var(--primary-green-subtle)' : 'transparent' }}
              onClick={() => handleNavClick('how-it-works')}
            >
              How It Works & Adobe Explainer
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'guides' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '10px 12px', fontSize: '1rem', borderRadius: 8, backgroundColor: currentPage === 'guides' ? 'var(--primary-green-subtle)' : 'transparent' }}
              onClick={() => handleNavClick('guides')}
            >
              Verification Guides & Help
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'faq' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '10px 12px', fontSize: '1rem', borderRadius: 8, backgroundColor: currentPage === 'faq' ? 'var(--primary-green-subtle)' : 'transparent' }}
              onClick={() => handleNavClick('faq')}
            >
              Frequently Asked Questions (FAQ)
            </button>
            <button
              type="button"
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '10px 12px', fontSize: '1rem', borderRadius: 8, backgroundColor: currentPage === 'about' ? 'var(--primary-green-subtle)' : 'transparent' }}
              onClick={() => handleNavClick('about')}
            >
              About
            </button>
            <button
              type="button"
              className="nav-action-btn"
              style={{ justifyContent: 'center', marginTop: '12px', padding: '12px 20px' }}
              onClick={() => handleNavClick('validate')}
            >
              <span>Validate PDF Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Red Running Privacy Ribbon Bar (Continuous Left-to-Right Stream) - hidden on About / Legal pages */}
      {currentPage !== 'about' && (
        <div className="red-privacy-ribbon" role="region" aria-label="100% Client-Side In-Memory Privacy Guarantee">
          <div className="ribbon-ticker-track">
            {[1, 2].map((set) => (
              <div key={set} className="ribbon-ticker-group">
                <span className="ribbon-badge">
                  <ShieldCheck size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
                  100% IN-MEMORY
                </span>
                <span className="ribbon-highlight">YOUR DETAILS NEVER RETAIN IN THIS SITE</span>
                <span className="ribbon-bullet">◆</span>
                <span>ZERO SERVER UPLOADS</span>
                <span className="ribbon-bullet">◆</span>
                <span>ALL VERIFICATION RUNS IN YOUR BROWSER RAM</span>
                <span className="ribbon-bullet">◆</span>
                <span>FILES ARE NEVER SAVED, STORED, OR TRANSMITTED</span>
                <span className="ribbon-bullet">◆</span>
                <span className="ribbon-highlight">COMPLETE PRIVACY GUARANTEED</span>
                <span className="ribbon-bullet">◆</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
