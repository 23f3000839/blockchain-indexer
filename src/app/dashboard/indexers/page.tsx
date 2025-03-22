import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, PencilIcon, PlayIcon, StopIcon } from "@heroicons/react/24/outline";
import { UserButtonClient } from "@/components/user-button-client";

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

export default async function IndexersPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Sample data - in a real application, this would come from your database
  const indexers = [
    {
      id: "idx_123456",
      name: "NFT Price Tracker",
      type: "nft_prices",
      description: "Indexes current prices of Solana NFTs from marketplaces",
      collections: ["Degenerate Ape Academy", "Solana Monkey Business"],
      targetDatabase: "prod_db",
      createdAt: new Date("2023-10-15"),
      lastSync: new Date("2023-10-25"),
      status: "Active",
      recordsIndexed: 2547
    },
    {
      id: "idx_789012",
      name: "Token Borrow Availability",
      type: "token_lending",
      description: "Tracks available tokens to borrow on Solend and Mango Markets",
      tokens: ["SOL", "USDC", "BTC"],
      targetDatabase: "prod_db",
      createdAt: new Date("2023-09-20"),
      lastSync: new Date("2023-10-24"),
      status: "Active",
      recordsIndexed: 1829
    },
    {
      id: "idx_345678",
      name: "Cross-DEX Token Prices",
      type: "token_prices",
      description: "Indexes token prices across multiple Solana DEXes",
      tokens: ["SOL", "USDC", "RAY", "SBR"],
      targetDatabase: "dev_db",
      createdAt: new Date("2023-08-05"),
      lastSync: null,
      status: "Paused",
      recordsIndexed: 754
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
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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

      {/* Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Data Indexers</h1>
              <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                <Link href="/dashboard/indexers/new" className="flex items-center">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Indexer
                </Link>
              </Button>
            </div>

            {indexers.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-200 mb-2">No indexers configured yet</h3>
                <p className="text-gray-400 mb-4">
                  Create your first data indexer to start collecting blockchain data in your database.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/dashboard/indexers/new" className="flex items-center justify-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Indexer
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {indexers.map((indexer) => (
                  <div key={indexer.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {indexer.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {indexer.description}
                          </p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          indexer.status === 'Active' 
                            ? 'bg-green-900 text-green-100' 
                            : 'bg-yellow-900 text-yellow-100'
                        }`}>
                          {indexer.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Indexer Details</h4>
                          <dl className="mt-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Type:</dt>
                              <dd className="text-gray-200">{indexer.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</dd>
                            </div>
                            <div className="flex justify-between mt-1">
                              <dt className="text-gray-400">Target Database:</dt>
                              <dd className="text-gray-200">{indexer.targetDatabase}</dd>
                            </div>
                            <div className="flex justify-between mt-1">
                              <dt className="text-gray-400">Created:</dt>
                              <dd className="text-gray-200">{new Date(indexer.createdAt).toLocaleDateString()}</dd>
                            </div>
                            <div className="flex justify-between mt-1">
                              <dt className="text-gray-400">Last Sync:</dt>
                              <dd className="text-gray-200">{indexer.lastSync ? new Date(indexer.lastSync).toLocaleString() : 'Never'}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Assets Tracked</h4>
                          <dl className="mt-2 text-sm">
                            {indexer.collections && (
                              <div className="mt-1">
                                <dt className="text-gray-400 mb-1">NFT Collections:</dt>
                                <dd className="text-gray-200">
                                  <div className="flex flex-wrap gap-1">
                                    {indexer.collections.map((collection) => (
                                      <span key={collection} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900 text-indigo-100">
                                        {collection}
                                      </span>
                                    ))}
                                  </div>
                                </dd>
                              </div>
                            )}
                            
                            {indexer.tokens && (
                              <div className="mt-1">
                                <dt className="text-gray-400 mb-1">Tokens:</dt>
                                <dd className="text-gray-200">
                                  <div className="flex flex-wrap gap-1">
                                    {indexer.tokens.map((token) => (
                                      <span key={token} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900 text-purple-100">
                                        {token}
                                      </span>
                                    ))}
                                  </div>
                                </dd>
                              </div>
                            )}
                            
                            <div className="mt-3">
                              <dt className="text-gray-400">Records Indexed:</dt>
                              <dd className="text-lg font-semibold text-indigo-400">{indexer.recordsIndexed.toLocaleString()}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-end space-x-2">
                        {indexer.status === 'Active' ? (
                          <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500 hover:bg-yellow-900 hover:text-yellow-100">
                            <StopIcon className="h-4 w-4 mr-1" />
                            Pause Indexer
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="border-green-600 text-green-500 hover:bg-green-900 hover:text-green-100">
                            <PlayIcon className="h-4 w-4 mr-1" />
                            Resume Indexer
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-700 text-red-400 hover:bg-red-900 hover:text-red-200">
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
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