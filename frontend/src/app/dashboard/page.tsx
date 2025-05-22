"use client";

import { UserButton, useUser, useAuth, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import FeatureCard from "@/components/ui/FeatureCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState<{ user_id: string; language_preference: string } | null>(null);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserData();
    }
  }, [isSignedIn, user]);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 404 && user) {
        // New user, create profile
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user.id, language_preference: "en" }),
        });
        setUserData({ user_id: user.id, language_preference: "en" });
      } else if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handler for guest users trying to access restricted features
  const handleGuestFeatureClick = useCallback(() => {
    setShowLoginOverlay(true);
  }, []);

  const handleCloseOverlay = () => setShowLoginOverlay(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative">
      {/* Overlay for login prompt */}
      {showLoginOverlay && (
        <>
          {/* Dimmed Guest Page with lower opacity */}
          <div className="fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300" style={{ pointerEvents: 'none' }} />
          {/* Overlay Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                onClick={handleCloseOverlay}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-700">Login Required</h2>
              <p className="text-gray-600 mb-4">Sign Up to access this feature.</p>
              <SignUpButton mode="modal">
                <span className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition cursor-pointer">Sign Up</span>
              </SignUpButton>
            </div>
          </div>
        </>
      )}
      <div className="absolute top-4 right-4">
        {/* <UserButton afterSignOutUrl="/" /> */}
      </div>
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        {isSignedIn ? "Welcome to Medhabee!" : "Guest Mode: No data will be saved."}
      </h1>{isSignedIn ? (
        
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <FeatureCard
            icon={<span role="img" aria-label="Chatbot">💬</span>}
            title="Chatbot"
            description="Ask science questions and get clear, educational answers."
          >
            <Link href="/chatbot" className="block mt-4 text-blue-600 hover:underline">Go to Chatbot</Link>
          </FeatureCard>
          <FeatureCard
            icon={<span role="img" aria-label="Facts">💡</span>}
            title="Daily Facts"
            description="Discover interesting science facts every day."
          >
            <Link href="/DailyFacts" className="block mt-4 text-blue-600 hover:underline">Explore Facts</Link>
          </FeatureCard>
          <FeatureCard
            icon={<span role="img" aria-label="Videos">🎬</span>}
            title="Educational Videos"
            description="Watch curated science videos for visual learning."
          >
            <Link href="/videos" className="block mt-4 text-blue-600 hover:underline">Watch Videos</Link>
          </FeatureCard>
          <FeatureCard
            icon={<span role="img" aria-label="Quiz">📝</span>}
            title="Quiz"
            description="Test your knowledge with fun science quizzes."
          >
            <Link href="/DailyFacts/Quiz" className="block mt-4 text-blue-600 hover:underline">Take a Quiz</Link>
          </FeatureCard>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col items-center mt-8">
          <FeatureCard
            icon={<span role="img" aria-label="Chatbot">💬</span>}
            title="Chatbot"
            description="Ask science questions and get clear, educational answers."
          >
            <Link href="/chatbot" className="block mt-4 text-blue-600 hover:underline">Go to Chatbot</Link>
          </FeatureCard>
          <div className="w-full flex flex-row gap-8 mt-8">
            <div onClick={handleGuestFeatureClick} className="cursor-pointer flex-1 min-w-0">
              <FeatureCard
                icon={<span role="img" aria-label="Facts">💡</span>}
                title="Daily Facts"
                description="Sign Up to Access this feature"
              />
            </div>
            <div onClick={handleGuestFeatureClick} className="cursor-pointer flex-1 min-w-0">
              <FeatureCard
                icon={<span role="img" aria-label="Quiz">📝</span>}
                title="Quiz"
                description="Sign Up to Access this feature"
              />
            </div>
            <div onClick={handleGuestFeatureClick} className="cursor-pointer flex-1 min-w-0">
              <FeatureCard
                icon={<span role="img" aria-label="Videos">🎬</span>}
                title="Educational Videos"
                description="Sign Up to Access this feature"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}