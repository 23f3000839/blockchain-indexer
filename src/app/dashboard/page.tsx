import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Database,
  WebhookIcon,
  GalleryHorizontalEnd,
  BarChart
} from "lucide-react";
import { UserButtonClient } from "@/components/user-button-client";
import { DashboardClient } from "@/components/dashboard-client";

// Server component separate from the main component
async function getUserData() {
  // Get the authObject first
  const authObject = await auth();
  const { userId } = authObject;
  
  if (!userId) {
    return null;
  }
  
  // Then get the user separately
  const user = await currentUser();
  return { userId, user };
}

export default async function Dashboard() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // These would be fetched from the database in a real implementation
  const mockStats = {
    databaseConnections: 0,
    indexingConfigurations: 0,
    webhookEndpoints: 0,
    totalRecordsIndexed: 0,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Dashboard Navbar */}
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-400">
                  Blockchain Indexer
                </Link>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/connections"
                  className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Database Connections
                </Link>
                <Link
                  href="/dashboard/indexers"
                  className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Indexers
                </Link>
                <Link
                  href="/dashboard/webhooks"
                  className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Webhooks
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <UserButtonClient />
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome, {userData.user?.firstName || 'User'}!
            </h2>
          </div>
          
          {/* Welcome Card */}
          <div className="px-4 py-6 sm:px-0">
            <Card className="bg-gray-800 border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Dashboard Overview</CardTitle>
                <CardDescription className="text-gray-300">
                  This is your Blockchain Indexing Platform dashboard where you can manage your data indexing configurations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-300">
                  You can set up multiple indexing configurations for different types of data from the Solana blockchain.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-white">Database Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-white">0</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                        <Link href="/dashboard/connections">Manage</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-white">Indexer Configurations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-white">0</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                        <Link href="/dashboard/indexers">Manage</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-white">Active Webhooks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-white">0</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                        <Link href="/dashboard/webhooks">Manage</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-white">Sync Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">No recent sync activity</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                        <Link href="/dashboard/status">View</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/dashboard/indexers/new">Create New Indexer</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Getting Started */}
          <div className="px-4 py-6 sm:px-0">
            <Card className="bg-gray-800 border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-white">Getting Started</CardTitle>
                <CardDescription className="text-gray-300">Follow these steps to set up your first data indexer.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-900 text-indigo-300">
                        1
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Connect Your Database</h4>
                      <p className="mt-1 text-sm text-gray-300">
                        Add your PostgreSQL database credentials to securely store indexed data.
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                          <Link href="/dashboard/connections/new">Add Database</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-900 text-indigo-300">
                        2
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Configure Your Indexer</h4>
                      <p className="mt-1 text-sm text-gray-300">
                        Choose what blockchain data you want to index and how you want it structured.
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                          <Link href="/dashboard/indexers/new">Create Indexer</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-900 text-indigo-300">
                        3
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Monitor Your Data</h4>
                      <p className="mt-1 text-sm text-gray-300">
                        View sync status, manage webhooks, and troubleshoot any issues.
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                          <Link href="/dashboard/status">View Status</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 