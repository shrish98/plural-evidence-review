import { ReportReviewerClient } from '@/components/ReportReviewerClient';
import { Suspense } from 'react';
import { LoadingSkeletonState } from '@/components/StateErrorBanners';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Plural Evidence Review — Candidate AI Work Session Report',
  description: 'Evidence-backed review portal for AI-assisted work sessions.',
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingSkeletonState />}>
      <ReportReviewerClient initialReportId={id} />
    </Suspense>
  );
}
