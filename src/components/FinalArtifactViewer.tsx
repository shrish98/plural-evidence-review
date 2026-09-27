'use client';

import { FinalArtifact } from '@/lib/types';
import { Check, Code2, Copy, FileText } from 'lucide-react';
import { useState } from 'react';

interface FinalArtifactViewerProps {
  artifact: FinalArtifact | null;
}

export function FinalArtifactViewer({ artifact }: FinalArtifactViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!artifact) {
    return (
      <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm">
        <div className="text-center py-8 text-slate-500 space-y-2">
          <Code2 className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No Final Artifact Submitted</p>
          <p className="text-xs text-slate-500">
            Candidate did not attach a finalized code artifact for this session.
          </p>
        </div>
      </section>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = artifact.content.split('\n');

  return (
    <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-orange-100 border border-orange-200 text-orange-600">
            <Code2 className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{artifact.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200 font-mono font-semibold">
                {artifact.filename}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Final candidate code artifact submitted for automated review
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-medium">
            {artifact.linesOfCode} lines ({artifact.language})
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1 rounded text-xs transition border border-slate-200 font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Copy artifact code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Note */}
      <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <FileText className="w-3.5 h-3.5 text-orange-500" />
          <span>Submission Overview</span>
        </div>
        <p className="leading-relaxed text-slate-700">{artifact.summary}</p>
      </div>

      {/* Code Editor Container */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs overflow-hidden shadow-sm">
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
          <span className="text-orange-400 font-semibold">{artifact.filename}</span>
          <span className="uppercase text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">{artifact.language}</span>
        </div>
        <div className="p-4 overflow-x-auto max-h-[400px]">
          <table className="w-full text-left border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50">
                  <td className="w-10 select-none text-right pr-4 text-slate-600 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="text-slate-200 whitespace-pre font-mono text-[12px] leading-relaxed">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
