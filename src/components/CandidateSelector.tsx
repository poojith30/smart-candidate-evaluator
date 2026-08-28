import React from 'react';
import { User, Columns } from 'lucide-react';
import type { ViewTab, EvaluationDocuments } from '../types';

interface CandidateSelectorProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  documents: EvaluationDocuments;
}

export const CandidateSelector: React.FC<CandidateSelectorProps> = ({
  activeTab,
  onTabChange,
  documents,
}) => {
  const isCandidateAReady = Boolean(documents.candidateA.resume && documents.candidateA.transcript);
  const isCandidateBReady = Boolean(documents.candidateB.resume && documents.candidateB.transcript);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-background-darker border border-slate-800 rounded-2xl">
      <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
        <button
          type="button"
          onClick={() => onTabChange('candidateA')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
            activeTab === 'candidateA'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span>Candidate A</span>
          {isCandidateAReady ? (
            <span className="w-2 h-2 rounded-full bg-cyan-400" title="Resume & Transcript attached" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-600" title="Documents pending" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('candidateB')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
            activeTab === 'candidateB'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4 text-emerald-400" />
          <span>Candidate B</span>
          {isCandidateBReady ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Resume & Transcript attached" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-600" title="Documents pending" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('comparison')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
            activeTab === 'comparison'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Columns className="w-4 h-4 text-indigo-400" />
          <span>Side-by-Side</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-3 px-3 py-1 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Active View:</span>
          <span className="font-semibold text-slate-300">
            {activeTab === 'candidateA'
              ? 'Candidate A In-Depth'
              : activeTab === 'candidateB'
              ? 'Candidate B In-Depth'
              : 'Dual Candidate Comparison'}
          </span>
        </div>
      </div>
    </div>
  );
};
