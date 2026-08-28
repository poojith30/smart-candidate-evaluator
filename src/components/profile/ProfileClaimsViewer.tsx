import React, { useState } from 'react';
import type { CandidateClaim } from '../../types';
import { EvidenceBadge, SourceBadge } from './ProfileBadge';
import { Quote, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProfileClaimsViewerProps {
  claims: CandidateClaim[];
}

export const ProfileClaimsViewer: React.FC<ProfileClaimsViewerProps> = ({ claims }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredClaims = claims.filter((claim) => {
    if (filterType === 'all') return true;
    if (filterType === 'fact') return claim.evidenceType === 'FACT / DIRECT EVIDENCE';
    if (filterType === 'claim') return claim.evidenceType === 'CANDIDATE CLAIM';
    return true;
  });

  if (claims.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          No explicit high-impact claims extracted yet from candidate documents.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Filter Claims:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({claims.length})
            </button>
            <button
              onClick={() => setFilterType('fact')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'fact'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Direct Evidence ({claims.filter(c => c.evidenceType === 'FACT / DIRECT EVIDENCE').length})
            </button>
            <button
              onClick={() => setFilterType('claim')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'claim'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candidate Claims ({claims.filter(c => c.evidenceType === 'CANDIDATE CLAIM').length})
            </button>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-3.5">
        {filteredClaims.map((claim) => (
          <div
            key={claim.id}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3"
          >
            {/* Header: Badges & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <EvidenceBadge type={claim.evidenceType} />
                <SourceBadge source={claim.source} />
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {claim.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                {claim.verificationStatus === 'Corroborated by Transcript' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Corroborated in Interview
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Unverified Resume Claim
                  </span>
                )}
              </div>
            </div>

            {/* Claim Statement */}
            <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
              "{claim.claimText}"
            </p>

            {/* Quoted Citations */}
            {claim.quotes && claim.quotes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Exact Supporting Quotes
                </span>
                <div className="space-y-1.5">
                  {claim.quotes.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-background-darkest/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <Quote className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 overflow-hidden">
                        <p className="italic text-slate-300 leading-normal">
                          "{q.quote}"
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                          <span>Source: {q.source}</span>
                          {q.sectionOrSpeaker && <span>• {q.sectionOrSpeaker}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Note */}
            <p className="text-[11px] text-slate-400 bg-slate-950/40 px-2.5 py-1.5 rounded-md border border-slate-800/40">
              <strong className="text-slate-300">Evidence Assessment:</strong> {claim.supportingEvidence}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
