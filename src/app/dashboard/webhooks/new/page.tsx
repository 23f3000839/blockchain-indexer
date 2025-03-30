import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { requireAuth, getCurrentUser } from "@/lib/auth";
import ClientForm from "./client-form";

export default async function NewWebhookPage() {
  // Require authentication
  await requireAuth();
  
  // Get current user data
  const userData = await getCurrentUser();
  if (!userData) {
    redirect("/auth/sign-in");
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/webhooks">
            <Button variant="ghost" size="icon" className="mr-2 text-gray-300 hover:text-white hover:bg-gray-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create New Webhook</h1>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <ClientForm />
      </div>
    </div>
  );
} 