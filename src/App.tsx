import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { CandidateSelector } from './components/CandidateSelector';
import { CandidateProfileSection } from './components/CandidateProfileSection';
import { AgentCard } from './components/AgentCard';
import { DebateSection } from './components/DebateSection';
import { FinalDecisionSection } from './components/FinalDecisionSection';
import { ApiConfigModal } from './components/ApiConfigModal';
import type { 
  EvaluationDocuments, 
  ViewTab, 
  CandidateProfile, 
  AgentRole, 
  AgentEvaluation,
  DebateResult,
  FinalDecisionReport
} from './types';
import { AGENTS_CONFIG } from './data/agentConstants';
import { buildCandidateProfile } from './services/profileBuilder';
import { evaluateCandidateIndependently } from './services/agents/orchestrator';
import { runCandidateDebate } from './services/debate/debateOrchestrator';
import { makeFinalDecision } from './services/decision/decisionService';
import { Info, Bot, Shield, CheckCircle2, Lock } from 'lucide-react';

export const App: React.FC = () => {
  const [documents, setDocuments] = useState<EvaluationDocuments>({
    jobDescription: null,
    candidateA: { resume: null, transcript: null },
    candidateB: { resume: null, transcript: null },
  });

  const [profileA, setProfileA] = useState<CandidateProfile | null>(null);
  const [profileB, setProfileB] = useState<CandidateProfile | null>(null);

  const [evalsA, setEvalsA] = useState<Record<AgentRole, AgentEvaluation | null>>({
    tech: null,
    culture: null,
    manager: null,
    skeptic: null,
  });

  const [evalsB, setEvalsB] = useState<Record<AgentRole, AgentEvaluation | null>>({
    tech: null,
    culture: null,
    manager: null,
    skeptic: null,
  });

  const [debateA, setDebateA] = useState<DebateResult | null>(null);
  const [debateB, setDebateB] = useState<DebateResult | null>(null);

  const [decisionA, setDecisionA] = useState<FinalDecisionReport | null>(null);
  const [decisionB, setDecisionB] = useState<FinalDecisionReport | null>(null);

  const [activeTab, setActiveTab] = useState<ViewTab>('candidateA');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pipelineAlert, setPipelineAlert] = useState<string | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  const handleUpdateDoc = (
    target: 'jobDescription' | 'candidateA_resume' | 'candidateA_transcript' | 'candidateB_resume' | 'candidateB_transcript',
    file: File | null
  ) => {
    const uploaded = file
      ? {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        }
      : null;

    setDocuments((prev) => {
      if (target === 'jobDescription') {
        return { ...prev, jobDescription: uploaded };
      }
      if (target === 'candidateA_resume') {
        return {
          ...prev,
          candidateA: { ...prev.candidateA, resume: uploaded },
        };
      }
      if (target === 'candidateA_transcript') {
        return {
          ...prev,
          candidateA: { ...prev.candidateA, transcript: uploaded },
        };
      }
      if (target === 'candidateB_resume') {
        return {
          ...prev,
          candidateB: { ...prev.candidateB, resume: uploaded },
        };
      }
      if (target === 'candidateB_transcript') {
        return {
          ...prev,
          candidateB: { ...prev.candidateB, transcript: uploaded },
        };
      }
      return prev;
    });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setPipelineAlert('Running complete 5-stage pipeline: Profile Building → Independent Evals → Debate → Final Decision...');

    try {
      const jdText = documents.jobDescription?.rawText || '';

      // Stage 2: Build Candidate Profiles
      const [resProfileA, resProfileB] = await Promise.all([
        buildCandidateProfile(
          documents.jobDescription,
          documents.candidateA.resume,
          documents.candidateA.transcript,
          'candidateA'
        ),
        buildCandidateProfile(
          documents.jobDescription,
          documents.candidateB.resume,
          documents.candidateB.transcript,
          'candidateB'
        ),
      ]);

      setProfileA(resProfileA);
      setProfileB(resProfileB);

      // Stage 3: Execute 4 Isolated Independent Agent evaluations
      const [candidateAEvaluations, candidateBEvaluations] = await Promise.all([
        evaluateCandidateIndependently(jdText, resProfileA),
        evaluateCandidateIndependently(jdText, resProfileB),
      ]);

      setEvalsA(candidateAEvaluations);
      setEvalsB(candidateBEvaluations);

      // Stage 4: Execute Multi-Agent Debate (Round 1 Cross-Exam + Round 2 Reassessment)
      const [resDebateA, resDebateB] = await Promise.all([
        runCandidateDebate(jdText, resProfileA, candidateAEvaluations, 'candidateA'),
        runCandidateDebate(jdText, resProfileB, candidateBEvaluations, 'candidateB'),
      ]);

      setDebateA(resDebateA);
      setDebateB(resDebateB);

      // Stage 5: Formulate Final Decision and Executive Report
      const [resDecisionA, resDecisionB] = await Promise.all([
        makeFinalDecision(jdText, resProfileA, candidateAEvaluations, resDebateA, 'candidateA'),
        makeFinalDecision(jdText, resProfileB, candidateBEvaluations, resDebateB, 'candidateB'),
      ]);

      setDecisionA(resDecisionA);
      setDecisionB(resDecisionB);

      setPipelineAlert('All 5 Stages Complete! Final hiring decisions and executive reports formulated with full evidence traceability.');
    } catch (err) {
      console.error('Error running evaluation and debate pipeline:', err);
      setPipelineAlert(`Pipeline error: ${(err as Error).message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-darkest text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 1. Header */}
      <Header onOpenApiConfig={() => setIsApiModalOpen(true)} />

      {/* API Configuration Modal */}
      <ApiConfigModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeySaved={() => {
          setPipelineAlert('API Configuration updated.');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mt-0.5">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Complete Multi-Agent Interview Evaluation Pipeline
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Stages 1–5 Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Profile Builder → 4 Isolated Independent Agents → 2-Round Deliberation Debate → Consensus Synthesis & Evidence-Weighted Final Report.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 self-start md:self-auto flex-shrink-0">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Evidence Traceability</span>
          </div>
        </div>

        {/* Pipeline Alert Toast if triggered */}
        {pipelineAlert && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              {decisionA ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              )}
              <span>{pipelineAlert}</span>
            </div>
            <button
              onClick={() => setPipelineAlert(null)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-200 ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2. Input Section */}
        <UploadSection
          documents={documents}
          onUpdateDoc={handleUpdateDoc}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {/* Section Divider & Results Dashboard Header */}
        <div className="pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Multi-Agent Evaluation Dashboard
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Explore candidate profiles, individual agent assessments, deliberation debates, and the synthesized hiring verdict.
              </p>
            </div>

            {/* 4. Candidate Selector */}
            <CandidateSelector
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              documents={documents}
            />
          </div>

          {/* 3. Results Dashboard Components */}
          <div className="space-y-8">
            {/* LAYER 1: CANDIDATE PROFILES & INDEPENDENT AGENT ANALYSIS */}
            <div className="space-y-6">
              {/* Header pill & Strict Independence Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Layer 1
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    Independent Agent Analysis — Before Debate
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cyan-300/90 font-medium">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Each agent was evaluated independently before the debate stage.</span>
                </div>
              </div>

              {/* View Rendering based on active tab */}
              {activeTab === 'candidateA' && (
                <div className="space-y-6">
                  {/* Candidate A Profile */}
                  <CandidateProfileSection
                    candidateId="candidateA"
                    docs={documents.candidateA}
                    title="Candidate A"
                    profile={profileA}
                  />

                  {/* 4 Agent Cards Grid for Candidate A */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <AgentCard 
                      agent={AGENTS_CONFIG.tech} 
                      candidateLabel="Candidate A" 
                      evaluation={evalsA.tech} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.culture} 
                      candidateLabel="Candidate A" 
                      evaluation={evalsA.culture} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.manager} 
                      candidateLabel="Candidate A" 
                      evaluation={evalsA.manager} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.skeptic} 
                      candidateLabel="Candidate A" 
                      evaluation={evalsA.skeptic} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'candidateB' && (
                <div className="space-y-6">
                  {/* Candidate B Profile */}
                  <CandidateProfileSection
                    candidateId="candidateB"
                    docs={documents.candidateB}
                    title="Candidate B"
                    profile={profileB}
                  />

                  {/* 4 Agent Cards Grid for Candidate B */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <AgentCard 
                      agent={AGENTS_CONFIG.tech} 
                      candidateLabel="Candidate B" 
                      evaluation={evalsB.tech} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.culture} 
                      candidateLabel="Candidate B" 
                      evaluation={evalsB.culture} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.manager} 
                      candidateLabel="Candidate B" 
                      evaluation={evalsB.manager} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.skeptic} 
                      candidateLabel="Candidate B" 
                      evaluation={evalsB.skeptic} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="space-y-6">
                  {/* Dual Candidate Profiles Side-by-Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CandidateProfileSection
                      candidateId="candidateA"
                      docs={documents.candidateA}
                      title="Candidate A"
                      profile={profileA}
                    />
                    <CandidateProfileSection
                      candidateId="candidateB"
                      docs={documents.candidateB}
                      title="Candidate B"
                      profile={profileB}
                    />
                  </div>

                  {/* Side-by-side agent cards overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AgentCard 
                      agent={AGENTS_CONFIG.tech} 
                      candidateLabel="Candidate A vs B" 
                      evaluation={evalsA.tech} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.culture} 
                      candidateLabel="Candidate A vs B" 
                      evaluation={evalsA.culture} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.manager} 
                      candidateLabel="Candidate A vs B" 
                      evaluation={evalsA.manager} 
                    />
                    <AgentCard 
                      agent={AGENTS_CONFIG.skeptic} 
                      candidateLabel="Candidate A vs B" 
                      evaluation={evalsA.skeptic} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LAYER 2: MULTI-AGENT DEBATE & OPINION CHANGES (Stage 4) */}
            <DebateSection 
              activeCandidateId={activeTab === 'candidateB' ? 'candidateB' : 'candidateA'}
              debateA={debateA}
              debateB={debateB}
            />

            {/* LAYER 3: FINAL DECISION & FINAL REPORT (Stage 5) */}
            <FinalDecisionSection 
              activeCandidateId={activeTab === 'candidateB' ? 'candidateB' : 'candidateA'}
              decisionA={decisionA}
              decisionB={decisionB}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-background-darker/80 py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AI Candidate Evaluator</span>
            <span>— Hackathon Edition</span>
          </div>
          <p>
            Complete 5-Stage Architecture: Profile Builder • 4 Isolated Agents • 2-Round Debate • Consensus Synthesis • Executive Report
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
