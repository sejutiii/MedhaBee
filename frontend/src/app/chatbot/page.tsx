'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ChatbotPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission logic here
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">MedhaBee Assistant</h1>
            <nav className="space-x-4">
              <Link href="/" className="text-blue-600 hover:underline">Home</Link>
              <Link href="/chatbot" className="text-blue-600 hover:underline">Chat</Link>
              <Link href="/dailyfact" className="text-blue-600 hover:underline">Daily Facts</Link>
              <Link href="/videos" className="text-blue-600 hover:underline">Video</Link>
            </nav>
          </div>
          <div className="space-x-2">
            <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
              Log In
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex">
        {/* Chatbot Section */}
        <div className="flex-1 bg-white rounded-lg shadow p-6 mr-6">
          <h2 className="text-2xl font-semibold mb-2">Ask </h2>
          <p className="text-gray-600 mb-4">Ask any science question and get an instant answer!</p>

          {/* Chatbot Interface */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="text-blue-600 font-medium">Science Assistant</div>
              <div className="flex items-center">
                <select 
                  className="text-sm border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  onChange={(e) => {
                    // Handle language change
                    console.log("Language changed to:", e.target.value);
                  }}
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা (Bangla)</option>
                </select>
              </div>
            </div>
            <div className="flex-1 h-64 overflow-y-auto border border-gray-200 rounded p-4 mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-2">💡</div>
                <p className="text-gray-500">
                  Ask me anything about science!<br />
                  Try &quot;What is photosynthesis?&quot; or &quot;How do magnets work?&quot;
                </p>
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a science question..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleSubmit}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
              <button
                onClick={() => {
                  // Voice recognition logic will go here
                  alert('Voice recognition activated');
                }}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                title="Use voice command"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80">
          {/* Tips Section */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Tips for Good Questions</h3>
            <ul className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Be specific with your question</li>
              <li>Use the simplify toggle for easier explanations</li>
              <li>Try voice input for hands-free interaction</li>
              <li>Switch languages if you prefer Bengali</li>
            </ul>
          </div>

          {/* Related Videos Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Related Videos</h3>
            <div className="bg-blue-50 p-3 rounded-lg mb-3">
              <p className="text-gray-700">
                Discover educational videos on various scientific topics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Science basics"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">No videos found. Try a different search term.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}