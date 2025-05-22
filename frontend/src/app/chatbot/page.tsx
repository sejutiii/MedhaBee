"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  sendChatMessage,
  sendSimplifiedMessage,
  sendAdvancedMessage,
} from "@/services/chatService";
import ReactMarkdown from "react-markdown";

// @ts-ignore
let Recorder: any = null;

// Define chat message type
type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Sample science topics for suggestions
const scienceTopics = [
  "What is photosynthesis?",
  "How do black holes form?",
  "Explain quantum physics simply",
  "How does DNA replication work?",
  "What causes lightning?",
  "How do vaccines work?",
];

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;

    // Add user message to chat history
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsBotTyping(true);

    try {
      let botContent = "";
      if (simplifiedMode) {
        botContent = await sendSimplifiedMessage(userMessage.content, language);
      } else {
        botContent = await sendChatMessage(userMessage.content, language);
      }
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botContent,
        sender: "bot",
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, botResponse]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, I couldn't get a response. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Scroll to bottom of chat when history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isBotTyping]);

  // Start recording audio for STT
  const startRecording = async () => {
    setRecordingError(null);
    setIsListening(true);

    try {
      // Dynamically load Recorder.js if not loaded
      if (!Recorder) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/recorder.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
        // @ts-ignore
        Recorder = window.Recorder;
      }

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create audio context and recorder
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const input = audioContext.createMediaStreamSource(stream);

      // Configure recorder for Azure Speech API requirements
      const recorder = new Recorder(input, {
        workerPath: '/recorderWorker.js',
        numChannels: 1,
        sampleRate: 16000,
        bufferLen: 4096,
      });
      recorderRef.current = recorder;

      // Start recording
      recorder.record();
      console.log("Recording started for STT");
    } catch (err: any) {
      setRecordingError("Failed to access microphone: " + (err instanceof Error ? err.message : String(err)));
      setIsListening(false);
    }
  };

  // Stop recording and transcribe audio
  const stopRecording = async () => {
    if (recorderRef.current) {
      recorderRef.current.stop();

      // Export the recorded audio as WAV and transcribe
      recorderRef.current.exportWAV(async (blob: Blob) => {
        console.log("Recording stopped, WAV blob created:", blob);

        // Send audio file to backend for STT
        try {
          const formData = new FormData();
          formData.append("audio", blob, "recorded-audio.wav");
          formData.append("language", language);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stt`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log("STT result:", result);
          const transcribedText = result.text || "No transcription available";
          setMessage(transcribedText); // Populate the input field with transcribed text
        } catch (err: any) {
          setRecordingError("Failed to transcribe audio: " + (err instanceof Error ? err.message : String(err)));
        }
      });

      recorderRef.current.clear();
      recorderRef.current = null;
    }

    // Clean up media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }

    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsListening(false);
  };

  // Handle voice command (toggle recording)
  const handleVoiceCommand = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Generate TTS and display audio player
  const handlePlayTTS = async () => {
    const lastBotMsg = [...chatHistory]
      .reverse()
      .find((msg) => msg.sender === "bot");
    if (!lastBotMsg) {
      setTtsError("No bot response to play.");
      return;
    }

    setTtsError(null);
    setAudioUrl(null);
    setIsGeneratingAudio(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: lastBotMsg.content,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const audioUrl = `${process.env.NEXT_PUBLIC_API_URL}${result.audio_url}`;
      setAudioUrl(audioUrl);
    } catch (err: any) {
      setTtsError("Failed to generate audio: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Simplify last user message
  const handleSimplify = async () => {
    const lastUserMsg = [...chatHistory]
      .reverse()
      .find((msg) => msg.sender === "user");
    if (!lastUserMsg) return;
    setIsBotTyping(true);
    try {
      const botContent = await sendSimplifiedMessage(lastUserMsg.content, language);
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 3).toString(),
          content: botContent,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 4).toString(),
          content: "Sorry, I couldn't simplify the response.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Advanced response for last user message
  const handleAdvance = async () => {
    const lastUserMsg = [...chatHistory]
      .reverse()
      .find((msg) => msg.sender === "user");
    if (!lastUserMsg) return;
    setIsBotTyping(true);
    try {
      const botContent = await sendAdvancedMessage(lastUserMsg.content, language);
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 5).toString(),
          content: botContent,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 6).toString(),
          content: "Sorry, I couldn't provide an advanced response.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
        recorderRef.current.clear();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              MedhaBee Assistant
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/chatbot"
                className="text-blue-600 border-b-2 border-blue-600 font-medium pb-1"
              >
                Chat
              </Link>
              <Link
                href="/DailyFacts"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Daily Facts
              </Link>
              <Link
                href="/videos"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Videos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Chatbot Section */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 mb-6 md:mb-0 md:mr-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Science Assistant
              </h2>
              <p className="text-gray-600 mt-1">
                Ask questions and get clear, educational answers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-50 p-1 rounded-full shadow-sm">
                <button
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    language === "en"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
                <button
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    language === "bn"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setLanguage("bn")}
                >
                  বাংলা
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Simplify</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={simplifiedMode}
                    onChange={() => setSimplifiedMode(!simplifiedMode)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Chatbot Interface */}
          <div className="flex-1">
            <div
              ref={chatContainerRef}
              className="flex-1 h-80 overflow-y-auto border border-gray-200 rounded-xl p-6 mb-5 bg-gray-50 shadow-inner"
            >
              {chatHistory.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-md"
                  >
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-3xl mb-5 shadow-md">
                      💡
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">
                      Ready to Answer Your Questions
                    </h3>
                    <p className="text-gray-600">
                      Ask me anything about science!
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {scienceTopics.slice(0, 4).map((topic, index) => (
                        <button
                          key={index}
                          className="text-left text-sm bg-white p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          onClick={() => setMessage(topic)}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        {msg.sender === "bot" ? (
                          <div className="prose prose-blue max-w-none text-base">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                        <p
                          className={`text-xs mt-1 text-right ${
                            msg.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isBotTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 rounded-bl-none max-w-[80%]">
                        <div className="flex space-x-2">
                          <div
                            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Ask a science question..."
                    : "একটি বিজ্ঞান প্রশ্ন জিজ্ঞাসা করুন..."
                }
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                disabled={isListening}
              />
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleVoiceCommand}
                className={`p-3 ${
                  isListening ? "bg-red-600 animate-pulse" : "bg-green-600"
                } text-white rounded-xl hover:bg-opacity-90 transition-colors shadow-sm`}
                title="Use voice command"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            </form>

            {/* Error Displays and Audio Playback */}
            <div className="mt-4 space-y-2">
              {(recordingError || ttsError) && (
                <>
                  {recordingError && (
                    <div className="p-4 bg-red-100 text-red-800 rounded">
                      <strong>Error:</strong> {recordingError}
                    </div>
                  )}
                  {ttsError && (
                    <div className="p-4 bg-red-100 text-red-800 rounded">
                      <strong>Error:</strong> {ttsError}
                    </div>
                  )}
                </>
              )}
              {isGeneratingAudio && (
                <div className="p-4 bg-blue-100 text-blue-800 rounded flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Generating Audio...
                </div>
              )}
              {audioUrl && !isGeneratingAudio && (
                <div className="p-4 bg-green-100 text-green-800 rounded">
                  <p className="mb-2 font-medium">Audio Generated:</p>
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex mt-4 space-x-3">
              <button
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all shadow-sm"
                onClick={handleSimplify}
                disabled={isBotTyping || chatHistory.length === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Simplify This Topic
              </button>
              <button
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all shadow-sm"
                onClick={handleAdvance}
                disabled={isBotTyping || chatHistory.length === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Ask More About This Topic
              </button>
              <button
                className="flex items-center justify-center px-4 py-3 text-sm rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all shadow-sm"
                onClick={handlePlayTTS}
                disabled={isBotTyping || chatHistory.length === 0 || !chatHistory.some((msg) => msg.sender === "bot")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Listen to Response
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-96">
          {/* Conversation History */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Conversation History
              </h3>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                Clear All
              </button>
            </div>
            <div className="space-y-3">
              {chatHistory.length > 0 ? (
                chatHistory
                  .filter((msg) => msg.sender === "user")
                  .slice(-3)
                  .map((msg, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setMessage(msg.content)}
                    >
                      <p className="text-sm text-gray-700 truncate">
                        {msg.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500 py-3">
                  No conversation history yet.
                </p>
              )}
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Tips for Better Learning
            </h3>
            <div className="divide-y divide-gray-100">
              <div className="py-3 flex items-start space-x-3">
                <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Be specific with questions
                  </p>
                  <p className="text-xs text-gray-500">
                    Focus on one concept at a time
                  </p>
                </div>
              </div>
              <div className="py-3 flex items-start space-x-3">
                <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Use simplify mode
                  </p>
                  <p className="text-xs text-gray-500">
                    For clearer basic explanations
                  </p>
                </div>
              </div>
              <div className="py-3 flex items-start space-x-3">
                <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Follow-up questions
                  </p>
                  <p className="text-xs text-gray-500">
                    Deepen understanding with related queries
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Resources */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Related Resources
            </h3>
            <div className="space-y-3">
              <Link
                href="/videos"
                className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors cursor-pointer group"
              >
                <div className="bg-white shadow-sm rounded-lg p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                    Educational Videos
                  </p>
                  <p className="text-xs text-gray-500">
                    Visual learning resources
                  </p>
                </div>
              </Link>
              <Link
                href="/DailyFacts"
                className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-colors cursor-pointer group"
              >
                <div className="bg-white shadow-sm rounded-lg p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-green-700 transition-colors">
                    Daily Facts
                  </p>
                  <p className="text-xs text-gray-500">
                    Interesting science facts
                  </p>
                </div>
              </Link>
              <Link
                href="/DailyFacts/Quiz"
                className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors cursor-pointer group"
              >
                <div className="bg-white shadow-sm rounded-lg p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-yellow-700 transition-colors">
                    Take a Quiz
                  </p>
                  <p className="text-xs text-gray-500">Test your knowledge</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </aside>
      </main>
    </div>
  );
}