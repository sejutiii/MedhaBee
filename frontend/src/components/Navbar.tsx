import SignInBtn from "@/components/SignInButton";
import SignUpBtn from "@/components/SignUpButton";
import GuestBtn from "@/components/GuestButton";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm px-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-700">MedhaBee</div>
      <div className="flex gap-4">
        <SignInBtn />
        <SignUpBtn />
        <GuestBtn />
      </div>
    </nav>
  );
}
