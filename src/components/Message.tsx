"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Bot, User, Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  content: string;
  isUserMessage: boolean;
}

export const Message = ({ content, isUserMessage }: MessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Failed to copy message:", e);
    }
  };

  return (
    <div
      className={cn(
        "group relative transition-colors border-b border-gray-800/40 py-5 px-4 sm:px-6",
        isUserMessage ? "bg-gray-950/60" : "bg-gray-900/50"
      )}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-sm font-medium shadow-md transition-all",
            isUserMessage
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
          )}
        >
          {isUserMessage ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              {isUserMessage ? "You" : "Website Assistant"}
            </span>

            {/* Copy button */}
            {!isUserMessage && (
              <button
                type="button"
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
                title="Copy response"
              >
                {copied ? (
                  <span className="inline-flex items-center text-xs text-green-400 gap-1">
                    <Check size={13} />
                    <span>Copied</span>
                  </span>
                ) : (
                  <Copy size={13} />
                )}
              </button>
            )}
          </div>

          <div className="text-sm leading-relaxed text-gray-200 prose prose-invert max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-300 prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800">
            {isUserMessage ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};