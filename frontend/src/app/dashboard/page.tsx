"use client";

import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState<{ user_id: string; language_preference: string } | null>(null);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserData();
    }
  }, [isSignedIn, user]);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 404 && user) {
        // New user, create profile
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user.id, language_preference: "en" }),
        });
        setUserData({ user_id: user.id, language_preference: "en" });
      } else if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="absolute top-4 right-4">
      </div>
      <h1 className="text-3xl font-bold mb-4 text-gray-800">MedhaBee Dashboard</h1>
      {isSignedIn ? (
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Welcome, {user?.firstName || "User"}!
          </p>
          <p className="text-md text-gray-500">
            Language Preference: {userData?.language_preference || "Loading..."}
          </p>
        </div>
      ) : (
        <p className="text-md text-gray-500">
          Guest Mode: No data will be saved.
        </p>
      )}
    </div>
  );
}