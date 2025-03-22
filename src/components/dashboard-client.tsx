"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DashboardClient() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);
  
  if (!isLoaded || !isSignedIn) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        Welcome, {user?.firstName || 'User'}!
      </h2>
    </div>
  );
} 