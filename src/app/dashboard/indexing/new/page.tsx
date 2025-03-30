import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ClientForm from "./client-form";

// UI components
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Create New Indexing Configuration",
  description: "Create a new blockchain data indexing configuration",
};

export default async function NewIndexingConfigPage() {
  // Require authentication
  await requireAuth();
  
  // Get current user data
  const userData = await getCurrentUser();
  if (!userData) {
    redirect("/auth/sign-in");
  }
  
  // Get active database connections for the user
  const connections = await prisma.databaseConnection.findMany({
    where: {
      userId: userData.userId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      host: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
  
  // Redirect to create a connection if none exists
  if (connections.length === 0) {
    redirect("/dashboard/connections/new?message=Please create a database connection first");
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/indexing">
            <Button variant="ghost" size="icon" className="mr-2 text-gray-300 hover:text-white hover:bg-gray-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create New Indexing Configuration</h1>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <ClientForm connections={connections} />
      </div>
    </div>
  );
} 