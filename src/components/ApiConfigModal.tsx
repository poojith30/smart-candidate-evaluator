import React, { useState, useEffect } from 'react';
import { Key, X, Check, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, isApiKeyConfigured } from '../services/llm/llmProvider';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setIsSaved(true);
    onKeySaved();
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setStoredApiKey('');
    setApiKey('');
    setIsSaved(true);
    onKeySaved();
  };

  const isConfigured = isApiKeyConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-darkest/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-background-darker border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">LLM API Configuration</h3>
              <p className="text-xs text-slate-400">Google Gemini Live Agent Provider</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Enter your Google Gemini API key to enable live LLM generation for the four independent agents.
          </p>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Get a free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Current Status:</span>
              <span className={isConfigured ? 'text-emerald-400' : 'text-amber-400'}>
                {isConfigured ? 'Live Gemini LLM Connected' : 'Profile Evidence Engine Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isConfigured
                ? 'Each agent makes an isolated call directly to Gemini 1.5 Flash.'
                : 'Running in deterministic profile evaluation mode (extracts real evidence without hallucination).'}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
              >
                Clear Key
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Key</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
