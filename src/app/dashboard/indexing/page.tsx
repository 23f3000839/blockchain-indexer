import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, ExternalLinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SyncStatusType } from "@prisma/client"; 

export const metadata = {
  title: "Indexing Configurations | Blockchain Indexer",
  description: "Manage your blockchain data indexing configurations",
};

export default async function IndexingPage() {
  // Get current user
  const userData = await getCurrentUser();
  
  if (!userData) {
    redirect("/auth/sign-in");
  }

  // Fetch indexing configurations from the database
  const indexingConfigs = await prisma.indexingConfiguration.findMany({
    where: {
      userId: userData.userId,
    },
    include: {
      syncStatuses: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      webhookEndpoints: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch the related database connections separately
  const connectionIds = indexingConfigs.map(config => config.connectionId);
  const connections = await prisma.databaseConnection.findMany({
    where: {
      id: {
        in: connectionIds
      }
    }
  });

  // Also fetch the webhook endpoints
  const webhookIds = indexingConfigs.flatMap(config => 
    config.webhookEndpoints.map(mapping => mapping.webhookId)
  );
  
  const webhooks = await prisma.webhookEndpoint.findMany({
    where: {
      id: {
        in: webhookIds
      }
    }
  });

  // Create lookup maps
  const connectionMap = connections.reduce((acc, conn) => {
    acc[conn.id] = conn;
    return acc;
  }, {} as Record<string, any>);
  
  const webhookMap = webhooks.reduce((acc, webhook) => {
    acc[webhook.id] = webhook;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Indexing Configurations</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
          <Link href="/dashboard/indexing/new" className="flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Configuration
          </Link>
        </Button>
      </div>

      {indexingConfigs.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-200 mb-2">No indexing configurations available</h3>
          <p className="text-gray-400 mb-4">
            Start your first blockchain data indexing to populate your database.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
            <Link href="/dashboard/indexing/new" className="flex items-center justify-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Configuration
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {indexingConfigs.map((config) => {
            // Get the latest status
            const latestStatus = config.syncStatuses[0];
            
            // Get the connection for this config
            const connection = connectionMap[config.connectionId];
            
            // Get webhook if exists
            const webhookMapping = config.webhookEndpoints[0];
            const webhook = webhookMapping ? webhookMap[webhookMapping.webhookId] : null;
            
            // Calculate progress - dummy value for now
            const progress = 
              !latestStatus ? 0 : 
              latestStatus.status === SyncStatusType.COMPLETED ? 100 :
              latestStatus.status === SyncStatusType.RUNNING ? 75 : 
              latestStatus.status === SyncStatusType.FAILED ? 0 : 25;
            
            return (
              <div key={config.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-medium text-white">{config.name}</h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {config.dataType?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      !latestStatus ? "bg-gray-600 text-gray-100" :
                      latestStatus.status === SyncStatusType.COMPLETED ? "bg-green-900 text-green-100" :
                      latestStatus.status === SyncStatusType.RUNNING ? "bg-blue-900 text-blue-100" :
                      latestStatus.status === SyncStatusType.FAILED ? "bg-red-900 text-red-100" : "bg-gray-600 text-gray-100"
                    }`}>
                      {!latestStatus ? "Not Started" : latestStatus.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Progress</span>
                        <span className="text-sm text-gray-300">
                          {latestStatus ? `${latestStatus.recordsProcessed} records` : 'No data yet'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Target Table:</p>
                        <p className="font-medium text-gray-200">{config.targetTable}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Database:</p>
                        <p className="font-medium text-gray-200">{connection?.name || 'Unknown'}</p>
                      </div>
                      {latestStatus && latestStatus.lastSyncedAt && (
                        <div>
                          <p className="text-gray-400">Last Synced:</p>
                          <p className="font-medium text-gray-200">
                            {new Date(latestStatus.lastSyncedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {webhook && (
                        <div>
                          <p className="text-gray-400">Webhook URL:</p>
                          <p className="font-medium text-gray-200 truncate">
                            {webhook.url}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-2 pt-4 border-t border-gray-700">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700" asChild>
                      <Link href={`/dashboard/indexing/${config.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">
                      Sync Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 