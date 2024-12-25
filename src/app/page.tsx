"use client"

import React, { useState } from 'react';
import { ArrowRight, Globe, Link, MessageSquare, MessagesSquare, PlusCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter()
  const demoUrl = "https://chatweb.swayam.tech/"
  const [website, setWebsite] = useState("")

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value)
  };

  const handleSubmit = () => {
    if (!website) return
    const finalUrl = `${demoUrl}${website}`
    router.push(finalUrl)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            ChatWeb - Chat with Any Website's Content
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Turn any website into an interactive chat experience by simply adding our URL prefix
          </p>

          <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-3 sm:p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
              <span className="hidden sm:inline text-gray-400 text-base whitespace-nowrap">
                {demoUrl}
              </span>

              <input
                type="text"
                value={website}
                onChange={handleWebsiteChange}
                onKeyDown={(e) => {
                  if(e.key === "Enter" && !e.shiftKey){
                      e.preventDefault()
                      handleSubmit()
                  }
              }}
                placeholder="Enter any website URL..."
                className="w-full bg-gray-800 border-0 focus:outline-none focus:ring-0 text-gray-100 placeholder-gray-500 text-base py-2"
              />

              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-base font-medium whitespace-nowrap"
              >
                Try Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>


        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Instant Access</h3>
            <p className="text-gray-300">
              No setup required. Just add our URL prefix to any website and start chatting immediately.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
              <Globe className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Works Everywhere</h3>
            <p className="text-gray-300">
              Compatible with any public website. Transform static content into dynamic conversations.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Natural Interaction</h3>
            <p className="text-gray-300">
              Ask questions, get summaries, and interact with web content through natural conversation.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <Link className="text-blue-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Copy Website URL</h3>
              <p className="text-gray-300">Find any website you want to chat with</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <PlusCircle className="text-blue-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Add Our Prefix</h3>
              <p className="text-gray-300">Prepend chatweb.swayam.tech/ to the URL</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <MessagesSquare className="text-blue-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Start Chatting</h3>
              <p className="text-gray-300">Ask questions and interact naturally</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© 2024 WebChat. Made with ❤️ by Swayam</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


