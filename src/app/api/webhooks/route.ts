import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// Get all webhook endpoints for the authenticated user
export async function GET() {
  try {
    const userData = await getCurrentUser();
    
    if (!userData) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const webhooks = await prisma.webhookEndpoint.findMany({
      where: {
        userId: userData.userId
      },
      include: {
        configurations: {
          include: {
            config: {
              select: {
                id: true,
                name: true,
                dataType: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const formattedWebhooks = webhooks.map(webhook => ({
      id: webhook.id,
      url: webhook.url,
      isActive: webhook.isActive,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt,
      configurations: webhook.configurations.map(c => ({
        configId: c.config.id,
        configName: c.config.name,
        dataType: c.config.dataType
      }))
    }));
    
    return NextResponse.json(formattedWebhooks);
    
  } catch (error) {
    console.error("Error fetching webhook endpoints:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Create a new webhook endpoint
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
    const { url, isActive = true } = data;
    
    if (!url) {
      return NextResponse.json(
        { error: "Webhook URL is required" },
        { status: 400 }
      );
    }
    
    // Generate a secret for the webhook
    const webhookSecret = uuidv4();
    
    // Create webhook endpoint
    const webhook = await prisma.webhookEndpoint.create({
      data: {
        userId: userData.userId,
        url,
        secret: webhookSecret,
        isActive: isActive === false ? false : true,
      }
    });
    
    return NextResponse.json({
      id: webhook.id,
      url: webhook.url,
      isActive: webhook.isActive,
      success: true,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating webhook endpoint:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Update webhook status (activate/deactivate)
export async function PATCH(request: NextRequest) {
  try {
    const userData = await getCurrentUser();
    
    if (!userData) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { id, isActive } = data;
    
    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Verify webhook exists and belongs to user
    const webhook = await prisma.webhookEndpoint.findFirst({
      where: {
        id,
        userId: userData.userId
      }
    });
    
    if (!webhook) {
      return NextResponse.json(
        { error: "Webhook not found" },
        { status: 404 }
      );
    }
    
    // Update webhook status
    const updatedWebhook = await prisma.webhookEndpoint.update({
      where: { id },
      data: { isActive }
    });
    
    return NextResponse.json({
      id: updatedWebhook.id,
      isActive: updatedWebhook.isActive,
      success: true
    });
    
  } catch (error) {
    console.error("Error updating webhook status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 