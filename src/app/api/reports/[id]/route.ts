import { getReportById } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const delay = parseInt(searchParams.get('delay') || '0', 10);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    const report = getReportById(id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: `Report with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error('API Report Fetch Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error while loading report.' },
      { status: 500 }
    );
  }
}
