"use client";
import {
  Accessibility,
  AudioLines,
  BotMessageSquareIcon,
  Languages,
} from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";
import Link from "next/link";

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              MedhaBee
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Learn without barriers - Supporting multiple languages,
            accessibility needs, and diverse learning styles.
          </p>
        </div>

        {/* Main Chatbot Feature */}
        <div className="max-w-md mx-auto mb-12 md:mb-16 transition-transform hover:scale-102">
          <Link href="/chatbot" className="block">
            <FeatureCard
              icon={<BotMessageSquareIcon size={40} />}
              title="AI-Powered Chatbot"
              description="Ask questions and get clear, educational answers"
            />
          </Link>
        </div>

        {/* Features Section */}
        <section aria-labelledby="features-heading" className="mt-8 md:mt-12">
          <h2
            id="features-heading"
            className="text-2xl font-semibold text-center text-gray-800 mb-8"
          >
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<AudioLines size={32} />}
              title="Multimodal Learning"
              description="Text, audio, and visual learning supported"
            />
            <FeatureCard
              icon={<Languages size={32} />}
              title="বাংলা/English Support"
              description="Learn in your preferred language"
            />
            <FeatureCard
              icon={<Accessibility size={32} />}
              title="Full Accessibility"
              description="Screen reader optimized, voice commands, and adjustable interfaces"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
