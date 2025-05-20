import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to MedhaBee</h1>
      <p className="text-lg mb-6 text-gray-600">Learn without limits, accessible to all.</p>
      <div className="space-y-4">
        <SignUpButton mode="modal">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
            aria-label="Sign up with email"
          >
            Sign Up
          </button>
        </SignUpButton>
        <SignInButton mode="modal">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200"
            aria-label="Sign in with email"
          >
            Sign In
          </button>
        </SignInButton>
        <Link href="/dashboard">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
            aria-label="Continue as guest without saving data"
          >
            Continue as Guest
          </button>
        </Link>
      </div>
    </div>
  );
}