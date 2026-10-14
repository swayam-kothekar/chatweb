"use client";

import React, { useRef, useEffect } from "react";
import { Send, CornerDownLeft, Loader2 } from "lucide-react";
import { type useChat } from "ai/react";

type HandleInputChange = ReturnType<typeof useChat>["handleInputChange"];
type HandleSubmit = ReturnType<typeof useChat>["handleSubmit"];
type SetInput = ReturnType<typeof useChat>["setInput"];

interface ChatInputProps {
  input: string;
  handleInputChange: HandleInputChange;
  handleSubmit: HandleSubmit;
  setInput: SetInput;
  isLoading?: boolean;
}

export const ChatInput = ({
  handleInputChange,
  handleSubmit,
  input,
  setInput,
  isLoading,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      handleSubmit();
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent pt-6 pb-4 px-4 sm:px-6 pointer-events-none z-20">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || isLoading) return;
            handleSubmit(e);
            setInput("");
          }}
          className="relative flex items-end gap-2 bg-gray-900/90 border border-gray-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-md focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            autoFocus
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder="Ask anything about this website..."
            className="w-full bg-transparent resize-none border-0 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none max-h-40 overflow-y-auto leading-relaxed"
          />

          <button
            id="chat-send-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-md shadow-blue-600/20"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between px-3 pt-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-[10px] text-gray-400">
              Enter
            </kbd>{" "}
            to send
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-[10px] text-gray-400">
              Shift + Enter
            </kbd>{" "}
            for new line
          </span>
        </div>
      </div>
    </div>
  );
};