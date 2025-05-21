import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInBtn() {
  return (
    <Link href="/dashboard">
      <SignInButton mode="modal">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200"
          aria-label="Sign in with email"
        >
          Sign In
        </button>
      </SignInButton>
    </Link>
  );
}
