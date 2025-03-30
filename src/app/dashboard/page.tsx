import { redirect } from "next/navigation";
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
  Settings,
  BarChart3
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SyncStatus } from "@prisma/client";

// Define the type for sync status with config relation
type SyncStatusWithConfig = SyncStatus & {
  config: {
    id: string;
    name: string;
    userId: string;
  }
};

export default async function Dashboard() {
  const userData = await getCurrentUser();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Default values in case of database errors
  let databaseConnectionsCount = 0;
  let indexingConfigurationsCount = 0;
  let webhookEndpointsCount = 0;
  let syncStatusesCount = 0;
  let latestSyncStatuses: SyncStatusWithConfig[] = [];

  try {
    // Fetch counts from the database with error handling
    [
      databaseConnectionsCount,
      indexingConfigurationsCount,
      webhookEndpointsCount,
      syncStatusesCount
    ] = await Promise.all([
      prisma.databaseConnection.count({
        where: { userId: userData.userId }
      }),
      prisma.indexingConfiguration.count({
        where: { userId: userData.userId }
      }),
      prisma.webhookEndpoint.count({
        where: { userId: userData.userId }
      }),
      prisma.syncStatus.count()
    ]);

    // Fetch the latest sync statuses
    latestSyncStatuses = await prisma.syncStatus.findMany({
      where: {
        config: {
          userId: userData.userId
        }
      },
      include: {
        config: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    }) as SyncStatusWithConfig[];
  } catch (error) {
    console.error("Database query error:", error);
    // Continue with default values
    latestSyncStatuses = [];
  }

  const stats = {
    databaseConnections: databaseConnectionsCount,
    indexingConfigurations: indexingConfigurationsCount,
    webhookEndpoints: webhookEndpointsCount,
    totalRecordsIndexed: latestSyncStatuses.reduce((acc, status) => acc + (status.recordsProcessed || 0), 0),
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
            </div>
          </div>
        </div>
      </nav>

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
                
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Database Connections</p>
                          <p className="text-2xl font-bold text-white">{stats.databaseConnections}</p>
                        </div>
                        <div className="p-2 bg-indigo-700 rounded-full">
                          <Database className="h-6 w-6 text-indigo-200" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 border-t border-gray-600">
                      <Link 
                        href="/dashboard/connections" 
                        className="text-xs text-indigo-400 hover:text-indigo-300 w-full text-center py-1 flex items-center justify-center"
                      >
                        View Details <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Indexing Configurations</p>
                          <p className="text-2xl font-bold text-white">{stats.indexingConfigurations}</p>
                        </div>
                        <div className="p-2 bg-green-700 rounded-full">
                          <BarChart3 className="h-6 w-6 text-green-200" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 border-t border-gray-600">
                      <Link 
                        href="/dashboard/indexing" 
                        className="text-xs text-green-400 hover:text-green-300 w-full text-center py-1 flex items-center justify-center"
                      >
                        View Details <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Helius <br/> Webhooks</p>
                          
                          <p className="text-2xl font-bold text-white">{stats.webhookEndpoints}</p>
                        </div>
                        <div className="p-2 bg-blue-700 rounded-full">
                          <WebhookIcon className="h-6 w-6 text-blue-200" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 border-t border-gray-600">
                      <Link 
                        href="/dashboard/webhooks" 
                        className="text-xs text-blue-400 hover:text-blue-300 w-full text-center py-1 flex items-center justify-center"
                      >
                        View Details <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                {/* Latest Sync Activity */}
                {latestSyncStatuses.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-white mb-4">Latest Sync Activity</h3>
                    <div className="bg-gray-700 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-600">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Configuration</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Records</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-700 divide-y divide-gray-600">
                            {latestSyncStatuses.map((status) => (
                              <tr key={status.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                  {status.config.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    status.status === 'COMPLETED' 
                                      ? 'bg-green-900 text-green-200' 
                                      : status.status === 'FAILED'
                                      ? 'bg-red-900 text-red-200'
                                      : status.status === 'RUNNING'
                                      ? 'bg-blue-900 text-blue-200'
                                      : 'bg-yellow-900 text-yellow-200'
                                  }`}>
                                    {status.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                  {status.recordsProcessed.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                  {new Date(status.createdAt).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Start Guides */}
                {stats.databaseConnections === 0 && (
                  <div className="mt-8 bg-gray-700 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-2">Getting Started</h3>
                    <p className="text-gray-300 mb-4">
                      To begin indexing Solana blockchain data, follow these steps:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                      <li>Create a database connection by adding your PostgreSQL credentials</li>
                      <li>Set up an indexing configuration to specify what data you want to index</li>
                      <li>The system will automatically create a webhook to receive blockchain data</li>
                      <li>Monitor your indexing progress from the dashboard</li>
                    </ol>
                    <div className="mt-4">
                      <Link href="/dashboard/connections/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          Create Your First Connection
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 