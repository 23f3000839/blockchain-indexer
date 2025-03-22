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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserButton } from "@clerk/nextjs";

export default async function NewIndexerPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Sample data - in a real application, this would come from your database
  const databaseConnections = [
    { id: "conn_1", name: "Production Database" },
    { id: "conn_2", name: "Development Database" },
    { id: "conn_3", name: "Testing Database" },
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
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Indexers
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
              <h1 className="text-2xl font-bold text-white">Create New Indexer</h1>
              <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" asChild>
                <Link href="/dashboard/indexers">Back to Indexers</Link>
              </Button>
            </div>

            <Card className="bg-gray-800 border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-white">New Data Indexer Configuration</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure what blockchain data you want to index and how it should be structured in your database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-gray-200">Indexer Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="NFT Collection Prices" 
                            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                          />
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-gray-200">Description</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            placeholder="Track prices of specific NFT collections across marketplaces" 
                            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                          />
                        </div>

                        <div>
                          <Label htmlFor="database" className="text-gray-200">Target Database</Label>
                          <Select name="database">
                            <SelectTrigger className="mt-1 w-full bg-gray-900 border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500">
                              <SelectValue placeholder="Select a database connection" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              {databaseConnections.map(connection => (
                                <SelectItem key={connection.id} value={connection.id} className="focus:bg-gray-700">
                                  {connection.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-400 mt-1">
                            Which database should this data be indexed to
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Data Type Selection */}
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Data Type</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <RadioGroup defaultValue="nft_prices" className="space-y-3">
                            <div className="flex items-start space-x-3 rounded-md border border-gray-700 p-4 bg-gray-900">
                              <RadioGroupItem value="nft_prices" id="nft_prices" className="mt-1" />
                              <div className="space-y-1">
                                <Label htmlFor="nft_prices" className="text-white font-medium">NFT Prices & Bids</Label>
                                <p className="text-sm text-gray-400">
                                  Track current prices and bids for NFT collections across marketplaces
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 rounded-md border border-gray-700 p-4 bg-gray-900">
                              <RadioGroupItem value="token_lending" id="token_lending" className="mt-1" />
                              <div className="space-y-1">
                                <Label htmlFor="token_lending" className="text-white font-medium">Token Lending Markets</Label>
                                <p className="text-sm text-gray-400">
                                  Monitor available tokens to borrow and supply on lending platforms like Solend
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 rounded-md border border-gray-700 p-4 bg-gray-900">
                              <RadioGroupItem value="token_prices" id="token_prices" className="mt-1" />
                              <div className="space-y-1">
                                <Label htmlFor="token_prices" className="text-white font-medium">Token Prices</Label>
                                <p className="text-sm text-gray-400">
                                  Track token prices across different DEXes and trading platforms
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 rounded-md border border-gray-700 p-4 bg-gray-900">
                              <RadioGroupItem value="custom" id="custom" className="mt-1" />
                              <div className="space-y-1">
                                <Label htmlFor="custom" className="text-white font-medium">Custom Data</Label>
                                <p className="text-sm text-gray-400">
                                  Define your own custom data indexing configuration
                                </p>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* Assets Selection (conditionally shown based on data type) */}
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Assets to Track</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="collections" className="text-gray-200">NFT Collections</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="collection1" className="text-indigo-600 focus:ring-indigo-500" />
                              <Label htmlFor="collection1" className="text-gray-200">DeGods</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="collection2" className="text-indigo-600 focus:ring-indigo-500" />
                              <Label htmlFor="collection2" className="text-gray-200">Okay Bears</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="collection3" className="text-indigo-600 focus:ring-indigo-500" />
                              <Label htmlFor="collection3" className="text-gray-200">Solana Monkey Business</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="collection4" className="text-indigo-600 focus:ring-indigo-500" />
                              <Label htmlFor="collection4" className="text-gray-200">Degenerate Ape Academy</Label>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Input 
                              id="custom_collection" 
                              name="custom_collection" 
                              placeholder="Enter custom collection address" 
                              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                            <p className="text-sm text-gray-400 mt-1">
                              Add a collection by its contract address
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Database Schema Options */}
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Database Schema</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="table_name" className="text-gray-200">Table Name</Label>
                          <Input 
                            id="table_name" 
                            name="table_name" 
                            placeholder="nft_prices" 
                            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                          />
                          <p className="text-sm text-gray-400 mt-1">
                            Name of the table in your database where data will be stored
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="auto_schema" className="text-indigo-600 focus:ring-indigo-500" />
                            <Label htmlFor="auto_schema" className="text-gray-200">Auto-generate optimal schema</Label>
                          </div>
                          <p className="text-sm text-gray-400 ml-6 mt-1">
                            We'll automatically create the best schema for your selected data type
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Update Frequency */}
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Update Frequency</h3>
                      
                      <div className="space-y-4">
                        <RadioGroup defaultValue="realtime" className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="realtime" id="realtime" />
                            <Label htmlFor="realtime" className="text-white">Real-time (via webhooks)</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="frequent" id="frequent" />
                            <Label htmlFor="frequent" className="text-white">Frequent (every 5 minutes)</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="hourly" id="hourly" />
                            <Label htmlFor="hourly" className="text-white">Hourly</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="daily" id="daily" />
                            <Label htmlFor="daily" className="text-white">Daily</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      type="button"
                      className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
                    >
                      Save as Draft
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create and Start Indexing
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