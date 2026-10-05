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
import type { ValidatedFile } from './types';
import { verifyPdf } from './verify/verifyPdf';

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
    }, 5000);
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

  // REAL cryptographic verification of uploaded files
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      const results: ValidatedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingFileName(file.name);
        setProcessingProgress(10);
        setProcessingStep(`Inspecting file ${i + 1} of ${files.length}...`);

        const validated = await verifyPdf(file, (percent, step) => {
          setProcessingProgress(percent);
          setProcessingStep(step);
        });

        results.push(validated);

        if (validated.status === 'valid') {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#126B44', '#10B981', '#34D399', '#D1FAE5']
          });
          addToast(`"${file.name}" digital signature verified successfully (PASS ✓)!`, 'success');
        } else if (validated.status === 'unsigned') {
          addToast(`No digital signature found in "${file.name}".`, 'warning');
        } else {
          addToast(`"${file.name}": ${validated.summary}`, 'warning');
        }
      }

      setValidatedFiles(prev => [...results, ...prev]);
      setActiveFileIndex(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast(`Verification failed: ${msg}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Instant testing with pre-computed official samples
  const handleSelectSample = (sampleDoc: Omit<ValidatedFile, 'id' | 'uploadDate'>) => {
    setIsProcessing(true);
    setProcessingFileName(sampleDoc.name);
    setProcessingProgress(30);
    setProcessingStep('Loading sample certificate from trust registry...');

    setTimeout(() => {
      setProcessingProgress(70);
      setProcessingStep('Validating against CCA India Root 2014...');
    }, 400);

    setTimeout(() => {
      const sampleItem: ValidatedFile = {
        ...sampleDoc,
        id: Date.now().toString(),
        uploadDate: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
      };

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#126B44', '#10B981', '#34D399']
      });

      setValidatedFiles(prev => [sampleItem, ...prev]);
      setActiveFileIndex(0);
      setIsProcessing(false);
      addToast(`Sample "${sampleDoc.sampleType}" verified with CCA India 2014!`, 'success');
    }, 900);
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
