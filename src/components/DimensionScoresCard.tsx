'use client';

import { DimensionScore, DimensionType } from '@/lib/types';
import {
  Brain,
  CheckCircle,
  Eye,
  FileText,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react';

interface DimensionScoresCardProps {
  scores: DimensionScore[];
  selectedDimension: DimensionType | 'all';
  onSelectDimension: (dimension: DimensionType | 'all') => void;
}

export function DimensionScoresCard({
  scores,
  selectedDimension,
  onSelectDimension,
}: DimensionScoresCardProps) {
  if (!scores || scores.length === 0) {
    return null;
  }

  const getDimensionMeta = (dim: DimensionType) => {
    switch (dim) {
      case 'delegation':
        return {
          title: 'Delegation',
          subtitle: 'Task decomposition & sub-problem prompt partitioning',
          icon: Target,
          accentColor: 'border-orange-200 bg-orange-100 text-orange-700',
          barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
        };
      case 'description':
        return {
          title: 'Description',
          subtitle: 'Prompt clarity, precision & technical constraint framing',
          icon: FileText,
          accentColor: 'border-amber-200 bg-amber-100 text-amber-700',
          barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
        };
      case 'discernment':
        return {
          title: 'Discernment',
          subtitle: 'Critical evaluation & bug catching in AI-generated code',
          icon: Eye,
          accentColor: 'border-orange-200 bg-orange-100 text-orange-700',
          barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
        };
      case 'diligence':
        return {
          title: 'Diligence',
          subtitle: 'Resiliency testing, edge-case validation & quality control',
          icon: Brain,
          accentColor: 'border-amber-200 bg-amber-100 text-amber-700',
          barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
        };
    }
  };

  const getScoreDescriptor = (val: number) => {
    if (val >= 4.5) return { label: 'Exceptional', symbol: '★★★★★' };
    if (val >= 4.0) return { label: 'Strong', symbol: '★★★★☆' };
    if (val >= 3.0) return { label: 'Proficient', symbol: '★★★☆☆' };
    if (val >= 2.0) return { label: 'Developing', symbol: '★★☆☆☆' };
    return { label: 'Needs Improvement', symbol: '★☆☆☆☆' };
  };

  const averageScore = (
    scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length
  ).toFixed(1);

  return (
    <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm space-y-6">
      {/* Header & Overall Rating */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-slate-900">Dimension Scores</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold border border-orange-200">
              Scale 0.0 – 5.0
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Click any dimension card below to filter evidence items in the explorer.
          </p>
        </div>

        {/* Aggregate Score Meter */}
        <div className="flex items-center gap-3 bg-orange-50/80 px-4 py-2 rounded-xl border border-orange-200/80">
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-600">
              Overall AI-Assisted Rating
            </div>
            <div className="text-xs text-orange-700 font-bold font-mono">
              {getScoreDescriptor(parseFloat(averageScore)).label}
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-orange-600">
            {averageScore}
            <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
          </div>
        </div>
      </div>

      {/* 4 Dimension Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scores.map((s) => {
          const meta = getDimensionMeta(s.dimension);
          const IconComp = meta.icon;
          const descriptor = getScoreDescriptor(s.score);
          const isSelected = selectedDimension === s.dimension;
          const percentage = (s.score / 5.0) * 100;

          return (
            <div
              key={s.id}
              onClick={() =>
                onSelectDimension(isSelected ? 'all' : s.dimension)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDimension(isSelected ? 'all' : s.dimension);
                }
              }}
              className={`p-4 rounded-xl border text-xs transition cursor-pointer select-none space-y-3 ${
                isSelected
                  ? 'bg-orange-50/60 border-orange-500 ring-2 ring-orange-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:bg-orange-50/30 hover:border-orange-200 shadow-sm'
              }`}
            >
              {/* Card Top Row: Title, Icon, Numeric Score */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg border ${meta.accentColor}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{meta.title}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-orange-600 text-white font-semibold px-1.5 py-0.2 rounded font-mono">
                          Filtered
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {meta.subtitle}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold font-mono text-slate-900">
                    {s.score.toFixed(1)}
                    <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
                  </div>
                  <div className="text-[10px] font-mono text-amber-600 font-semibold">
                    {descriptor.symbol} {descriptor.label}
                  </div>
                </div>
              </div>

              {/* Score Visual Bar Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Score Progress</span>
                  <span className="font-semibold text-orange-600">{percentage.toFixed(0)}%</span>
                </div>
                <div
                  className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200"
                  role="progressbar"
                  aria-valuenow={s.score}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-label={`${meta.title} score ${s.score} out of 5`}
                >
                  <div
                    className={`h-full ${meta.barColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Short Observation Text */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                  <span>Observation</span>
                </div>
                <p className="leading-relaxed text-slate-700">{s.observation}</p>
              </div>

              {/* Key Takeaway */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="truncate font-medium">{s.keyTakeaway}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
