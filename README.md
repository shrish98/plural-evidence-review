# Plural Evidence Review

> **Full-Stack Technical Assignment — Plural App**  
> **Candidate:** Shrishti  
> **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Persistent Database, Vitest & React Testing Library.

---

## 🌟 Overview

**Plural Evidence Review** is a standalone web application built to evaluate candidate AI-assisted work sessions. Instead of presenting unexplained scores, every dimension score and conclusion directly links back to concrete conversation transcripts, prompt instructions, or draft code iterations.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (Tested on Node v22.13.1)
- **NPM**: `v10.x` or `v11.x`

### 1. Installation
```bash
git clone <repository-url>
cd plural-evidence-review
npm install
```

### 2. Database Seeding
To populate the persistent database with synthetic reports for all 9 product states:
```bash
npm run seed
```

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Running Automated Tests
```bash
npm run test
```
Executes the Vitest test suite covering backend API validation, idempotency, evidence deep-linking, and product state safety.

### 5. Production Build Verification
```bash
npm run build
npm run start
```

---

## 🏗️ Architecture & Data Flow

The application follows a clean Next.js App Router architecture with strict component boundaries, server-side API handlers, and client-side reactive state management.

```
[ Browser / Reviewer ]
        │
        ├── 1. URL State Sync (?evidence=ev-303)
        ├── 2. Reactive Component Tree
        │       ├── DevStateSwitcher (Top Bar)
        │       ├── ReportHeader & Verification Outcome
        │       ├── DimensionScoresCard (Radar & Progress Meters)
        │       ├── FinalArtifactViewer (Submitted Code & Copy)
        │       ├── EvidenceExplorer (Category Filters & Search)
        │       ├── TranscriptViewer (Auto-scroll & Glow Highlight)
        │       └── RevisionDiffViewer (Iteration Diffs)
        │
        ▼ (HTTP REST API)
[ Next.js API Routes ]
        │
        ├── GET  /api/reports/[id]       -> Fetch full report & evidence
        ├── POST /api/reports/[id]/verify -> Idempotent decision submit
        └── POST /api/reset               -> Reset database to seed state
        │
        ▼ (Database Access)
[ Persistent JSON File DB (`plural_db.json`) ]
```

---

## 📊 Data Model

```typescript
export interface FullReport {
  id: string; // e.g. "rpt-001"
  status: ReportStatus; // "AWAITING_VERIFICATION" | "VERIFIED" | "REJECTED" | ...
  candidate: CandidateInfo; // Name, email, role, avatar
  task: TaskInfo; // Title, description, complexity, time limit
  sessionDuration: string; // e.g. "1h 42m"
  completedAt: string; // ISO date
  createdAt: string;
  updatedAt: string;
  errorMessage?: string; // For failure states
  dimensionScores: DimensionScore[]; // 0.0 - 5.0 scale for Delegation, Description, etc.
  finalArtifact: FinalArtifact | null; // Submitted TypeScript/code file
  conversationMessages: ConversationMessage[]; // User & AI assistant turns
  draftRevisions: DraftRevision[]; // Step-by-step diff revisions
  evidenceItems: EvidenceItem[]; // Linked scored behaviors
  verification: VerificationRecord | null; // Reviewer decision record
}
```

---

## 🔗 Evidence-Linking & URL State Strategy

1. **Deep-Linkable URL Representation**:
   Selecting an evidence item updates the URL query parameter `?evidence=<evidence_id>` via `router.push(..., { scroll: false })` without causing a page reload. This URL state survives page refreshes and can be shared directly with team members.

2. **Smooth Target Scrolling & Keyboard Focus**:
   Upon evidence selection:
   - The application resolves the target element ID (`msg-<id>` or `rev-<id>`).
   - Executes `element.scrollIntoView({ behavior: 'smooth', block: 'center' })`.
   - Programmatically shifts keyboard focus onto the target element (`element.focus()`).

3. **Visible Highlight Glow Keyframes**:
   Selected target messages or revisions receive the CSS class `.evidence-target-highlighted`, triggering an animated pulsing border and indigo glow (`box-shadow: 0 0 24px rgba(99, 102, 241, 0.45)`).

4. **Orphaned Evidence Resilience**:
   If an evidence item targets missing content (`isOrphaned: true`), an advisory badge **"Target Content Unavailable"** is rendered, preventing broken anchor references.

---

## ♿ Accessibility Decisions

- **Color Independence**: Every status badge, score meter, and evidence impact tag pairs color with explicit text labels, star ratings (`★★★★☆`), and visual icons (`PlusCircle`, `MinusCircle`, `CheckCircle2`).
- **Visible Focus Outlines**: All interactive buttons, cards, inputs, and tab stops implement visible focus indicators (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
- **Keyboard Navigation**: Full keyboard navigation support (Card selection via `Enter` / `Space`, input focus, focus trap in modal dialogs).
- **ARIA Semantics**: Proper ARIA roles (`role="status"`, `role="dialog"`, `aria-live="polite"`, `aria-modal="true"`, `aria-valuenow`).

---

## 🔒 Idempotency & Duplicate Submission Strategy

To ensure verification operations are safe against network retries or double-clicking:
1. **Database Check**: The backend handler `submitVerification(reportId, payload)` inspects whether a `verification_record` already exists for `reportId`.
2. **Conflict Prevention**: If a record exists, the API skips insertion and safely returns the existing record with `alreadySubmitted: true` and status `200 OK`.
3. **Read-Only Lock**: Once verified or rejected, the frontend renders an immutable decision summary banner and disables verification triggers.

---

## 🧪 Automated Test Suite

Located in `src/__tests__/`:
1. `verification-api.test.ts`: Validates backend API rules, input sanitization, DB persistence, and duplicate submission idempotency.
2. `evidence-deep-link.test.tsx`: Tests Evidence Explorer component rendering, dimension filtering, and click selection callback triggers.
3. `product-states.test.tsx`: Validates product state rendering safety, ensuring failed or insufficient evidence states render clear informative advisory banners instead of zero scores.

---

## 🔮 What I Would Build Next

1. **Transcript Telemetry Virtualization**: For sessions with 1,000+ messages, implement `@tanstack/react-virtual` list windowing to maintain 60 FPS scrolling.
2. **Side-by-Side Diff Viewer**: A full Git side-by-side split diff viewer for draft revisions comparing any arbitrary revision against the final artifact.
3. **Real-time Session Observation**: WebSocket server events pushing live prompt turns while candidate work sessions are in progress.

---

## 🤖 AI-Tool Disclosure

AI coding tools were utilized for boilerplate speedup during implementation:
- **Scaffolding Seed Data**: Assisted in generating synthetic JSON telemetry for candidate messages and Redis sliding window code artifacts.
- **Glassmorphism & Glow CSS**: Assisted in generating keyframe pulse animations for evidence highlights.
- **Test Setup**: Assisted in mocking DOM scrollIntoView APIs for Vitest test suites.

*All generated code was thoroughly inspected, tested, and validated by the author.*
