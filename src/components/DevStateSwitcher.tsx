'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  FileQuestion,
  HelpCircle,
  Loader2,
  RotateCcw,
  Sliders,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface DevStateSwitcherProps {
  currentReportId: string;
  onSelectReportId: (id: string) => void;
  isSimulatingLoading: boolean;
  onToggleSimulateLoading: (value: boolean) => void;
  isSimulatingSaveFailure: boolean;
  onToggleSimulateSaveFailure: (value: boolean) => void;
  onResetDatabase: () => Promise<void>;
}

export function DevStateSwitcher({
  currentReportId,
  onSelectReportId,
  isSimulatingLoading,
  onToggleSimulateLoading,
  isSimulatingSaveFailure,
  onToggleSimulateSaveFailure,
  onResetDatabase,
}: DevStateSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const STATE_PRESETS = [
    {
      id: 'rpt-001',
      label: '5. Complete (Awaiting Verification)',
      badge: 'Default Seed',
      icon: Clock,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      id: 'rpt-verified-demo',
      label: '6. Verified State (Read-only)',
      badge: 'Verified',
      icon: CheckCircle2,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      id: 'rpt-rejected-demo',
      label: '7. Rejected State (Read-only)',
      badge: 'Rejected',
      icon: XCircle,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      id: 'rpt-scoring-in-progress',
      label: '2. Scoring In Progress',
      badge: 'Processing',
      icon: Loader2,
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    },
    {
      id: 'rpt-scoring-failed',
      label: '3. Scoring Failed',
      badge: 'Pipeline Error',
      icon: AlertCircle,
      color: 'text-red-400 border-red-500/30 bg-red-500/10',
    },
    {
      id: 'rpt-insufficient-evidence',
      label: '4. Insufficient Evidence',
      badge: 'Short Session',
      icon: HelpCircle,
      color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    },
    {
      id: 'rpt-orphaned',
      label: '9. Unavailable Content Link',
      badge: 'Orphaned ID',
      icon: FileQuestion,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
  ];

  const handleReset = async () => {
    setIsResetting(true);
    await onResetDatabase();
    setIsResetting(false);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs px-4 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Dev Switcher Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-100">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Reviewer Dev Switcher</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-expanded={isOpen}
            aria-label="Toggle state switcher menu"
          >
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span>Select Product State</span>
          </button>
        </div>

        {/* Center: Quick Presets */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-0.5">
          {STATE_PRESETS.map((preset) => {
            const isSelected = currentReportId === preset.id && !isSimulatingLoading;
            const IconComponent = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onToggleSimulateLoading(false);
                  onSelectReportId(preset.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  isSelected
                    ? `${preset.color} font-semibold ring-1 ring-orange-500`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <IconComponent className="w-3 h-3" />
                <span>{preset.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Simulation Toggles & Reset DB */}
        <div className="flex items-center gap-3">
          {/* Simulate Loading Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none">
            <input
              type="checkbox"
              checked={isSimulatingLoading}
              onChange={(e) => onToggleSimulateLoading(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-orange-500 focus:ring-orange-500"
            />
            <span>1. Loading State</span>
          </label>

          {/* Simulate Save Fail Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none">
            <input
              type="checkbox"
              checked={isSimulatingSaveFailure}
              onChange={(e) => onToggleSimulateSaveFailure(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-rose-500"
            />
            <span>8. Save Fail (500)</span>
          </label>

          {/* Reset DB Button */}
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 bg-orange-950/40 hover:bg-orange-900/60 border border-orange-700/50 text-orange-300 px-2.5 py-1 rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50"
            title="Reset SQLite database to clean seed state"
          >
            {isResetting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
            )}
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Expanded Preset Drawer */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {STATE_PRESETS.map((preset) => {
            const isSelected = currentReportId === preset.id && !isSimulatingLoading;
            const IconComponent = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onToggleSimulateLoading(false);
                  onSelectReportId(preset.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition ${
                  isSelected
                    ? `${preset.color} ring-1 ring-orange-500`
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-xs">{preset.label}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-400">
                  {preset.id}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
