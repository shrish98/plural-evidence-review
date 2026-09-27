'use client';

import { ConversationMessage } from '@/lib/types';
import {
  Bot,
  Check,
  Copy,
  MessageSquare,
  Sparkles,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface TranscriptViewerProps {
  messages: ConversationMessage[];
  highlightedTargetId: string | null;
}

export function TranscriptViewer({
  messages,
  highlightedTargetId,
}: TranscriptViewerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!messages || messages.length === 0) {
    return (
      <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm">
        <div className="text-center py-8 text-slate-500 text-xs">
          No conversation messages recorded for this session.
        </div>
      </section>
    );
  }

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="glass-panel p-6 border border-slate-200 bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-bold text-slate-900">
            Session Conversation Transcript
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium">
            {messages.length} Messages
          </span>
        </div>
      </div>

      {/* Transcript Messages Feed */}
      <div className="space-y-4 max-h-[720px] overflow-y-auto pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isHighlighted = highlightedTargetId === msg.id;

          return (
            <div
              key={msg.id}
              id={`msg-${msg.id}`}
              tabIndex={-1}
              className={`p-4 rounded-xl border text-xs transition space-y-2 focus:outline-none ${
                isHighlighted
                  ? 'evidence-target-highlighted ring-2 ring-orange-500'
                  : isUser
                  ? 'bg-amber-50/70 border-amber-200/80 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg border ${
                      isUser
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-orange-100 border-orange-300 text-orange-800'
                    }`}
                  >
                    {isUser ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 capitalize text-xs">
                      {isUser ? 'Candidate Prompt' : 'AI Assistant Response'}
                    </span>
                    {msg.model && (
                      <span className="ml-2 text-[10px] text-orange-800 bg-orange-100 px-1.5 py-0.2 rounded border border-orange-200 font-mono font-medium">
                        {msg.model}
                      </span>
                    )}
                  </div>
                </div>

                {/* ID & Controls */}
                <div className="flex items-center gap-2">
                  {isHighlighted && (
                    <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded shadow animate-pulse">
                      Target Evidence Match
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 font-mono">
                    {msg.timestamp}
                  </span>

                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
                    title="Copy message content"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-slate-800 leading-relaxed font-sans whitespace-pre-wrap pl-8">
                {msg.content}
              </div>

              {/* Token Footer if available */}
              {(msg.promptTokens || msg.completionTokens) && (
                <div className="pl-8 pt-1 text-[10px] font-mono text-slate-400 flex items-center gap-3">
                  {msg.promptTokens && <span>Prompt: {msg.promptTokens} tokens</span>}
                  {msg.completionTokens && <span>Completion: {msg.completionTokens} tokens</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
