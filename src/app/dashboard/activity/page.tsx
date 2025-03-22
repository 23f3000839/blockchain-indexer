import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButtonClient } from "@/components/user-button-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  BellIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

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

export default async function ActivityPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Sample activity data
  const activities = [
    {
      id: "act_1",
      type: "indexer_created",
      description: "Created new indexer 'NFT Price Tracker'",
      timestamp: new Date("2023-10-25T09:30:00"),
      user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatars/user1.png"
      },
      entity: {
        id: "idx_123456",
        type: "indexer",
        name: "NFT Price Tracker"
      },
      status: "success"
    },
    {
      id: "act_2",
      type: "connection_updated",
      description: "Updated database connection 'Production Database'",
      timestamp: new Date("2023-10-25T10:15:00"),
      user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatars/user1.png"
      },
      entity: {
        id: "conn_1",
        type: "connection",
        name: "Production Database"
      },
      status: "success"
    },
    {
      id: "act_3",
      type: "indexing_started",
      description: "Started indexing job for 'NFT Collection Indexing'",
      timestamp: new Date("2023-10-25T10:30:00"),
      user: {
        name: "System",
        email: "system@example.com",
        avatar: "/avatars/system.png"
      },
      entity: {
        id: "job_123456",
        type: "indexing_job",
        name: "NFT Collection Indexing"
      },
      status: "in_progress"
    },
    {
      id: "act_4",
      type: "webhook_failed",
      description: "Webhook delivery failed for 'Token Transfers'",
      timestamp: new Date("2023-10-25T11:05:00"),
      user: {
        name: "System",
        email: "system@example.com",
        avatar: "/avatars/system.png"
      },
      entity: {
        id: "wh_789012",
        type: "webhook",
        name: "Token Transfers"
      },
      status: "error",
      error: "Target URL returned 503 Service Unavailable"
    },
    {
      id: "act_5",
      type: "webhook_created",
      description: "Created new webhook 'NFT Sales Tracker'",
      timestamp: new Date("2023-10-24T14:20:00"),
      user: {
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/avatars/user2.png"
      },
      entity: {
        id: "wh_123456",
        type: "webhook",
        name: "NFT Sales Tracker"
      },
      status: "success"
    },
    {
      id: "act_6",
      type: "indexing_completed",
      description: "Completed indexing job 'Wallet Activity Analysis'",
      timestamp: new Date("2023-10-23T12:45:00"),
      user: {
        name: "System",
        email: "system@example.com",
        avatar: "/avatars/system.png"
      },
      entity: {
        id: "job_901234",
        type: "indexing_job",
        name: "Wallet Activity Analysis"
      },
      status: "success",
      details: "8,750 records indexed"
    },
    {
      id: "act_7",
      type: "indexer_paused",
      description: "Paused indexer 'Historical DEX Swaps'",
      timestamp: new Date("2023-10-24T15:45:00"),
      user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatars/user1.png"
      },
      entity: {
        id: "idx_345678",
        type: "indexer",
        name: "Historical DEX Swaps"
      },
      status: "warning"
    }
  ];

  // Function to get the appropriate icon for an activity type
  const getActivityIcon = (activity: any) => {
    if (activity.status === "success") {
      return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
    } else if (activity.status === "error") {
      return <XCircleIcon className="h-6 w-6 text-red-400" />;
    } else if (activity.status === "warning") {
      return <ExclamationCircleIcon className="h-6 w-6 text-yellow-400" />;
    } else if (activity.status === "in_progress") {
      return <ArrowPathIcon className="h-6 w-6 text-blue-400" />;
    } else {
      return <BellIcon className="h-6 w-6 text-indigo-400" />;
    }
  };

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
                  href="/dashboard/webhooks"
                  className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Webhooks
                </Link>
                <Link
                  href="/dashboard/activity"
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Activity
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
              <h1 className="text-2xl font-bold text-white">Activity Log</h1>
              <div className="flex items-center space-x-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Export Activity
                </Button>
              </div>
            </div>

            <Card className="bg-gray-800 border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">User and system events over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activities.length === 0 ? (
                    <p className="text-gray-400">No recent activity to display.</p>
                  ) : (
                    <div className="relative">
                      <div className="absolute top-0 left-6 h-full w-0.5 bg-gray-700" aria-hidden="true"></div>
                      <ul className="space-y-6">
                        {activities.map((activity) => (
                          <li key={activity.id} className="relative flex gap-4">
                            <div className="flex-none z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 border border-gray-700">
                              {getActivityIcon(activity)}
                            </div>
                            <div className="flex flex-col flex-grow min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {activity.description}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {activity.user.name} • {activity.entity.type.charAt(0).toUpperCase() + activity.entity.type.slice(1)}
                                  </p>
                                </div>
                                <div className="flex-none flex items-center">
                                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-400">{activity.timestamp.toLocaleString()}</span>
                                </div>
                              </div>
                              {activity.error && (
                                <div className="mt-2 p-2 bg-red-900/30 rounded text-xs text-red-300">
                                  Error: {activity.error}
                                </div>
                              )}
                              {activity.details && (
                                <div className="mt-2 text-xs text-gray-400">
                                  {activity.details}
                                </div>
                              )}
                              <div className="mt-2 flex">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs border-gray-700 text-gray-300 hover:bg-gray-700"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 