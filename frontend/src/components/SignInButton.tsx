import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInBtn() {
  return (
    <Link href="/dashboard">
      <SignInButton mode="modal">
        <button
          className="px-5 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md font-medium text-sm transition-all duration-200 cursor-pointer active:translate-y-0 active:shadow-sm"
          aria-label="Sign in with email"
        >
          Sign In
        </button>
      </SignInButton>
    </Link>
  );
}
