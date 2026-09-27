'use client';

import { DimensionType, EvidenceItem, FullReport } from '@/lib/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { DevStateSwitcher } from './DevStateSwitcher';
import { DimensionScoresCard } from './DimensionScoresCard';
import { EvidenceExplorer } from './EvidenceExplorer';
import { FinalArtifactViewer } from './FinalArtifactViewer';
import { ReportHeader } from './ReportHeader';
import { RevisionDiffViewer } from './RevisionDiffViewer';
import {
  InsufficientEvidenceBanner,
  LoadingSkeletonState,
  ScoringFailedBanner,
  ScoringInProgressBanner,
} from './StateErrorBanners';
import { TranscriptViewer } from './TranscriptViewer';
import { VerificationModal } from './VerificationModal';

interface ReportReviewerClientProps {
  initialReportId: string;
}

export function ReportReviewerClient({ initialReportId }: ReportReviewerClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State Management
  const [reportId, setReportId] = useState<string>(initialReportId);
  const [report, setReport] = useState<FullReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dev Switcher Simulation Controls
  const [isSimulatingLoading, setIsSimulatingLoading] = useState<boolean>(false);
  const [isSimulatingSaveFailure, setIsSimulatingSaveFailure] = useState<boolean>(false);

  // Evidence Explorer Controls & Filter State
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    searchParams.get('evidence')
  );
  const [selectedDimensionFilter, setSelectedDimensionFilter] = useState<
    DimensionType | 'all'
  >('all');

  // Verification Modal State
  const [verificationModalAction, setVerificationModalAction] = useState<
    'VERIFIED' | 'REJECTED' | null
  >(null);

  // 1. Fetch Report Data
  const fetchReport = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/reports/${id}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || `Failed to load report '${id}'.`);
        setReport(null);
      } else {
        setReport(json.data);
      }
    } catch (err: any) {
      console.error('Fetch Error:', err);
      setError('Network error while connecting to backend API.');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On reportId change
  useEffect(() => {
    fetchReport(reportId);
  }, [reportId, fetchReport]);

  // Helper to scroll & focus target element
  const scrollToTarget = useCallback((evidence: EvidenceItem) => {
    if (evidence.targetId && !evidence.isOrphaned) {
      setTimeout(() => {
        const prefix = evidence.targetType === 'message' ? 'msg-' : 'rev-';
        const targetElement = document.getElementById(`${prefix}${evidence.targetId}`);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElement.focus();
        }
      }, 150);
    }
  }, []);

  // 2. URL State & Evidence Selection Sync Handler
  const handleSelectEvidence = (evidence: EvidenceItem) => {
    setSelectedEvidenceId(evidence.id);

    // Update URL query parameter without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('evidence', evidence.id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    // Scroll & focus target element
    scrollToTarget(evidence);
  };

  // Sync state if URL evidence query param changes directly (e.g., refresh or browser back)
  useEffect(() => {
    const evidenceFromUrl = searchParams.get('evidence');
    if (evidenceFromUrl && evidenceFromUrl !== selectedEvidenceId) {
      setSelectedEvidenceId(evidenceFromUrl);
    }
  }, [searchParams, selectedEvidenceId]);

  // Restore scroll & focus on mount/refresh when report finishes loading and selectedEvidenceId is set
  useEffect(() => {
    if (!isLoading && report && selectedEvidenceId) {
      const activeEv = report.evidenceItems.find((e) => e.id === selectedEvidenceId);
      if (activeEv) {
        scrollToTarget(activeEv);
      }
    }
  }, [isLoading, report, selectedEvidenceId, scrollToTarget]);

  // 3. Reset Database Handler
  const handleResetDatabase = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchReport(reportId);
    } catch (err) {
      console.error('Reset Failed:', err);
    }
  };

  // 4. Handle Verification Success
  const handleVerificationSuccess = (verificationRecord: any) => {
    if (report) {
      setReport({
        ...report,
        status: verificationRecord.outcome,
        verification: verificationRecord,
        updatedAt: verificationRecord.createdAt,
      });
    }
  };

  // Calculate highlighted target ID from active evidence selection
  const activeEvidence = report?.evidenceItems.find((e) => e.id === selectedEvidenceId);
  const highlightedTargetId = activeEvidence ? activeEvidence.targetId : null;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans pb-16 selection:bg-orange-500 selection:text-white">
      {/* Dev State Switcher Floating Banner */}
      <DevStateSwitcher
        currentReportId={reportId}
        onSelectReportId={(id) => {
          setReportId(id);
          setSelectedEvidenceId(null);
          // Update URL path
          router.push(`/report/${id}`);
        }}
        isSimulatingLoading={isSimulatingLoading}
        onToggleSimulateLoading={setIsSimulatingLoading}
        isSimulatingSaveFailure={isSimulatingSaveFailure}
        onToggleSimulateSaveFailure={setIsSimulatingSaveFailure}
        onResetDatabase={handleResetDatabase}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* State 1: Loading State */}
        {(isLoading || isSimulatingLoading) && <LoadingSkeletonState />}

        {/* State 3: Scoring Failed */}
        {!isLoading && !isSimulatingLoading && report?.status === 'SCORING_FAILED' && (
          <ScoringFailedBanner
            reportId={report.id}
            errorMessage={report.errorMessage}
            onRetry={() => fetchReport(reportId)}
          />
        )}

        {/* State 2: Scoring In Progress */}
        {!isLoading && !isSimulatingLoading && report?.status === 'SCORING_IN_PROGRESS' && (
          <ScoringInProgressBanner
            reportId={report.id}
            candidateName={report.candidate.name}
          />
        )}

        {/* State 4: Insufficient Evidence */}
        {!isLoading && !isSimulatingLoading && report?.status === 'INSUFFICIENT_EVIDENCE' && (
          <InsufficientEvidenceBanner
            reportId={report.id}
            errorMessage={report.errorMessage}
          />
        )}

        {/* State 5, 6, 7, 9: Standard Reviewable Report View */}
        {!isLoading &&
          !isSimulatingLoading &&
          report &&
          report.status !== 'SCORING_FAILED' &&
          report.status !== 'SCORING_IN_PROGRESS' &&
          report.status !== 'INSUFFICIENT_EVIDENCE' && (
            <>
              {/* Report Header */}
              <ReportHeader
                report={report}
                onOpenVerificationModal={(action) =>
                  setVerificationModalAction(action)
                }
              />

              {/* Top Grid: Dimension Scores & Final Artifact */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Dimension Scores Card */}
                <DimensionScoresCard
                  scores={report.dimensionScores}
                  selectedDimension={selectedDimensionFilter}
                  onSelectDimension={(dim) => setSelectedDimensionFilter(dim)}
                />

                {/* 2. Final Submitted Artifact Viewer */}
                <FinalArtifactViewer artifact={report.finalArtifact} />
              </div>

              {/* Main Section: Evidence Explorer & Deep-Linked Content Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Evidence Explorer (Left/Top Column, 5 cols) */}
                <div className="lg:col-span-5 sticky top-16">
                  <EvidenceExplorer
                    evidenceItems={report.evidenceItems}
                    selectedEvidenceId={selectedEvidenceId}
                    onSelectEvidence={handleSelectEvidence}
                    selectedDimensionFilter={selectedDimensionFilter}
                    onSelectDimensionFilter={(dim) =>
                      setSelectedDimensionFilter(dim)
                    }
                  />
                </div>

                {/* Target Content Feed: Transcript & Draft Revisions (Right Column, 7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Candidate Conversation Transcript */}
                  <TranscriptViewer
                    messages={report.conversationMessages}
                    highlightedTargetId={highlightedTargetId}
                  />

                  {/* Draft Iteration Revisions */}
                  <RevisionDiffViewer
                    revisions={report.draftRevisions}
                    highlightedTargetId={highlightedTargetId}
                  />
                </div>
              </div>
            </>
          )}

        {/* Generic Error Fallback */}
        {!isLoading && !isSimulatingLoading && error && !report && (
          <div className="glass-panel p-8 text-center text-rose-700 border border-rose-200 bg-rose-50 space-y-4 my-12">
            <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
            <p className="text-xs text-slate-600">{error}</p>
            <button
              onClick={() => fetchReport(reportId)}
              className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-500 shadow-md transition"
            >
              Retry Loading
            </button>
          </div>
        )}
      </main>

      {/* Verification Modal Dialog */}
      {verificationModalAction && report && (
        <VerificationModal
          isOpen={Boolean(verificationModalAction)}
          action={verificationModalAction}
          reportId={report.id}
          candidateName={report.candidate.name}
          onClose={() => setVerificationModalAction(null)}
          onSuccess={handleVerificationSuccess}
          isSimulatingSaveFailure={isSimulatingSaveFailure}
        />
      )}
    </div>
  );
}
