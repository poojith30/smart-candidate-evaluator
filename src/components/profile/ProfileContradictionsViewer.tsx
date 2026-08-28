import React from 'react';
import type { ContradictionItem } from '../../types';
import { EvidenceBadge } from './ProfileBadge';
import { ShieldAlert, Quote, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProfileContradictionsViewerProps {
  contradictions: ContradictionItem[];
}

export const ProfileContradictionsViewer: React.FC<ProfileContradictionsViewerProps> = ({ contradictions }) => {
  if (contradictions.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center justify-center text-center space-y-2">
        <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-200">No Direct Contradictions Detected</h4>
        <p className="text-xs text-slate-400 max-w-md">
          Candidate's interview answers align consistently with the written claims in their resume.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Flagged Discrepancies between Written Resume and Verbal Interview:</span>
        </div>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
          {contradictions.length} Flagged
        </span>
      </div>

      <div className="space-y-4">
        {contradictions.map((contra) => (
          <div
            key={contra.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-500/50 transition-all space-y-3"
          >
            {/* Header: Badges & Severity */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <EvidenceBadge type="POSSIBLE CONTRADICTION" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                  {contra.topic}
                </h4>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                contra.severity === 'High'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : contra.severity === 'Medium'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {contra.severity} Divergence
              </span>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
              {/* Left: Resume Statement & Quote */}
              <div className="p-3.5 rounded-lg bg-background-darkest border border-cyan-500/20 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-1.5">
                    <span>📄 Resume Written Claim</span>
                    <span className="font-mono text-[10px] text-slate-500">Source: Resume</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {contra.resumeStatement.text}
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400 italic">
                  <Quote className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>"{contra.resumeStatement.quote}"</span>
                </div>
              </div>

              {/* Right: Transcript Statement & Quote */}
              <div className="p-3.5 rounded-lg bg-background-darkest border border-rose-500/20 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-rose-400 mb-1.5">
                    <span>🎙️ Verbal Interview Response</span>
                    <span className="font-mono text-[10px] text-slate-500">Source: Transcript</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {contra.transcriptStatement.text}
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400 italic">
                  <Quote className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>"{contra.transcriptStatement.quote}"</span>
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-200">Discrepancy Analysis:</strong> {contra.discrepancySummary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
