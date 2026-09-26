export type ReportStatus =
  | 'SCORING_IN_PROGRESS'
  | 'SCORING_FAILED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'AWAITING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED';

export type DimensionType = 'delegation' | 'description' | 'discernment' | 'diligence';

export interface CandidateInfo {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface TaskInfo {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  complexity: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export interface DimensionScore {
  id: string;
  reportId: string;
  dimension: DimensionType;
  score: number; // 0.0 to 5.0
  observation: string;
  keyTakeaway: string;
}

export interface FinalArtifact {
  id: string;
  reportId: string;
  title: string;
  filename: string;
  language: string;
  content: string;
  summary: string;
  linesOfCode: number;
}

export interface ConversationMessage {
  id: string;
  reportId: string;
  role: 'user' | 'assistant';
  timestamp: string;
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  model?: string;
}

export interface DraftRevision {
  id: string;
  reportId: string;
  version: number;
  timestamp: string;
  title: string;
  description: string;
  code: string;
  diffSummary: string; // e.g. "+35 -12 lines"
}

export interface EvidenceItem {
  id: string;
  reportId: string;
  dimension: DimensionType;
  title: string;
  explanation: string;
  scoreImpact: 'positive' | 'negative' | 'neutral';
  scoreDelta: number;
  targetType: 'message' | 'revision';
  targetId: string;
  timestamp: string;
  snippet?: string;
  isOrphaned?: boolean;
}

export interface VerificationRecord {
  id: string;
  reportId: string;
  outcome: 'VERIFIED' | 'REJECTED';
  reviewerName: string;
  note: string;
  createdAt: string;
}

export interface FullReport {
  id: string;
  status: ReportStatus;
  candidate: CandidateInfo;
  task: TaskInfo;
  sessionDuration: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
  dimensionScores: DimensionScore[];
  finalArtifact: FinalArtifact | null;
  conversationMessages: ConversationMessage[];
  draftRevisions: DraftRevision[];
  evidenceItems: EvidenceItem[];
  verification: VerificationRecord | null;
}

export interface VerifyReportPayload {
  outcome: 'VERIFIED' | 'REJECTED';
  reviewerName: string;
  note: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}
