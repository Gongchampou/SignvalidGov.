import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

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
  const { toggleTheme, isDark } = useTheme();

  // Prevent background scroll and handle Escape key when mobile navigation is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

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

            {/* Theme Toggle Button */}
            <ThemeToggle />

            <button
              type="button"
              className="nav-action-btn"
              onClick={() => handleNavClick('validate')}
            >
              <span>Validate PDF</span>
              <ArrowRight size={14} />
            </button>
          </nav>

          {/* Mobile Right Controls: Theme Toggle & Hamburger Button */}
          <div className="header-mobile-actions">
            <ThemeToggle />
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-links">
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'validate' ? 'active' : ''}`}
                onClick={() => handleNavClick('validate')}
              >
                Validate
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'documents' ? 'active' : ''}`}
                onClick={() => handleNavClick('documents')}
              >
                Documents
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'authorities' ? 'active' : ''}`}
                onClick={() => handleNavClick('authorities')}
              >
                Authorities
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'how-it-works' ? 'active' : ''}`}
                onClick={() => handleNavClick('how-it-works')}
              >
                How It Works
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'guides' ? 'active' : ''}`}
                onClick={() => handleNavClick('guides')}
              >
                Guides
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'faq' ? 'active' : ''}`}
                onClick={() => handleNavClick('faq')}
              >
                FAQ
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                About
              </button>
            </div>

            <div className="mobile-nav-footer">
              <div
                className="mobile-nav-theme-row"
                onClick={() => toggleTheme()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                  }
                }}
                aria-label={`Toggle theme appearance. Current mode: ${isDark ? 'Dark' : 'Light'}`}
              >
                <div className="mobile-nav-theme-info">
                  <div className="mobile-nav-theme-icon-badge">
                    {isDark ? <Moon size={16} strokeWidth={2.4} /> : <Sun size={16} strokeWidth={2.4} />}
                  </div>
                  <div className="mobile-nav-theme-text-col">
                    <span className="mobile-nav-theme-label">Appearance</span>
                    <span className="mobile-nav-theme-sublabel">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                </div>
                <ThemeToggle />
              </div>
              <button
                type="button"
                className="nav-action-btn mobile-cta-btn"
                onClick={() => handleNavClick('validate')}
              >
                <span>Validate PDF</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Red Running Privacy Ribbon Bar (Continuous Left-to-Right Stream) - hidden on About page AND while mobile menu is open */}
      {currentPage !== 'about' && !mobileMenuOpen && (
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
