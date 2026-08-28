import React, { useState } from 'react';
import { MessagesSquare, Sparkles, ArrowRightLeft, User, RefreshCw } from 'lucide-react';
import type { CandidateId, DebateResult } from '../types';
import { DebateRound1Timeline } from './debate/DebateRound1Timeline';
import { OpinionChangesTracker } from './debate/OpinionChangesTracker';

interface DebateSectionProps {
  activeCandidateId?: CandidateId;
  debateA?: DebateResult | null;
  debateB?: DebateResult | null;
}

export const DebateSection: React.FC<DebateSectionProps> = ({
  activeCandidateId = 'candidateA',
  debateA,
  debateB,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateId>(activeCandidateId);

  const activeDebate = selectedCandidate === 'candidateA' ? debateA : debateB;
  const isDebateComplete = Boolean(activeDebate && activeDebate.isComplete);

  return (
    <section className="bg-background-darker border border-purple-900/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle purple background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10">
        {/* Layer 2 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Layer 2
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Multi-Agent Debate
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Agents directly challenge each other's assessments and reassess their recommendations post-discourse.
            </p>
          </div>

          {/* Candidate Debate Switcher */}
          <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedCandidate('candidateA')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCandidate === 'candidateA'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidate A Debate</span>
              {debateA && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </button>

            <button
              type="button"
              onClick={() => setSelectedCandidate('candidateB')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCandidate === 'candidateB'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidate B Debate</span>
              {debateB && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Visual Timeline Bar */}
        <div className="mt-5 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Debate Execution Timeline:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              1. Independent Analysis
            </span>
            <span className="text-purple-400">→</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              2. Round 1: Cross-Examination
            </span>
            <span className="text-purple-400">→</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              3. Round 2: Reassessment & Opinion Shifts
            </span>
          </div>
        </div>

        {/* Real Debate Content vs Standby State */}
        {isDebateComplete && activeDebate ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Column 1: Multi-Agent Debate Arena (Round 1) */}
            <div className="lg:col-span-7 bg-background-card/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <MessagesSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">Round 1: Cross-Examination Arena</h4>
                      <p className="text-[11px] text-slate-400">
                        {selectedCandidate === 'candidateA' ? 'Candidate A' : 'Candidate B'} Evidence Disputations
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Round 1 Complete ({activeDebate.round1Responses.length} Turns)
                  </span>
                </div>

                <div className="mt-4">
                  <DebateRound1Timeline responses={activeDebate.round1Responses} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/70 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Direct Agent-to-Agent Arguments</span>
                <span className="font-mono">Evidence-Grounded Discourse</span>
              </div>
            </div>

            {/* Column 2: Opinion Changes Tracker (Round 2) */}
            <div className="lg:col-span-5 bg-background-card/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">Round 2: Opinion Changes</h4>
                      <p className="text-[11px] text-slate-400">Before vs After Reassessment</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    Round 2 Reassessed
                  </span>
                </div>

                <div className="mt-4">
                  <OpinionChangesTracker opinionChanges={activeDebate.opinionChanges} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/70 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Audited Stance Shift Logging</span>
                <span className="font-mono">Zero Manufactured Changes</span>
              </div>
            </div>
          </div>
        ) : (
          /* Standby Placeholder when debate has not yet executed */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-7 bg-background-card/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <MessagesSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Multi-Agent Debate Arena</h4>
                    <p className="text-[11px] text-slate-400">Cross-examination turns will execute automatically after Stage 3 analysis</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                  Standby
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  During this stage, the <span className="text-cyan-400 font-semibold">Technical Agent</span>, <span className="text-emerald-400 font-semibold">HR Agent</span>, <span className="text-amber-400 font-semibold">Hiring Manager</span>, and <span className="text-rose-400 font-semibold">Skeptic Agent</span> will directly challenge each other’s scores and highlight conflicting evidence.
                </p>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-purple-400 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-300 font-semibold">
                    Awaiting Candidate Evaluation Execution
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Click "Analyze Candidates" above to run the independent agent evaluations followed by the multi-agent debate.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-background-card/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Opinion Changes</h4>
                    <p className="text-[11px] text-slate-400">Stance shifts post-debate</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                  Standby
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Tracks how each agent updates their assessment when presented with counter-arguments or overlooked transcript evidence.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
