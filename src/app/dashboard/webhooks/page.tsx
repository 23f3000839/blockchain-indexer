import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, PencilIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { UserButtonClient } from "@/components/user-button-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default async function WebhooksManagementPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Sample data - in a real application, this would come from your database
  const webhooks = [
    {
      id: "wh_123456",
      name: "NFT Sales Tracker",
      targetUrl: "https://example.com/api/webhooks/nft-sales",
      type: "nft_sales",
      accountsCount: 15,
      transactionTypes: ["NFT_SALE"],
      createdAt: new Date("2023-10-15"),
      lastTriggered: new Date("2023-10-25"),
      status: "Active"
    },
    {
      id: "wh_789012",
      name: "Token Transfers",
      targetUrl: "https://example.com/api/webhooks/token-transfers",
      type: "token_activity",
      accountsCount: 8,
      transactionTypes: ["TOKEN_TRANSFER", "TOKEN_MINT", "TOKEN_BURN"],
      createdAt: new Date("2023-09-20"),
      lastTriggered: new Date("2023-10-24"),
      status: "Active"
    },
    {
      id: "wh_345678",
      name: "DEX Trading Activity",
      targetUrl: "https://example.com/api/webhooks/dex-trades",
      type: "dex_activity",
      accountsCount: 5,
      transactionTypes: ["SWAP"],
      createdAt: new Date("2023-08-05"),
      lastTriggered: null,
      status: "Inactive"
    }
  ];

  type TransactionType = "NFT_SALE" | "NFT_BID" | "TOKEN_TRANSFER" | "TOKEN_MINT" | "TOKEN_BURN" | "SWAP";

  const transactionTypeLabels: Record<TransactionType, string> = {
    "NFT_SALE": "NFT Sales",
    "NFT_BID": "NFT Bids",
    "TOKEN_TRANSFER": "Token Transfers",
    "TOKEN_MINT": "Token Mints",
    "TOKEN_BURN": "Token Burns",
    "SWAP": "DEX Swaps"
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
                  href="/dashboard/webhooks"
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
              <h1 className="text-2xl font-bold text-white">Helius Webhooks</h1>
              <div className="flex items-center space-x-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="nft_sales">NFT Sales</SelectItem>
                    <SelectItem value="token_activity">Token Activity</SelectItem>
                    <SelectItem value="dex_activity">DEX Activity</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/dashboard/webhooks/new" className="flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Webhook
                  </Link>
                </Button>
              </div>
            </div>

            {webhooks.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-200 mb-2">No webhooks configured yet</h3>
                <p className="text-gray-400 mb-4">
                  Create your first webhook to start receiving real-time blockchain data.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/dashboard/webhooks/new" className="flex items-center justify-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Webhook
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {webhook.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            ID: {webhook.id}
                          </p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          webhook.status === 'Active' 
                            ? 'bg-green-900 text-green-100' 
                            : 'bg-gray-600 text-gray-100'
                        }`}>
                          {webhook.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Webhook Details</h4>
                          <dl className="mt-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Type:</dt>
                              <dd className="text-gray-200">{webhook.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</dd>
                            </div>
                            <div className="flex justify-between mt-1">
                              <dt className="text-gray-400">Target URL:</dt>
                              <dd className="text-gray-200 truncate max-w-[200px]">{webhook.targetUrl}</dd>
                            </div>
                            <div className="flex justify-between mt-1">
                              <dt className="text-gray-400">Created:</dt>
                              <dd className="text-gray-200">{new Date(webhook.createdAt).toLocaleDateString()}</dd>
                            </div>
                            <div className="flex justify-between mt-1">
                              <dt className="text-gray-400">Last Triggered:</dt>
                              <dd className="text-gray-200">{webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleString() : 'Never'}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Configuration</h4>
                          <dl className="mt-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Accounts:</dt>
                              <dd className="text-gray-200">{webhook.accountsCount} addresses</dd>
                            </div>
                            <div className="mt-1">
                              <dt className="text-gray-400 mb-1">Transaction Types:</dt>
                              <dd className="text-gray-200">
                                <div className="flex flex-wrap gap-1">
                                  {webhook.transactionTypes.map((type) => (
                                    <span key={type} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-200">
                                      {transactionTypeLabels[type as TransactionType]}
                                    </span>
                                  ))}
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center text-sm text-indigo-400">
                          <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
                          View Transaction History
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
                            Test
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-700 text-red-400 hover:bg-red-900 hover:text-red-200">
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 