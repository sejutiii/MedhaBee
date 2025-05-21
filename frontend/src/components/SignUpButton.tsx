import { SignUpButton } from "@clerk/nextjs";

export default function SignUpBtn() {
  return (
    <SignUpButton mode="modal">
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
        aria-label="Sign up with email"
      >
        Sign Up
      </button>
    </SignUpButton>
  );
}
