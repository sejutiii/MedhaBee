"use client";

import { useState } from "react";
import Link from "next/link";

// Categories with their description and icon
const categories = [
  {
    id: "biology",
    name: "Biology",
    description: "Life sciences and living organisms",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    id: "physics",
    name: "Physics",
    description: "Matter, energy and natural forces",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
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
    ),
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Substances, reactions and properties",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    id: "medicine",
    name: "Medicine",
    description: "Health, treatment and disease",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
];

// Video data organized by category
type CategoryKey = "biology" | "physics" | "chemistry" | "medicine";

const videosByCategory: Record<
  CategoryKey,
  {
    category: string;
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    channel: string;
    views: string;
    videoUrl: string;
  }[]
> = {
  biology: [
    {
      category: "biology",
      id: "bio1",
      title: "The Hidden World of Cell Division",
      thumbnail: "https://i.ytimg.com/vi/q9hZx6mantU/maxresdefault.jpg",
      duration: "12:45",
      channel: "Science Explained",
      views: "1.2M views",
      videoUrl: "https://www.youtube.com/watch?v=q9hZx6mantU",
    },
    {
      category: "biology",
      id: "bio2",
      title: "Inside the Human Cell: A Journey",
      thumbnail: "https://i.ytimg.com/vi/URUJD5NEXC8/maxresdefault.jpg",
      duration: "8:21",
      channel: "BioDigital",
      views: "950K views",
      videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
    },
    {
      category: "biology",
      id: "bio3",
      title: "Photosynthesis: Nature's Power Plant",
      thumbnail: "https://i.ytimg.com/vi/sQK3Yr4Sc_k/maxresdefault.jpg",
      duration: "15:33",
      channel: "Plant Sciences",
      views: "780K views",
      videoUrl: "https://www.youtube.com/watch?v=sQK3Yr4Sc_k",
    },
  ],
  physics: [
    {
      category: "physics",
      id: "phys1",
      title: "Quantum Mechanics Explained Simply",
      thumbnail: "https://i.ytimg.com/vi/7u_n5YlEv4Q/maxresdefault.jpg",
      duration: "14:18",
      channel: "Physics Foundations",
      views: "2.1M views",
      videoUrl: "https://www.youtube.com/watch?v=7u_n5YlEv4Q",
    },
    {
      category: "physics",
      id: "phys2",
      title: "How Black Holes Actually Work",
      thumbnail: "https://i.ytimg.com/vi/e-P5IFTqB98/maxresdefault.jpg",
      duration: "10:27",
      channel: "Space Explorer",
      views: "3.5M views",
      videoUrl: "https://www.youtube.com/watch?v=e-P5IFTqB98",
    },
    {
      category: "physics",
      id: "phys3",
      title: "The Four Fundamental Forces",
      thumbnail: "https://i.ytimg.com/vi/Yv3EMq2Dgq8/maxresdefault.jpg",
      duration: "18:42",
      channel: "Physics Foundations",
      views: "1.8M views",
      videoUrl: "https://www.youtube.com/watch?v=Yv3EMq2Dgq8",
    },
  ],
  chemistry: [
    {
      category: "chemistry",
      id: "chem1",
      title: "How Atoms Bond: Chemistry Basics",
      thumbnail: "https://i.ytimg.com/vi/NgvgNQWYxN8/maxresdefault.jpg",
      duration: "9:55",
      channel: "Chemistry World",
      views: "1.5M views",
      videoUrl: "https://www.youtube.com/watch?v=NgvgNQWYxN8",
    },
    {
      category: "chemistry",
      id: "chem2",
      title: "The Periodic Table: A Complete Guide",
      thumbnail: "https://i.ytimg.com/vi/VgVQKCcfwnU/maxresdefault.jpg",
      duration: "12:10",
      channel: "Elements",
      views: "2.2M views",
      videoUrl: "https://www.youtube.com/watch?v=VgVQKCcfwnU",
    },
    {
      category: "chemistry",
      id: "chem3",
      title: "Chemical Reactions in Daily Life",
      thumbnail: "https://i.ytimg.com/vi/wGnKKpxuKS8/maxresdefault.jpg",
      duration: "11:36",
      channel: "Chemistry World",
      views: "890K views",
      videoUrl: "https://www.youtube.com/watch?v=wGnKKpxuKS8",
    },
  ],
  medicine: [
    {
      category: "medicine",
      id: "med1",
      title: "How Vaccines Actually Work",
      thumbnail: "https://i.ytimg.com/vi/rb7TVW77ZCs/maxresdefault.jpg",
      duration: "16:22",
      channel: "Medical Insights",
      views: "4.8M views",
      videoUrl: "https://www.youtube.com/watch?v=rb7TVW77ZCs",
    },
    {
      category: "medicine",
      id: "med2",
      title: "The Human Heart: A Living Pump",
      thumbnail: "https://i.ytimg.com/vi/tg_ObDJEaGo/maxresdefault.jpg",
      duration: "13:45",
      channel: "Body Systems",
      views: "2.4M views",
      videoUrl: "https://www.youtube.com/watch?v=tg_ObDJEaGo",
    },
    {
      category: "medicine",
      id: "med3",
      title: "Understanding Diabetes: Causes and Treatments",
      thumbnail: "https://i.ytimg.com/vi/qwes8OgpJ4E/maxresdefault.jpg",
      duration: "11:05",
      channel: "Medical Insights",
      views: "1.7M views",
      videoUrl: "https://www.youtube.com/watch?v=qwes8OgpJ4E",
    },
  ],
};

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>("biology");
  const [searchQuery, setSearchQuery] = useState("");
  const [simplifiedMode, setSimplifiedMode] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Create YouTube search URL
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchQuery + " science"
      )}`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-2"
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
              MedhaBee
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/chatbot"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Chat
              </Link>
              <Link
                href="/DailyFacts"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Daily Facts
              </Link>
              <Link
                href="/videos"
                className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
              >
                Videos
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className={`p-1.5 rounded-full ${
                simplifiedMode
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 bg-gray-100"
              } hover:bg-blue-100 transition-colors`}
              onClick={() => setSimplifiedMode(!simplifiedMode)}
              title={
                simplifiedMode
                  ? "Disable simplified mode"
                  : "Enable simplified mode"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
            <div className="space-x-2">
              <Link
                href="/login"
                className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Science Video Library
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Watch educational videos on a variety of science topics
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 bg-white p-2 rounded-xl shadow-sm">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-gray-50"
                placeholder="Search for science videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-white px-6 py-3.5 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 font-medium"
            >
              Search
            </button>
          </form>

          <div className="flex items-center mt-3 px-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                Simplify Results
              </span>
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
            <span className="text-xs text-gray-500 ml-auto">
              Search anywhere on YouTube for educational content
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <div className="text-center mb-5">
            <h2 className="text-xl font-medium text-gray-700">
              Select a Category
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`flex items-center px-6 py-3.5 rounded-xl shadow-sm border-2 ${
                  selectedCategory === category.id
                    ? `${category.color} border-2 shadow-md transform scale-105`
                    : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200"
                } transition-all duration-200`}
                onClick={() => setSelectedCategory(category.id as CategoryKey)}
              >
                <span className="mr-2.5">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Title */}
        <div className="flex flex-col md:flex-row md:items-center mb-8">
          <div className="flex items-center">
            <div className="w-1.5 h-12 bg-blue-600 rounded-r mr-4 hidden md:block"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {categories.find((cat) => cat.id === selectedCategory)?.name}{" "}
              Videos
            </h2>
            <div className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              {videosByCategory[selectedCategory].length} videos
            </div>
          </div>
          <div className="md:ml-auto mt-3 md:mt-0 flex items-center">
            <button
              onClick={() => setSimplifiedMode(!simplifiedMode)}
              className={`flex items-center px-3 py-1.5 rounded-lg mr-3 text-sm ${
                simplifiedMode
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
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
              Simplify Mode
            </button>
            <Link
              href={`/chatbot?topic=${encodeURIComponent(
                categories.find((cat) => cat.id === selectedCategory)?.name ||
                  ""
              )}`}
              className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
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
              Ask Questions
            </Link>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {videosByCategory[selectedCategory].map((video) => (
            <a
              key={video.id}
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative">
                {/* Next.js warns about using img instead of Image, but we'll keep it for now */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2.5 py-1 text-xs font-medium rounded-md">
                  {video.duration}
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full 
                    ${
                      video.category === "biology"
                        ? "bg-green-100 text-green-800"
                        : video.category === "physics"
                        ? "bg-blue-100 text-blue-800"
                        : video.category === "chemistry"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {simplifiedMode
                      ? "Simplified"
                      : video.category || selectedCategory}
                  </span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900 mb-1 group-hover:text-blue-600">
                  {video.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-3">{video.channel}</span>
                  <span>{video.views}</span>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <div className="text-xs inline-flex items-center py-1 px-2 bg-blue-50 text-blue-700 rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
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
                    </svg>
                    Watch on YouTube
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSimplifiedMode(true);
                      window.open(
                        `https://www.youtube.com/results?search_query=${encodeURIComponent(
                          video.title + " simplified for beginners"
                        )}`,
                        "_blank"
                      );
                    }}
                    className="text-xs inline-flex items-center py-1 px-2 bg-green-50 text-green-700 rounded hover:bg-green-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
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
                    Simplify
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        `/chatbot?topic=${encodeURIComponent(video.title)}`,
                        "_blank"
                      );
                    }}
                    className="text-xs inline-flex items-center py-1 px-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
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
                    Ask More
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Discovery Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 shadow-sm border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Discover More Science Content
              </h3>
              <p className="text-gray-600 max-w-xl">
                Explore our curated collection of educational resources designed
                to make learning science engaging and accessible to everyone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/DailyFacts"
                className="px-6 py-3 bg-white shadow-sm border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:shadow transition-all flex items-center justify-center font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Daily Facts
              </Link>
              <Link
                href="/chatbot"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center justify-center font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                Ask Questions
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-gray-500">
                © 2025 MedhaBee. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
