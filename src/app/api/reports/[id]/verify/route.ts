import { submitVerification } from '@/lib/db';
import { VerifyReportPayload } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Simulation switch for testing save failure & retry UI
    if (searchParams.get('simulateFailure') === 'true') {
      return NextResponse.json(
        {
          success: false,
          error: 'Simulated Network Failure: Database transaction timed out. Please click Retry.',
        },
        { status: 500 }
      );
    }

    const body: VerifyReportPayload = await request.json();

    // 1. Input Validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload.' },
        { status: 400 }
      );
    }

    if (!['VERIFIED', 'REJECTED'].includes(body.outcome)) {
      return NextResponse.json(
        { success: false, error: "Outcome must be either 'VERIFIED' or 'REJECTED'." },
        { status: 400 }
      );
    }

    if (!body.reviewerName || body.reviewerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Reviewer name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    if (!body.note || body.note.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Verification note is required (minimum 5 characters).' },
        { status: 400 }
      );
    }

    // 2. Submit Verification via Idempotent DB handler
    const result = submitVerification(id, {
      outcome: body.outcome,
      reviewerName: body.reviewerName,
      note: body.note,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to record decision.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.verification,
      alreadySubmitted: result.alreadySubmitted,
      message: result.alreadySubmitted
        ? 'Report was already verified. Returned existing record.'
        : `Report successfully ${body.outcome.toLowerCase()}.`,
    });
  } catch (error: any) {
    console.error('API Verification Submit Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing verification.' },
      { status: 500 }
    );
  }
}
