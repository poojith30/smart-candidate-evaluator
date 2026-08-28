import type { EvidenceTraceItem } from '../../types';
import { SourceBadge } from '../profile/ProfileBadge';
import { Layers, Quote } from 'lucide-react';

interface EvidenceTraceViewerProps {
  traces: EvidenceTraceItem[];
}

export const EvidenceTraceViewer: React.FC<EvidenceTraceViewerProps> = ({ traces }) => {
  if (traces.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
        No evidence trace items recorded.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {traces.map((trace, idx) => (
        <div
          key={idx}
          className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              {trace.claim}
            </span>

            {trace.source === 'Debate Argument' ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Debate Argument
              </span>
            ) : (
              <SourceBadge source={trace.source} />
            )}
          </div>

          <div className="p-2 rounded bg-background-darkest/90 border border-slate-800 flex items-start gap-2 text-slate-300 italic text-[11px]">
            <Quote className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>"{trace.citation}"</span>
          </div>

          <p className="text-[11px] text-slate-400 bg-slate-950/40 p-1.5 rounded border border-slate-800/40">
            <strong className="text-slate-300">Decision Impact:</strong> {trace.impactOnDecision}
          </p>
        </div>
      ))}
    </div>
  );
};
