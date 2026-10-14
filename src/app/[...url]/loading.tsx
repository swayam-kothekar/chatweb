import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full bg-gray-900/80 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Loader2 size={30} className="animate-spin text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Analyzing Webpage</h3>
        <p className="text-sm text-gray-400 mb-6">
          Fetching live content and preparing in-memory context for Groq AI...
        </p>

        <div className="space-y-3 text-xs text-left">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80 text-blue-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Fetching live HTML &amp; stripping clutter</span>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-950/40 border border-gray-800/50 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            <span>Structuring text content in memory</span>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-950/40 border border-gray-800/50 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            <span>Connecting to Groq LLaMA 3.3 engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
