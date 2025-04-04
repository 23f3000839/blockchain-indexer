import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import ClientForm from "./client-form";

export default async function NewDatabaseConnection() {
  await requireAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/connections">
            <Button variant="ghost" size="icon" className="mr-2 text-gray-300 hover:text-white hover:bg-gray-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">New Database Connection</h1>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-2">PostgreSQL Database Connection</h2>
        <p className="text-gray-300 mb-6">
          Enter your PostgreSQL database credentials to establish a connection for data indexing.
          All credentials are securely encrypted.
        </p>
        <ClientForm />
      </div>
    </div>
  );
} 