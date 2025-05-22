"use client";
import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

export default function SignOutButton() {
  return (
    <ClerkSignOutButton>
      <button
        className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-md font-medium text-sm transition-all duration-200 cursor-pointer active:translate-y-0 active:shadow-sm"
        aria-label="Sign out"
      >
        Sign Out
      </button>
    </ClerkSignOutButton>
  );
}
