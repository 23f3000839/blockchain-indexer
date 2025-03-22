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
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default async function MonitoringPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Mock data for the monitoring dashboard
  const systemStats = {
    uptime: "99.8%",
    responseTime: "120ms",
    storageUsed: "1.8TB",
    lastError: new Date("2023-10-24T15:20:00"),
    activeJobs: 3,
    queuedJobs: 2,
    completedJobs: 87,
    failedJobs: 2,
  };

  // Sample resource metrics (CPU, memory, etc.)
  const resourceMetrics = [
    { name: "CPU Usage", value: "42%", change: "+12%", trend: "up" },
    { name: "Memory Usage", value: "3.2GB", change: "+0.5GB", trend: "up" },
    { name: "Database Connections", value: "28", change: "-3", trend: "down" },
    { name: "API Requests", value: "1.2K/min", change: "+15%", trend: "up" },
    { name: "Storage I/O", value: "75MB/s", change: "-5MB/s", trend: "down" },
    { name: "Network Traffic", value: "120MB/s", change: "+10MB/s", trend: "up" },
  ];

  // Recent alerts
  const recentAlerts = [
    {
      id: "alert_1",
      level: "warning",
      message: "High memory usage detected in indexer service",
      timestamp: new Date("2023-10-25T09:45:00"),
      resolved: true,
    },
    {
      id: "alert_2",
      level: "error",
      message: "Database connection pool exhausted",
      timestamp: new Date("2023-10-24T22:17:00"),
      resolved: true,
    },
    {
      id: "alert_3",
      level: "warning",
      message: "API rate limit approaching threshold",
      timestamp: new Date("2023-10-25T10:30:00"),
      resolved: false,
    },
    {
      id: "alert_4",
      level: "info",
      message: "Webhook delivery latency increased",
      timestamp: new Date("2023-10-25T11:05:00"),
      resolved: false,
    },
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
                  href="/dashboard/monitoring"
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Monitoring
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
              <h1 className="text-2xl font-bold text-white">System Monitoring</h1>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Refresh Data
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 text-gray-300">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">System Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-400">{systemStats.uptime}</p>
                      <p className="text-sm text-gray-400 mt-1">Last 30 days</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Avg. Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-indigo-400">{systemStats.responseTime}</p>
                      <p className="text-sm text-gray-400 mt-1">API endpoints</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Storage Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-indigo-400">{systemStats.storageUsed}</p>
                      <p className="text-sm text-gray-400 mt-1">Total capacity: 5TB</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Last Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold text-white">{systemStats.lastError.toLocaleString()}</p>
                      <p className="text-sm text-gray-400 mt-1">Database connection timeout</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Active Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-400">{systemStats.activeJobs}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Queued Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-yellow-400">{systemStats.queuedJobs}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Completed Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-400">{systemStats.completedJobs}</p>
                      <p className="text-sm text-gray-400 mt-1">Last 7 days</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Failed Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-red-400">{systemStats.failedJobs}</p>
                      <p className="text-sm text-gray-400 mt-1">Last 7 days</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Health Check Status</CardTitle>
                      <CardDescription className="text-gray-400">System services status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-white">API Service</span>
                          </div>
                          <span className="text-green-400">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-white">Database Service</span>
                          </div>
                          <span className="text-green-400">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-white">Indexing Service</span>
                          </div>
                          <span className="text-green-400">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                            <span className="text-white">Webhook Service</span>
                          </div>
                          <span className="text-yellow-400">Performance Degradation</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-white">Authentication Service</span>
                          </div>
                          <span className="text-green-400">Operational</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="alerts">
                <div className="mt-6">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Alerts</CardTitle>
                      <CardDescription className="text-gray-400">System alerts from the past 24 hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentAlerts.length === 0 ? (
                          <p className="text-gray-400">No alerts in the past 24 hours.</p>
                        ) : (
                          <div className="divide-y divide-gray-700">
                            {recentAlerts.map((alert) => (
                              <div key={alert.id} className="py-4">
                                <div className="flex items-start">
                                  <div className={`mt-1 h-4 w-4 rounded-full ${
                                    alert.level === 'error' ? 'bg-red-500' : 
                                    alert.level === 'warning' ? 'bg-yellow-500' : 
                                    'bg-blue-500'
                                  } mr-3`}></div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <p className={`font-medium ${
                                        alert.level === 'error' ? 'text-red-400' : 
                                        alert.level === 'warning' ? 'text-yellow-400' : 
                                        'text-blue-400'
                                      }`}>
                                        {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                                      </p>
                                      <p className="text-sm text-gray-400">{alert.timestamp.toLocaleString()}</p>
                                    </div>
                                    <p className="mt-1 text-white">{alert.message}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <p className={`text-sm ${alert.resolved ? 'text-green-400' : 'text-gray-400'}`}>
                                        {alert.resolved ? 'Resolved' : 'Ongoing'}
                                      </p>
                                      <Button variant="outline" size="sm" className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700">
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                        View All Alerts
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="mt-6">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">System Resources</CardTitle>
                      <CardDescription className="text-gray-400">Current usage metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resourceMetrics.map((metric) => (
                          <div key={metric.name} className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <p className="text-gray-400">{metric.name}</p>
                              <div className={`flex items-center ${
                                metric.trend === 'up' ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {metric.trend === 'up' ? (
                                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                                ) : (
                                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                                )}
                                <span>{metric.change}</span>
                              </div>
                            </div>
                            <p className="text-2xl font-bold text-white mt-2">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                        View Detailed Metrics
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
} 