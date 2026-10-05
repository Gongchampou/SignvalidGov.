import React from 'react';
import { UploadCloud, ShieldCheck, Download, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
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
      desc: 'Get an updated PDF copy containing a permanent green checkmark, complete signing metadata, and a verification QR code that displays cleanly on any device and on paper printouts.',
      icon: Download,
      sub: 'Universal Display'
    }
  ];

  return (
    <section className="section-wrapper alternate-bg" id="how-it-works">
      <div className="container">
        <div className="section-header-center">
          <div className="section-subheading-pill">
            <Zap size={14} />
            <span>Simple & Cryptographically Rigorous</span>
          </div>
          <h2 className="section-main-title">
            How SignValid Works
          </h2>
          <p className="section-desc">
            3 simple steps from yellow question mark confusion to a permanent, universally accepted green checkmark.
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
    </section>
  );
};
