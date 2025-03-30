import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/db";

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

  // Fetch real connections from database
  const connections = await prisma.databaseConnection.findMany({
    where: {
      userId: userData.userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
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
          <h3 className="text-xl font-medium text-gray-200 mb-2">No database connections available</h3>
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
        <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-md rounded-lg">
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
                    <div className="text-sm text-gray-400">{connection.database}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(connection.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      connection.isActive 
                        ? 'bg-green-900 text-green-100' 
                        : 'bg-gray-600 text-gray-100'
                    }`}>
                      {connection.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:text-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 