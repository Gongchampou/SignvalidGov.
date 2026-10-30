import React from 'react';
import {
  Check,
  ArrowRight
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { VerificationProgress } from './VerificationProgress';
import { ResultsCard } from './ResultsCard';
import type { ValidatedFile } from '../types';

interface HeroProps {
  onFilesSelected: (files: File[]) => void;
  onErrorToast: (msg: string) => void;
  validatedFiles: ValidatedFile[];
  activeFileIndex: number;
  onSelectFileIndex: (idx: number) => void;
  onOpenReportModal: (file: ValidatedFile) => void;
  onReset: () => void;
  onRemoveFile?: (idx: number) => void;
  isProcessing: boolean;
  processingProgress: number;
  processingStep: string;
  processingFileName: string;
  onOpenStats: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFilesSelected,
  onErrorToast,
  validatedFiles,
  activeFileIndex,
  onSelectFileIndex,
  onOpenReportModal,
  onReset,
  onRemoveFile,
  isProcessing,
  processingProgress,
  processingStep,
  processingFileName,
  onOpenStats
}) => {
  const isPreviewMode = validatedFiles.length > 0;

  return (
    <section className={`hero-section ${isPreviewMode ? 'hero-preview-mode' : ''}`}>
      <div className={`container ${isPreviewMode ? 'preview-container' : ''}`}>
        {isPreviewMode ? (
          <ResultsCard
            files={validatedFiles}
            activeFileIndex={activeFileIndex}
            onSelectFileIndex={onSelectFileIndex}
            onOpenReportModal={onOpenReportModal}
            onReset={onReset}
            onRemoveFile={onRemoveFile}
          />
        ) : (
          <div className="hero-grid">
            {/* Left Column (Desktop) / Bottom Column (Mobile): Copy & Value Propositions */}
            <div className="hero-copy-col">
              {/*<div className="hero-pill-badge">
                <Sparkles size={14} />
                <span>Validate Indian government PDF signatures — and fix the yellow question mark for good.</span>
              </div>*/}

              <h1 className="hero-title">
                Validate Indian Digital Signatures
              </h1>

              <p className="hero-desc">
                Validate e-Aadhaar, state e-District certificates, DigiLocker files, and PAN e-cards against India's official Controller of Certifying Authorities (CCA) root trust store, producing a universal display copy with a permanent green checkmark.
              </p>

              {/* 4 Value propositions with green tick icons */}
              <div className="hero-value-props">
                <div className="value-prop-item">
                  <div className="tick-circle">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Free · no signup</span>
                </div>

                <div className="value-prop-item">
                  <div className="tick-circle">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Files are processed in memory and never stored</span>
                </div>

                <div className="value-prop-item">
                  <div className="tick-circle">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Works in any viewer and on printouts</span>
                </div>

                <div className="value-prop-item">
                  <div className="tick-circle">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Validate many PDFs at once</span>
                </div>
              </div>

              {/* Visual Before-and-After Graphic */}
              <div className="before-after-card">
                <div className="state-pill unknown">
                  <span>? Validity Unknown</span>
                </div>

                <div className="state-arrow-divider">
                  <ArrowRight size={20} strokeWidth={2.5} />
                </div>

                <div className="state-pill valid">
                  <span>✓ Signature Valid</span>
                </div>
              </div>

              {/* Dynamic Social Proof Counter */}
              <div className="social-proof-banner">
                <span className="live-dot" />
                <span>
                  <strong>49,550+</strong> documents validated so far
                </span>
                <span>·</span>
                <button
                  type="button"
                  className="social-proof-link"
                  onClick={onOpenStats}
                >
                  <span>See the numbers</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column (Desktop) / Top Column (Mobile): Interactive Drag-and-Drop Area / Verification States */}
            <div className="hero-input-col">
              {isProcessing ? (
                <VerificationProgress
                  fileName={processingFileName}
                  stepMessage={processingStep}
                  progressPercent={processingProgress}
                />
              ) : (
                <Dropzone
                  onFilesSelected={onFilesSelected}
                  onErrorToast={onErrorToast}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
