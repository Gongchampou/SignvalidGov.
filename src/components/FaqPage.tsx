import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faqData';

interface FaqPageProps {
  onNavigateToValidate: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigateToValidate }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

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
            Answers to common questions regarding Indian digital signature validation, Adobe yellow question marks, legal validity under the IT Act 2000, and zero-retention privacy.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* FAQ Accordion List */}
        <div className="faq-list">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown size={20} className="faq-icon-chevron" />
                </button>
                {isOpen && (
                  <div className="faq-answer-body">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="guide-cta-banner" style={{ marginTop: 48 }}>
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
  );
};
