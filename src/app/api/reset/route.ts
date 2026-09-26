import { seedDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database successfully reset to initial seed data.',
    });
  } catch (error: any) {
    console.error('API Reset Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset database.' },
      { status: 500 }
    );
  }
}
