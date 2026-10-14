"use client";

import React, { useEffect, useRef } from "react";
import { Message as TMessage } from "ai/react";
import { Message } from "./Message";
import { Sparkles, MessageSquareText, Globe } from "lucide-react";

interface MessagesProps {
  messages: TMessage[];
  isLoading?: boolean;
  websiteUrl?: string;
  onSelectPrompt?: (prompt: string) => void;
}

const suggestedPrompts = [
  "Summarize the main points of this page in 3 bullets",
  "What is the core topic or purpose of this website?",
  "List the key takeaways and important details",
  "Explain this content in simple terms for a beginner",
];

export const Messages = ({
  messages,
  isLoading,
  websiteUrl,
  onSelectPrompt,
}: MessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  let hostname = "this website";
  try {
    if (websiteUrl) {
      hostname = new URL(websiteUrl).hostname;
    }
  } catch {
    hostname = websiteUrl || "this website";
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length ? (
        <div className="pb-36">
          {messages.map((message, i) => (
            <Message
              key={message.id || i}
              content={message.content}
              isUserMessage={message.role === "user"}
            />
          ))}

          {/* Thinking indicator */}
          {isLoading && (
            <div className="border-b border-gray-800/40 py-4 px-4 sm:px-6 bg-gray-900/30">
              <div className="max-w-4xl mx-auto flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles size={16} className="animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>Searching context &amp; drafting answer</span>
                  <span className="flex gap-1 ml-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      ) : (
        /* Empty State with Prompt Suggestions */
        <div className="h-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/10">
            <MessageSquareText size={28} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-mono text-gray-400 mb-3">
            <Globe size={12} className="text-blue-400" />
            <span className="truncate max-w-xs">{hostname}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            What would you like to know?
          </h3>
          <p className="text-sm text-gray-400 mb-8 max-w-md">
            This webpage has been extracted and vectorized. Ask any question to query the content.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSelectPrompt?.(prompt)}
                className="text-left p-3.5 rounded-xl bg-gray-900/60 hover:bg-gray-850 border border-gray-800 hover:border-blue-500/40 text-xs sm:text-sm text-gray-300 hover:text-white transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className="text-blue-400/70 group-hover:text-blue-400 shrink-0"
                  />
                  <span>{prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};