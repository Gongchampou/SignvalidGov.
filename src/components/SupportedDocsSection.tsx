import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SUPPORTED_DOCUMENTS } from '../data/supportedDocs';

export const SupportedDocsSection: React.FC = () => {
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
    <section className="section-wrapper" id="documents">
      <div className="container">
        <div className="section-header-center">
          <div className="section-subheading-pill">
            <ShieldCheck size={14} />
            <span>Comprehensive Coverage</span>
          </div>
          <h2 className="section-main-title">
            Supported Indian Digital Documents
          </h2>
          <p className="section-desc">
            SignValid supports digitally signed certificates issued by Indian central authorities, state e-Governance portals, judiciary, and accredited bodies.
          </p>
        </div>

        {/* Search and Category Filter Bar */}
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
                style={{ fontSize: '0.8rem', color: 'var(--color-muted)', padding: '2px 8px' }}
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
      </div>
    </section>
  );
};
