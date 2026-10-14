"use client";

import React from "react";
import { useChat } from "ai/react";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  AlertCircle,
  Zap,
} from "lucide-react";

interface ChatWrapperProps {
  websiteUrl: string;
  websiteTitle?: string;
  indexingError?: string | null;
}

export const ChatWrapper = ({
  websiteUrl,
  websiteTitle,
  indexingError,
}: ChatWrapperProps) => {
  const {
    messages,
    handleInputChange,
    handleSubmit,
    input,
    setInput,
    isLoading,
    append,
  } = useChat({
    api: "/api/chat-stream",
    body: { websiteUrl },
  });

  let hostname = websiteUrl;
  try {
    hostname = new URL(websiteUrl).hostname;
  } catch {
    // fallback
  }

  const handleSelectPrompt = (prompt: string) => {
    append(
      {
        role: "user",
        content: prompt,
      },
      {
        body: { websiteUrl },
      }
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-850 transition-colors"
            title="Back to home"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-700/40 flex items-center justify-center text-blue-400 shrink-0">
              <Globe size={16} />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {websiteTitle || hostname}
                </span>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  title="Visit website in new tab"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
              <span className="text-[11px] text-gray-400 truncate max-w-xs sm:max-w-md">
                {websiteUrl}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {indexingError ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-800/50 text-amber-300 text-xs">
              <AlertCircle size={12} />
              <span>General Knowledge Mode</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <Zap size={11} className="text-emerald-400" />
              <span>True Vector RAG Active</span>
            </div>
          )}
        </div>
      </header>

      {/* Indexing warning banner if any */}
      {indexingError && (
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2.5 text-xs text-amber-200 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0 text-amber-400" />
          <span>{indexingError}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <Messages
          messages={messages}
          isLoading={isLoading}
          websiteUrl={websiteUrl}
          onSelectPrompt={handleSelectPrompt}
        />
      </main>

      {/* Floating Chat Input */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setInput={setInput}
        isLoading={isLoading}
      />
    </div>
  );
};