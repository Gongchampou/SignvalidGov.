import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

interface GuidesModalProps {
  initialTopic?: string;
  onClose: () => void;
  onScrollToValidate: () => void;
}

export const GuidesModal: React.FC<GuidesModalProps> = ({
  initialTopic = 'adobe',
  onClose,
  onScrollToValidate
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTopic);

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
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="modal-title">SignValid Knowledge Guides</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                Authoritative instructions for Indian digital signature compliance
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab navigation */}
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '12px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'adobe', label: 'Fix "Validity Unknown"' },
            { id: 'eaadhaar', label: 'e-Aadhaar Validation' },
            { id: 'edistrict', label: 'State e-District' },
            { id: 'digilocker', label: 'DigiLocker Files' },
            { id: 'about', label: 'About SignValid' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--primary-green)' : 'var(--border-subtle)',
                backgroundColor: activeTab === tab.id ? 'var(--primary-green)' : '#FFFFFF',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--color-body)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {activeTab === 'adobe' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-heading-dark)' }}>
                Why Adobe Reader Shows "? Validity Unknown" and How to Fix It
              </h4>
              <p>
                When you open a downloaded e-Aadhaar or e-District certificate in Adobe Acrobat Reader, you will often see a yellow question mark stating:
                <strong style={{ color: 'var(--warning-text)' }}> "At least one signature has problems."</strong>
              </p>
              <div style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning-border)', padding: '14px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: 'var(--warning-text)' }}>
                <strong>Important:</strong> This does NOT mean your document is fake or tampered with. It simply means Adobe's software does not have India's official CCA Root Certificate imported into its trusted identities list by default.
              </div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)', marginTop: 8 }}>
                Two Ways to Resolve This:
              </h5>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
                <li>
                  <strong>Use SignValid (Instant & Universal):</strong> Drop your PDF into SignValid. Our engine verifies the PKCS#7 signature against CCA India 2014 and gives you a universal verified copy featuring a clear green tick that displays correctly on smartphones, web browsers, and paper printouts.
                </li>
                <li>
                  <strong>Manual Adobe Configuration:</strong> Right-click the signature field in Adobe Reader → Select <em>Signature Properties</em> → Click <em>Show Signer's Certificate</em> → Open the <em>Trust</em> tab → Click <em>Add to Trusted Certificates</em> → Check <em>Certified documents</em> → Click OK, then click <em>Validate Signature</em>.
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'eaadhaar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-heading-dark)' }}>
                Verifying e-Aadhaar & Masked Aadhaar Digital Signatures
              </h4>
              <p>
                The Unique Identification Authority of India (UIDAI) signs electronic Aadhaar cards using Class 3 digital signature tokens issued by eMudhra or CCA. The signature contains a visual block at the bottom right with a question mark before validation.
              </p>
              <div style={{ backgroundColor: 'var(--mint-bg)', border: '1px solid var(--mint-border)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                <strong>UIDAI Signer Details:</strong> Common Name DS UIDAI 01 / DS UIDAI 02 / DS UIDAI 03, issued under Controller of Certifying Authorities (CCA) India.
              </div>
              <p style={{ fontSize: '0.9rem' }}>
                Passphrase Note: If your e-Aadhaar PDF is password-protected, the password is your 4-letter first name in capital letters followed by your 4-digit birth year (e.g., SURE1990).
              </p>
            </div>
          )}

          {activeTab === 'edistrict' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-heading-dark)' }}>
                State Revenue & Citizen e-District Certificates
              </h4>
              <p>
                State portal certificates (Caste, Income, Domicile, Non-Creamy Layer, Legal Heir) issued via Karnataka Seva Sindhu, TN eSevai, Kerala e-District, UP eDistrict, and Maharashtra Aaple Sarkar are signed with Class 3 DSC tokens issued through National Informatics Centre (NIC CA) or commercial licensed CAs.
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                SignValid parses the detached PKCS#7 envelope, inspects the Tahsildar / Revenue Inspector signature certificate, and checks CRL revocation against the state repository.
              </p>
            </div>
          )}

          {activeTab === 'digilocker' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-heading-dark)' }}>
                DigiLocker & Academic Depository Certificates
              </h4>
              <p>
                DigiLocker issued certificates (such as CBSE marksheets, university degree certificates, driving licenses, and vehicle registration) are cryptographically signed by the National e-Governance Division (NeGD) using C-DAC CA or NIC CA certificates.
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Under Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules 2016, documents from DigiLocker are treated at par with original physical documents.
              </p>
            </div>
          )}

          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-heading-dark)' }}>
                About SignValid & Independent Public Service
              </h4>
              <p>
                SignValid was created as an open, free, and privacy-respecting public web utility to eliminate the widespread confusion caused by Adobe Reader's yellow question mark on authentic Indian government documents.
              </p>
              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                <strong>Strict Zero-Retention Architecture:</strong> All PDF parsing, hash calculation, and certificate validation takes place strictly in volatile RAM. No documents are stored on any disk or database.
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                Disclaimer: SignValid is an independent utility and is not affiliated with UIDAI, MeitY, or any central or state government organization.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="download-cta-btn"
            onClick={() => {
              onClose();
              onScrollToValidate();
            }}
          >
            Go to Document Validator
          </button>
        </div>
      </div>
    </div>
  );
};
