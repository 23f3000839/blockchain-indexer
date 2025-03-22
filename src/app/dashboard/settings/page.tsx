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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

export default async function SettingsPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

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
                  href="/dashboard/settings"
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Settings
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
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 text-gray-300">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="api">API Access</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="mt-6 space-y-6">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Profile Information</CardTitle>
                      <CardDescription className="text-gray-400">Update your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-white">Full Name</Label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="py-2 px-3 flex-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Your name"
                              defaultValue={userData.user?.firstName + " " + userData.user?.lastName}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white">Email Address</Label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="py-2 px-3 flex-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Your email"
                              defaultValue={userData.user?.emailAddresses[0]?.emailAddress}
                              disabled
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly. Contact support for assistance.</p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-white">Company</Label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="company"
                            id="company"
                            className="py-2 px-3 flex-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your company name"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Interface Settings</CardTitle>
                      <CardDescription className="text-gray-400">Customize your dashboard experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Dark Mode</Label>
                          <p className="text-sm text-gray-400">Always use dark theme</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Compact View</Label>
                          <p className="text-sm text-gray-400">Use compact layout for tables and lists</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Auto-refresh Dashboard</Label>
                          <p className="text-sm text-gray-400">Automatically update data (every 30 seconds)</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">Save Preferences</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="mt-6 space-y-6">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Notification Preferences</CardTitle>
                      <CardDescription className="text-gray-400">Choose when and how to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Email Notifications</Label>
                          <p className="text-sm text-gray-400">Receive important updates via email</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Indexing Job Completions</Label>
                          <p className="text-sm text-gray-400">Get notified when indexing jobs finish</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Webhook Failures</Label>
                          <p className="text-sm text-gray-400">Get notified when webhooks fail to deliver</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">System Alerts</Label>
                          <p className="text-sm text-gray-400">Notifications about system performance and issues</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Marketing Updates</Label>
                          <p className="text-sm text-gray-400">Receive updates about new features and improvements</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">Save Notification Settings</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="api">
                <div className="mt-6 space-y-6">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">API Keys</CardTitle>
                      <CardDescription className="text-gray-400">Manage your API access credentials</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-white">Production Key</h3>
                            <p className="text-xs text-gray-400 mt-1">Created on Oct 15, 2023</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="text-xs border-gray-700 text-gray-300 hover:bg-gray-700">
                              Regenerate
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs border-red-700 text-red-400 hover:bg-red-900 hover:text-red-200">
                              Revoke
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center mt-2">
                            <input
                              type="password"
                              className="py-1 px-3 flex-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                              value="sk_live_xxxxxxxxxxxxxxxxxxxxx"
                              readOnly
                            />
                            <Button variant="ghost" size="sm" className="ml-2 text-xs text-indigo-400 hover:text-indigo-300">
                              Show
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-white">Development Key</h3>
                            <p className="text-xs text-gray-400 mt-1">Created on Oct 20, 2023</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="text-xs border-gray-700 text-gray-300 hover:bg-gray-700">
                              Regenerate
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs border-red-700 text-red-400 hover:bg-red-900 hover:text-red-200">
                              Revoke
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center mt-2">
                            <input
                              type="password"
                              className="py-1 px-3 flex-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                              value="sk_test_xxxxxxxxxxxxxxxxxxxxx"
                              readOnly
                            />
                            <Button variant="ghost" size="sm" className="ml-2 text-xs text-indigo-400 hover:text-indigo-300">
                              Show
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        Create New API Key
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">API Rate Limits</CardTitle>
                      <CardDescription className="text-gray-400">Current limits and usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-white">Current Plan: Professional</p>
                          <p className="text-sm text-gray-400">10,000 requests per minute</p>
                        </div>
                        
                        <div className="bg-gray-900 rounded-md p-4">
                          <p className="text-sm font-medium text-white mb-2">Current Usage</p>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <p className="text-xs text-gray-400">1,503 / 10,000 requests</p>
                            <p className="text-xs text-gray-400">15% used</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                        View API Documentation
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="billing">
                <div className="mt-6 space-y-6">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Current Plan</CardTitle>
                      <CardDescription className="text-gray-400">Your subscription details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 rounded-md p-6 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-bold text-white">Professional Plan</h3>
                            <p className="text-indigo-400 text-lg font-medium mt-1">$99 / month</p>
                          </div>
                          <div className="bg-green-900 text-green-200 text-sm font-medium px-3 py-1 rounded-full">
                            Active
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs mr-2 mt-0.5">✓</div>
                            <span className="text-white">Up to 10 indexers</span>
                          </div>
                          <div className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs mr-2 mt-0.5">✓</div>
                            <span className="text-white">100 million records per month</span>
                          </div>
                          <div className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs mr-2 mt-0.5">✓</div>
                            <span className="text-white">10,000 API requests per minute</span>
                          </div>
                          <div className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs mr-2 mt-0.5">✓</div>
                            <span className="text-white">Priority support</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-sm text-gray-400">Next billing date: Nov 15, 2023</span>
                          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                            Change Plan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Payment Method</CardTitle>
                      <CardDescription className="text-gray-400">Manage your payment information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-800 w-12 h-8 flex items-center justify-center rounded-md mr-4">
                              <span className="text-white font-bold">VISA</span>
                            </div>
                            <div>
                              <p className="text-white">•••• •••• •••• 4242</p>
                              <p className="text-xs text-gray-400">Expires 05/25</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="text-xs border-gray-700 text-gray-300 hover:bg-gray-700">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs border-gray-700 text-gray-300 hover:bg-gray-700">
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        Add Payment Method
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Billing History</CardTitle>
                      <CardDescription className="text-gray-400">View your past invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-hidden bg-gray-900 border border-gray-700 rounded-md">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-800">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Description
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Receipt
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-900 divide-y divide-gray-700">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                Oct 15, 2023
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                Professional Plan - Monthly
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                $99.00
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                                  Paid
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
                                  Download
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                Sep 15, 2023
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                Professional Plan - Monthly
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                $99.00
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                                  Paid
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
                                  Download
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
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