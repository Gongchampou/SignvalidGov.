import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { FaqSection } from './FaqSection';

interface FaqPageProps {
  onNavigateToValidate: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigateToValidate }) => {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            <HelpCircle size={14} />
            <span>Support & Knowledge</span>
          </div>
          <h1 className="page-hero-title">
            Frequently Asked Questions
          </h1>
          <p className="page-hero-desc">
            Answers to common questions regarding Indian digital signature validation, Adobe yellow question marks, legal validity, and zero-retention privacy.
          </p>
        </div>
      </div>

      <div>
        {/* Faq Section */}
        <FaqSection />

        {/* Bottom CTA Banner */}
        <div className="container" style={{ paddingBottom: 60 }}>
          <div className="guide-cta-banner">
            <div>
              <h3>Have a Question About Your Specific File?</h3>
              <p>Drop your file into the validator to see a complete cryptographic breakdown in seconds.</p>
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
