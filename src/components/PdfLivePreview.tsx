import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { ValidatedFile } from '../types';
import { createGreenTickCopy } from '../verify/stampPdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfLivePreviewProps {
  file: ValidatedFile;
  password?: string;
  onDownloadStamped?: () => void;
}

export const PdfLivePreview: React.FC<PdfLivePreviewProps> = ({
  file,
  password,
  onDownloadStamped
}) => {
  const [viewMode, setViewMode] = useState<'stamped' | 'original'>('stamped');
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stampedBytes, setStampedBytes] = useState<Uint8Array | null>(null);
  const [isStamping, setIsStamping] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  // Stamping preparation
  useEffect(() => {
    let isCancelled = false;

    const prepareStampedBytes = async () => {
      // 1. If file is already verified, it already has the permanent green tick!
      if (file.status === 'already_verified') {
        setStampedBytes(file.bytes);
        setViewMode('stamped');
        return;
      }

      // 2. Only skip if file is completely unsigned or has an error (prevent double up/fake stamps)
      if (file.status === 'unsigned' || file.status === 'error' || file.signatures.length === 0) {
        setStampedBytes(null);
        setViewMode('original');
        return;
      }

      try {
        setIsStamping(true);
        const bytes = await createGreenTickCopy(file, password);
        if (!isCancelled) {
          setStampedBytes(bytes);
          setViewMode('stamped');
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('Could not pre-stamp live preview:', err);
          setStampedBytes(null);
          setViewMode('original');
        }
      } finally {
        if (!isCancelled) {
          setIsStamping(false);
        }
      }
    };

    prepareStampedBytes();

    return () => {
      isCancelled = true;
    };
  }, [file, password]);

  // Load PDF Document when file, mode, or stampedBytes change
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setErrorMsg(null);

    const loadPdfDoc = async () => {
      try {
        const rawBytes = (viewMode === 'stamped' && stampedBytes) ? stampedBytes : file.bytes;
        if (!rawBytes || rawBytes.length === 0) {
          throw new Error('No PDF bytes available for preview.');
        }

        // Must slice so worker doesn't detach buffer if transferred
        const loadingTask = pdfjsLib.getDocument({
          data: rawBytes.slice(),
          password: password || undefined,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@' + pdfjsLib.version + '/cmaps/',
          cMapPacked: true
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        // If it's a multi-page document and likely has signature on last page, keep page or 1
        setPageNum(p => Math.min(p, doc.numPages));
        setLoading(false);
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMsg('Unable to render PDF live preview: ' + msg);
        setLoading(false);
      }
    };

    loadPdfDoc();

    return () => {
      isCancelled = true;
    };
  }, [file, viewMode, stampedBytes, password]);

  // Render Page to Canvas with container-aware auto-fit
  const renderCurrentPage = useCallback(async () => {
    const doc = pdfDocRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!doc || !canvas) return;

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await doc.getPage(pageNum);
      
      // Calculate responsive fit scale based on current container width
      const containerWidth = container ? container.clientWidth : 720;
      const padding = window.innerWidth <= 640 ? 20 : 48;
      const availableWidth = Math.max(280, containerWidth - padding);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      
      // Smart base scale: fits neatly on mobile & tablet, expands generously on bigger monitors
      const autoFitScale = Math.min(2.2, Math.max(0.5, availableWidth / unscaledViewport.width));
      const effectiveScale = autoFitScale * zoom;
      const viewport = page.getViewport({ scale: effectiveScale });

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderContext: any = {
        canvasContext: ctx,
        viewport,
        canvas
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.warn('PDF page rendering error:', err);
      }
    }
  }, [pageNum, zoom]);

  useEffect(() => {
    if (!loading && pdfDocRef.current) {
      renderCurrentPage();
    }
  }, [loading, pageNum, zoom, renderCurrentPage]);

  // Handle window and container resize for dynamic responsive refit
  useEffect(() => {
    let timeoutId: any;
    const triggerRerender = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!loading && pdfDocRef.current) {
          renderCurrentPage();
        }
      }, 100);
    };

    window.addEventListener('resize', triggerRerender);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(triggerRerender);
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', triggerRerender);
      if (observer) observer.disconnect();
    };
  }, [loading, renderCurrentPage]);

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum(p => p - 1);
  };

  const handleNextPage = () => {
    if (pageNum < numPages) setPageNum(p => p + 1);
  };

  const handleZoomIn = () => {
    setZoom(z => Math.min(2.5, z + 0.2));
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(0.6, z - 0.2));
  };

  const handleZoomReset = () => {
    setZoom(1.0);
  };

  const handleOpenInNewTab = () => {
    const bytesToOpen = (viewMode === 'stamped' && stampedBytes) ? stampedBytes : file.bytes;
    const blob = new Blob([bytesToOpen as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div
      ref={containerRef}
      className="pdf-live-preview-box"
    >
      {/* Top Header Controls Bar */}
      <div className="pdf-preview-toolbar">
        {/* Toggle Mode: Stamped Green Tick vs Original */}
        <div className="pdf-preview-mode-toggle">
          {file.status === 'already_verified' ? (
            <div className="pdf-mode-btn active" style={{ cursor: 'default' }}>
              <CheckCircle2 size={14} color="#FFFFFF" />
              <span>Already Verified (✓)</span>
            </div>
          ) : file.status === 'unsigned' ? (
            <div className="pdf-mode-btn" style={{ borderColor: '#FECACA', color: '#B91C1C', cursor: 'default', backgroundColor: '#FEF2F2' }}>
              <AlertCircle size={14} color="#DC2626" />
              <span>Missing Signature</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                className={`pdf-mode-btn ${viewMode === 'stamped' ? 'active' : ''}`}
                onClick={() => setViewMode('stamped')}
                disabled={isStamping}
              >
                <CheckCircle2 size={14} color={viewMode === 'stamped' ? '#FFFFFF' : '#16A34A'} />
                <span>Verified Copy (✓)</span>
              </button>

              <button
                type="button"
                className={`pdf-mode-btn ${viewMode === 'original' ? 'active' : ''}`}
                onClick={() => setViewMode('original')}
              >
                <AlertCircle size={14} color={viewMode === 'original' ? '#FFFFFF' : '#D97706'} />
                <span>Original (?)</span>
              </button>
            </>
          )}
        </div>

        {/* Page Navigation & Zoom Tools */}
        <div className="pdf-preview-page-tools">
          <div className="pdf-page-controls">
            <button
              type="button"
              className="pdf-tool-btn"
              onClick={handlePrevPage}
              disabled={pageNum <= 1 || loading}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pdf-page-indicator">
              Page {pageNum} of {numPages}
            </span>
            <button
              type="button"
              className="pdf-tool-btn"
              onClick={handleNextPage}
              disabled={pageNum >= numPages || loading}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="pdf-zoom-controls">
            <button
              type="button"
              className="pdf-tool-btn"
              onClick={handleZoomOut}
              disabled={zoom <= 0.6 || loading}
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              className="pdf-zoom-val-btn"
              onClick={handleZoomReset}
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="pdf-tool-btn"
              onClick={handleZoomIn}
              disabled={zoom >= 2.5 || loading}
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Open full PDF in new tab */}
          <div className="pdf-view-actions">
            <button
              type="button"
              className="pdf-tool-btn"
              onClick={handleOpenInNewTab}
              title="Open full PDF in new browser tab"
            >
              <ExternalLink size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="pdf-preview-stage">
        {loading || isStamping ? (
          <div className="pdf-preview-loading" style={{ margin: 'auto', textAlign: 'center', width: '100%' }}>
            <div className="spinner-ring" style={{ width: 42, height: 42, borderWidth: 3, margin: '0 auto 12px' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-heading)', textAlign: 'center', display: 'block' }}>
              {isStamping ? 'Stamping green tick onto original document...' : 'Rendering live PDF preview...'}
            </span>
          </div>
        ) : errorMsg ? (
          <div className="pdf-preview-error" style={{ margin: 'auto', textAlign: 'center', width: '100%' }}>
            <AlertCircle size={24} color="#EF4444" style={{ margin: '0 auto 8px' }} />
            <span style={{ textAlign: 'center', display: 'block' }}>{errorMsg}</span>
          </div>
        ) : (
          <div className="pdf-canvas-wrapper">
            <canvas ref={canvasRef} className="pdf-page-canvas" />

            {/* Live Indicator Watermark Pill */}
            <div className="pdf-live-badge">
              {file.status === 'already_verified' ? (
                <>
                  <CheckCircle2 size={13} color="#16A34A" />
                  <span>Already Verified Document · Green Tick Embedded ✓</span>
                </>
              ) : file.status === 'unsigned' ? (
                <>
                  <AlertCircle size={13} color="#DC2626" />
                  <span>Unsigned Document · Missing Signature</span>
                </>
              ) : viewMode === 'stamped' ? (
                <>
                  <Sparkles size={13} color="#16A34A" />
                  <span>Verified Live Copy · CCA Trusted</span>
                </>
              ) : (
                <>
                  <AlertCircle size={13} color="#D97706" />
                  <span>Original Document Copy (?)</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint Bar */}
      <div className="pdf-preview-bottom-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
          {file.status === 'unsigned' ? (
            <AlertCircle size={14} color="#DC2626" style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={14} color="var(--primary-green)" style={{ flexShrink: 0 }} />
          )}
          <span>
            {file.status === 'already_verified'
              ? 'This document was already verified by SignValid. The authentic green tick is permanently embedded and universally valid.'
              : file.status === 'unsigned'
              ? 'Error: Missing digital signature. This document cannot be stamped because no digital certificate was detected.'
              : viewMode === 'stamped'
              ? 'Displaying your actual document with the authentic green checkmark ✓ stamped directly on the signature area.'
              : 'Displaying original PDF with unverified question mark (?). Toggle above to see verified tick.'}
          </span>
        </div>

        {onDownloadStamped && file.status !== 'unsigned' && (
          <button
            type="button"
            className="download-cta-btn"
            onClick={onDownloadStamped}
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Download size={15} />
            <span>{file.status === 'already_verified' ? 'Save Verified PDF' : 'Download Verified PDF'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
