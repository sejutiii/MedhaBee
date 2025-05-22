"use client";

import { useState } from "react";
import Link from "next/link";

// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    category: "Biology",
    question: "Approximately how many genes does the human genome contain?",
    options: [
      { text: "5,000-10,000", isCorrect: false },
      { text: "20,000-25,000", isCorrect: true },
      { text: "100,000-150,000", isCorrect: false },
      { text: "1 million+", isCorrect: false },
    ],
    explanation:
      "The human genome contains approximately 20,000-25,000 genes, which is fewer than scientists initially expected.",
  },
  {
    id: 2,
    category: "Physics",
    question: "Which of the following is NOT a fundamental force in nature?",
    options: [
      { text: "Gravity", isCorrect: false },
      { text: "Electromagnetic force", isCorrect: false },
      { text: "Nuclear force", isCorrect: true },
      { text: "Weak interaction", isCorrect: false },
    ],
    explanation:
      'The four fundamental forces in nature are gravity, electromagnetic force, strong nuclear force, and weak nuclear force. "Nuclear force" as a general term is not one of the fundamental forces.',
  },
  {
    id: 3,
    category: "Chemistry",
    question: "What is the most abundant element in the Earth's atmosphere?",
    options: [
      { text: "Oxygen", isCorrect: false },
      { text: "Carbon Dioxide", isCorrect: false },
      { text: "Hydrogen", isCorrect: false },
      { text: "Nitrogen", isCorrect: true },
    ],
    explanation:
      "Nitrogen makes up about 78% of Earth's atmosphere, making it the most abundant element.",
  },
];

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing answer

    setSelectedOption(optionIndex);
    setShowExplanation(true);

    if (currentQuestion.options[optionIndex].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

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
              <Link
                href="/chatbot"
                className="text-gray-600 hover:text-blue-600"
              >
                Chat
              </Link>
              <Link
                href="/DailyFacts"
                className="text-gray-600 hover:text-blue-600"
              >
                Daily Facts
              </Link>
              <Link
                href="/DailyFacts/Quiz"
                className="text-blue-600 font-medium"
              >
                Quiz
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
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {quizCompleted ? (
          // Quiz Results Section
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-600 text-3xl font-bold mb-6">
                {score}/{quizQuestions.length}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quiz Completed!
              </h2>
              <p className="text-gray-600 mb-8">
                {score === quizQuestions.length
                  ? "Perfect score! You're a science master!"
                  : score > quizQuestions.length / 2
                  ? "Great job! You have a solid understanding of science concepts."
                  : "Good effort! Keep learning and you'll do even better next time."}
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  Take Quiz Again
                </button>
                <Link
                  href="/DailyFacts"
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Return to Daily Facts
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Quiz Question Section
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </span>
                <span>
                  Score: {score}/{currentQuestionIndex}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (currentQuestionIndex / quizQuestions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
              {/* Question Header */}
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 text-left rounded-lg border transition-all ${
                        selectedOption === index
                          ? option.isCorrect
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "bg-red-50 border-red-500 text-red-700"
                          : selectedOption !== null && option.isCorrect
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full border mr-3 mt-0.5 ${
                            selectedOption === index
                              ? option.isCorrect
                                ? "bg-green-500 border-green-500"
                                : "bg-red-500 border-red-500"
                              : selectedOption !== null && option.isCorrect
                              ? "bg-green-500 border-green-500"
                              : "border-gray-400"
                          }`}
                        ></div>
                        <span>{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Explanation:
                    </h3>
                    <p className="text-blue-700">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    className={`px-6 py-2 rounded-lg ${
                      selectedOption === null
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {currentQuestionIndex < quizQuestions.length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
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
