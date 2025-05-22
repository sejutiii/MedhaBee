import { SignUpButton } from "@clerk/nextjs";

export default function SignUpBtn() {
  return (
    <SignUpButton mode="modal">
      <button
        className="px-5 py-2 bg-white-700 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md font-medium text-sm transition-all duration-200 cursor-pointer active:translate-y-0 active:shadow-sm"
        aria-label="Sign up with email"
      >
        Sign Up
      </button>
    </SignUpButton>
  );
}
