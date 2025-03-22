"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <SignIn />;
}
