"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Globe,
  Bot,
  Database,
  Layers,
  Zap,
  ExternalLink,
  Search,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const LoadingOverlay = ({ targetUrl }: { targetUrl: string }) => (
  <div className="fixed inset-0 bg-gray-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Loader2 size={32} className="animate-spin text-white" />
        </div>
        <h3 className="text-xl text-white font-semibold mb-2">Preparing Knowledge Base</h3>
        <p className="text-sm text-gray-400 mb-4 truncate px-2 font-mono">
          {targetUrl}
        </p>
        <div className="space-y-2 text-xs text-gray-400 text-left bg-gray-950/60 p-3 rounded-xl border border-gray-800/80">
          <div className="flex items-center gap-2 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Fetching webpage content & stripping layout
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            Generating semantic vector embeddings
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            Bootstrapping conversational RAG agent
          </div>
        </div>
      </div>
    </div>
  </div>
);

const exampleUrls = [
  "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "https://nextjs.org/docs",
  "https://github.com/features",
];

const LandingPage = () => {
  const router = useRouter();
  const [website, setWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hostDisplay, setHostDisplay] = useState("chatweb/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostDisplay(`${window.location.host}/`);
    }
  }, []);

  const cleanAndNavigate = (urlToProcess: string) => {
    let raw = urlToProcess.trim();
    if (!raw) return;

    setIsLoading(true);

    // Strip any leading protocol
    raw = raw.replace(/^(?:https?:\/?\/)+/gi, "");

    // Direct route to [...url]
    router.push(`/${raw}`);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    cleanAndNavigate(website);
  };

  return (
    <>
      {isLoading && <LoadingOverlay targetUrl={website || "Website"} />}

      <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-96 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 relative">

          {/* Hero Heading */}
          <div className="text-center max-w-4xl mx-auto pt-2 sm:pt-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Chat with Any Website&apos;s Content in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Real-Time
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Turn documentation, blog articles, and web pages into an interactive conversational AI.
              Ask complex questions, extract summaries, and verify factual references instantly.
            </p>

            {/* Smart URL Input Box */}
            <div className="max-w-2xl mx-auto mb-6">
              <form
                onSubmit={handleSubmit}
                className="relative flex flex-col sm:flex-row items-stretch p-2 bg-gray-900/90 border border-gray-700/80 rounded-2xl shadow-2xl shadow-blue-950/40 backdrop-blur-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200"
              >
                <div className="flex items-center pl-3 pr-2 py-2 sm:py-0 text-gray-500 select-none">
                  <Search size={18} className="text-gray-400 shrink-0 mr-2" />
                  <span className="hidden md:inline font-mono text-xs text-blue-400/90 bg-blue-950/80 border border-blue-800/40 px-2 py-1 rounded-md mr-1">
                    {hostDisplay}
                  </span>
                </div>

                <input
                  id="target-url-input"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://en.wikipedia.org/wiki/React"
                  className="w-full bg-transparent border-0 px-2 py-2 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
                />

                <button
                  id="try-now-btn"
                  type="submit"
                  disabled={!website.trim()}
                  className="mt-2 sm:mt-0 sm:ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 shrink-0"
                >
                  <span>Chat Now</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Quick Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <span className="text-gray-500 font-medium">Or try an example:</span>
                {exampleUrls.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setWebsite(example);
                      cleanAndNavigate(example);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-850 hover:bg-gray-800 border border-gray-700/60 text-gray-300 hover:text-white transition-colors"
                  >
                    <Globe size={12} className="text-blue-400" />
                    <span>{example.replace(/^https?:\/\//, "").split("/")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl hover:border-gray-700/80 transition-all hover:shadow-xl hover:shadow-blue-950/20 group">
              <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-700/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Zap className="text-blue-400" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Preprocessing</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Extracts clean textual content from HTML pages, stripping away navigation clutter, headers, and ads.
              </p>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl hover:border-gray-700/80 transition-all hover:shadow-xl hover:shadow-indigo-950/20 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Database className="text-indigo-400" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Vectorized Knowledge</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Indexes text chunks into isolated vector namespaces for rapid, hallucination-free retrieval on every prompt.
              </p>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl hover:border-gray-700/80 transition-all hover:shadow-xl hover:shadow-purple-950/20 group">
              <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Bot className="text-purple-400" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Contextual Conversations</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Retains multi-turn conversation memory with Redis session history, allowing seamless contextual follow-up questions.
              </p>
            </div>
          </div>

          {/* How It Works Workflow */}
          <div className="mt-24 pt-12 border-t border-gray-800/80">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How It Works</h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
                Three simple steps to extract answers from any webpage in seconds.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative p-6 rounded-2xl bg-gray-900/40 border border-gray-800 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h4 className="font-semibold text-white mb-1.5">Paste or Prepend URL</h4>
                <p className="text-sm text-gray-400">
                  Enter any public web page URL into the input or prefix it in your browser address bar.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-gray-900/40 border border-gray-800 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h4 className="font-semibold text-white mb-1.5">Autonomous Vectorization</h4>
                <p className="text-sm text-gray-400">
                  Content is parsed with Cheerio, divided into semantic overlapping chunks, and embedded into vector storage.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-gray-900/40 border border-gray-800 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h4 className="font-semibold text-white mb-1.5">Interactive Q&amp;A</h4>
                <p className="text-sm text-gray-400">
                  Ask questions, summarize key takeaways, or explore details grounded in the webpage facts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-900 bg-gray-950/80 py-8 text-center text-sm text-gray-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-400 font-medium">
              <Globe size={16} className="text-blue-400" />
              <span>© 2026 ChatWeb</span>
            </div>
            <p className="text-xs text-gray-500">
              Powered by Next.js, Upstash Vector &amp; Redis, and LangChain RAG.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;