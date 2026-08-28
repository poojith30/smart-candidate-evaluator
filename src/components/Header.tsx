import React from 'react';
import { Cpu, ShieldCheck, Sparkles, Layers, Key } from 'lucide-react';
import { isApiKeyConfigured } from '../services/llm/llmProvider';

interface HeaderProps {
  onOpenApiConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApiConfig }) => {
  const isConfigured = isApiKeyConfigured();

  return (
    <header className="border-b border-slate-800/80 bg-background-darker/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-glow-indigo">
            <div className="h-full w-full bg-background-card rounded-[11px] flex items-center justify-center">
              <Cpu className="h-6 w-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AI Candidate Evaluator
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-3 h-3" /> Multi-Agent 2.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Multi-Agent Interview Evaluation System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Architecture:</span>
            <span className="font-semibold text-slate-200">4 Isolated Agents + Debate + Synthesis</span>
          </div>

          <button
            type="button"
            onClick={onOpenApiConfig}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Configure LLM API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isConfigured ? 'Gemini API Active' : 'API Key Setup'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stage 3 Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
