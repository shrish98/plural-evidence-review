import { getReportById, seedDatabase, submitVerification } from '@/lib/db';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Backend Verification & Idempotency API Unit Tests', () => {
  beforeEach(() => {
    // Reset DB before each test
    seedDatabase();
  });

  it('should successfully submit a verification decision for an awaiting report', () => {
    const reportId = 'rpt-001';
    const initialReport = getReportById(reportId);
    expect(initialReport?.status).toBe('AWAITING_VERIFICATION');
    expect(initialReport?.verification).toBeNull();

    const result = submitVerification(reportId, {
      outcome: 'VERIFIED',
      reviewerName: 'Shrishti',
      note: 'Verified: High quality candidate with excellent Redis discernment.',
    });

    expect(result.success).toBe(true);
    expect(result.alreadySubmitted).toBe(false);
    expect(result.verification?.outcome).toBe('VERIFIED');
    expect(result.verification?.reviewerName).toBe('Shrishti');

    // Verify DB state updated
    const updatedReport = getReportById(reportId);
    expect(updatedReport?.status).toBe('VERIFIED');
    expect(updatedReport?.verification?.note).toContain('Redis discernment');
  });

  it('IDEMPOTENCY: retrying verification on an already verified report must return existing record without creating duplicate entries', () => {
    const reportId = 'rpt-001';

    // First submission
    const firstSubmit = submitVerification(reportId, {
      outcome: 'VERIFIED',
      reviewerName: 'Shrishti',
      note: 'Initial verification decision.',
    });
    expect(firstSubmit.success).toBe(true);
    expect(firstSubmit.alreadySubmitted).toBe(false);

    // Retry submission (Simulating duplicate network retry)
    const secondSubmit = submitVerification(reportId, {
      outcome: 'VERIFIED',
      reviewerName: 'Shrishti',
      note: 'Duplicate retry submission.',
    });

    expect(secondSubmit.success).toBe(true);
    expect(secondSubmit.alreadySubmitted).toBe(true);
    expect(secondSubmit.verification?.id).toBe(firstSubmit.verification?.id);
    expect(secondSubmit.verification?.note).toBe('Initial verification decision.');
  });

  it('should prevent verification on non-awaiting states like SCORING_FAILED', () => {
    const result = submitVerification('rpt-scoring-failed', {
      outcome: 'VERIFIED',
      reviewerName: 'Hullas',
      note: 'Attempting invalid verify.',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot verify report');
  });
});
