import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { AuthoritiesSection } from './AuthoritiesSection';

interface AuthoritiesPageProps {
  onNavigateToValidate: () => void;
}

export const AuthoritiesPage: React.FC<AuthoritiesPageProps> = ({ onNavigateToValidate }) => {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            <Award size={14} />
            <span>Root Trust Directory</span>
          </div>
          <h1 className="page-hero-title">
            CCA India Trusted Certifying Authorities
          </h1>
          <p className="page-hero-desc">
            Explore the official licensed Certifying Authorities and India PKI root trust anchors operating under the Ministry of Electronics & IT (MeitY).
          </p>
        </div>
      </div>

      <div>
        {/* Authorities Section */}
        <AuthoritiesSection />

        {/* Bottom CTA Banner */}
        <div className="container" style={{ paddingBottom: 60 }}>
          <div className="guide-cta-banner">
            <div>
              <h3>Verify Against the Official CCA Root</h3>
              <p>Test your PDF digital certificate against the bundled Indian CCA Root trust store.</p>
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
