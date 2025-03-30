import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default async function WebhooksManagementPage() {
  const userData = await getUserData();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Fetch real webhooks from database
  const webhooks = await prisma.webhookEndpoint.findMany({
    where: {
      userId: userData.userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      configurations: true,
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Helius Webhooks</h1>
        <div className="flex items-center space-x-4">
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
          <h3 className="text-xl font-medium text-gray-200 mb-2">No webhooks available</h3>
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
                      Webhook: {webhook.id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      ID: {webhook.id}
                    </p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    webhook.isActive 
                      ? 'bg-green-900 text-green-100' 
                      : 'bg-gray-600 text-gray-100'
                  }`}>
                    {webhook.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Webhook Details</h4>
                    <dl className="mt-2 text-sm">
                      <div className="flex justify-between mt-1">
                        <dt className="text-gray-400">URL:</dt>
                        <dd className="text-gray-200 truncate max-w-[200px]">{webhook.url}</dd>
                      </div>
                      <div className="flex justify-between mt-1">
                        <dt className="text-gray-400">Created:</dt>
                        <dd className="text-gray-200">{new Date(webhook.createdAt).toLocaleDateString()}</dd>
                      </div>
                      <div className="flex justify-between mt-1">
                        <dt className="text-gray-400">Last Updated:</dt>
                        <dd className="text-gray-200">{new Date(webhook.updatedAt).toLocaleString()}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Configuration</h4>
                    <dl className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Linked Configs:</dt>
                        <dd className="text-gray-200">{webhook.configurations.length} configurations</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-end">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
                      Test
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-700 text-red-400 hover:bg-red-900 hover:text-red-200">
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
  );
} 