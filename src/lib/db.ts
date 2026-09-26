import fs from 'fs';
import path from 'path';
import { INITIAL_REPORTS } from './seed-data';
import { FullReport, VerificationRecord, VerifyReportPayload } from './types';

const DB_FILE_PATH = process.env.DATABASE_FILE || path.join(process.cwd(), 'plural_db.json');

export interface DatabaseSchema {
  reports: FullReport[];
}

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initial: DatabaseSchema = { reports: INITIAL_REPORTS };
      writeDb(initial);
      return initial;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading database file, re-initializing:', err);
    const initial: DatabaseSchema = { reports: INITIAL_REPORTS };
    writeDb(initial);
    return initial;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
    throw err;
  }
}

export function initDb(): void {
  readDb();
}

export function seedDatabase(): void {
  const data: DatabaseSchema = {
    // Clone deep to prevent reference mutations
    reports: JSON.parse(JSON.stringify(INITIAL_REPORTS)),
  };
  writeDb(data);
}

export function getAllReports(): { id: string; candidateName: string; taskTitle: string; status: string }[] {
  const db = readDb();
  return db.reports.map((r) => ({
    id: r.id,
    candidateName: r.candidate.name,
    taskTitle: r.task.title,
    status: r.status,
  }));
}

export function getReportById(reportId: string): FullReport | null {
  const db = readDb();
  const report = db.reports.find((r) => r.id === reportId);
  return report ? JSON.parse(JSON.stringify(report)) : null;
}

/**
 * IDEMPOTENT VERIFICATION SUBMISSION
 * Enforces single verification decision per report.
 * Safe against retries & duplicate network requests.
 */
export function submitVerification(
  reportId: string,
  payload: VerifyReportPayload
): { success: boolean; verification?: VerificationRecord; alreadySubmitted?: boolean; error?: string } {
  const db = readDb();
  const reportIndex = db.reports.findIndex((r) => r.id === reportId);

  if (reportIndex === -1) {
    return { success: false, error: `Report with ID '${reportId}' not found.` };
  }

  const report = db.reports[reportIndex];

  // 1. Check existing verification record (Idempotency check)
  if (report.verification) {
    return {
      success: true,
      verification: report.verification,
      alreadySubmitted: true,
    };
  }

  // 2. Validate current report state
  if (report.status !== 'AWAITING_VERIFICATION') {
    return {
      success: false,
      error: `Cannot verify report currently in '${report.status}' state.`,
    };
  }

  // 3. Create verification record
  const verificationRecord: VerificationRecord = {
    id: `ver-${Date.now()}`,
    reportId,
    outcome: payload.outcome,
    reviewerName: payload.reviewerName.trim(),
    note: payload.note.trim(),
    createdAt: new Date().toISOString(),
  };

  // 4. Atomic state update
  report.verification = verificationRecord;
  report.status = payload.outcome;
  report.updatedAt = verificationRecord.createdAt;

  db.reports[reportIndex] = report;
  writeDb(db);

  return {
    success: true,
    verification: verificationRecord,
    alreadySubmitted: false,
  };
}
