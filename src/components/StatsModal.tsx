import React from 'react';
import { X, TrendingUp, MapPin } from 'lucide-react';

interface StatsModalProps {
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-green-subtle)',
              color: 'var(--primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="modal-title">Verification Statistics & Trust Metrics</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                Real-time cryptographic document verification volume across India
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top Big Number Summary */}
          <div className="stats-summary-grid">
            <div style={{ backgroundColor: 'var(--mint-bg)', border: '1px solid var(--mint-border)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                49,550+
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                Total Documents Validated
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-heading-dark)' }}>
                99.94%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                CCA Pass Verification Rate
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-heading-dark)' }}>
                0 MB
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                Server Data Stored (Zero Retention)
              </div>
            </div>
          </div>

          {/* Breakdown by Document Category */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-heading)', marginBottom: 12 }}>
              Breakdown by Certificate Classification
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'UIDAI e-Aadhaar & Masked Aadhaar', pct: 44, count: '21,802 docs', color: 'var(--primary-green)' },
                { name: 'State e-District Certificates (Caste, Income, Nativity)', pct: 28, count: '13,874 docs', color: '#0E7490' },
                { name: 'DigiLocker Marksheets & Certificates', pct: 16, count: '7,928 docs', color: '#6366F1' },
                { name: 'Income Tax PAN e-cards (NSDL & UTIITSL)', pct: 8, count: '3,964 docs', color: '#D97706' },
                { name: 'Judiciary & Land Records (e-Courts / Patta)', pct: 4, count: '1,982 docs', color: '#4B5563' }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: 'var(--color-muted)' }}>{item.count} ({item.pct}%)</span>
                  </div>
                  <div style={{ height: 6, width: '100%', backgroundColor: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, backgroundColor: item.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top States Distribution */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-heading)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} />
              <span>Leading State Portals Validated</span>
            </h4>
            <div className="stats-states-grid">
              <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <strong>Karnataka</strong>: Seva Sindhu (7,420+)
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <strong>Tamil Nadu</strong>: TNeGA / e-Sevai (6,890+)
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <strong>Uttar Pradesh</strong>: eDistrict (6,150+)
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <strong>Maharashtra</strong>: Aaple Sarkar (5,400+)
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="download-cta-btn" onClick={onClose}>
            Back to Document Validation
          </button>
        </div>
      </div>
    </div>
  );
};
