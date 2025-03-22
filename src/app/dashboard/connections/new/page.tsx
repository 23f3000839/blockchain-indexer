import { auth } from "@clerk/nextjs/server";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserButton } from "@clerk/nextjs";

export default async function NewDatabaseConnection() {
  const { userId } = await auth();
  
  if (!userId) {
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
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Database Connections
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">New Database Connection</h1>
              <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                <Link href="/dashboard/connections">Back to Connections</Link>
              </Button>
            </div>

            <Card className="bg-gray-800 border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-white">Add PostgreSQL Database Connection</CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your PostgreSQL database credentials to establish a connection for data indexing.
                  All credentials are securely encrypted.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-200">Connection Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="My Production Database" 
                        className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        A friendly name to identify this connection
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="host" className="text-gray-200">Host</Label>
                        <Input 
                          id="host" 
                          name="host" 
                          placeholder="localhost or db.example.com" 
                          className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="port" className="text-gray-200">Port</Label>
                        <Input 
                          id="port" 
                          name="port" 
                          placeholder="5432" 
                          type="number" 
                          className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="databaseName" className="text-gray-200">Database Name</Label>
                      <Input 
                        id="databaseName" 
                        name="databaseName" 
                        placeholder="my_database" 
                        className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username" className="text-gray-200">Username</Label>
                        <Input 
                          id="username" 
                          name="username" 
                          placeholder="postgres" 
                          className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-gray-200">Password</Label>
                        <Input 
                          id="password" 
                          name="password" 
                          type="password" 
                          className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="ssl" 
                        name="ssl" 
                        className="rounded bg-gray-900 border-gray-700 text-indigo-600 focus:ring-indigo-500" 
                      />
                      <Label htmlFor="ssl" className="text-gray-200">Use SSL</Label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      type="button"
                      className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
                    >
                      Test Connection
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save Connection
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 