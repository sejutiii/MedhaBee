"use client";

import React, { useState, useEffect } from "react";
//import Image from 'next/image';
import Link from "next/link";
//import { LightbulbIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { sendChatMessage } from "@/services/chatService";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const categories = [
	{ id: "physics", name: "Physics", description: "Fundamental laws of the universe" },
	{ id: "biology", name: "Biology", description: "Life and living organisms" },
	{ id: "chemistry", name: "Chemistry", description: "Substances and their transformations" },
	{ id: "astronomy", name: "Astronomy", description: "Space and celestial objects" },
	{ id: "earth-science", name: "Earth Science", description: "Geology, weather, and environment" },
	{ id: "technology", name: "Technology", description: "Applied science and innovation" },
];

interface Fact { content: string; category: string; isLoading?: boolean; }

type CategoryId = (typeof categories)[number]["id"];
type SelectedCategories = Record<CategoryId, boolean>;

export default function FactsPage() {
	const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(
		categories.reduce((acc, cat) => ({ ...acc, [cat.id]: false }), {} as SelectedCategories)
	);
	const [facts, setFacts] = useState<Fact[]>([]);
	const [loading, setLoading] = useState(false);
	const [language, setLanguage] = useState<'en'|'bn'>('en');
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<Fact[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch facts for selected categories
	useEffect(() => {
		async function fetchFactsForSelectedCategories() {
			setLoading(true);
			try {
				const selected = Object.entries(selectedCategories)
					.filter(([_, v]) => v)
					.map(([k]) => k);
				const factsArr: Fact[] = [];
				for (const catId of selected) {
					const cat = categories.find((c) => c.id === catId);
					if (!cat) continue;
					try {
						const prompt = language === 'bn'
							? `${cat.name} সম্পর্কে একটি আকর্ষণীয়, নির্ভুল এবং সংক্ষিপ্ত বিজ্ঞান তথ্য দিন।`
							: `Give me a random, concise and accurate science fact about ${cat.name}.`;
						const response = await sendChatMessage(prompt, language);
						factsArr.push({ content: response, category: cat.name });
					} catch (e) {
						factsArr.push({ content: `Failed to fetch fact for ${cat?.name || catId}.`, category: cat?.name || catId });
					}
					await new Promise(res => setTimeout(res, 1200));
				}
				setFacts(factsArr);
			} catch (e) {
				setFacts([{ content: "Failed to fetch facts. Please try again.", category: "" }]);
			} finally {
				setLoading(false);
			}
		}
		fetchFactsForSelectedCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategories, language]);

	// Search handler
	async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!searchQuery.trim()) return;
		setIsSearching(true);
		setSearchResults([]);
		setSearchTerm("");
		try {
			const prompt = language === 'bn'
				? `${searchQuery} সম্পর্কে একটি আকর্ষণীয়, নির্ভুল এবং সংক্ষিপ্ত বিজ্ঞান তথ্য দিন।`
				: `Give me an interesting, concise and accurate science fact about ${searchQuery}.`;
			const response = await sendChatMessage(prompt, language);
			setSearchResults([{ content: response, category: searchQuery }]);
			setSearchTerm(searchQuery);
		} catch (e) {
			setSearchResults([{ content: "Failed to fetch facts. Please try again.", category: "Error" }]);
		} finally {
			setIsSearching(false);
		}
	}

	// Category toggle
	const toggleCategory = (categoryId: keyof typeof selectedCategories) => {
		setSelectedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header with Navigation */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
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
							<Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
							<Link href="/chatbot" className="text-gray-600 hover:text-blue-600">Chat</Link>
							<Link href="/DailyFacts" className="text-blue-600 font-medium">Daily Facts</Link>
							<Link href="/videos" className="text-gray-600 hover:text-blue-600">Videos</Link>
						</nav>
					</div>
					<div className="flex items-center space-x-3">
						<button
							onClick={() => setLanguage('en')}
							className={`px-3 py-1 rounded-md ${language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
						>English</button>
						<button
							onClick={() => setLanguage('bn')}
							className={`px-3 py-1 rounded-md ${language === 'bn' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
						>বাংলা</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-8">
				{/* Title and Subtitle Section */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{language === 'bn' ? 'দৈনিক বিজ্ঞান তথ্য' : 'Daily Science Facts'}</h1>
					<p className="text-lg text-gray-600">{language === 'bn' ? 'নতুন কিছু জানুন, প্রতিদিন!' : 'Learn something new, every day!'}</p>
				</div>

				{/* Search Section */}
				<div className="mb-8">
					<form onSubmit={handleSearch} className="max-w-2xl mx-auto">
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder={language === 'bn' ? 'যেকোনো বিজ্ঞান তথ্য অনুসন্ধান করুন...' : 'Search for any science fact...'}
								value={searchQuery}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
								disabled={isSearching}
								className="w-full pr-4"
							/>
							<button
								type="submit"
								className={`px-6 py- rounded-lg font-medium transition-all duration-200 ${isSearching ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
								disabled={isSearching || !searchQuery.trim()}
							>{isSearching ? (language === 'bn' ? 'অনুসন্ধান হচ্ছে...' : 'Searching...') : (language === 'bn' ? 'অনুসন্ধান' : 'Search')}</button>
						</div>
					</form>
				</div>

				{/* Search Results */}
				{searchResults.length > 0 && (
					<div className="grid gap-6 max-w-4xl mx-auto mb-8">
						<div className="text-sm text-gray-600 mb-2">
							{searchTerm && <span>{language === 'bn' ? 'অনুসন্ধানের ফলাফল:' : 'Search results for:'} <span className="font-medium">{searchTerm}</span></span>}
						</div>
						{searchResults.map((fact, idx) => (
							<Card key={`search-${idx}`} className="w-full">
								<div className="p-6 font-sans prose prose-blue max-w-none">
									<div className="flex items-center justify-between mb-4">
										<span className="text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider bg-blue-100 text-blue-800">
											{/* Use category if it matches a known category, else Miscellaneous */}
											{categories.some(c => c.name.toLowerCase() === fact.category.toLowerCase()) ? fact.category : (language === 'bn' ? 'বিবিধ' : 'Miscellaneous')}
										</span>
									</div>
									<ReactMarkdown>{fact.content}</ReactMarkdown>
								</div>
							</Card>
						))}
					</div>
				)}

				{/* Category Filter Section */}
				<div className="bg-blue-50 rounded-xl p-6 mb-10">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{categories.map((category) => (
							<div key={category.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
								<div>
									<h3 className="font-medium text-gray-800">{category.name}</h3>
									<p className="text-sm text-gray-500">{category.description}</p>
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
				</div>

				{/* Facts Cards */}
				<div className="grid gap-6 max-w-4xl mx-auto">
					{loading ? (
						<div className="text-gray-500 text-center py-8">
							<svg className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span>{language === 'bn' ? 'তথ্য লোড হচ্ছে...' : 'Loading facts...'}</span>
						</div>
					) : facts.length > 0 ? (
						facts.map((fact, index) => (
							<Card key={index} className="w-full">
								<div className="p-6 font-sans prose prose-blue max-w-none">
									<div className="flex items-center justify-between mb-4">
										<span className="text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider bg-blue-100 text-blue-800">{fact.category}</span>
										<button
											className="ml-auto px-4 py-1 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											onClick={async () => {
												// Fetch a new fact for this category
												const cat = categories.find((c) => c.name === fact.category);
												if (!cat) return;
												try {
													const prompt = language === 'bn'
														? `${cat.name} সম্পর্কে একটি আকর্ষণীয়, নির্ভুল এবং সংক্ষিপ্ত বিজ্ঞান তথ্য দিন।`
														: `Give me a random, concise and accurate science fact about ${cat.name}.`;
													const response = await sendChatMessage(prompt, language);
													setFacts((prev) => prev.map((f, i) => i === index ? { ...f, content: response } : f));
												} catch (e) {
													setFacts((prev) => prev.map((f, i) => i === index ? { ...f, content: `Failed to fetch fact for ${cat.name}.` } : f));
												}
											}}
										>
											{language === 'bn' ? 'পরবর্তী' : 'Next'}
										</button>
									</div>
									<ReactMarkdown>{fact.content}</ReactMarkdown>
								</div>
							</Card>
						))
					) : null}
				</div>
			</main>
		</div>
	);
}
