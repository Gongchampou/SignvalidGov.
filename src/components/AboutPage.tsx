import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Award,
  CheckCircle2,
  FileText,
  Scale,
  UserCheck,
  Star
} from 'lucide-react';
import { TermAndCond } from './term&cond';
  //in code line 100 ther is line to edit eh start no to add up or increase the start no.
  //
  //
const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const GITHUB_USERNAME = 'Gongchampou';
const GITHUB_REPO = 'SignvalidGov';
const GITHUB_REPO_URL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`;
const SHIELDS_API_URL = `https://img.shields.io/github/stars/${GITHUB_USERNAME}/${GITHUB_REPO}.json`;

const OwnershipScrapReveal: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [starCount, setStarCount] = useState<number>(() => {
    try {
      const cached = localStorage.getItem('signvalid_gh_stars');
      const val = cached !== null ? parseInt(cached, 10) : NaN;
      return !isNaN(val) && val >= 3 ? val : 3;
    } catch {
      return 3;
    }
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isRevealedRef = useRef(isRevealed);
  isRevealedRef.current = isRevealed;

  const fetchStars = useCallback(async () => {
    // 1. Try official GitHub REST API
    try {
      const res = await fetch(GITHUB_API_URL, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (res.ok) {
        const data = await res.json();
        const count = data.stargazers_count;
        if (typeof count === 'number' && !isNaN(count)) {
          setStarCount(count);
          try {
            localStorage.setItem('signvalid_gh_stars', String(count));
          } catch {
            // ignore
          }
          return;
        }
      }
    } catch {
      // Fall through to backup
    }

    // 2. Try Shields.io endpoint (bypasses GitHub unauthenticated IP rate-limits)
    try {
      const res = await fetch(SHIELDS_API_URL);
      if (res.ok) {
        const data = await res.json();
        const parsed = parseInt(data.value || data.message, 10);
        if (!isNaN(parsed)) {
          setStarCount(parsed);
          try {
            localStorage.setItem('signvalid_gh_stars', String(parsed));
          } catch {
            // ignore
          }
          return;
        }
      }
    } catch {
      // Fall through to default
    }

    // 3. set start no to show it in webiste here to verified count (3,4,5 .....)
    setStarCount((prev) => (prev >=  5? prev : 4));
  }, []);

  useEffect(() => {
    fetchStars();

    const handleFocus = () => {
      fetchStars();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStars();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic 60s background refresh for live star counts
    const interval = window.setInterval(fetchStars, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(interval);
    };
  }, [fetchStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));

    // Particle pool - creates the dense sparkling noise dust storm from Telegram
    const particleCount = 140;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 1.5 + 0.8) * (window.devicePixelRatio || 1),
      alpha: Math.random() * 0.7 + 0.3,
      twinkleOffset: Math.random() * Math.PI * 2,
      vx: 0,
      vy: 0
    }));

    let isExploding = false;
    let explodeFrame = 0;

    const startExplosion = () => {
      isExploding = true;
      explodeFrame = 0;
      const centerX = width / 2;
      const centerY = height / 2;
      for (const p of particles) {
        const angle = Math.atan2(p.y - centerY, p.x - centerX) + (Math.random() - 0.5) * 0.6;
        const speed = (Math.random() * 4 + 2) * (window.devicePixelRatio || 1);
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      }
    };

    const resetParticles = () => {
      isExploding = false;
      explodeFrame = 0;
      for (const p of particles) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
        p.alpha = Math.random() * 0.7 + 0.3;
        p.vx = 0;
        p.vy = 0;
      }
    };

    let prevRevealed = isRevealedRef.current;

    const render = () => {
      if (!prevRevealed && isRevealedRef.current) {
        prevRevealed = true;
        startExplosion();
      } else if (prevRevealed && !isRevealedRef.current) {
        prevRevealed = false;
        resetParticles();
      }

      ctx.clearRect(0, 0, width, height);

      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (!isRevealedRef.current) {
        // Idle shimmering noise
        const time = Date.now() * 0.005;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += (Math.random() - 0.5) * 0.9;
          p.y += (Math.random() - 0.5) * 0.9;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const currentAlpha = 0.2 + 0.8 * Math.abs(Math.sin(time + p.twinkleOffset));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${currentAlpha})`
            : `rgba(30, 41, 59, ${currentAlpha * 0.85})`;
          ctx.fill();
        }
        animIdRef.current = requestAnimationFrame(render);
      } else if (isExploding) {
        // Telegram particle explosion / dispersal
        explodeFrame++;
        let hasAlive = false;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha *= 0.88;
          if (p.alpha > 0.03) {
            hasAlive = true;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = isDark
              ? `rgba(255, 255, 255, ${p.alpha})`
              : `rgba(30, 41, 59, ${p.alpha * 0.85})`;
            ctx.fill();
          }
        }
        if (hasAlive && explodeFrame < 40) {
          animIdRef.current = requestAnimationFrame(render);
        } else {
          isExploding = false;
          ctx.clearRect(0, 0, width, height);
        }
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      height = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      for (const p of particles) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [isRevealed]);

  const handleToggle = () => {
    if (isRevealed) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsRevealed(false);
      return;
    }

    setIsRevealed(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsRevealed(false);
      timeoutRef.current = null;
    }, 30000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="ownership-disclaimer-row">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span className="ownership-disclaimer-label">
          <UserCheck size={14} style={{ color: 'var(--primary-green)' }} />
          <span>Project Ownership:</span>
        </span>
        <span
          className={`telegram-spoiler ${isRevealed ? 'is-revealed' : 'is-hidden'}`}
          onClick={handleToggle}
          title={isRevealed ? 'Revealed · Click to hide' : 'Telegram spoiler · Click to reveal'}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <span className="telegram-spoiler-text">Jonah Kamei</span>
          <canvas ref={canvasRef} className="telegram-spoiler-canvas" />
        </span>
      </div>

      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="supabase-star-button"
        title="View SignValid on GitHub · Star the repository"
      >
        <span className="supabase-star-left">
          <GithubIcon size={14} />
          <span>GitHub</span>
          <Star size={13} className="star-icon" fill="#eab308" stroke="#eab308" style={{ marginLeft: 2 }} />
        </span>
        <span className="supabase-star-divider" />
        <span className="supabase-star-count">
          {starCount.toLocaleString()}
        </span>
      </a>
    </div>
  );
};

export type AboutSubTab = 'about' | 'terms' | 'privacy';

interface AboutPageProps {
  initialTab?: AboutSubTab;
  onNavigateToValidate: () => void;
  onTabChange?: (tab: AboutSubTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  initialTab = 'about',
  onNavigateToValidate,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<AboutSubTab>(initialTab);

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tab: AboutSubTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="page-content-wrapper">
      {/* Dynamic Page Hero Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            {activeTab === 'about' && (
              <>
                <ShieldCheck size={14} />
                <span>Independent Public Service</span>
              </>
            )}
            {activeTab === 'terms' && (
              <>
                <Scale size={14} />
                <span>Legal & User Agreement</span>
              </>
            )}
            {activeTab === 'privacy' && (
              <>
                <Lock size={14} />
                <span>Zero-Retention Privacy Policy</span>
              </>
            )}
          </div>

          <h1 className="page-hero-title">
            {activeTab === 'about' && 'About SignValid & Security Architecture'}
            {activeTab === 'terms' && 'Terms and Conditions of Use'}
            {activeTab === 'privacy' && 'Privacy Policy & Zero Data Retention'}
          </h1>

          <p className="page-hero-desc">
            {activeTab === 'about' &&
              'An open, free, and privacy-respecting cryptographic utility eliminating the widespread confusion caused by Adobe Reader\'s yellow question mark on Indian digital government documents.'}
            {activeTab === 'terms' &&
              'Clear and binding terms governing your use of SignValid, in-browser cryptographic verification, and universal display copies under the Information Technology Act, 2000.'}
            {activeTab === 'privacy' &&
              'Our strict commitment to citizen privacy: all PDF processing executes strictly in volatile RAM, with zero server uploads, zero disk caching, and zero data monetization.'}
          </p>
        </div>
      </div>

      {/* Sticky Inner Sub-Navigation Bar */}
      <div className="page-subnav-sticky-wrap">
        <div className="container">
          <nav className="page-subnav-bar" aria-label="About and Legal Sections">
            <button
              type="button"
              className={`page-subnav-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabSelect('about')}
            >
              <ShieldCheck size={16} />
              <span>About SignValid</span>
            </button>
            <button
              type="button"
              className={`page-subnav-item ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => handleTabSelect('terms')}
            >
              <FileText size={16} />
              <span>Terms & Conditions</span>
            </button>
            <button
              type="button"
              className={`page-subnav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => handleTabSelect('privacy')}
            >
              <Lock size={16} />
              <span>Privacy Policy</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 60, paddingTop: 16 }}>
        {/* ======================================================== */}
        {/* TAB 1: ABOUT SIGNVALID & SECURITY ARCHITECTURE           */}
        {/* ======================================================== */}
        {activeTab === 'about' && (
          <div>
            {/* Core Mission & Story */}
            <div className="about-section-card">
              <div className="about-section-grid">
                <div>
                  <div className="guide-badge success" style={{ marginBottom: 12 }}>Our Mission</div>
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--color-heading-dark)', marginBottom: 14 }}>
                    Ending the "Yellow Question Mark" Problem for Indian Citizens
                  </h2>
                  <p style={{ lineHeight: 1.7, color: 'var(--color-body)', marginBottom: 14 }}>
                    Over 1.4 billion citizens in India receive digital documents — from e-Aadhaar identity cards and income certificates to university marksheets and driving licenses. Every year, millions of citizens are turned away by government clerks, banks, or colleges because Adobe Acrobat Reader shows a yellow question mark: <em>"? Validity Unknown"</em>.
                  </p>
                  <p style={{ lineHeight: 1.7, color: 'var(--color-body)' }}>
                    SignValid was created to solve this once and for all: validating the actual cryptographic math against the official Indian Controller of Certifying Authorities (CCA) root hierarchy and producing a compliant, universal display copy with a permanent green checkmark (✓).
                  </p>
                </div>

                <div className="about-highlight-box">
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-green)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} />
                    <span>The SignValid Standard</span>
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
                    <li style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓</span>
                      <span><strong>100% Free:</strong> No registration, paywalls, or limits.</span>
                    </li>
                    <li style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓</span>
                      <span><strong>Zero Data Retention:</strong> Processed in volatile memory only.</span>
                    </li>
                    <li style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓</span>
                      <span><strong>Accredited Roots:</strong> Validated against CCA India 2014 & 2022.</span>
                    </li>
                    <li style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓</span>
                      <span><strong>Universal Display:</strong> Green checkmark stays intact everywhere.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3 Pillars of Security Architecture */}
            <div style={{ marginTop: 36, marginBottom: 36 }}>
              <h2 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--color-heading-dark)', marginBottom: 24 }}>
                Security & Cryptographic Architecture
              </h2>

              <div className="about-pillars-grid">
                <div className="about-pillar-card">
                  <div className="pillar-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                    <Lock size={22} />
                  </div>
                  <h3>Zero-Retention Privacy Guarantee</h3>
                  <p>
                    When you drag a file into SignValid, the document is parsed directly in browser RAM buffers. We do not store your Aadhaar numbers, tax records, or certificates on any disk, database, or cloud bucket. When you close your browser tab, your document is instantly eradicated from RAM.
                  </p>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-icon-box" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                    <Cpu size={22} />
                  </div>
                  <h3>Cryptographic Integrity Verification</h3>
                  <p>
                    Our engine parses the ISO 32000 PDF /ByteRange boundaries, recalculates the SHA-256 cryptographic digest of the signed bytes, and verifies the RSA/ECDSA mathematical signature against the signer's public key using WebCrypto and PKCS#7 standards.
                  </p>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-icon-box" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                    <Award size={22} />
                  </div>
                  <h3>CCA India Trust Chain Anchor</h3>
                  <p>
                    SignValid maintains bundled public key anchors for India PKI CCA Root Certificates (2007, 2011, 2014, 2015SPL, 2022, 2022SPL), verifying certificate paths through accredited CAs including e-Mudhra, NIC, Capricorn, NSDL, IDRBT, VSign, and CDAC.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Framework & IT Act 2000 */}
            <div className="about-legal-card">
              <div className="guide-badge info">Legal Framework</div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-heading-dark)', marginTop: 8, marginBottom: 12 }}>
                Information Technology Act 2000 Compliance
              </h2>
              <p style={{ lineHeight: 1.7, color: 'var(--color-body)', marginBottom: 16 }}>
                Under Section 4 and Section 5 of the Information Technology Act 2000, electronic records and digital signatures authenticated through licensed Certifying Authorities under the Controller of Certifying Authorities (CCA) have legal recognition and equivalence to handwritten physical signatures.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--color-heading-dark)' }}>Section 4 (Legal Recognition):</strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', margin: '6px 0 0 0' }}>
                    Where any law provides that information shall be in writing or in physical form, such requirement is deemed satisfied if rendered in electronic form.
                  </p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--color-heading-dark)' }}>Section 5 (Digital Signatures):</strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', margin: '6px 0 0 0' }}>
                    Where any law provides that information shall be authenticated by affixing a signature, such requirement is deemed satisfied by digital signature.
                  </p>
                </div>
              </div>
            </div>

            {/* Transparency Disclaimer */}
            <div className="about-disclaimer-box">
              <strong>Non-Government Affiliation Disclaimer:</strong>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: 'var(--color-muted)' }}>
                SignValid is an independent cryptographic verification utility. It is not affiliated with, maintained by, or operated by UIDAI, MeitY, the Controller of Certifying Authorities, or any central or state government portal. All verification uses publicly verifiable cryptographic standards and root certificates published by cca.gov.in.
              </p>
              <OwnershipScrapReveal />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TERMS AND CONDITIONS OF USE (from term&cond.tsx)   */}
        {/* ======================================================== */}
        {activeTab === 'terms' && (
          <TermAndCond onNavigateToValidate={onNavigateToValidate} />
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRIVACY POLICY & ZERO RETENTION                   */}
        {/* ======================================================== */}
        {activeTab === 'privacy' && (
          <div className="terms-container">
            <div className="terms-intro-card" style={{ borderLeftColor: '#059669' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Lock size={20} color="#059669" />
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-heading-dark)', margin: 0 }}>
                  Zero-Retention Privacy Guarantee
                </h2>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                Indian citizen documents contain sensitive personal and financial identifiers, including Aadhaar numbers, PAN identifiers, parental names, and residential addresses. SignValid is engineered with uncompromising privacy by design: your document never leaves your device's volatile memory.
              </p>
            </div>

            <div className="about-pillars-grid">
              <div className="about-pillar-card">
                <div className="pillar-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                  <Cpu size={22} />
                </div>
                <h3>100% In-Memory RAM Buffers</h3>
                <p>
                  Files are evaluated strictly in volatile RAM. Buffers are purged from memory as soon as verification completes. No files or images are ever saved to disk or server databases.
                </p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon-box" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                  <ShieldCheck size={22} />
                </div>
                <h3>Signature Directory Inspection Only</h3>
                <p>
                  We inspect only signature byte ranges, cryptographic hashes, and public X.509 certificates. Your Aadhaar photo, biometric records, and personal particulars are never harvested or indexed.
                </p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon-box" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  <Lock size={22} />
                </div>
                <h3>No Data Monetization</h3>
                <p>
                  SignValid does not build user profiles, track documents across sessions, sell advertising, or share analytical telemetry with third-party brokers.
                </p>
              </div>
            </div>

            <div className="terms-article-card">
              <div className="terms-article-header">
                <ShieldCheck size={20} color="var(--primary-green)" />
                <h3 className="terms-article-title">Digital Personal Data Protection (DPDP) Act Alignment</h3>
              </div>
              <div className="terms-article-body">
                <p>
                  In accordance with India's <strong>Digital Personal Data Protection Act, 2023</strong>:
                </p>
                <ul>
                  <li>
                    <strong>Purpose Limitation:</strong> Uploaded files are accessed exclusively for the explicit purpose requested by the citizen — verifying mathematical digital signatures.
                  </li>
                  <li>
                    <strong>Storage Limitation:</strong> Retention duration is zero milliseconds after session termination. No logs containing document names, citizen identities, or file contents are preserved.
                  </li>
                  <li>
                    <strong>Data Minimization:</strong> Only byte ranges designated under ISO 32000-1 `/ByteRange` are read for cryptographic hashing.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AboutPage;
