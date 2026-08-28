import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Sparkles, 
  FileText,
  Scale,
  FileCheck2
} from 'lucide-react';
import type { CandidateId, FinalDecisionReport } from '../types';
import { SourceBadge } from './profile/ProfileBadge';
import { UnresolvedDisagreementsViewer } from './decision/UnresolvedDisagreementsViewer';
import { EvidenceTraceViewer } from './decision/EvidenceTraceViewer';

interface FinalDecisionSectionProps {
  activeCandidateId?: CandidateId;
  decisionA?: FinalDecisionReport | null;
  decisionB?: FinalDecisionReport | null;
}

export const FinalDecisionSection: React.FC<FinalDecisionSectionProps> = ({
  activeCandidateId = 'candidateA',
  decisionA,
  decisionB,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateId>(activeCandidateId);

  const activeDecision = selectedCandidate === 'candidateA' ? decisionA : decisionB;
  const isDecisionReady = Boolean(activeDecision && activeDecision.isComplete);

  const getRecommendationTheme = (rec?: string) => {
    switch (rec) {
      case 'Strongly Advance':
        return {
          banner: 'bg-gradient-to-r from-emerald-950/80 via-indigo-950/60 to-emerald-900/40 border-emerald-500/40',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          text: 'text-emerald-300',
          glow: 'shadow-glow-emerald'
        };
      case 'Advance':
        return {
          banner: 'bg-gradient-to-r from-indigo-950/80 via-emerald-950/40 to-slate-900/80 border-indigo-500/40',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
          text: 'text-indigo-300',
          glow: 'shadow-glow-indigo'
        };
      case 'Hold / Need More Evidence':
        return {
          banner: 'bg-gradient-to-r from-amber-950/80 via-slate-900/80 to-amber-900/40 border-amber-500/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          text: 'text-amber-300',
          glow: 'shadow-glow-amber'
        };
      case 'Do Not Advance':
        return {
          banner: 'bg-gradient-to-r from-rose-950/80 via-slate-900/80 to-rose-900/40 border-rose-500/40',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          text: 'text-rose-300',
          glow: 'shadow-glow-rose'
        };
      default:
        return {
          banner: 'bg-background-card border-slate-800',
          badge: 'bg-slate-800 text-slate-400 border-slate-700',
          text: 'text-slate-200',
          glow: ''
        };
    }
  };

  const handleExportReport = () => {
    if (!activeDecision) return;

    const reportMarkdown = `# Hiring Committee Final Executive Report
**Candidate**: ${activeDecision.candidateName} (${activeDecision.candidateId === 'candidateA' ? 'Candidate A' : 'Candidate B'})
**Date**: ${new Date(activeDecision.generatedAt).toLocaleString()}
**Final Recommendation**: ${activeDecision.recommendation}
**Confidence Score**: ${activeDecision.confidenceScore}%

---

## 1. Decision Reasoning & Evidence Synthesis
${activeDecision.decisionReasoning}

**Confidence Rationale**: ${activeDecision.confidenceExplanation}

---

## 2. Key Evidence-Backed Strengths
${activeDecision.strengths.map(s => `- **${s.strength}**\n  *Evidence*: "${s.evidence}" (${s.source})`).join('\n\n')}

---

## 3. Identified Risks & Missing Requirements
${activeDecision.concerns.map(c => `- **${c.concern}**\n  *Evidence*: "${c.evidence}" (${c.source})`).join('\n\n')}

---

## 4. Unresolved Agent Disagreements
${activeDecision.unresolvedDisagreements.map(u => `### ${u.topic}\n- **${u.agentAPerspective.agent.toUpperCase()} Agent**: ${u.agentAPerspective.stance}\n- **${u.agentBPerspective.agent.toUpperCase()} Agent**: ${u.agentBPerspective.stance}\n- *Synthesis Resolution*: ${u.finalReasoning}`).join('\n\n')}

---

## 5. Multi-Agent Debate & Opinion Changes
${activeDecision.opinionChangesSummary}

---

## 6. Full Evidence Traceability
${activeDecision.evidenceTrace.map(t => `- **${t.claim}** [${t.source}]: "${t.citation}"\n  *Decision Impact*: ${t.impactOnDecision}`).join('\n\n')}
`;

    // Trigger download of markdown file
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Final_Report_${activeDecision.candidateId}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const theme = getRecommendationTheme(activeDecision?.recommendation);

  return (
    <section className="bg-background-darker border border-indigo-900/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Layer 3 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Layer 3
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Final Decision Reasoning
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Final hiring recommendation synthesized from evidence quality, independent evaluations, and debate discourse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Candidate Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
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
                <span>Candidate A Report</span>
                {decisionA && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
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
                <span>Candidate B Report</span>
                {decisionB && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            </div>

            {/* Export Report Action */}
            <button
              type="button"
              onClick={handleExportReport}
              disabled={!isDecisionReady}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
                isDecisionReady
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Real Decision View vs Standby State */}
        {isDecisionReady && activeDecision ? (
          <div className="space-y-6 mt-6">
            {/* 1. HERO RECOMMENDATION BANNER */}
            <div className={`p-6 rounded-2xl border ${theme.banner} shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Hiring Committee Final Verdict
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activeDecision.recommendation}
                  </h2>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${theme.badge} uppercase tracking-wider`}>
                    {activeDecision.candidateName}
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {activeDecision.decisionReasoning}
                </p>
              </div>

              {/* Confidence Score Pill */}
              <div className="p-4 rounded-xl bg-background-darkest/90 border border-slate-800 min-w-[200px] flex flex-col justify-between space-y-2 self-start md:self-auto">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">Synthesis Confidence:</span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {activeDecision.confidenceScore}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${activeDecision.confidenceScore}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-400 leading-tight">
                  {activeDecision.confidenceExplanation}
                </p>
              </div>
            </div>

            {/* 2. STRENGTHS & CONCERNS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Strengths */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Key Decision Strengths
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Evidence Sourced</span>
                </div>

                <div className="space-y-3">
                  {activeDecision.strengths.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-background-darkest border border-slate-800/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{item.strength}</span>
                        <SourceBadge source={item.source} />
                      </div>
                      <p className="italic text-[11px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800/60">
                        "{item.evidence}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Identified Concerns & Gaps
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Risk Mitigation</span>
                </div>

                <div className="space-y-3">
                  {activeDecision.concerns.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-background-darkest border border-slate-800/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{item.concern}</span>
                        <SourceBadge source={item.source} />
                      </div>
                      <p className="italic text-[11px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800/60">
                        "{item.evidence}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. UNRESOLVED DISAGREEMENTS & POST-DEBATE CONSENSUS */}
            <div className="p-5 rounded-xl bg-background-card/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                    Unresolved Agent Disagreements & Synthesis
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Committee Weighing
                </span>
              </div>

              <UnresolvedDisagreementsViewer disagreements={activeDecision.unresolvedDisagreements} />

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <strong className="text-slate-200">Debate Opinion Shift Summary:</strong> {activeDecision.opinionChangesSummary}
              </div>
            </div>

            {/* 4. FULL EVIDENCE TRACEABILITY */}
            <div className="p-5 rounded-xl bg-background-card/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                    Full Evidence Lineage & Traceability
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Audit Verified
                </span>
              </div>

              <EvidenceTraceViewer traces={activeDecision.evidenceTrace} />
            </div>
          </div>
        ) : (
          /* Standby Placeholder when pipeline has not yet executed */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-6 bg-background-card/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">Final Hiring Recommendation</h4>
                      <p className="text-[11px] text-slate-400">Evidence-weighted hiring verdict</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                    Standby
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The final decision synthesizes candidate profile evidence, independent agent evaluations, and debate discourse without score averaging.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center space-y-2">
                    <Sparkles className="w-6 h-6 text-indigo-400 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Awaiting Pipeline Run
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Click "Analyze Candidates" above to run the complete 5-stage multi-agent evaluation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-background-card/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">Final Executive Report</h4>
                      <p className="text-[11px] text-slate-400">Structured hiring committee briefing</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                    Standby
                  </span>
                </div>

                <div className="mt-4 space-y-2 p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-1">Executive Report Includes:</span>
                  <ul className="space-y-1 pl-1">
                    <li>• Final recommendation & confidence explanation</li>
                    <li>• Evidence-backed strengths & risk mitigations</li>
                    <li>• Unresolved agent disagreements resolution</li>
                    <li>• Full evidence lineage & source citations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
