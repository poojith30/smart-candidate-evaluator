import type { UnresolvedDisagreement, AgentRole } from '../../types';
import { Scale, ArrowRight } from 'lucide-react';

interface UnresolvedDisagreementsViewerProps {
  disagreements: UnresolvedDisagreement[];
}

const AGENT_BADGES: Record<AgentRole, { name: string; color: string; border: string; bg: string }> = {
  tech: { name: 'Technical Agent', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
  culture: { name: 'HR Agent', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  manager: { name: 'Hiring Manager', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  skeptic: { name: 'Skeptic Agent', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
};

export const UnresolvedDisagreementsViewer: React.FC<UnresolvedDisagreementsViewerProps> = ({ disagreements }) => {
  if (disagreements.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
        No unresolved agent disagreements. The committee achieved consensus during debate.
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {disagreements.map((item, index) => {
        const agentA = AGENT_BADGES[item.agentAPerspective.agent];
        const agentB = AGENT_BADGES[item.agentBPerspective.agent];

        return (
          <div
            key={index}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            {/* Topic Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Scale className="w-4 h-4 text-indigo-400" />
              <h5 className="text-xs sm:text-sm font-bold text-slate-200">
                {item.topic}
              </h5>
            </div>

            {/* Split Perspectives */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-background-darkest/90 border border-slate-800 space-y-1">
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${agentA.bg} ${agentA.color} ${agentA.border}`}>
                  {agentA.name}
                </span>
                <p className="text-slate-300 leading-relaxed pt-1">
                  {item.agentAPerspective.stance}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background-darkest/90 border border-slate-800 space-y-1">
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${agentB.bg} ${agentB.color} ${agentB.border}`}>
                  {agentB.name}
                </span>
                <p className="text-slate-300 leading-relaxed pt-1">
                  {item.agentBPerspective.stance}
                </p>
              </div>
            </div>

            {/* Final Committee Reasoning */}
            <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-indigo-100">Committee Synthesis Rationale:</strong> {item.finalReasoning}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
