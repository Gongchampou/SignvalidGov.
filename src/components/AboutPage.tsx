import React from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  ArrowRight,
  Award,
  CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
  onNavigateToValidate: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToValidate }) => {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            <ShieldCheck size={14} />
            <span>Independent Public Service</span>
          </div>
          <h1 className="page-hero-title">
            About SignValid & Security Architecture
          </h1>
          <p className="page-hero-desc">
            An open, free, and privacy-respecting cryptographic utility eliminating the widespread confusion caused by Adobe Reader's yellow question mark on Indian digital government documents.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 60 }}>
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

        {/* Bottom CTA Banner */}
        <div className="guide-cta-banner" style={{ marginTop: 32 }}>
          <div>
            <h3>Validate Your Documents with SignValid</h3>
            <p>Experience real, in-browser cryptographic verification with zero data retention.</p>
          </div>
          <button
            type="button"
            className="download-cta-btn"
            onClick={onNavigateToValidate}
          >
            <span>Start Validation Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
