import React, { useRef } from 'react';
import { Briefcase, User, Play, Sparkles, HelpCircle, UploadCloud } from 'lucide-react';
import type { EvaluationDocuments } from '../types';
import { FileUploadSlot } from './FileUploadSlot';

interface UploadSectionProps {
  documents: EvaluationDocuments;
  onUpdateDoc: (
    target: 'jobDescription' | 'candidateA_resume' | 'candidateA_transcript' | 'candidateB_resume' | 'candidateB_transcript',
    file: File | null
  ) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  documents,
  onUpdateDoc,
  onAnalyze,
  isAnalyzing,
}) => {
  const batchInputRef = useRef<HTMLInputElement>(null);

  const docCount = [
    documents.jobDescription,
    documents.candidateA.resume,
    documents.candidateA.transcript,
    documents.candidateB.resume,
    documents.candidateB.transcript,
  ].filter(Boolean).length;

  const isReady = docCount === 5;

  // Auto-route batch uploaded challenge files based on filename keywords
  const handleBatchFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const name = file.name.toLowerCase();
      if (name.includes('job') || name.includes('jd') || name.includes('02_')) {
        onUpdateDoc('jobDescription', file);
      } else if ((name.includes('resume') && (name.includes('a') || name.includes('03_'))) || name.includes('03_resume')) {
        onUpdateDoc('candidateA_resume', file);
      } else if ((name.includes('transcript') && (name.includes('a') || name.includes('05_'))) || name.includes('05_transcript')) {
        onUpdateDoc('candidateA_transcript', file);
      } else if ((name.includes('resume') && (name.includes('b') || name.includes('04_'))) || name.includes('04_resume')) {
        onUpdateDoc('candidateB_resume', file);
      } else if ((name.includes('transcript') && (name.includes('b') || name.includes('06_'))) || name.includes('06_transcript')) {
        onUpdateDoc('candidateB_transcript', file);
      }
    });
  };

  return (
    <section className="bg-background-darker border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient glow behind header */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10">
        {/* Section Title & Batch Ingest Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Evaluation Input Workspace
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload the 5 challenge PDFs (Job Description, Candidate A Resume/Transcript, Candidate B Resume/Transcript).
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Batch Upload Shortcut */}
            <input
              type="file"
              ref={batchInputRef}
              multiple
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => handleBatchFiles(e.target.files)}
            />

            <button
              type="button"
              onClick={() => batchInputRef.current?.click()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              title="Upload all 5 PDFs at once"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>Batch Upload (All 5 PDFs)</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Uploaded:</span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                isReady ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'
              }`}>
                {docCount} / 5 PDFs
              </span>
            </div>
          </div>
        </div>

        {/* 3 Panels Grid: Job Description | Candidate A | Candidate B */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
          {/* 1. Job Description (4 columns on lg) */}
          <div className="lg:col-span-4 bg-background-card/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">1. Job Description</h3>
                  <p className="text-[11px] text-slate-400">02_Job_Description.pdf</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Role description, mandatory skills, responsibilities, and experience requirements used as the baseline for all agents.
              </p>
            </div>

            <FileUploadSlot
              label="Job Description PDF"
              sublabel="02_Job_Description.pdf"
              doc={documents.jobDescription}
              onFileSelect={(file) => onUpdateDoc('jobDescription', file)}
              accentColor="indigo"
              iconType="jd"
            />
          </div>

          {/* 2. Candidate A (4 columns on lg) */}
          <div className="lg:col-span-4 bg-background-card/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">2. Candidate A</h3>
                  <p className="text-[11px] text-cyan-400/90 font-medium">Resume & Interview Evidence</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                03_Resume_A.pdf cross-checked against 05_Transcript_A.pdf to evaluate depth and consistency.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <FileUploadSlot
                label="Candidate A Resume"
                sublabel="03_Resume_A.pdf"
                doc={documents.candidateA.resume}
                onFileSelect={(file) => onUpdateDoc('candidateA_resume', file)}
                accentColor="cyan"
                iconType="resume"
              />
              <FileUploadSlot
                label="Candidate A Transcript"
                sublabel="05_Transcript_A.pdf"
                doc={documents.candidateA.transcript}
                onFileSelect={(file) => onUpdateDoc('candidateA_transcript', file)}
                accentColor="cyan"
                iconType="transcript"
              />
            </div>
          </div>

          {/* 3. Candidate B (4 columns on lg) */}
          <div className="lg:col-span-4 bg-background-card/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">3. Candidate B</h3>
                  <p className="text-[11px] text-emerald-400/90 font-medium">Resume & Interview Evidence</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                04_Resume_B.pdf cross-checked against 06_Transcript_B.pdf to evaluate depth and consistency.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <FileUploadSlot
                label="Candidate B Resume"
                sublabel="04_Resume_B.pdf"
                doc={documents.candidateB.resume}
                onFileSelect={(file) => onUpdateDoc('candidateB_resume', file)}
                accentColor="emerald"
                iconType="resume"
              />
              <FileUploadSlot
                label="Candidate B Transcript"
                sublabel="06_Transcript_B.pdf"
                doc={documents.candidateB.transcript}
                onFileSelect={(file) => onUpdateDoc('candidateB_transcript', file)}
                accentColor="emerald"
                iconType="transcript"
              />
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="mt-7 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>
              {isReady
                ? 'All 5 PDF documents are attached. Click below to trigger the 5-stage multi-agent evaluation.'
                : `Attach all 5 PDF files (${5 - docCount} remaining) to enable evaluation.`}
            </span>
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!isReady || isAnalyzing}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg ${
              isReady && !isAnalyzing
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-600 text-white shadow-indigo-600/30 hover:scale-[1.02] cursor-pointer'
                : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Running 5-Stage Multi-Agent Pipeline...</span>
              </>
            ) : isReady ? (
              <>
                <Play className="w-4 h-4 fill-current text-indigo-200" />
                <span>Analyze Candidates</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-slate-500" />
                <span>Analyze Candidates ({docCount}/5 uploaded)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
