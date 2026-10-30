import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FolderUp } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  onErrorToast: (msg: string) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  onErrorToast
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard Paste Support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const pdfFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
              pdfFiles.push(file);
            }
          }
        }
      }

      if (pdfFiles.length > 0) {
        processFiles(pdfFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFiles = (files: File[]) => {
    const validPdfs: File[] = [];
    const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

    for (const file of files) {
      if (file.size === 0) {
        onErrorToast(`"${file.name}" is an empty file (0 bytes) and cannot be verified.`);
        continue;
      }
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        onErrorToast(`"${file.name}" is not a PDF file. Please upload Indian government PDF documents.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        onErrorToast(`"${file.name}" exceeds the 25 MB safe file size limit.`);
        continue;
      }
      validPdfs.push(file);
    }

    if (validPdfs.length > 6) {
      onErrorToast('Security Rate Limit: Up to 6 certificates can be submitted per batch (limit: 6 certs/min).');
      validPdfs.length = 6;
    }

    if (validPdfs.length > 0) {
      onFilesSelected(validPdfs);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      processFiles(selected);
      // Reset input value to allow re-upload of same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`dropzone-container ${isDragOver ? 'is-dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      id="validate"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,application/pdf"
        multiple
        style={{ display: 'none' }}
      />

      <div className="upload-icon-tray">
        <FolderUp size={32} />
      </div>

      <h3 className="dropzone-title">Drop your PDFs here</h3>
      <p className="dropzone-subtext">or</p>

      <button
        type="button"
        className="choose-files-btn"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud size={18} />
        <span>Choose files</span>
      </button>

      <p className="dropzone-hint">
        e-Aadhaar, birth / income / community certificate, DigiLocker PDF, PAN e-card...
      </p>

      <p className="dropzone-limits">
        Up to 25 MB and 50 pages each. Files are processed in memory and never stored.
      </p>

      <div className="dropzone-paste-tip">
        <span>Tip: you can also paste copied files here with</span>
        <kbd className="kbd-badge">Ctrl + V</kbd>
      </div>
    </div>
  );
};
