import React from 'react';
import {
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UploadCloud,
  ShieldCheck,
  Download,
  HelpCircle
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigateToValidate: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigateToValidate }) => {
  const steps = [
    {
      num: '1',
      title: 'Upload PDF in Memory',
      desc: 'Drag & drop your Indian government PDF. Your document is processed strictly inside ephemeral browser RAM buffers and is never written to disk or stored on any server.',
      icon: UploadCloud,
      sub: 'Zero Data Retention'
    },
    {
      num: '2',
      title: 'CCA Trust Verification',
      desc: 'Our engine extracts the PKCS#7 envelope, inspects the X.509 certificate path, validates SHA-256 hashes, and checks CRL/OCSP status against the official Indian CCA Root hierarchy.',
      icon: ShieldCheck,
      sub: 'IT Act 2000 Compliant'
    },
    {
      num: '3',
      title: 'Download Validated Copy',
      desc: 'Get an updated PDF copy containing a permanent green checkmark, complete signing metadata, and a verification audit certificate that displays cleanly on any device and on paper printouts.',
      icon: Download,
      sub: 'Universal Display'
    }
  ];

  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            <Zap size={14} />
            <span>Technical Architecture</span>
          </div>
          <h1 className="page-hero-title">
            How SignValid Works
          </h1>
          <p className="page-hero-desc">
            Understanding the root cause of Adobe Acrobat's yellow question mark and how SignValid produces universally verified display copies with authentic green checkmarks.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* Educational Explainer: Why does Adobe show a yellow question mark? */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-header-center" style={{ marginBottom: 28 }}>
            <div className="section-subheading-pill">
              <HelpCircle size={14} />
              <span>Root Cause Explained</span>
            </div>
            <h2 className="section-main-title">
              Why does Adobe show a yellow question mark?
            </h2>
            <p className="section-desc">
              Millions of Indian citizens see <em>"Validity Unknown"</em> on authentic certificates. Here is why it happens and how SignValid fixes it for good.
            </p>
          </div>

          <div className="explainer-comparison-grid">
            {/* Adobe Reader Box */}
            <div className="explainer-card adobe-card">
              <div className="explainer-tag">
                <AlertCircle size={14} />
                <span>Standard Adobe Acrobat Reader</span>
              </div>

              <h3 className="explainer-card-title" style={{ color: 'var(--warning-text)' }}>
                ? Validity Unknown
              </h3>

              <div className="explainer-list">
                <div className="explainer-list-item">
                  <XCircle size={18} color="#D97706" className="list-icon" />
                  <div>
                    <strong>Missing Indian CCA Root Certificate:</strong> Adobe Reader only ships with US-centric Adobe Approved Trust List (AATL) root stores by default. The official Controller of Certifying Authorities (CCA) India root certificate is omitted.
                  </div>
                </div>

                <div className="explainer-list-item">
                  <XCircle size={18} color="#D97706" className="list-icon" />
                  <div>
                    <strong>Recipient Confusion:</strong> When presenting documents to employers, banks, or colleges, officers often reject authentic documents thinking the yellow mark signifies an unverified or counterfeit file.
                  </div>
                </div>

                <div className="explainer-list-item">
                  <XCircle size={18} color="#D97706" className="list-icon" />
                  <div>
                    <strong>Fails on Mobile & Print:</strong> Mobile PDF viewers and physical paper prints display a frozen question mark, with no way for a third party to click "Signature Properties".
                  </div>
                </div>
              </div>
            </div>

            {/* SignValid Solution Box */}
            <div className="explainer-card signvalid-card">
              <div className="explainer-tag">
                <CheckCircle2 size={14} />
                <span>SignValid Universal Verification</span>
              </div>

              <h3 className="explainer-card-title" style={{ color: 'var(--primary-green)' }}>
                ✓ Verified Signature Copy
              </h3>

              <div className="explainer-list">
                <div className="explainer-list-item">
                  <CheckCircle2 size={18} color="var(--primary-green)" className="list-icon" />
                  <div>
                    <strong>Pre-installed India CCA Trust Store:</strong> SignValid evaluates every signature against the official CCA India 2014 Root and accredited CAs (NIC, eMudhra, C-DAC, NSDL, Capricorn).
                  </div>
                </div>

                <div className="explainer-list-item">
                  <CheckCircle2 size={18} color="var(--primary-green)" className="list-icon" />
                  <div>
                    <strong>Universal Green Tick Display Copy:</strong> Produces a compliant display document featuring a permanent green checkmark, complete signer metadata, and a tamper-evident verification stamp.
                  </div>
                </div>

                <div className="explainer-list-item">
                  <CheckCircle2 size={18} color="var(--primary-green)" className="list-icon" />
                  <div>
                    <strong>Works on Any Phone & Paper Printouts:</strong> The validated copy prints with the verified green tick and includes a cryptographic verification QR code for instant cross-checking.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="download-cta-btn"
                onClick={onNavigateToValidate}
                style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
              >
                <span>Validate Your Document Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Step Verification Process */}
        <div style={{ marginTop: 52 }}>
          <div className="section-header-center" style={{ marginBottom: 28 }}>
            <div className="section-subheading-pill">
              <Zap size={14} />
              <span>Simple & Rigorous</span>
            </div>
            <h2 className="section-main-title">
              3-Step Verification Process
            </h2>
            <p className="section-desc">
              How SignValid securely transforms an unverified question mark into a universally accepted green checkmark.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="step-card">
                  <div className="step-number-badge">
                    {step.num}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary-green)', textTransform: 'uppercase', marginBottom: 8 }}>
                    <Icon size={14} />
                    <span>{step.sub}</span>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner back to Validator */}
        <div className="guide-cta-banner" style={{ marginTop: 52 }}>
          <div>
            <h3>Ready to Validate Your PDF?</h3>
            <p>Experience real, in-memory cryptographic verification and get an authentic green checkmark copy in seconds.</p>
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
