"use client";
import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

export default function SignOutButton() {
  return (
    <ClerkSignOutButton>
      <button
        className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        aria-label="Sign out"
      >
        Sign Out
      </button>
    </ClerkSignOutButton>
  );
}
