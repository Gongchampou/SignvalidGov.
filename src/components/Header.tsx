import React, { useState } from 'react';
import { ShieldCheck, Check, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onOpenGuides: (topic?: string) => void;
  onOpenAbout: () => void;
  onOpenStats: () => void;
  onScrollToValidate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuides,
  onOpenAbout,
  onScrollToValidate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header-fixed">
      <div className="container">
        <div className="header-inner">
          {/* Brand Logo & Name */}
          <div className="brand-wrapper" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <div className="brand-logo-badge">
              <Check size={22} strokeWidth={3} />
            </div>
            <div>
              <div className="brand-name">
                Sign<span>Valid</span>
              </div>
            </div>
            <div className="cca-tag">
              <ShieldCheck size={13} />
              <span>CCA India 2014</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <a
              href="#validate"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                onScrollToValidate();
              }}
            >
              Validate
            </a>
            <a
              href="#documents"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('documents');
              }}
            >
              Documents
            </a>
            <a
              href="#authorities"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('authorities');
              }}
            >
              Trusted Authorities
            </a>
            <button
              type="button"
              className="nav-link"
              onClick={() => onOpenGuides()}
            >
              Guides
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={onOpenAbout}
            >
              About
            </button>
            <button
              type="button"
              className="nav-action-btn"
              onClick={onScrollToValidate}
            >
              <span>Validate PDF</span>
              <ArrowRight size={16} />
            </button>
          </nav>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            padding: '16px 0 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              type="button"
              className="nav-link"
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '1.05rem' }}
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToValidate();
              }}
            >
              Validate Digital Signatures
            </button>
            <button
              type="button"
              className="nav-link"
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '1.05rem' }}
              onClick={() => scrollTo('documents')}
            >
              Supported Government Documents
            </button>
            <button
              type="button"
              className="nav-link"
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '1.05rem' }}
              onClick={() => scrollTo('authorities')}
            >
              CCA Trusted Authorities
            </button>
            <button
              type="button"
              className="nav-link"
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '1.05rem' }}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGuides();
              }}
            >
              Verification Guides
            </button>
            <button
              type="button"
              className="nav-link"
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '1.05rem' }}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAbout();
              }}
            >
              About SignValid & Privacy
            </button>
            <button
              type="button"
              className="nav-action-btn"
              style={{ justifyContent: 'center', marginTop: '8px' }}
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToValidate();
              }}
            >
              <span>Validate PDF Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
