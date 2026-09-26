import { getAllReports } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reports = getAllReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error('API List Reports Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reports list.' },
      { status: 500 }
    );
  }
}
