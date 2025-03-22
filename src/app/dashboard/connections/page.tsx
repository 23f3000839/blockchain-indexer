import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
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

export default async function DatabaseConnectionsPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Sample data - in a real application, this would come from your database
  const connections = [
    {
      id: "1",
      name: "Production Database",
      host: "db.example.com",
      port: 5432,
      databaseName: "blockchain_prod",
      username: "db_user",
      createdAt: new Date("2023-10-15"),
      lastSync: new Date("2023-10-20"),
      status: "Active"
    },
    {
      id: "2",
      name: "Development Database",
      host: "localhost",
      port: 5432,
      databaseName: "blockchain_dev",
      username: "developer",
      createdAt: new Date("2023-09-10"),
      lastSync: new Date("2023-10-19"),
      status: "Active"
    },
    {
      id: "3",
      name: "Testing Database",
      host: "test.example.org",
      port: 5432,
      databaseName: "blockchain_test",
      username: "tester",
      createdAt: new Date("2023-08-05"),
      lastSync: null,
      status: "Inactive"
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
                  className="border-indigo-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Database Connections
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
              <h1 className="text-2xl font-bold text-white">Database Connections</h1>
              <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                <Link href="/dashboard/connections/new" className="flex items-center">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Connection
                </Link>
              </Button>
            </div>

            {connections.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-200 mb-2">No database connections yet</h3>
                <p className="text-gray-400 mb-4">
                  Create your first database connection to start indexing blockchain data.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/dashboard/connections/new" className="flex items-center justify-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Connection
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-md sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Host / Database
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Last Sync
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {connections.map((connection) => (
                      <tr key={connection.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{connection.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{connection.host}:{connection.port}</div>
                          <div className="text-sm text-gray-400">{connection.databaseName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(connection.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {connection.lastSync 
                            ? new Date(connection.lastSync).toLocaleDateString() 
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            connection.status === 'Active' 
                              ? 'bg-green-900 text-green-100' 
                              : 'bg-gray-600 text-gray-100'
                          }`}>
                            {connection.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-300 hover:text-white mr-2"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-300 hover:text-red-500"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 