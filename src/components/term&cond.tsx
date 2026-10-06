import React from 'react';
import {
  Scale,
  ShieldCheck,
  AlertCircle,
  FileText,
  ArrowRight
} from 'lucide-react';

interface TermAndCondProps {
  onNavigateToValidate?: () => void;
}

/**
 * Terms and Conditions Page Component
 * Written in clean, semantic HTML markup so it is easy to read, maintain, and edit.
 */
export const TermAndCond: React.FC<TermAndCondProps> = ({ onNavigateToValidate }) => {
  return (
    <div className="terms-page-container">
      {/* ========================================================= */}
      {/* HEADER BANNER / NOTICE CARD                               */}
      {/* ========================================================= */}
      <div className="terms-intro-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Scale size={24} color="var(--primary-green)" />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-heading-dark)', margin: 0 }}>
            SignValid — Terms and Conditions of Service
          </h2>
        </div>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-body)', lineHeight: 1.65, margin: 0 }}>
          Please read these Terms and Conditions carefully before using SignValid. By accessing or using the SignValid web application, uploading files for cryptographic signature verification, or downloading universal display copies, you confirm your acceptance of these terms, governed under the <strong>Information Technology Act, 2000</strong> of the Republic of India.
        </p>

        <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span><strong>Effective Date:</strong> October 2026</span>
          <span>•</span>
          <span><strong>Version:</strong> 2.0 (CCA India Compliant)</span>
          <span>•</span>
          <span><strong>Applicability:</strong> All Citizens, Verifiers & Institutions</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TABLE OF CONTENTS                                         */}
      {/* ========================================================= */}
      <div className="terms-toc-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <FileText size={18} color="var(--primary-green)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-heading-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Navigation / Table of Contents
          </strong>
        </div>

        <div className="terms-toc-grid">
          <a href="#section-1" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§1.</span>
            <span>Acceptance & Public Utility Scope</span>
          </a>
          <a href="#section-2" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§2.</span>
            <span>Non-Affiliation with Government</span>
          </a>
          <a href="#section-3" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§3.</span>
            <span>Ephemeral Client-Side RAM Architecture</span>
          </a>
          <a href="#section-4" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§4.</span>
            <span>Universal Display Copies & Flattening</span>
          </a>
          <a href="#section-5" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§5.</span>
            <span>Permitted Uses & User Responsibilities</span>
          </a>
          <a href="#section-6" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§6.</span>
            <span>Prohibited Activities & Misuse</span>
          </a>
          <a href="#section-7" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§7.</span>
            <span>Encrypted PDF Passwords (e-Aadhaar)</span>
          </a>
          <a href="#section-8" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§8.</span>
            <span>Disclaimer of Warranties</span>
          </a>
          <a href="#section-9" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§9.</span>
            <span>Limitation of Legal Liability</span>
          </a>
          <a href="#section-10" className="terms-toc-link">
            <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>§10.</span>
            <span>Information Technology Act 2000</span>
          </a>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: ACCEPTANCE OF TERMS                            */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-1">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 1</span>
          <h3 className="terms-article-title">1. Acceptance of Terms & Public Utility Scope</h3>
        </div>
        <div className="terms-article-body">
          <p>
            SignValid is provided as an open, accessible, public-interest cryptographic utility intended to assist Indian citizens, employers, universities, banks, and verifying authorities in verifying digital signatures affixed to official government electronic documents.
          </p>
          <p>
            By using SignValid, you agree to comply with and be legally bound by these Terms and Conditions. If you do not agree to these terms in their entirety, you must not upload documents or use this service.
          </p>
          <p>
            If you are accessing or using this service on behalf of an institution, commercial enterprise, or governmental agency, you warrant and represent that you have the requisite authority to bind that entity to these Terms.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: NON-AFFILIATION WITH GOVERNMENT                */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-2">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 2</span>
          <h3 className="terms-article-title">2. Independent Status & Non-Government Affiliation</h3>
        </div>
        <div className="terms-article-body">
          <div className="terms-highlight-callout">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 4 }}>
              <ShieldCheck size={18} />
              <span>Mandatory Legal Transparency Notice:</span>
            </div>
            SignValid is an independent cryptographic verification utility. It is NOT affiliated with, authorized by, sponsored by, or operated by the Government of India or any state government portal.
          </div>
          <p>
            Specifically, SignValid has no formal or legal affiliation with:
          </p>
          <ul>
            <li>The <strong>Unique Identification Authority of India (UIDAI)</strong> (issuers of Aadhaar and e-Aadhaar cards).</li>
            <li>The <strong>Ministry of Electronics and Information Technology (MeitY)</strong>.</li>
            <li>The <strong>Controller of Certifying Authorities (CCA)</strong>, Ministry of Communications and IT.</li>
            <li>State e-District and citizen delivery portals, including <em>Seva Sindhu</em> (Karnataka), <em>e-Sevai</em> (Tamil Nadu), <em>e-District</em> (UP, Kerala, Delhi, Manipur), or <em>Aaple Sarkar</em> (Maharashtra).</li>
            <li>The <strong>Income Tax Department / Central Board of Direct Taxes (CBDT)</strong>, Protean (NSDL), or UTIITSL.</li>
            <li>The <strong>National e-Governance Division (NeGD)</strong> or the DigiLocker platform.</li>
          </ul>
          <p>
            SignValid does not generate, re-issue, modify the legal ownership of, or alter official citizen credentials. It performs purely mathematical integrity and X.509 certificate chain validation using public root keys published under Section 18 of the IT Act, 2000.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: EPHEMERAL CLIENT-SIDE RAM ARCHITECTURE         */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-3">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 3</span>
          <h3 className="terms-article-title">3. Ephemeral Client-Side Processing (Zero Data Retention)</h3>
        </div>
        <div className="terms-article-body">
          <p>
            SignValid is engineered with uncompromising privacy-by-design. By submitting files to the application, you acknowledge and agree that:
          </p>
          <ul>
            <li>
              <strong>Volatile RAM Execution:</strong> All parsing, PKCS#7 signature extraction, SHA-256 cryptographic hashing, and certificate chain verification execute strictly within ephemeral, volatile browser memory (RAM buffers) on your device.
            </li>
            <li>
              <strong>Zero Server Storage:</strong> Your documents, photographs, Aadhaar numbers, PAN numbers, marks, addresses, or personal particulars are NEVER stored on any server disk, saved in any database, or sent to cloud storage buckets.
            </li>
            <li>
              <strong>Immediate Purge:</strong> When your verification completes, when you click "Reset", or when you close/reload your browser window, all memory buffers containing document data are permanently wiped.
            </li>
            <li>
              <strong>No Telemetry Harvesting:</strong> SignValid does not profile citizens, track individuals across documents, or sell behavioral information to third parties.
            </li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: UNIVERSAL DISPLAY COPIES                       */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-4">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 4</span>
          <h3 className="terms-article-title">4. Universal Display Copies & Vector Flattening</h3>
        </div>
        <div className="terms-article-body">
          <p>
            SignValid provides a specialized feature allowing users to export a display copy with an authentic permanent green checkmark (✓). You agree and understand that:
          </p>
          <ul>
            <li>
              <strong>Root Cause Resolution:</strong> Standard Adobe Acrobat Reader displays a yellow question mark ("? Validity Unknown") simply because Adobe's pre-packaged software does not include the official Controller of Certifying Authorities (CCA) India root certificate. The yellow mark does not mean the document is invalid; it merely reflects Adobe's unconfigured state.
            </li>
            <li>
              <strong>Display Copy Purpose:</strong> The exported document (ending in <em>_verified.pdf</em>) is an informational display copy designed to maintain visual clarity on mobile devices, web browsers, and paper printouts where third-party recipients cannot click Adobe signature properties.
            </li>
            <li>
              <strong>Visual Layer Flattening:</strong> In accordance with ISO 32000-1 specifications, modifying any byte in a signed PDF invalidates its original digital envelope. To prevent PDF readers from triggering false-red tampering alarms, SignValid flattens the verified status into the document visual layer and removes the signature field from the AcroForm dictionary, while preserving 100% of all page content, texts, and stamps.
            </li>
            <li>
              <strong>Independent Verification:</strong> Every display copy retains the original document SHA-256 fingerprint, signing timestamp, and certifying authority name, allowing any verifying officer to cross-check authenticity.
            </li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: PERMITTED USES & RESPONSIBILITIES              */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-5">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 5</span>
          <h3 className="terms-article-title">5. Permitted Uses & User Responsibilities</h3>
        </div>
        <div className="terms-article-body">
          <p>You agree to use SignValid solely for legitimate and lawful purposes, including:</p>
          <ul>
            <li>Verifying the digital authenticity and integrity of your own government-issued electronic documents.</li>
            <li>Verifying applicant certificates submitted for employment, college admissions, banking KYC, or administrative procedures.</li>
            <li>Generating clean, print-ready display copies of valid documents for physical submission.</li>
          </ul>
          <p>
            You represent and warrant that you have lawful possession and rights to hold and verify any file you submit to SignValid.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: PROHIBITED ACTIVITIES                          */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-6">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 6</span>
          <h3 className="terms-article-title">6. Prohibited Activities & Misuse</h3>
        </div>
        <div className="terms-article-body">
          <div className="terms-warning-callout">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 4 }}>
              <AlertCircle size={18} />
              <span>Strict Prohibition:</span>
            </div>
            Misrepresenting altered, tampered, or forged documents is a punishable offense under Indian law.
          </div>
          <p>You agree NOT to:</p>
          <ul>
            <li>Upload forged, fraudulent, or counterfeit documents with the intention of deceiving third-party verifiers.</li>
            <li>Manipulate the underlying text, serial numbers, names, or values of a document before submitting it for verification.</li>
            <li>Attempt to bypass document security or passwords without authorization from the legitimate document owner.</li>
            <li>Upload files containing malicious code, Trojan horses, or corrupted PDF structures designed to exploit parser vulnerabilities.</li>
            <li>Misrepresent SignValid as an official government agency or claim that SignValid provides official governmental issuance.</li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: ENCRYPTED PDF PASSWORDS                        */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-7">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 7</span>
          <h3 className="terms-article-title">7. Encrypted PDF Passwords (e.g. e-Aadhaar)</h3>
        </div>
        <div className="terms-article-body">
          <p>
            Certain Indian government documents (such as e-Aadhaar identity files) are encrypted with user passwords mandated by UIDAI. If you enter a document password on SignValid:
          </p>
          <ul>
            <li>The password is used purely in local device RAM to unlock the PDF stream for signature inspection and display stamping.</li>
            <li>Passwords are never transmitted to any external server, stored in cookies, or written to persistent memory.</li>
            <li>You remain solely responsible for the confidentiality of your passwords.</li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: DISCLAIMER OF WARRANTIES                       */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-8">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 8</span>
          <h3 className="terms-article-title">8. Disclaimer of Warranties & Third-Party Acceptance</h3>
        </div>
        <div className="terms-article-body">
          <p>
            SignValid is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express, statutory, or implied.
          </p>
          <p>
            While our cryptographic engine strictly follows ISO 32000-1, RFC 5652, and official CCA India root trust stores, <strong>SignValid does not guarantee that every third party (such as a foreign consulate, bank officer, or government clerk) will accept the flattened display copy</strong>. Acceptance of submitted documentation remains entirely within the administrative discretion of the recipient authority.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 9: LIMITATION OF LIABILITY                        */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-9">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 9</span>
          <h3 className="terms-article-title">9. Limitation of Legal Liability</h3>
        </div>
        <div className="terms-article-body">
          <p>
            To the maximum extent permitted under applicable law, SignValid, its developers, contributors, and hosting providers shall not be held liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to:
          </p>
          <ul>
            <li>Rejection of documents by employers, visa authorities, colleges, or banks.</li>
            <li>Delays in government application filings or missed submission deadlines.</li>
            <li>Corrupted files resulting from client hardware, browser, or network interruptions.</li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 10: GOVERNING LAW & JURISDICTION                  */}
      {/* ========================================================= */}
      <section className="terms-article-card" id="section-10">
        <div className="terms-article-header">
          <span className="terms-section-num">Section 10</span>
          <h3 className="terms-article-title">10. Information Technology Act 2000 & Legal Jurisdiction</h3>
        </div>
        <div className="terms-article-body">
          <p>
            These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of India, specifically:
          </p>
          <ul>
            <li>
              <strong>Information Technology Act, 2000:</strong> Sections 3, 4, 5, 43A, and 72A regarding electronic records, digital signatures, and data privacy.
            </li>
            <li>
              <strong>Information Technology (Certifying Authorities) Rules, 2000:</strong> Technical standards governing root public keys.
            </li>
          </ul>
          <p>
            Any dispute, claim, or controversy arising under or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts of India.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BOTTOM ACTION CTA BANNER                                  */}
      {/* ========================================================= */}
      {onNavigateToValidate && (
        <div className="guide-cta-banner" style={{ marginTop: 32 }}>
          <div>
            <h3>Have a Document to Validate?</h3>
            <p>Experience real, client-side cryptographic verification with zero data retention.</p>
          </div>
          <button
            type="button"
            className="download-cta-btn"
            onClick={onNavigateToValidate}
          >
            <span>Start Validation Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TermAndCond;
