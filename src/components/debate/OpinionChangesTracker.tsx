import type { OpinionChange, AgentRole } from '../../types';
import { RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';

interface OpinionChangesTrackerProps {
  opinionChanges: OpinionChange[];
}

const AGENT_COLORS: Record<AgentRole, { text: string; badge: string; border: string }> = {
  tech: { text: 'text-cyan-400', badge: 'bg-cyan-500/10 text-cyan-400', border: 'border-cyan-500/30' },
  culture: { text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
  manager: { text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' },
  skeptic: { text: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400', border: 'border-rose-500/30' }
};

export const OpinionChangesTracker: React.FC<OpinionChangesTrackerProps> = ({ opinionChanges }) => {
  if (opinionChanges.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
        Round 2 reassessment data awaiting execution.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {opinionChanges.map((change) => {
        const colors = AGENT_COLORS[change.agentId];
        const influencerColors = change.influencedByAgent ? AGENT_COLORS[change.influencedByAgent] : null;

        return (
          <div
            key={change.agentId}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            {/* Header: Agent Name + Change Status Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className={`text-xs sm:text-sm font-bold ${colors.text}`}>
                  {change.agentName}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Round 2 Verdict
                </span>
              </div>

              {change.changed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin-slow" />
                  <span>Stance / Confidence Shifted</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Stance Maintained</span>
                </span>
              )}
            </div>

            {/* Before vs After Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Before State */}
              <div className="p-3 rounded-lg bg-background-darkest/90 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Original Independent Stance (Stage 3)
                </span>
                <div className="font-semibold text-slate-300">
                  {change.originalRecommendation}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Confidence: {change.originalConfidence} ({change.originalConfidenceScore}%)
                </div>
              </div>

              {/* After State */}
              <div className={`p-3 rounded-lg bg-background-darkest/90 border ${
                change.changed ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800/80'
              } space-y-1`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                  Post-Debate Reassessment (Stage 4)
                </span>
                <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <span>{change.revisedRecommendation}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Confidence: {change.revisedConfidence} ({change.revisedConfidenceScore}%)
                </div>
              </div>
            </div>

            {/* Explanation & Influencer Pill */}
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-slate-200">Reassessment Rationale:</strong> {change.reason}
              </p>

              {change.influencedByAgent && influencerColors && (
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Influenced By:</span>
                  <span className={`px-2 py-0.5 rounded font-bold border ${influencerColors.badge} ${influencerColors.border}`}>
                    {change.influencedByAgent.toUpperCase()} Agent
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
