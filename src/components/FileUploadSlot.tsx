import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';
import type { UploadedDoc } from '../types';

interface FileUploadSlotProps {
  label: string;
  sublabel: string;
  accept?: string;
  doc: UploadedDoc | null;
  onFileSelect: (file: File | null) => void;
  accentColor?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'purple';
  iconType?: 'jd' | 'resume' | 'transcript';
}

export const FileUploadSlot: React.FC<FileUploadSlotProps> = ({
  label,
  sublabel,
  accept = '.pdf,application/pdf',
  doc,
  onFileSelect,
  accentColor = 'indigo',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const borderClasses = {
    indigo: 'hover:border-indigo-500/50 focus-within:border-indigo-500',
    cyan: 'hover:border-cyan-500/50 focus-within:border-cyan-500',
    emerald: 'hover:border-emerald-500/50 focus-within:border-emerald-500',
    amber: 'hover:border-amber-500/50 focus-within:border-amber-500',
    purple: 'hover:border-purple-500/50 focus-within:border-purple-500',
  }[accentColor];

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[240px]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          {label}
        </label>
        {doc && (
          <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Attached
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {!doc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`group relative flex flex-col items-center justify-center p-4 border border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-slate-900/50 hover:bg-slate-900/80 ${
            isDragOver ? 'border-indigo-500 bg-indigo-500/5 scale-[0.99]' : 'border-slate-800'
          } ${borderClasses}`}
        >
          <div className="p-2.5 rounded-lg bg-slate-800/80 group-hover:bg-slate-800 text-slate-400 group-hover:text-slate-200 transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-300 text-center">
            Click to upload or drag & drop
          </p>
          <p className="text-[11px] text-slate-500 text-center mt-0.5">
            {sublabel} (PDF)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate" title={doc.name}>
                {doc.name}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {formatFileSize(doc.size)} • PDF
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-2 flex-shrink-0"
            title="Remove document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};
