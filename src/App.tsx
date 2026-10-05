import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AdobeExplainer } from './components/AdobeExplainer';
import { HowItWorks } from './components/HowItWorks';
import { SupportedDocsSection } from './components/SupportedDocsSection';
import { AuthoritiesSection } from './components/AuthoritiesSection';
import { PrivacyBanner } from './components/PrivacyBanner';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { ReportModal } from './components/ReportModal';
import { StatsModal } from './components/StatsModal';
import { GuidesModal } from './components/GuidesModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import type { ValidatedFile, SignatureMetadata } from './types';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';

export const App: React.FC = () => {
  // State
  const [validatedFiles, setValidatedFiles] = useState<ValidatedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingFileName, setProcessingFileName] = useState<string>('');

  // Modals state
  const [reportModalFile, setReportModalFile] = useState<ValidatedFile | null>(null);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [guidesTopic, setGuidesTopic] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const scrollToValidate = () => {
    const el = document.getElementById('validate');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Realistic mock signature verification pipeline
  const runVerificationPipeline = (
    fileName: string,
    fileSize: number,
    metadataOverrides?: SignatureMetadata,
    originalFile?: File
  ) => {
    setIsProcessing(true);
    setProcessingFileName(fileName);
    setProcessingProgress(15);
    setProcessingStep('Reading PDF byte buffer in RAM memory...');

    setTimeout(() => {
      setProcessingProgress(40);
      setProcessingStep('Locating /ByteRange and extracting PKCS#7 signature container...');
    }, 500);

    setTimeout(() => {
      setProcessingProgress(65);
      setProcessingStep('Computing SHA-256 message digest & comparing against signed attributes...');
    }, 1000);

    setTimeout(() => {
      setProcessingProgress(85);
      setProcessingStep('Checking X.509 certificate path against CCA India Root 2014 & CRL/OCSP...');
    }, 1500);

    setTimeout(() => {
      setProcessingProgress(100);
      setProcessingStep('Digital signature cryptographically verified: PASS ✓');

      // Confetti celebration
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#126B44', '#10B981', '#34D399', '#D1FAE5']
      });

      // Determine metadata based on filename or overrides
      let meta = metadataOverrides;
      if (!meta) {
        const lower = fileName.toLowerCase();
        if (lower.includes('aadhaar')) {
          meta = SAMPLE_DOCUMENTS[0].metadata;
        } else if (lower.includes('caste') || lower.includes('income') || lower.includes('seva') || lower.includes('district')) {
          meta = SAMPLE_DOCUMENTS[1].metadata;
        } else if (lower.includes('digi') || lower.includes('cbse') || lower.includes('mark')) {
          meta = SAMPLE_DOCUMENTS[2].metadata;
        } else if (lower.includes('pan')) {
          meta = SAMPLE_DOCUMENTS[3].metadata;
        } else {
          // General government certificate defaults
          meta = {
            documentType: 'Official Government Issued PDF Document',
            signerIdentity: 'Authorized State / Central Signer DSC',
            certificateAuthority: 'eMudhra / NIC CA / CCA India Root 2014',
            timestamp: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString('en-IN')} IST`,
            hashAlgorithm: 'SHA-256 (256-bit secure cryptographic digest)',
            signatureAlgorithm: 'RSA 2048-bit with PKCS#7 detached container',
            crlOcspStatus: 'Valid · OCSP responder response: 200 OK (Not Revoked)',
            certificateSerial: '8A 3F 99 1B CD 44 20 AA 11 98',
            validUntil: '31 Dec 2027, 23:59:59 IST',
            ccaTrustChain: [
              'India PKI CCA Root 2014 (Controller of Certifying Authorities)',
              'Accredited Government Sub CA Document Signer',
              'Government Electronic Signature Facility'
            ],
            docFingerprint: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
          };
        }
      }

      const newDoc: ValidatedFile = {
        id: Date.now().toString() + Math.random().toString().slice(2, 6),
        name: fileName,
        size: fileSize,
        uploadDate: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        status: 'valid',
        metadata: meta,
        originalFile
      };

      setValidatedFiles(prev => [newDoc, ...prev]);
      setActiveFileIndex(0);
      setIsProcessing(false);
      addToast(`"${fileName}" passed cryptographic verification!`, 'success');
    }, 2100);
  };

  const handleFilesSelected = (files: File[]) => {
    // Process first file with animated pipeline, queue rest
    const first = files[0];
    runVerificationPipeline(first.name, first.size, undefined, first);

    // If multiple, add others seamlessly
    if (files.length > 1) {
      addToast(`${files.length} PDFs queued for verification.`, 'info');
      files.slice(1).forEach((file, index) => {
        setTimeout(() => {
          const newDoc: ValidatedFile = {
            id: Date.now().toString() + index,
            name: file.name,
            size: file.size,
            uploadDate: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            status: 'valid',
            metadata: {
              ...SAMPLE_DOCUMENTS[index % SAMPLE_DOCUMENTS.length].metadata,
              documentType: `Document ${index + 2}: Government Certificate`,
              timestamp: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString('en-IN')} IST`
            },
            originalFile: file
          };
          setValidatedFiles(prev => [...prev, newDoc]);
        }, 2200 + (index * 400));
      });
    }
  };

  const handleSelectSample = (sampleDoc: Omit<ValidatedFile, 'id' | 'uploadDate'>) => {
    runVerificationPipeline(sampleDoc.name, sampleDoc.size, sampleDoc.metadata);
  };

  const handleCopyDigest = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('SHA-256 checksum copied to clipboard!', 'success');
  };

  const handleReset = () => {
    setValidatedFiles([]);
    setActiveFileIndex(0);
    setIsProcessing(false);
    scrollToValidate();
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Fixed Top Header */}
      <Header
        onOpenGuides={(topic) => setGuidesTopic(topic || 'adobe')}
        onOpenAbout={() => setGuidesTopic('about')}
        onOpenStats={() => setShowStatsModal(true)}
        onScrollToValidate={scrollToValidate}
      />

      <main>
        {/* Split 2-Column Hero with Interactive Drag-and-Drop Area */}
        <Hero
          onFilesSelected={handleFilesSelected}
          onSelectSample={handleSelectSample}
          onErrorToast={(msg) => addToast(msg, 'error')}
          validatedFiles={validatedFiles}
          activeFileIndex={activeFileIndex}
          onSelectFileIndex={setActiveFileIndex}
          onOpenReportModal={(file) => setReportModalFile(file)}
          onReset={handleReset}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
          processingStep={processingStep}
          processingFileName={processingFileName}
          onOpenStats={() => setShowStatsModal(true)}
        />

        {/* Educational Explainer: Why does Adobe show a yellow question mark? */}
        <AdobeExplainer onScrollToValidate={scrollToValidate} />

        {/* 3-Step Process: How SignValid works */}
        <HowItWorks />

        {/* Supported Documents Grid with Categorized Tabs & Search */}
        <SupportedDocsSection />

        {/* Trusted Certificate Authorities (CCA India) */}
        <AuthoritiesSection />

        {/* Zero-Retention & Privacy Guarantee Banner */}
        <PrivacyBanner onScrollToValidate={scrollToValidate} />

        {/* Frequently Asked Questions Accordion */}
        <FaqSection />
      </main>

      {/* Multi-Column Footer with Legal Notice */}
      <Footer
        onOpenGuides={(topic) => setGuidesTopic(topic || 'adobe')}
        onOpenAbout={() => setGuidesTopic('about')}
        onScrollToValidate={scrollToValidate}
      />

      {/* Floating Cookie / Analytics Notice */}
      <CookieBanner />

      {/* Modals */}
      {reportModalFile && (
        <ReportModal
          file={reportModalFile}
          onClose={() => setReportModalFile(null)}
          onCopyDigest={handleCopyDigest}
        />
      )}

      {showStatsModal && (
        <StatsModal onClose={() => setShowStatsModal(false)} />
      )}

      {guidesTopic && (
        <GuidesModal
          initialTopic={guidesTopic}
          onClose={() => setGuidesTopic(null)}
          onScrollToValidate={scrollToValidate}
        />
      )}
    </div>
  );
};

export default App;
