"use client";

import React, { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-red-900/30 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
          <AlertTriangle size={28} />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Unable to load chat</h2>
        <p className="text-sm text-gray-400 mb-6">
          {error?.message || "An unexpected error occurred while loading this website's knowledge base."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
