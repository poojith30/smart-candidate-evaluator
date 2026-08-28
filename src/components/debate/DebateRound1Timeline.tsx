import type { DebateResponse, AgentRole } from '../../types';
import { Quote, ArrowRight, Check, X, Minus } from 'lucide-react';

interface DebateRound1TimelineProps {
  responses: DebateResponse[];
}

const AGENT_LABELS: Record<AgentRole, { name: string; tag: string; color: string; border: string; bg: string }> = {
  tech: {
    name: 'Technical Agent',
    tag: 'TA',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10'
  },
  culture: {
    name: 'HR / Culture Agent',
    tag: 'HR',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10'
  },
  manager: {
    name: 'Hiring Manager',
    tag: 'HM',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10'
  },
  skeptic: {
    name: 'Skeptic Agent',
    tag: 'SA',
    color: 'text-rose-400',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10'
  }
};

export const DebateRound1Timeline: React.FC<DebateRound1TimelineProps> = ({ responses }) => {
  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'agree':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
            <Check className="w-3 h-3" /> Agrees
          </span>
        );
      case 'disagree':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase">
            <X className="w-3 h-3" /> Challenges / Disagrees
          </span>
        );
      case 'partially agree':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
            <Minus className="w-3 h-3" /> Partially Agrees
          </span>
        );
      default:
        return null;
    }
  };

  if (responses.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
        Debate cross-examination turns awaiting execution.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {responses.map((turn, index) => {
        const from = AGENT_LABELS[turn.respondingAgent];
        const to = AGENT_LABELS[turn.targetAgent];

        return (
          <div
            key={turn.id || index}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden"
          >
            {/* Header: Turn #, Responding Agent -> Target Agent, Stance Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/70">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Turn {index + 1}
                </span>

                {/* Responding Agent Tag */}
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg border ${from.bg} ${from.color} ${from.border}`}>
                  {from.name}
                </span>

                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

                {/* Target Agent Tag */}
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg border ${to.bg} ${to.color} ${to.border}`}>
                  {to.name}
                </span>
              </div>

              {getPositionBadge(turn.position)}
            </div>

            {/* Point Addressed */}
            <div className="text-xs text-slate-400 bg-background-darkest/60 p-2 rounded-lg border border-slate-800/60">
              <span className="font-semibold text-slate-300">Addressing Point:</span> "{turn.pointAddressed}"
            </div>

            {/* Agent Argument Response */}
            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {turn.response}
              </p>
            </div>

            {/* Supporting Evidence Quote */}
            {turn.supportingEvidence && (
              <div className="p-2.5 rounded-lg bg-background-darkest border border-slate-800 text-xs flex items-start gap-2 text-slate-300">
                <Quote className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Supporting Evidence Cited:
                  </span>
                  <p className="italic text-[11px] text-slate-300">
                    "{turn.supportingEvidence}"
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
