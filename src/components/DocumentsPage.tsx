import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { SupportedDocsSection } from './SupportedDocsSection';

interface DocumentsPageProps {
  onNavigateToValidate: () => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ onNavigateToValidate }) => {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            <FileText size={14} />
            <span>Document Directory</span>
          </div>
          <h1 className="page-hero-title">
            Supported Indian Digital Documents
          </h1>
          <p className="page-hero-desc">
            Explore 40+ supported government document categories, certifying authorities, and state portals across India.
          </p>
        </div>
      </div>

      <div>
        {/* Supported Documents Section */}
        <SupportedDocsSection />

        {/* Bottom CTA Banner */}
        <div className="container" style={{ paddingBottom: 60 }}>
          <div className="guide-cta-banner">
            <div>
              <h3>Have a Document to Validate?</h3>
              <p>Drag and drop your e-Aadhaar, certificate, marksheet, or land record to verify it now.</p>
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
