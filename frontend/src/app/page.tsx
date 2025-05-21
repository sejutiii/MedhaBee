// import SignUpBtn from "@/components/SignUpButton";
// import SignInBtn from "@/components/SignInButton";
// import GuestBtn from "@/components/GuestButton";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to MedhaBee</h1>
//       <p className="text-lg mb-6 text-gray-600">Learn without limits, accessible to all.</p>
//       <div className="space-y-4">
//         <SignUpBtn />
//         <SignInBtn />
//         <GuestBtn />
//       </div>
//     </div>
//   );
// }

import HomeContent from "@/components/HomeContent";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeContent />
    </>
  );
}