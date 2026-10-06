import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { AdobeExplainer } from './AdobeExplainer';
import { HowItWorks } from './HowItWorks';

interface HowItWorksPageProps {
  onNavigateToValidate: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigateToValidate }) => {
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

      <div>
        {/* Educational Explainer: Why does Adobe show a yellow question mark? */}
        <AdobeExplainer onScrollToValidate={onNavigateToValidate} />

        {/* 3-Step Process: How SignValid works */}
        <HowItWorks />

        {/* Bottom Banner back to Validator */}
        <div className="container" style={{ paddingBottom: 60 }}>
          <div className="guide-cta-banner">
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
    </div>
  );
};
