"use client";

import { useState } from "react";
//import Image from 'next/image';
import Link from "next/link";
//import { LightbulbIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    id: "physics",
    name: "Physics",
    description: "Fundamental laws of the universe",
  },
  { id: "biology", name: "Biology", description: "Life and living organisms" },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Substances and their transformations",
  },
  {
    id: "astronomy",
    name: "Astronomy",
    description: "Space and celestial objects",
  },
  {
    id: "earth-science",
    name: "Earth Science",
    description: "Geology, weather, and environment",
  },
  {
    id: "technology",
    name: "Technology",
    description: "Applied science and innovation",
  },
];

const facts = [
  {
    id: 1,
    category: "Physics",
    title: "The Speed of Light",
    content:
      "Light travels at a speed of 299,792,458 meters per second in a vacuum. It takes about 8 minutes and 20 seconds for light from the Sun to reach Earth.",
    source: "NASA",
    image: "/images/space-nebula.jpg",
  },
  // Add more facts here...
];

export default function FactsPage() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  type CategoryId = (typeof categories)[number]["id"];
  type SelectedCategories = Record<CategoryId, boolean>;

  const [selectedCategories, setSelectedCategories] =
    useState<SelectedCategories>(
      categories.reduce(
        (acc, cat) => ({ ...acc, [cat.id]: cat.id === "physics" }),
        {} as SelectedCategories
      )
    );

  const handlePrevious = () => {
    setCurrentFactIndex((prev) => (prev > 0 ? prev - 1 : facts.length - 1));
  };

  const handleNext = () => {
    setCurrentFactIndex((prev) => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  interface ToggleCategoryFn {
    (categoryId: keyof typeof selectedCategories): void;
  }

  const toggleCategory: ToggleCategoryFn = (categoryId) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const currentFact = facts[currentFactIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 flex items-center"
            >
              MedhaBee
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/chat" className="text-gray-600 hover:text-blue-600">
                Chat
              </Link>
              <Link href="/DailyFacts" className="text-blue-600 font-medium">
                Daily Facts
              </Link>
              <Link
                href="/videos"
                className="text-gray-600 hover:text-blue-600"
              >
                Videos
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daily Science Facts
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore interesting science facts based on your interests
          </p>
        </div>

        {/* Category Filter Section */}
        <div className="bg-blue-50 rounded-xl p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={selectedCategories[category.id]}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/DailyFacts/Quiz" className="flex items-center">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Take a Quiz
              </button>
            </Link>
          </div>
        </div>

        {/* Fact Card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
          {/* Fact Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
            <img
              src={currentFact.image}
              alt={currentFact.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Fact Content */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
                {currentFact.category}
              </span>
              <button className="ml-auto p-1 text-blue-600 rounded-full hover:bg-blue-50">
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
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentFact.title}
            </h2>
            <p className="text-gray-700 mb-4">{currentFact.content}</p>
            <p className="text-gray-500 text-sm">
              Source: {currentFact.source}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <span className="text-sm text-gray-500">
              {currentFactIndex + 1} of {facts.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
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
