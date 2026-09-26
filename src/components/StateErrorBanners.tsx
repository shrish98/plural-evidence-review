'use client';

import {
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Loader2,
  RefreshCw,
  ServerCrash,
} from 'lucide-react';

export function LoadingSkeletonState() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="glass-panel p-6 border border-slate-200 bg-white space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
        <div className="grid grid-cols-4 gap-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 h-96 bg-white border border-slate-200 rounded-xl"></div>
        <div className="glass-panel p-6 h-96 bg-white border border-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}

interface ScoringInProgressBannerProps {
  reportId: string;
  candidateName: string;
}

export function ScoringInProgressBanner({
  reportId,
  candidateName,
}: ScoringInProgressBannerProps) {
  return (
    <div className="glass-panel p-8 border border-orange-200 bg-orange-50/60 text-center space-y-4 max-w-3xl mx-auto my-12 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center mx-auto text-orange-600">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
          State: Scoring In Progress
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          AI Evaluation Pipeline Running for {candidateName}
        </h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          The Plural automated scoring pipeline is currently analyzing candidate session telemetry, prompt interactions, and submitted diffs. Scores will populate automatically upon completion.
        </p>
      </div>

      <div className="p-3 bg-white rounded-lg border border-slate-200 max-w-md mx-auto text-slate-700 font-mono text-xs flex items-center justify-between shadow-2xs">
        <span>Report ID: {reportId}</span>
        <span className="text-orange-600 animate-pulse font-bold">
          Processing telemetry...
        </span>
      </div>
    </div>
  );
}

interface ScoringFailedBannerProps {
  reportId: string;
  errorMessage?: string;
  onRetry: () => void;
}

export function ScoringFailedBanner({
  reportId,
  errorMessage,
  onRetry,
}: ScoringFailedBannerProps) {
  return (
    <div className="glass-panel p-8 border border-red-200 bg-red-50/60 text-center space-y-4 max-w-3xl mx-auto my-12 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-red-100 border border-red-300 flex items-center justify-center mx-auto text-red-600">
        <ServerCrash className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
          State: Scoring Failed
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          AI Scoring Pipeline Encountered a Failure
        </h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          The automated assessment pipeline could not finalize score calculations due to a telemetry processing error. Note: This failure status is explicitly rendered rather than showing a misleading zero score.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-white rounded-lg border border-red-200 text-red-900 font-mono text-xs text-left max-w-lg mx-auto shadow-2xs">
          <div className="font-bold text-red-700 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>Error Trace details:</span>
          </div>
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Report</span>
        </button>
      </div>
    </div>
  );
}

interface InsufficientEvidenceBannerProps {
  reportId: string;
  errorMessage?: string;
}

export function InsufficientEvidenceBanner({
  reportId,
  errorMessage,
}: InsufficientEvidenceBannerProps) {
  return (
    <div className="glass-panel p-8 border border-amber-200 bg-amber-50/60 text-center space-y-4 max-w-3xl mx-auto my-12 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-700">
        <HelpCircle className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          State: Insufficient Session Evidence
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Not Enough Interaction Data To Score Session
        </h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          The candidate completed or ended the work session too quickly, yielding fewer prompt turns than required for evidence scoring.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-white rounded-lg border border-amber-200 text-amber-900 text-xs text-left max-w-lg mx-auto space-y-1 shadow-2xs">
          <div className="font-bold text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Telemetry Advisory:</span>
          </div>
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
