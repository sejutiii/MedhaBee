import Link from "next/link";

export default function GuestBtn() {
  return (
    <Link href="guest/dashboard">
      <button
        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
        aria-label="Continue as guest without saving data"
      >
        Continue as Guest
      </button>
    </Link>
  );
}
