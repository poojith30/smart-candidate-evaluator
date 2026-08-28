import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, FileText, Mic, Sparkles } from 'lucide-react';
import type { EvidenceType, EvidenceSource } from '../../types';

interface EvidenceBadgeProps {
  type: EvidenceType;
  size?: 'sm' | 'md';
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ type, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (type) {
    case 'FACT / DIRECT EVIDENCE':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          <span>FACT / DIRECT EVIDENCE</span>
        </span>
      );
    case 'CANDIDATE CLAIM':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
          <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
          <span>CANDIDATE CLAIM</span>
        </span>
      );
    case 'MISSING INFORMATION':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>
          <AlertCircle className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span>MISSING INFORMATION</span>
        </span>
      );
    case 'POSSIBLE CONTRADICTION':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 ${sizeClasses}`}>
          <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />
          <span>POSSIBLE CONTRADICTION</span>
        </span>
      );
    default:
      return null;
  }
};

interface SourceBadgeProps {
  source: EvidenceSource;
  size?: 'sm' | 'md';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (source) {
    case 'Resume':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 ${sizeClasses}`}>
          <FileText className="w-3 h-3 text-cyan-400" />
          <span>Resume</span>
        </span>
      );
    case 'Transcript':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 ${sizeClasses}`}>
          <Mic className="w-3 h-3 text-purple-400" />
          <span>Transcript</span>
        </span>
      );
    case 'Both':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 ${sizeClasses}`}>
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Resume + Transcript (Both)</span>
        </span>
      );
    default:
      return null;
  }
};
