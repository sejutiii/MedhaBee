"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";

// Categories
const categories = [
  { id: "biology", name: "Biology", color: "bg-green-100 text-green-800", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "physics", name: "Physics", color: "bg-blue-100 text-blue-800", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "chemistry", name: "Chemistry", color: "bg-purple-100 text-purple-800", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { id: "medicine", name: "Medicine", color: "bg-red-100 text-red-800", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
];

// Predefined video queries for each category
const categoryQueries = {
  biology: "cell division biology",
  physics: "quantum mechanics physics",
  chemistry: "chemical reactions chemistry",
  medicine: "how vaccines work medicine",
};

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views: string;
  videoUrl: string;
  category: string;
};

type CategoryKey = "biology" | "physics" | "chemistry" | "medicine";

// Reusable Video Card Component
function VideoCard({
  video,
  simplifiedMode,
  onPlay,
}: {
  video: Video;
  simplifiedMode: boolean;
  onPlay: (video: { id: string; title: string; videoUrl: string }) => void;
}) {
  return (
    <div
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
      onClick={() => onPlay({ id: video.id, title: video.title, videoUrl: video.videoUrl })}
    >
      <div className="relative h-52">
        <Image src={video.thumbnail} alt={video.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" priority={video.id.includes("1")} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 text-xs rounded-md">{video.duration}</div>
        <div className="absolute top-3 left-3">
          {/* Removed the label that says 'search' on top of the video card */}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 bg-blue-600/90 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600">{video.title}</h3>
        <div className="flex text-sm text-gray-600">
          <span className="mr-3">{video.channel}</span>
          <span>{video.views}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <div className="text-xs flex items-center py-1 px-2 bg-blue-50 text-blue-700 rounded">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Watch
          </div>
          <Link
            href={`/chatbot?topic=${encodeURIComponent(video.title)}`}
            className="text-xs flex items-center py-1 px-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ask
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("biology");
  const [searchQuery, setSearchQuery] = useState("");
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string; videoUrl: string } | null>(null);
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [categoryVideos, setCategoryVideos] = useState<Record<CategoryKey, Video[]>>({
    biology: [],
    physics: [],
    chemistry: [],
    medicine: [],
  });

  // Fetch category videos on mount
  useEffect(() => {
    const fetchCategoryVideos = async () => {
      const newCategoryVideos = { ...categoryVideos };
      for (const [category, query] of Object.entries(categoryQueries)) {
        try {
          const response = await fetch(`http://localhost:8000/videos?query=${encodeURIComponent(query)}`);
          if (!response.ok) throw new Error("Failed to fetch category videos");
          const data = await response.json();
          newCategoryVideos[category as CategoryKey] = data;
        } catch (error) {
          console.error(`Error fetching videos for ${category}:`, error);
          newCategoryVideos[category as CategoryKey] = []; // Fallback to empty array
        }
      }
      setCategoryVideos(newCategoryVideos);
    };
    fetchCategoryVideos();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/videos?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to fetch search results");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-blue-600 flex items-center">
              <svg className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              MedhaBee
            </Link>
            <nav className="hidden md:flex gap-8">
              {["Home", "Chat", "DailyFacts", "Videos"].map((item) => (
                <Link
                  key={item}
                  href={
                  item === "Home"
                    ? "/"
                    : item === "DailyFacts"
                    ? "/DailyFacts"
                    : item === "Chat"
                    ? "/chatbot"
                    : `/${item.toLowerCase()}`
                  }
                  className={`font-medium ${item === "Videos" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600 hover:text-blue-600"}`}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`p-1.5 rounded-full ${simplifiedMode ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"} hover:bg-blue-100`}
              onClick={() => setSimplifiedMode(!simplifiedMode)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4 items-center justify-center">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Science Video Library</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Watch educational science videos</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 bg-white p-2 rounded-xl shadow-sm">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 bg-gray-50"
                placeholder="Search science videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="ml-2 bg-blue-600 text-white px-6 py-3.5 rounded-lg hover:bg-blue-700 font-medium">Search</button>
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-12 bg-blue-600 rounded-r mr-4 hidden md:block"></div>
              <h2 className="text-2xl font-bold text-gray-900">Search Results for "{searchQuery}"</h2>
              <span className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">{searchResults.length} videos</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((video) => (
                <VideoCard key={video.id} video={video} simplifiedMode={simplifiedMode} onPlay={setSelectedVideo} />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-xl font-medium text-gray-700 text-center mb-5">Select a Category</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`flex items-center px-6 py-3.5 rounded-xl border-2 ${selectedCategory === category.id ? `${category.color} shadow-md scale-105` : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"} transition-all`}
                onClick={() => {
                  setSelectedCategory(category.id as CategoryKey);
                  setSearchResults([]);
                }}
              >
                <svg className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                </svg>
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Category Videos */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-12 bg-blue-600 rounded-r mr-4 hidden md:block"></div>
            <h2 className="text-2xl font-bold text-gray-900">{categories.find((cat) => cat.id === selectedCategory)?.name} Videos</h2>
            <span className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">{categoryVideos[selectedCategory].length} videos</span>
            <div className="ml-auto flex gap-3">
              <Link href={`/chatbot?topic=${encodeURIComponent(categories.find((cat) => cat.id === selectedCategory)?.name || "")}`} className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryVideos[selectedCategory].map((video) => (
              <VideoCard key={video.id} video={video} simplifiedMode={simplifiedMode} onPlay={setSelectedVideo} />
            ))}
          </div>
        </section>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setSelectedVideo(null)}>
            <div className="w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-0 pb-[56.25%]">
                <VideoPlayer videoUrl={selectedVideo.videoUrl} title={selectedVideo.title} onClose={() => setSelectedVideo(null)} />
              </div>
              <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-lg font-medium truncate mr-4">{selectedVideo.title}</h3>
                <div className="flex gap-2">
                  <a href={selectedVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-white rounded-md">YouTube</a>
                  <button onClick={() => setSelectedVideo(null)} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Discovery */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="inline-flex h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4 items-center justify-center">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Discover More</h3>
              <p className="text-gray-600 max-w-xl">Explore engaging science resources for everyone.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/DailyFacts" className="px-6 py-3 bg-white border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Daily Facts
              </Link>
              <Link href="/chatbot" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask Questions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}