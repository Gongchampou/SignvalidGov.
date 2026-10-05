import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('signvalid_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem('signvalid_cookie_consent', accepted ? 'allowed' : 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner-floating">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} color="var(--primary-green)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-heading-dark)' }}>
            Privacy-First Analytics
          </strong>
        </div>
        <button
          type="button"
          onClick={() => handleChoice(false)}
          style={{ color: 'var(--color-muted)', cursor: 'pointer', padding: 2 }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <p className="cookie-text">
        We collect anonymous diagnostic traffic metrics to keep the service fast and available. We never inspect, store, or transmit your document contents or identifiers.
      </p>

      <div className="cookie-actions">
        <button
          type="button"
          className="cookie-btn-decline"
          onClick={() => handleChoice(false)}
        >
          Decline
        </button>
        <button
          type="button"
          className="cookie-btn-allow"
          onClick={() => handleChoice(true)}
        >
          Allow analytics
        </button>
      </div>
    </div>
  );
};
