import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Award,
  CheckCircle2,
  FileText,
  Scale
} from 'lucide-react';
import { TermAndCond } from './term&cond';

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
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--color-heading-dark)' }}>Section 4 (Legal Recognition):</strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', margin: '6px 0 0 0' }}>
                    Where any law provides that information shall be in writing or in physical form, such requirement is deemed satisfied if rendered in electronic form.
                  </p>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
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
              <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: '#6B7280' }}>
                SignValid is an independent cryptographic verification utility. It is not affiliated with, maintained by, or operated by UIDAI, MeitY, the Controller of Certifying Authorities, or any central or state government portal. All verification uses publicly verifiable cryptographic standards and root certificates published by cca.gov.in.
              </p>
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
