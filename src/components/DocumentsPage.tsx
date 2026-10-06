import React, { useState } from 'react';
import { FileText, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { SUPPORTED_DOCUMENTS } from '../data/supportedDocs';

interface DocumentsPageProps {
  onNavigateToValidate: () => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ onNavigateToValidate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...SUPPORTED_DOCUMENTS.map(c => c.category)];

  const allItems = SUPPORTED_DOCUMENTS.flatMap(c =>
    c.items.map(item => ({ ...item, category: c.category }))
  );

  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.portal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

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

      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* Search Bar */}
        <div style={{ maxWidth: 650, margin: '0 auto 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Search size={18} color="var(--color-muted)" style={{ marginRight: 10 }} />
            <input
              type="text"
              placeholder="Search e-Aadhaar, Seva Sindhu, DigiLocker, PAN, Caste Certificate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.92rem',
                color: 'var(--color-heading-dark)'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ fontSize: '0.8rem', color: 'var(--color-muted)', padding: '2px 8px', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="supported-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Document Cards Grid */}
        <div className="docs-grid">
          {filteredItems.map((doc, idx) => (
            <div key={idx} className="doc-card-item">
              <div>
                <div className="doc-card-header">
                  <h4 className="doc-card-name">{doc.name}</h4>
                  <CheckCircle2 size={18} color="var(--primary-green)" style={{ flexShrink: 0 }} />
                </div>
                <div className="doc-card-authority">{doc.authority}</div>
              </div>

              <div className="doc-card-footer">
                <span className="doc-tag-pill">{doc.tag}</span>
                <span className="doc-portal-link">{doc.portal}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)' }}>
            No documents matched "{searchQuery}". Try searching for "Aadhaar", "Income", or "DigiLocker".
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="guide-cta-banner" style={{ marginTop: 48 }}>
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
  );
};
