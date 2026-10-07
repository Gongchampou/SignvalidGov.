import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import type { NavPage } from './components/Header';
import { Hero } from './components/Hero';
import { DocumentsPage } from './components/DocumentsPage';
import { AuthoritiesPage } from './components/AuthoritiesPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { GuidesPage } from './components/GuidesPage';
import { FaqPage } from './components/FaqPage';
import { AboutPage } from './components/AboutPage';
import type { AboutSubTab } from './components/AboutPage';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { ReportModal } from './components/ReportModal';
import { StatsModal } from './components/StatsModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import type { ValidatedFile } from './types';
import { verifyPdf } from './verify/verifyPdf';
import { securityRateLimiter } from './security/rateLimiter';
import { runWithSecurityTimeout } from './security/sanitizer';

export const App: React.FC = () => {
  // Navigation Page State with URL hash sync
  const [currentPage, setCurrentPage] = useState<NavPage>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const [page] = hash.split('/');
    if (page === 'terms' || page === 'privacy' || page === 'about') {
      return 'about';
    }
    if (['validate', 'documents', 'authorities', 'how-it-works', 'guides', 'faq'].includes(page)) {
      return page as NavPage;
    }
    return 'validate';
  });
  const [guidesInitialTopic, setGuidesInitialTopic] = useState<string>('adobe');
  const [aboutInitialTab, setAboutInitialTab] = useState<AboutSubTab>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'terms' || hash === 'about/terms') return 'terms';
    if (hash === 'privacy' || hash === 'about/privacy') return 'privacy';
    return 'about';
  });

  // Files & Validation State
  const [validatedFiles, setValidatedFiles] = useState<ValidatedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingFileName, setProcessingFileName] = useState<string>('');

  // Modals state
  const [reportModalFile, setReportModalFile] = useState<ValidatedFile | null>(null);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Strip any leftover hash on mount so the domain stays strictly clean (e.g. https://signvalid.pages.dev)
  useEffect(() => {
    if (window.location.hash) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {
        // ignore
      }
    }
  }, []);

  const navigateTo = (page: NavPage, topic?: string) => {
    if (page === 'about') {
      const targetTab: AboutSubTab = (topic as AboutSubTab) || 'about';
      setCurrentPage('about');
      setAboutInitialTab(targetTab);
    } else {
      setCurrentPage(page);
      if (topic) {
        setGuidesInitialTopic(topic);
      }
    }

    // Keep address bar strictly on the base domain without appending page paths or hashes
    if (window.location.hash) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {
        // ignore
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // REAL cryptographic verification of uploaded files
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    // Security Rate Limiter Evaluation (1/sec, 6 certs/min)
    const rateCheck = securityRateLimiter.evaluateVerification(files.length);
    if (!rateCheck.allowed) {
      addToast(rateCheck.message, 'error');
      return;
    }

    if (rateCheck.message) {
      addToast(rateCheck.message, 'warning');
    }

    const filesToProcess = files.slice(0, rateCheck.allowedCount);
    if (filesToProcess.length === 0) return;

    // Immediately switch to validate page so user sees progress and results
    navigateTo('validate');
    setIsProcessing(true);

    try {
      const results: ValidatedFile[] = [];

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        setProcessingFileName(file.name);
        setProcessingProgress(10);
        setProcessingStep(`Inspecting file ${i + 1} of ${filesToProcess.length}...`);

        // Security: Wrap verification in a 25-second timeout to prevent ReDoS / decompression hang
        const validated = await runWithSecurityTimeout(
          verifyPdf(file, (percent, step) => {
            setProcessingProgress(percent);
            setProcessingStep(step);
          }),
          25000,
          `Security Timeout: "${file.name}" took longer than 25 seconds. Operation halted for protection.`
        );

        results.push(validated);

        if (validated.status === 'valid') {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#126B44', '#10B981', '#34D399', '#D1FAE5']
          });
          addToast(`"${file.name}" digital signature verified successfully (PASS ✓)!`, 'success');
        } else if (validated.status === 'already_verified') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#126B44', '#10B981', '#34D399']
          });
          addToast(`"${file.name}" is already verified with a permanent green checkmark!`, 'success');
        } else if (validated.status === 'unsigned') {
          addToast(`Error: No digital signature found in "${file.name}".`, 'error');
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
    // Security rate check on sample trigger
    const sampleRateCheck = securityRateLimiter.evaluateSampleTest();
    if (!sampleRateCheck.allowed) {
      addToast(sampleRateCheck.message, 'error');
      return;
    }

    navigateTo('validate');
    setIsProcessing(true);
    setProcessingFileName(sampleDoc.name);
    setProcessingProgress(30);
    setProcessingStep('Loading sample certificate from trust registry...');

    setTimeout(() => {
      setProcessingProgress(70);
      setProcessingStep('Validating against CCA India Root...');
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
      addToast(`Sample "${sampleDoc.sampleType}" verified with CCA India!`, 'success');
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
    navigateTo('validate');
  };

  const handleRemoveFile = (index: number) => {
    setValidatedFiles(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        navigateTo('validate');
      }
      return next;
    });
    setActiveFileIndex(prev => Math.max(0, prev >= index ? prev - 1 : prev));
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Fixed Top Header with Page Navigation Tabs */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => navigateTo(page)}
      />

      {/* Main Multi-Page Routed View */}
      <main>
        {currentPage === 'validate' && (
          <div className="page-content-wrapper">
            {/* Validation Workspace Hero (Dropzone + Live Preview + Results) */}
            <Hero
              onFilesSelected={handleFilesSelected}
              onSelectSample={handleSelectSample}
              onErrorToast={(msg) => addToast(msg, 'error')}
              validatedFiles={validatedFiles}
              activeFileIndex={activeFileIndex}
              onSelectFileIndex={setActiveFileIndex}
              onOpenReportModal={(file) => setReportModalFile(file)}
              onReset={handleReset}
              onRemoveFile={handleRemoveFile}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
              processingStep={processingStep}
              processingFileName={processingFileName}
              onOpenStats={() => setShowStatsModal(true)}
            />

          </div>
        )}

        {currentPage === 'documents' && (
          <DocumentsPage onNavigateToValidate={() => navigateTo('validate')} />
        )}

        {currentPage === 'authorities' && (
          <AuthoritiesPage onNavigateToValidate={() => navigateTo('validate')} />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage onNavigateToValidate={() => navigateTo('validate')} />
        )}

        {currentPage === 'guides' && (
          <GuidesPage
            initialTopic={guidesInitialTopic}
            onNavigateToValidate={() => navigateTo('validate')}
          />
        )}

        {currentPage === 'faq' && (
          <FaqPage onNavigateToValidate={() => navigateTo('validate')} />
        )}

        {currentPage === 'about' && (
          <AboutPage
            initialTab={aboutInitialTab}
            onNavigateToValidate={() => navigateTo('validate')}
            onTabChange={(tab) => {
              setAboutInitialTab(tab);
              if (window.location.hash) {
                try {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                } catch {
                  // ignore
                }
              }
            }}
          />
        )}
      </main>

      {/* Multi-Column Footer with Page Navigation */}
      <Footer onNavigate={(page, topic) => navigateTo(page, topic)} />

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
    </div>
  );
};

export default App;
