import React, { useState } from 'react';
import { 
  Code2, 
  Users2, 
  Briefcase, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Quote, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import type { AgentInfo, AgentEvaluation } from '../types';
import { SourceBadge } from './profile/ProfileBadge';

interface AgentCardProps {
  agent: AgentInfo;
  candidateLabel?: string;
  evaluation?: AgentEvaluation | null;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  candidateLabel = 'Candidate',
  evaluation,
}) => {
  const [showEvidence, setShowEvidence] = useState(false);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'tech':
        return <Code2 className="w-5 h-5" />;
      case 'culture':
        return <Users2 className="w-5 h-5" />;
      case 'manager':
        return <Briefcase className="w-5 h-5" />;
      case 'skeptic':
        return <ShieldAlert className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'Strongly Move Forward':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Move Forward':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Move Forward with Reservations':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Do Not Move Forward':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Requires Clarification':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className={`bg-background-darker border ${agent.themeColor.border} rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-lg relative overflow-hidden group`}>
      {/* Subtle background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${agent.themeColor.bgSubtle} rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div>
        {/* Card Header: Icon, Agent Title, Subtitle, Recommendation / Status */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${agent.themeColor.iconBg}`}>
              {getAgentIcon(agent.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-100">
                  {agent.title}
                </h4>
                {candidateLabel && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {candidateLabel}
                  </span>
                )}
              </div>
              <p className={`text-xs font-medium ${agent.themeColor.accent}`}>
                {agent.subtitle}
              </p>
            </div>
          </div>

          {evaluation ? (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getRecommendationBadge(evaluation.recommendation)} flex-shrink-0`}>
              {evaluation.recommendation}
            </span>
          ) : (
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${agent.themeColor.badge} flex-shrink-0`}>
              Awaiting Run
            </span>
          )}
        </div>

        {/* Real Evaluation Content */}
        {evaluation ? (
          <div className="mt-4 space-y-4">
            {/* Confidence & Score Pill */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confidence:</span>
                <span className="font-semibold text-slate-200">{evaluation.confidence} ({evaluation.confidenceScore}%)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Isolated LLM Call</span>
            </div>

            {/* Overall Assessment Summary */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.overallAssessment}
              </p>
            </div>

            {/* Strengths & Concerns Grid */}
            <div className="space-y-3">
              {/* Strengths */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-slate-900/40 p-1.5 rounded border border-slate-800/40">
                      <span className="text-emerald-400 text-xs mt-0.5">•</span>
                      <span className="leading-snug">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concerns */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Identified Concerns / Gaps
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {evaluation.concerns.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-slate-900/40 p-1.5 rounded border border-slate-800/40">
                      <span className="text-amber-400 text-xs mt-0.5">•</span>
                      <span className="leading-snug">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Evidence Toggle & List */}
            {evaluation.evidenceItems && evaluation.evidenceItems.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowEvidence(!showEvidence)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Evidence Citations ({evaluation.evidenceItems.length})</span>
                  </span>
                  {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showEvidence && (
                  <div className="space-y-2 mt-2">
                    {evaluation.evidenceItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-background-darkest border border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <SourceBadge source={item.source} />
                          <span className="text-[10px] text-slate-500 font-mono">Evidence Item #{idx + 1}</span>
                        </div>
                        <p className="text-[11px] italic text-slate-300 bg-slate-900/70 p-1.5 rounded border border-slate-800/60">
                          "{item.exactQuoteOrEvidence}"
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          <strong className="text-slate-300">Rationale:</strong> {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Placeholder Analysis State */
          <div>
            <p className="text-xs text-slate-400 mt-3.5 leading-relaxed">
              {agent.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Evaluation Rubric Focus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {agent.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-300 border border-slate-800"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-3 bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Key Strengths & Evidence
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Pending run</span>
              </div>
              <div className="h-3 bg-slate-800/60 rounded animate-pulse w-4/5" />

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Identified Risks / Doubts
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Pending run</span>
              </div>
              <div className="h-3 bg-slate-800/60 rounded animate-pulse w-3/5" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span>Independent Agent Mode</span>
        <span className="font-mono">Stage 1 of Pipeline</span>
      </div>
    </div>
  );
};
