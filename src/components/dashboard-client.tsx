"use client";

import { useUser } from "@clerk/nextjs";
import { ProtectedRoute } from "@/components/protected-route";

export function DashboardClient() {
  const { user } = useUser();
  
  return (
    <ProtectedRoute>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Welcome, {user?.firstName || 'User'}!
        </h2>
      </div>
    </ProtectedRoute>
  );
} 