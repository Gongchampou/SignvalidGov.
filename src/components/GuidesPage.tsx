import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Key,
  ShieldCheck,
  ArrowRight,
  Printer
} from 'lucide-react';

interface GuidesPageProps {
  initialTopic?: string;
  onNavigateToValidate: () => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({
  initialTopic = 'adobe',
  onNavigateToValidate
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTopic);

  const tabs = [
    { id: 'adobe', label: 'Fix "Validity Unknown" in Adobe', icon: AlertCircle },
    { id: 'eaadhaar', label: 'e-Aadhaar Digital Signature', icon: FileText },
    { id: 'edistrict', label: 'State e-District Certificates', icon: ShieldCheck },
    { id: 'digilocker', label: 'DigiLocker Academic Documents', icon: BookOpen },
    { id: 'passwords', label: 'Encrypted PDF Passwords', icon: Key },
    { id: 'printing', label: 'Printing & Physical Verification', icon: Printer }
  ];

  return (
    <div className="page-content-wrapper">
      {/* Page Header */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="section-subheading-pill">
            <BookOpen size={14} />
            <span>Official Knowledge Base</span>
          </div>
          <h1 className="page-hero-title">
            Indian Digital Signature Verification Guides
          </h1>
          <p className="page-hero-desc">
            Step-by-step compliance instructions for e-Aadhaar, state e-District portals, DigiLocker certificates, and Adobe Acrobat trust configuration.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 60 }}>
        {/* Horizontal Navigation Tabs */}
        <div className="guide-nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`guide-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Guide Content Display */}
        <div className="guide-content-card">
          {activeTab === 'adobe' && (
            <div className="guide-body">
              <div className="guide-section-header">
                <div className="guide-badge warning">Root Cause & Resolution</div>
                <h2>Why Adobe Acrobat Shows "? Validity Unknown" and How to Fix It</h2>
                <p>
                  When you open an Indian government PDF (such as an e-Aadhaar, income certificate, or caste certificate) in Adobe Acrobat Reader, it almost always displays a yellow question mark with the message <em>"At least one signature has problems"</em> or <em>"Validity Unknown"</em>.
                </p>
              </div>

              <div className="guide-alert-box warning">
                <AlertCircle size={20} className="alert-box-icon" />
                <div>
                  <strong>Important Note for Citizens & Officials:</strong>
                  <p>
                    This yellow question mark does <strong>NOT</strong> mean your document is fraudulent, expired, or tampered with. It simply means that Adobe Acrobat Reader does not include the Government of India's Controller of Certifying Authorities (CCA) root certificate in its pre-installed AATL trust list.
                  </p>
                </div>
              </div>

              <h3>Method 1: Use SignValid (Instant, Universal & Permanent)</h3>
              <p>
                Instead of configuring every computer or having officers reject your certificate, simply validate your PDF using SignValid:
              </p>
              <ul className="guide-steps-list">
                <li>
                  <strong>100% In-Memory Audit:</strong> Extracts the PKCS#7 cryptographic container and verifies the certificate chain against India's official CCA Root certificates (2014 & 2022).
                </li>
                <li>
                  <strong>Universal Display Copy:</strong> Generates a verified display copy where the yellow '?' is replaced with a permanent Adobe-style 3D green tick (✓).
                </li>
                <li>
                  <strong>Works Everywhere:</strong> Stays green in Google Chrome, Microsoft Edge, mobile viewers, and physical paper printouts.
                </li>
              </ul>

              <div style={{ margin: '20px 0' }}>
                <button
                  type="button"
                  className="download-cta-btn"
                  onClick={onNavigateToValidate}
                >
                  <span>Validate Your Document with SignValid</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <hr className="guide-divider" />

              <h3>Method 2: Manual Adobe Acrobat Desktop Configuration</h3>
              <p>If you prefer to manually configure Adobe Acrobat Reader on a Windows or Mac computer:</p>
              <ol className="guide-numbered-list">
                <li>Open your digitally signed PDF in Adobe Acrobat Reader DC.</li>
                <li>Right-click on the signature box displaying the yellow question mark.</li>
                <li>Click <strong>Show Signature Properties</strong>.</li>
                <li>In the dialog that appears, click <strong>Show Signer's Certificate</strong>.</li>
                <li>Select the <strong>Trust</strong> tab at the top of the Certificate Viewer.</li>
                <li>Click <strong>Add to Trusted Certificates</strong>, then click <strong>OK</strong> when prompted with security warnings.</li>
                <li>Check the box that says <strong>Certified documents</strong> and <strong>Dynamic content</strong>.</li>
                <li>Click <strong>OK</strong> to close the dialog, then click <strong>Validate Signature</strong>. The yellow '?' will turn into a green checkmark on that specific computer.</li>
              </ol>
            </div>
          )}

          {activeTab === 'eaadhaar' && (
            <div className="guide-body">
              <div className="guide-section-header">
                <div className="guide-badge success">UIDAI Identity Compliance</div>
                <h2>Verifying e-Aadhaar & Masked Aadhaar Digital Signatures</h2>
                <p>
                  Electronic Aadhaar cards issued by the Unique Identification Authority of India (UIDAI) via uidai.gov.in or myaadhaar.uidai.gov.in contain an official digital signature token located at the bottom-right corner.
                </p>
              </div>

              <div className="guide-alert-box info">
                <ShieldCheck size={20} className="alert-box-icon" />
                <div>
                  <strong>Official UIDAI Signer Identity:</strong>
                  <p>
                    Authentic e-Aadhaar signatures are issued to <strong>DS UNIQUE IDENTIFICATION AUTHORITY OF INDIA 01, 02, or 03</strong> by accredited Certifying Authorities (such as e-Mudhra or CCA India).
                  </p>
                </div>
              </div>

              <h3>Password Protection Rule for e-Aadhaar</h3>
              <p>
                All e-Aadhaar PDFs are protected by default with an 8-character password format mandated by UIDAI:
              </p>
              <div className="guide-code-box">
                <div className="code-label">Password Format:</div>
                <code>[FIRST 4 LETTERS OF NAME IN CAPITAL] + [4-DIGIT YEAR OF BIRTH]</code>
                <div className="code-example">
                  Example: If your name is <strong>ANITA KUMARI</strong> and year of birth is <strong>1992</strong>, your password is <strong>ANIT1992</strong>.
                </div>
              </div>

              <h3>How SignValid Validates e-Aadhaar</h3>
              <ul className="guide-steps-list">
                <li>Decrypts in volatile memory using your password (never saved).</li>
                <li>Verifies the SHA-256 cryptographic digest of UIDAI identity data.</li>
                <li>Validates the X.509 certificate path against CCA India 2014 Root Authority.</li>
                <li>Produces a print-ready display copy with the verified green tick ✓.</li>
              </ul>
            </div>
          )}

          {activeTab === 'edistrict' && (
            <div className="guide-body">
              <div className="guide-section-header">
                <div className="guide-badge success">State e-Governance</div>
                <h2>State e-District Government Certificates (Caste, Income, Domicile)</h2>
                <p>
                  State portals like Karnataka Seva Sindhu, Tamil Nadu eSevai, Uttar Pradesh eDistrict, Kerala e-District, Manipur e-Seva, and Maharashtra Aaple Sarkar issue digitally signed certificates without physical signatures or ink stamps.
                </p>
              </div>

              <div className="guide-grid-2">
                <div className="guide-feature-box">
                  <h4>Authorized Signatory Formats</h4>
                  <p>
                    Certificates are digitally signed by Tahsildars, Sub-Divisional Officers (SDO), Revenue Officers (RO), or District Magistrates using Class 3 DSC tokens issued by National Informatics Centre (NICCA) or licensed CAs like e-Mudhra, Capricorn, or VSign.
                  </p>
                </div>
                <div className="guide-feature-box">
                  <h4>Legal Status under IT Act 2000</h4>
                  <p>
                    Section 4 & 5 of the Information Technology Act 2000 accords digital signatures the exact same legal status as traditional handwritten ink signatures in all Indian courts and administrative proceedings.
                  </p>
                </div>
              </div>

              <h3>Common Issues with State Certificates</h3>
              <ul className="guide-steps-list">
                <li>
                  <strong>Missing Intermediate CA:</strong> Many state portals embed only the officer's leaf certificate and omit the Sub-CA in the PDF. SignValid resolves this automatically using our built-in accredited CA registry.
                </li>
                <li>
                  <strong>Expired Signing Token:</strong> SignValid verifies whether the certificate was valid at the exact timestamp of signing, ensuring older documents remain valid.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'digilocker' && (
            <div className="guide-body">
              <div className="guide-section-header">
                <div className="guide-badge success">National Academic & Citizen Depository</div>
                <h2>DigiLocker Marksheets, Degree Certificates & Official Records</h2>
                <p>
                  Documents issued through the DigiLocker platform (such as CBSE marksheets, university degree certificates, driving licenses, and vehicle registration certificates) are cryptographically signed by the National e-Governance Division (NeGD).
                </p>
              </div>

              <div className="guide-alert-box info">
                <CheckCircle2 size={20} className="alert-box-icon" />
                <div>
                  <strong>Rule 9A of IT Rules 2016:</strong>
                  <p>
                    Under Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules 2016, documents available via DigiLocker are treated at par with original physical documents.
                  </p>
                </div>
              </div>

              <h3>Key Signatures in DigiLocker Documents</h3>
              <ul className="guide-steps-list">
                <li>
                  <strong>Signer Identity:</strong> National e-Governance Division (NeGD) or Central Board of Secondary Education (CBSE).
                </li>
                <li>
                  <strong>Certifying Authority:</strong> C-DAC CA or NIC CA, chained to CCA India Root 2014 / 2022.
                </li>
                <li>
                  <strong>Signature Standard:</strong> PAdES / PKCS#7 detached digital signature with SHA-256 digest.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'passwords' && (
            <div className="guide-body">
              <div className="guide-section-header">
                <div className="guide-badge info">Password Reference</div>
                <h2>Standard Password Formats for Encrypted Indian PDFs</h2>
                <p>
                  Many government portals encrypt PDFs using password security to protect citizen privacy. Below are the official password patterns:
                </p>
              </div>

              <div className="passwords-table-wrapper">
                <table className="passwords-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Password Format</th>
                      <th>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>e-Aadhaar (UIDAI)</strong></td>
                      <td>First 4 letters of name in CAPITAL + 4-digit Year of Birth</td>
                      <td>RAME1985</td>
                    </tr>
                    <tr>
                      <td><strong>e-PAN (Income Tax)</strong></td>
                      <td>Date of Birth in DDMMYYYY format (no slashes)</td>
                      <td>15081995</td>
                    </tr>
                    <tr>
                      <td><strong>DigiLocker PIN Protected</strong></td>
                      <td>6-digit Security PIN set during account creation</td>
                      <td>123456</td>
                    </tr>
                    <tr>
                      <td><strong>Vehicle RC / Driving License</strong></td>
                      <td>Vehicle Registration Number or DOB depending on RTO</td>
                      <td>DL01AB1234</td>
                    </tr>
                    <tr>
                      <td><strong>EPFO UAN Statement</strong></td>
                      <td>First 4 letters of name in LOWERCASE + DOB in DDMMYYYY</td>
                      <td>amit15081990</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'printing' && (
            <div className="guide-body">
              <div className="guide-section-header">
                <div className="guide-badge success">Universal Acceptance</div>
                <h2>Printing & Physical Submission of Digitally Signed Documents</h2>
                <p>
                  When presenting digital certificates for college admissions, bank loans, passport verification, or visa applications, officers frequently demand a physical printout with a green checkmark.
                </p>
              </div>

              <div className="guide-alert-box warning">
                <AlertCircle size={20} className="alert-box-icon" />
                <div>
                  <strong>Why Regular Prints Fail:</strong>
                  <p>
                    If you print a document directly from Adobe Acrobat Reader when it displays "?", the printed paper will permanently show a yellow question mark, which clerks often reject.
                  </p>
                </div>
              </div>

              <h3>SignValid's Universal Display Standard</h3>
              <p>
                SignValid generates a compliant display copy where the green checkmark is flattened into the PDF vector layer:
              </p>
              <ul className="guide-steps-list">
                <li>
                  <strong>Crisp Adobe 3D Green Checkmark:</strong> Rendered with exact Adobe Acrobat geometric coordinates and 3D black drop shadow.
                </li>
                <li>
                  <strong>All Pages Preserved:</strong> 100% of the original document layout, stamps, bar codes, and QR codes are preserved without compression loss.
                </li>
                <li>
                  <strong>Print-Ready:</strong> Prints flawlessly on black-and-white and color laser printers without any "Signature Not Verified" marks.
                </li>
              </ul>

              <div style={{ marginTop: 24 }}>
                <button
                  type="button"
                  className="download-cta-btn"
                  onClick={onNavigateToValidate}
                >
                  <span>Upload & Create Print-Ready Copy</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner back to Validator */}
        <div className="guide-cta-banner">
          <div>
            <h3>Ready to Validate Your PDF?</h3>
            <p>Upload your document to inspect its digital signature and get an authentic green checkmark copy in seconds.</p>
          </div>
          <button
            type="button"
            className="download-cta-btn"
            onClick={onNavigateToValidate}
          >
            <span>Go to Document Validator</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
