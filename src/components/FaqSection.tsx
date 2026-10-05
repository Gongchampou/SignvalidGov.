import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faqData';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="section-wrapper alternate-bg" id="faq">
      <div className="container">
        <div className="section-header-center">
          <div className="section-subheading-pill">
            <HelpCircle size={14} />
            <span>Answers & Technical Details</span>
          </div>
          <h2 className="section-main-title">
            Frequently Asked Questions
          </h2>
          <p className="section-desc">
            Everything you need to know about Indian government digital signatures, CCA trust anchors, and PDF verification.
          </p>
        </div>

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
      </div>
    </section>
  );
};
