'use client';

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShieldAlert,
  X,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  action: 'VERIFIED' | 'REJECTED';
  reportId: string;
  candidateName: string;
  onClose: () => void;
  onSuccess: (verificationRecord: any) => void;
  isSimulatingSaveFailure: boolean;
}

export function VerificationModal({
  isOpen,
  action,
  reportId,
  candidateName,
  onClose,
  onSuccess,
  isSimulatingSaveFailure,
}: VerificationModalProps) {
  const [reviewerName, setReviewerName] = useState('Shrishti');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const reviewerInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      const timer = setTimeout(() => {
        reviewerInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab' && dialogRef.current) {
          const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isVerify = action === 'VERIFIED';
  const minNoteLength = 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reviewerName.trim() || reviewerName.trim().length < 2) {
      setErrorMessage('Reviewer name must be at least 2 characters.');
      return;
    }

    if (!note.trim() || note.trim().length < minNoteLength) {
      setErrorMessage(
        `Verification note is required (minimum ${minNoteLength} characters). Please detail your reasoning.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const url = `/api/reports/${reportId}/verify${
        isSimulatingSaveFailure ? '?simulateFailure=true' : ''
      }`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome: action,
          reviewerName: reviewerName.trim(),
          note: note.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error ||
            'Verification save failed due to a server error. Please retry.'
        );
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSubmitting(false);
      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      console.error('Submit Error:', err);
      setErrorMessage('Network or server connection error. Click retry.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden space-y-0">
        {/* Modal Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isVerify
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-rose-50 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-xl border ${
                isVerify
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                  : 'bg-rose-100 border-rose-300 text-rose-700'
              }`}
            >
              {isVerify ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </span>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-slate-900">
                {isVerify ? 'Verify Candidate Report' : 'Reject Candidate Report'}
              </h3>
              <p id="modal-description" className="text-xs text-slate-600">
                Candidate: <span className="font-bold text-slate-900">{candidateName}</span> (Report ID: {reportId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Simulation Alert if Active */}
          {isSimulatingSaveFailure && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>
                <strong>Dev Test Mode Active:</strong> This submission will simulate a 500 error to test the save failure & retry UI.
              </span>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Save Error Encountered</span>
              </div>
              <p className="text-[11px] text-red-800 leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Reviewer Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="reviewerName" className="font-semibold text-slate-800 block">
              Reviewer Name <span className="text-rose-500">*</span>
            </label>
            <input
              ref={reviewerInputRef}
              id="reviewerName"
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-slate-400"
              placeholder="Enter your name (e.g., Shrishti)"
            />
          </div>

          {/* Required Note Textarea */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="note" className="font-semibold text-slate-800 block">
                {isVerify ? 'Verification Rationale Note' : 'Rejection Reason Note'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {note.length} / {minNoteLength} min chars
              </span>
            </div>
            <textarea
              id="note"
              rows={4}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-slate-400 leading-relaxed"
              placeholder={
                isVerify
                  ? 'Explain why this report is verified (e.g., Candidate caught critical race conditions and wrote robust fallback tests)...'
                  : 'Explain why this report is rejected (e.g., Candidate blindly accepted AI output without verifying edge cases)...'
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg font-semibold text-white shadow-md transition flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 ${
                isVerify
                  ? 'bg-orange-600 hover:bg-orange-500 focus-visible:ring-orange-400'
                  : 'bg-rose-600 hover:bg-rose-500 focus-visible:ring-rose-400'
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : errorMessage ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Submission</span>
                </>
              ) : (
                <>
                  {isVerify ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>Confirm {isVerify ? 'Verification' : 'Rejection'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
