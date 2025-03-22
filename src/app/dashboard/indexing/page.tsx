import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import { UserButtonClient } from "@/components/user-button-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

export default async function IndexingPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Sample data - in a real application, this would come from your database
  const indexingJobs = [
    {
      id: "job_123456",
      name: "NFT Collection Indexing",
      type: "nft_collections",
      status: "running",
      progress: 68,
      startedAt: new Date("2023-10-25T10:30:00"),
      estimatedCompletion: new Date("2023-10-25T14:30:00"),
      recordsProcessed: 2547,
      totalRecords: 3750,
      targetDatabase: "prod_db",
    },
    {
      id: "job_789012",
      name: "Token Price History",
      type: "token_prices",
      status: "queued",
      progress: 0,
      startedAt: null,
      estimatedCompletion: null,
      recordsProcessed: 0,
      totalRecords: 5000,
      targetDatabase: "analytics_db",
    },
    {
      id: "job_345678",
      name: "Historical DEX Swaps",
      type: "dex_activity",
      status: "paused",
      progress: 42,
      startedAt: new Date("2023-10-24T15:45:00"),
      estimatedCompletion: null,
      recordsProcessed: 1254,
      totalRecords: 3000,
      targetDatabase: "trading_db",
    },
    {
      id: "job_901234",
      name: "Wallet Activity Analysis",
      type: "wallet_activity",
      status: "completed",
      progress: 100,
      startedAt: new Date("2023-10-23T09:15:00"),
      estimatedCompletion: new Date("2023-10-23T12:45:00"),
      recordsProcessed: 8750,
      totalRecords: 8750,
      targetDatabase: "analytics_db",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
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
                  className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                  href="/dashboard/indexing"
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Indexing Jobs
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

      {/* Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Indexing Jobs</h1>
              <div className="flex items-center space-x-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/dashboard/indexing/new" className="flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Indexing Job
                  </Link>
                </Button>
              </div>
            </div>

            {indexingJobs.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-200 mb-2">No indexing jobs yet</h3>
                <p className="text-gray-400 mb-4">
                  Start your first blockchain data indexing job to populate your database.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/dashboard/indexing/new" className="flex items-center justify-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Indexing Job
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {indexingJobs.map((job) => (
                  <Card key={job.id} className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-white">{job.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            ID: {job.id} • Type: {job.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </CardDescription>
                        </div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'running' 
                            ? 'bg-green-900 text-green-100' 
                            : job.status === 'queued'
                            ? 'bg-blue-900 text-blue-100'
                            : job.status === 'paused'
                            ? 'bg-yellow-900 text-yellow-100'
                            : 'bg-gray-700 text-gray-100'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-300">Progress: {job.progress}%</span>
                          <span className="text-sm text-gray-300">
                            {job.recordsProcessed.toLocaleString()} / {job.totalRecords.toLocaleString()} records
                          </span>
                        </div>
                        <Progress value={job.progress} className="h-2 bg-gray-700" 
                          indicatorClassName={
                            job.status === 'running' 
                              ? 'bg-green-500' 
                              : job.status === 'paused'
                              ? 'bg-yellow-500'
                              : job.status === 'completed'
                              ? 'bg-indigo-500'
                              : 'bg-blue-500'
                          } />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Target Database:</p>
                          <p className="text-white font-medium">{job.targetDatabase}</p>
                        </div>
                        {job.startedAt && (
                          <div>
                            <p className="text-gray-400">Started At:</p>
                            <p className="text-white font-medium">{job.startedAt.toLocaleString()}</p>
                          </div>
                        )}
                        {job.estimatedCompletion && (
                          <div>
                            <p className="text-gray-400">Estimated Completion:</p>
                            <p className="text-white font-medium">{job.estimatedCompletion.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      {job.status === 'running' && (
                        <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500 hover:bg-yellow-900 hover:text-yellow-100">
                          Pause
                        </Button>
                      )}
                      {job.status === 'paused' && (
                        <Button variant="outline" size="sm" className="border-green-600 text-green-500 hover:bg-green-900 hover:text-green-100">
                          Resume
                        </Button>
                      )}
                      {job.status === 'queued' && (
                        <Button variant="outline" size="sm" className="border-green-600 text-green-500 hover:bg-green-900 hover:text-green-100">
                          Start Now
                        </Button>
                      )}
                      {job.status !== 'completed' && (
                        <Button variant="outline" size="sm" className="border-red-600 text-red-500 hover:bg-red-900 hover:text-red-100">
                          Cancel
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 