import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// Create a new indexing configuration
export async function POST(request: NextRequest) {
  try {
    const userData = await getCurrentUser();
    
    if (!userData) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { name, databaseConnectionId, dataType, targetTable, filters } = data;
    
    // Validate input
    if (!name || !databaseConnectionId || !dataType || !targetTable) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Verify database connection exists and belongs to user
    const connection = await prisma.databaseConnection.findFirst({
      where: {
        id: databaseConnectionId,
        userId: userData.userId,
        isActive: true
      }
    });
    
    if (!connection) {
      return NextResponse.json(
        { error: "Database connection not found or not active" },
        { status: 404 }
      );
    }
    
    // Create the indexing configuration
    const config = await prisma.indexingConfiguration.create({
      data: {
        userId: userData.userId,
        connectionId: databaseConnectionId,
        name,
        dataType,
        targetTable,
        filters: filters ? JSON.parse(filters) : null,
        isActive: true
      }
    });
    
    // Create a webhook endpoint for this configuration
    const webhookId = uuidv4();
    const webhookSecret = uuidv4();
    
    const webhook = await prisma.webhookEndpoint.create({
      data: {
        id: webhookId,
        userId: userData.userId,
        url: `/api/webhooks/helius/${webhookId}`,
        secret: webhookSecret,
        isActive: true,
        configurations: {
          create: {
            configId: config.id
          }
        }
      }
    });
    
    // Create initial sync status
    await prisma.syncStatus.create({
      data: {
        configId: config.id,
        status: "PENDING",
        recordsProcessed: 0
      }
    });
    
    return NextResponse.json({
      id: config.id,
      name: config.name,
      dataType: config.dataType,
      webhookUrl: webhook.url,
      success: true
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating indexing configuration:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Get all indexing configurations for the authenticated user
export async function GET() {
  try {
    const userData = await getCurrentUser();
    
    if (!userData) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const configurations = await prisma.indexingConfiguration.findMany({
      where: {
        userId: userData.userId
      },
      include: {
        syncStatuses: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        webhookEndpoints: {
          include: {
            webhook: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const formattedConfigs = configurations.map(config => ({
      id: config.id,
      name: config.name,
      dataType: config.dataType,
      targetTable: config.targetTable,
      connectionId: config.connectionId,
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
      latestStatus: config.syncStatuses[0] || null,
      webhookUrl: config.webhookEndpoints[0]?.webhook.url || null
    }));
    
    return NextResponse.json(formattedConfigs);
    
  } catch (error) {
    console.error("Error fetching indexing configurations:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 