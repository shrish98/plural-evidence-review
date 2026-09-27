'use client';

import { DimensionType, EvidenceItem } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  CornerDownRight,
  Filter,
  MessageSquare,
  MinusCircle,
  PlusCircle,
  Search,
  Sparkles,
  GitCommit,
} from 'lucide-react';
import { useState } from 'react';

interface EvidenceExplorerProps {
  evidenceItems: EvidenceItem[];
  selectedEvidenceId: string | null;
  onSelectEvidence: (evidence: EvidenceItem) => void;
  selectedDimensionFilter: DimensionType | 'all';
  onSelectDimensionFilter: (dim: DimensionType | 'all') => void;
}

export function EvidenceExplorer({
  evidenceItems,
  selectedEvidenceId,
  onSelectEvidence,
  selectedDimensionFilter,
  onSelectDimensionFilter,
}: EvidenceExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const filteredItems = evidenceItems.filter((item) => {
    // Dimension Filter
    if (selectedDimensionFilter !== 'all' && item.dimension !== selectedDimensionFilter) {
      return false;
    }
    // Impact Filter
    if (impactFilter !== 'all' && item.scoreImpact !== impactFilter) {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchExp = item.explanation.toLowerCase().includes(q);
      const matchSnippet = item.snippet?.toLowerCase().includes(q) || false;
      return matchTitle || matchExp || matchSnippet;
    }
    return true;
  });

  const getDimensionBadgeClass = (dim: DimensionType) => {
    switch (dim) {
      case 'delegation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'description':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'discernment':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'diligence':
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-slate-900">Evidence Explorer</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-mono font-semibold border border-orange-200">
              {evidenceItems.length} Scored Behaviors
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Select an evidence item below to deep-link, scroll, and highlight its transcript or draft context.
          </p>
        </div>
      </div>

      {/* Filter Toolbar: Dimensions, Impact, Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        {/* Dimension Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-slate-500 font-medium flex items-center gap-1 pr-1 text-[11px]">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Dimension:</span>
          </span>

          {(['all', 'delegation', 'description', 'discernment', 'diligence'] as const).map(
            (dim) => (
              <button
                key={dim}
                onClick={() => onSelectDimensionFilter(dim)}
                className={`px-2.5 py-1 rounded-md border capitalize text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  selectedDimensionFilter === dim
                    ? 'bg-orange-600 border-orange-500 text-white font-semibold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {dim}
              </button>
            )
          )}
        </div>

        {/* Impact Filters & Search Bar */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Impact Toggle */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm">
            {(['all', 'positive', 'negative'] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setImpactFilter(imp)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize transition ${
                  impactFilter === imp
                    ? 'bg-orange-100 text-orange-900 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {imp}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Evidence Items List */}
      <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
            No evidence items match the selected filter criteria.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedEvidenceId === item.id;
            const isPositive = item.scoreImpact === 'positive';

            return (
              <div
                key={item.id}
                id={`evidence-card-${item.id}`}
                onClick={() => onSelectEvidence(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectEvidence(item);
                  }
                }}
                className={`p-4 rounded-xl border text-xs transition cursor-pointer select-none space-y-3 ${
                  isSelected
                    ? 'bg-orange-50/60 border-orange-500 ring-2 ring-orange-500/30 shadow-md'
                    : 'bg-white border-slate-200 hover:bg-orange-50/20 hover:border-orange-200 shadow-sm'
                }`}
              >
                {/* Evidence Item Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Score Impact Pill */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border font-mono ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {isPositive ? (
                          <PlusCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <MinusCircle className="w-3 h-3 text-rose-600" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}
                          {item.scoreDelta.toFixed(1)} impact
                        </span>
                      </span>

                      {/* Dimension Tag */}
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] font-semibold capitalize font-mono ${getDimensionBadgeClass(
                          item.dimension
                        )}`}
                      >
                        {item.dimension}
                      </span>

                      {/* Orphaned State Warning Badge */}
                      {item.isOrphaned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Target Content Unavailable</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 pt-1">
                      <span>{item.title}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-orange-600 text-white font-semibold px-1.5 py-0.2 rounded font-mono">
                          Active Selection
                        </span>
                      )}
                    </h4>
                  </div>

                  {/* Target Pointer Link Badge */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-orange-800 bg-orange-100/80 px-2 py-1 rounded border border-orange-200 font-semibold">
                      {item.targetType === 'message' ? (
                        <MessageSquare className="w-3 h-3 text-orange-600" />
                      ) : (
                        <GitCommit className="w-3 h-3 text-orange-600" />
                      )}
                      <span>
                        {item.targetType}: {item.targetId}
                      </span>
                      <CornerDownRight className="w-3 h-3 text-orange-600" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-slate-700 leading-relaxed text-xs">
                  {item.explanation}
                </p>

                {/* Target Snippet Preview if present */}
                {item.snippet && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 font-mono text-[11px] italic truncate">
                    &ldquo;{item.snippet}&rdquo;
                  </div>
                )}

                {/* Navigation CTA footer */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Logged at {item.timestamp}</span>
                  </span>

                  <span className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
                    <span>Jump to context</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
