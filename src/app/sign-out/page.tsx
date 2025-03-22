"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // If not signed in, redirect to home
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Clerk will handle the redirect to the home page
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sign Out</h1>
          <p className="text-gray-400">Are you sure you want to sign out?</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleSignOut} 
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => router.back()}
            disabled={isSigningOut}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
} 