import '@testing-library/jest-dom';
import {
  InsufficientEvidenceBanner,
  ScoringFailedBanner,
  ScoringInProgressBanner,
} from '@/components/StateErrorBanners';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Product State Rendering Safety Tests', () => {
  it('SCORING FAILED: renders pipeline failure banner with error trace instead of zero scores', () => {
    render(
      <ScoringFailedBanner
        reportId="rpt-scoring-failed"
        errorMessage="Session transcript parsing timed out"
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('State: Scoring Failed')).toBeInTheDocument();
    expect(
      screen.getByText('AI Scoring Pipeline Encountered a Failure')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Session transcript parsing timed out')
    ).toBeInTheDocument();

    // Verify 0 score is not displayed anywhere as a misleading value
    expect(screen.queryByText('0.0 / 5.0')).not.toBeInTheDocument();
  });

  it('INSUFFICIENT EVIDENCE: renders clear session length advisory banner', () => {
    render(
      <InsufficientEvidenceBanner
        reportId="rpt-insufficient-evidence"
        errorMessage="Candidate submitted session within 4 minutes. Less than 2 AI prompt turns detected."
      />
    );

    expect(
      screen.getByText('State: Insufficient Session Evidence')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Not Enough Interaction Data To Score Session')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Less than 2 AI prompt turns detected/)
    ).toBeInTheDocument();
  });

  it('SCORING IN PROGRESS: renders active pipeline processing state', () => {
    render(
      <ScoringInProgressBanner
        reportId="rpt-scoring-in-progress"
        candidateName="Jordan Rivera"
      />
    );

    expect(
      screen.getByText('State: Scoring In Progress')
    ).toBeInTheDocument();
    expect(
      screen.getByText('AI Evaluation Pipeline Running for Jordan Rivera')
    ).toBeInTheDocument();
  });
});
