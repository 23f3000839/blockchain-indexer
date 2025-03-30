"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);
  
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return <>{children}</>;
} 