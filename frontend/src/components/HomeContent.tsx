"use client";
import { Accessibility, AudioLines, BotMessageSquareIcon, Languages } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";
import Link from "next/link";

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container px-4 py-8">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              MedhaBee
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn without barriers - Supporting multiple languages, accessibility needs, 
            and diverse learning styles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Chatbot Section */}
          <Link href="/chatbot">
          <FeatureCard 
          icon={<BotMessageSquareIcon />}
            title="AI-Powered Chatbot"
            description="Ask questions and get clear, educational answers"
            >
          </FeatureCard>
          </Link>
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

      </main>
    </div>
  );
}
