import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Code, 
  Briefcase, 
  GraduationCap, 
  HelpCircle, 
  ShieldAlert, 
  Quote, 
  Sparkles, 
  Layers
} from 'lucide-react';
import type { CandidateDocs, CandidateId, CandidateProfile } from '../types';
import { EvidenceBadge, SourceBadge } from './profile/ProfileBadge';
import { ProfileClaimsViewer } from './profile/ProfileClaimsViewer';
import { ProfileMissingInfoViewer } from './profile/ProfileMissingInfoViewer';
import { ProfileContradictionsViewer } from './profile/ProfileContradictionsViewer';

interface CandidateProfileSectionProps {
  candidateId: CandidateId;
  docs: CandidateDocs;
  title: string;
  profile?: CandidateProfile | null;
}

export const CandidateProfileSection: React.FC<CandidateProfileSectionProps> = ({
  candidateId,
  docs,
  title,
  profile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'skills' | 'claims' | 'missing' | 'contradictions'>('overview');

  const isA = candidateId === 'candidateA';
  const hasResume = Boolean(docs.resume);
  const hasTranscript = Boolean(docs.transcript);

  const badgeTheme = isA
    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  const accentColor = isA ? 'text-cyan-400' : 'text-emerald-400';

  return (
    <div className="bg-background-darker border border-slate-800 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xl">
      {/* Profile Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-xl border ${badgeTheme}`}>
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {profile ? profile.candidateName : `${title} Profile`}
              </h3>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeTheme}`}>
                {isA ? 'Candidate A' : 'Candidate B'}
              </span>
              {profile && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Profile Built
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile 
                ? `Processed: ${profile.rawStats.totalEvidencePoints} evidence data points extracted across documents.`
                : 'Extracted candidate background, competencies, and interview context.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Source Docs:</span>
          <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${
            hasResume ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}>
            Resume: {hasResume ? docs.resume?.name : 'Not provided'}
          </span>
          <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${
            hasTranscript ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}>
            Transcript: {hasTranscript ? docs.transcript?.name : 'Not provided'}
          </span>
        </div>
      </div>

      {/* When Profile IS Built: Sub-Tabs and Full Breakdown View */}
      {profile ? (
        <div className="mt-5 space-y-6">
          {/* Sub Navigation Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'overview'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveSubTab('skills')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'skills'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Skills ({profile.skills.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('claims')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'claims'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Quote className="w-3.5 h-3.5 text-indigo-400" />
              <span>Claims & Evidence ({profile.claims.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('missing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'missing'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Missing Info ({profile.missingInformation.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('contradictions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'contradictions'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Contradictions ({profile.contradictions.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-5">
              {/* Executive Summary Callout */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Extracted Profile Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {profile.summary}
                </p>
              </div>

              {/* Education & Experience Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Education Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span>Education Credentials</span>
                  </div>
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="p-3 rounded-lg bg-background-darkest border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{edu.degree}</span>
                        <EvidenceBadge type={edu.evidenceType} />
                      </div>
                      <p className="text-xs text-slate-400">{edu.institution}</p>
                      {edu.quote && (
                        <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-1.5 rounded border border-slate-800/40">
                          "{edu.quote}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Work Experience Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span>Work & Project Experience</span>
                  </div>
                  {profile.workExperience.map((exp) => (
                    <div key={exp.id} className="p-3 rounded-lg bg-background-darkest border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{exp.role}</span>
                        <SourceBadge source={exp.source} />
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-500 mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & TECHNICAL MATRIX */}
          {activeSubTab === 'skills' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {profile.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-200">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {skill.category}
                        </span>
                      </div>
                      <EvidenceBadge type={skill.evidenceType} />
                    </div>

                    <div className="flex items-center gap-2">
                      <SourceBadge source={skill.source} />
                      <span className="text-[11px] text-slate-400">
                        {skill.statusNote}
                      </span>
                    </div>

                    {skill.quotes.length > 0 && (
                      <div className="p-2 rounded bg-background-darkest border border-slate-800 text-[11px] text-slate-300 italic">
                        <Quote className="w-3 h-3 text-indigo-400 inline mr-1" />
                        "{skill.quotes[0].quote}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLAIMS & EVIDENCE */}
          {activeSubTab === 'claims' && (
            <ProfileClaimsViewer claims={profile.claims} />
          )}

          {/* TAB 4: MISSING INFORMATION */}
          {activeSubTab === 'missing' && (
            <ProfileMissingInfoViewer missingInfo={profile.missingInformation} />
          )}

          {/* TAB 5: CONTRADICTIONS */}
          {activeSubTab === 'contradictions' && (
            <ProfileContradictionsViewer contradictions={profile.contradictions} />
          )}
        </div>
      ) : (
        /* When Profile is NOT yet built: Clean Ready Placeholder */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
              <Award className={`w-4 h-4 ${accentColor}`} />
              <span>Claimed Experience & Education</span>
            </div>
            <div className="space-y-2 mt-3">
              <div className="h-4 bg-slate-800/80 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-800/50 rounded animate-pulse w-full" />
              <div className="h-3 bg-slate-800/50 rounded animate-pulse w-5/6" />
            </div>
            <p className="text-[11px] text-slate-500 italic mt-3">
              Attach PDFs and click "Analyze Candidates" to trigger the Candidate Profile Builder.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
              <Code className={`w-4 h-4 ${accentColor}`} />
              <span>Extracted Skills & Competencies</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['Skills & Evidence', 'Resume vs Transcript', 'Exact Quoted Citations', 'Source Tracking'].map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic mt-3">
              Distinguishes FACT / DIRECT EVIDENCE from CANDIDATE CLAIM.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
              <ShieldAlert className={`w-4 h-4 text-rose-400`} />
              <span>Gaps & Contradictions</span>
            </div>
            <div className="space-y-2 mt-3">
              <div className="h-4 bg-slate-800/80 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-slate-800/50 rounded animate-pulse w-4/5" />
            </div>
            <p className="text-[11px] text-slate-500 italic mt-3">
              Flags "Insufficient evidence" against Job Description and inconsistencies.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
