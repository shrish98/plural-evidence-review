'use client';

import { DraftRevision } from '@/lib/types';
import { GitCommit, History } from 'lucide-react';

interface RevisionDiffViewerProps {
  revisions: DraftRevision[];
  highlightedTargetId: string | null;
}

export function RevisionDiffViewer({
  revisions,
  highlightedTargetId,
}: RevisionDiffViewerProps) {
  if (!revisions || revisions.length === 0) {
    return (
      <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm">
        <div className="text-center py-8 text-slate-500 text-xs">
          No draft revisions recorded for this session.
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-bold text-slate-900">Draft Iteration Revisions</h3>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium">
            {revisions.length} Iterations
          </span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
        {revisions.map((rev) => {
          const isHighlighted = highlightedTargetId === rev.id;

          return (
            <div
              key={rev.id}
              id={`rev-${rev.id}`}
              tabIndex={-1}
              className={`p-4 rounded-xl border text-xs transition space-y-3 focus:outline-none ${
                isHighlighted
                  ? 'evidence-target-highlighted ring-2 ring-orange-500'
                  : 'bg-white border-slate-200 shadow-xs hover:border-orange-200'
              }`}
            >
              {/* Revision Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-orange-100 border border-orange-200 text-orange-600">
                    <GitCommit className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{rev.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200 font-mono font-semibold">
                        v{rev.version}
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs">{rev.description}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded border border-emerald-300">
                    {rev.diffSummary}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {rev.timestamp}
                  </span>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto shadow-xs">
                <pre>{rev.code}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
