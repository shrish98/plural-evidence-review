'use client';

import { FullReport } from '@/lib/types';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  FileCode,
  HelpCircle,
  Loader2,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';

interface ReportHeaderProps {
  report: FullReport;
  onOpenVerificationModal: (action: 'VERIFIED' | 'REJECTED') => void;
}

export function ReportHeader({ report, onOpenVerificationModal }: ReportHeaderProps) {
  const getStatusBadge = () => {
    switch (report.status) {
      case 'AWAITING_VERIFICATION':
        return {
          label: 'AI scored — awaiting human verification',
          shortLabel: 'Awaiting Human Verification',
          bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          icon: Clock,
        };
      case 'VERIFIED':
        return {
          label: 'Report Verified by Reviewer',
          shortLabel: 'Verified',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          icon: CheckCircle2,
        };
      case 'REJECTED':
        return {
          label: 'Report Rejected by Reviewer',
          shortLabel: 'Rejected',
          bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          icon: XCircle,
        };
      case 'SCORING_IN_PROGRESS':
        return {
          label: 'AI Scoring in Progress...',
          shortLabel: 'Scoring In Progress',
          bgColor: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
          icon: Loader2,
          spin: true,
        };
      case 'SCORING_FAILED':
        return {
          label: 'AI Scoring Failed',
          shortLabel: 'Scoring Failed',
          bgColor: 'bg-red-500/10 border-red-500/30 text-red-300',
          icon: AlertCircle,
        };
      case 'INSUFFICIENT_EVIDENCE':
        return {
          label: 'Insufficient Session Evidence',
          shortLabel: 'Insufficient Evidence',
          bgColor: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
          icon: HelpCircle,
        };
      default:
        return {
          label: report.status,
          shortLabel: report.status,
          bgColor: 'bg-slate-800 border-slate-700 text-slate-300',
          icon: Clock,
        };
    }
  };

  const statusConfig = getStatusBadge();
  const StatusIcon = statusConfig.icon;
  const isAwaitingVerification = report.status === 'AWAITING_VERIFICATION';
  const isReadOnly = report.status === 'VERIFIED' || report.status === 'REJECTED';

  return (
    <header className="glass-panel p-6 border border-slate-200 bg-white shadow-sm space-y-6">
      {/* Top Row: App Title & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500 text-white shadow-sm shadow-orange-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Plural Evidence Review
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200 font-mono font-medium">
              ID: {report.id}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Evidence-backed candidate assessment review & human verification portal
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium shadow-sm ${statusConfig.bgColor}`}
            role="status"
            aria-live="polite"
          >
            <StatusIcon
              className={`w-4 h-4 ${statusConfig.spin ? 'animate-spin' : ''}`}
            />
            <span className="font-semibold">{statusConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Verification Read-Only Banner if already verified/rejected */}
      {isReadOnly && report.verification && (
        <div
          className={`p-4 rounded-lg border text-xs space-y-2 ${
            report.status === 'VERIFIED'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {report.status === 'VERIFIED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                Report Decision: {report.verification.outcome} by{' '}
                {report.verification.reviewerName}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {new Date(report.verification.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200 text-slate-700 italic">
            &ldquo;{report.verification.note}&rdquo;
          </div>
          <p className="text-[11px] text-slate-500">
            This report is locked and read-only. Duplicate verification submissions are automatically prevented.
          </p>
        </div>
      )}

      {/* Candidate & Task Metadata Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-200 text-xs">
        {/* Candidate Card */}
        <div className="bg-orange-50/40 p-3.5 rounded-lg border border-orange-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
            <User className="w-3.5 h-3.5 text-orange-500" />
            <span>Candidate</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">
            {report.candidate.name}
          </div>
          <div className="text-slate-600 text-[11px] truncate">
            {report.candidate.role}
          </div>
          <div className="text-slate-500 font-mono text-[10px] truncate">
            {report.candidate.email}
          </div>
        </div>

        {/* Task Card */}
        <div className="bg-orange-50/40 p-3.5 rounded-lg border border-orange-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
            <FileCode className="w-3.5 h-3.5 text-orange-500" />
            <span>Assigned Task</span>
          </div>
          <div className="font-bold text-slate-900 text-sm truncate" title={report.task.title}>
            {report.task.title}
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-semibold">
              {report.task.complexity} Level
            </span>
            <span className="text-slate-500 text-[11px]">
              {report.task.timeLimitMinutes}m Limit
            </span>
          </div>
        </div>

        {/* Session Stats */}
        <div className="bg-orange-50/40 p-3.5 rounded-lg border border-orange-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>Session Duration</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">
            {report.sessionDuration}
          </div>
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{new Date(report.completedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Controls / Verification Trigger */}
        <div className="bg-orange-50/40 p-3.5 rounded-lg border border-orange-100 flex flex-col justify-center gap-2">
          {isAwaitingVerification ? (
            <>
              <div className="text-[11px] text-slate-600 font-medium">
                Reviewer Actions Needed:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenVerificationModal('VERIFIED')}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-1.5 px-3 rounded-md text-xs shadow-md shadow-orange-500/20 transition flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
                <button
                  onClick={() => onOpenVerificationModal('REJECTED')}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-1.5 px-3 rounded-md text-xs shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-1 text-slate-500 text-[11px]">
              {isReadOnly ? (
                <span className="text-slate-500">Review status is finalized.</span>
              ) : (
                <span className="text-slate-500">Awaiting AI scoring pipeline.</span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
