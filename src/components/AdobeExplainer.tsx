import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface AdobeExplainerProps {
  onScrollToValidate: () => void;
}

export const AdobeExplainer: React.FC<AdobeExplainerProps> = ({ onScrollToValidate }) => {
  return (
    <section className="section-wrapper" id="why-adobe">
      <div className="container">
        <div className="section-header-center">
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
              onClick={onScrollToValidate}
              style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
            >
              <span>Validate Your Document Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
