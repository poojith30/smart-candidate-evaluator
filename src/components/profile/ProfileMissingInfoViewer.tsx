import React from 'react';
import type { MissingInfoItem } from '../../types';
import { EvidenceBadge } from './ProfileBadge';
import { HelpCircle, AlertCircle, MessageSquareQuote } from 'lucide-react';

interface ProfileMissingInfoViewerProps {
  missingInfo: MissingInfoItem[];
}

export const ProfileMissingInfoViewer: React.FC<ProfileMissingInfoViewerProps> = ({ missingInfo }) => {
  if (missingInfo.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
        <p className="text-xs text-emerald-400 font-medium">
          No critical job description gaps detected. All primary baseline topics were addressed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Job Description Criteria with Missing or Unsubstantiated Evidence:</span>
        </div>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {missingInfo.length} Gap{missingInfo.length > 1 ? 's' : ''} Identified
        </span>
      </div>

      <div className="space-y-3.5">
        {missingInfo.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3"
          >
            {/* Header: Topic, Badge, Status */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <EvidenceBadge type="MISSING INFORMATION" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                  {item.topic}
                </h4>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                {item.status}
              </span>
            </div>

            {/* Expected Requirement vs Reason */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-background-darkest/80 border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Expected Job Requirement
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {item.jdRequirement}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background-darkest/80 border border-slate-800/80">
                <span className="text-[10px] font-bold text-rose-400/90 uppercase tracking-wider block mb-1">
                  Extraction Observation
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            </div>

            {/* Suggested Interview Follow-up */}
            <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-2 text-xs text-indigo-300">
              <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-indigo-200">Recommended Follow-up Question:</strong> {item.suggestedClarification}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
