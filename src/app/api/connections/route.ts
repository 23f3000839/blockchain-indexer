import { NextRequest, NextResponse } from "next/server";
import { prisma, encryptData, testDatabaseConnection } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Create a new database connection
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
    const { name, host, port, username, password, database, schema = "public", useSSL = true } = data;
    
    // Validate input
    if (!name || !host || !port || !username || !password || !database) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Test the connection before saving
    const testResult = await testDatabaseConnection(
      host, 
      parseInt(port.toString()), 
      username, 
      password, 
      database,
      schema,
      useSSL
    );
    
    if (!testResult.success) {
      return NextResponse.json(
        { error: `Connection failed: ${testResult.message}` },
        { status: 400 }
      );
    }
    
    // Encrypt sensitive data
    const encryptedPassword = encryptData(password);
    
    // Create the connection record
    const connection = await prisma.databaseConnection.create({
      data: {
        userId: userData.userId,
        name,
        host,
        port: parseInt(port.toString()),
        username,
        password: encryptedPassword,
        database,
        schema: schema || "public",
        useSSL: useSSL === false ? false : true,
        isActive: true
      }
    });
    
    return NextResponse.json({
      id: connection.id,
      name: connection.name,
      host: connection.host,
      success: true
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating database connection:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Get all database connections for the authenticated user
export async function GET() {
  try {
    const userData = await getCurrentUser();
    
    if (!userData) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const connections = await prisma.databaseConnection.findMany({
      where: {
        userId: userData.userId
      },
      select: {
        id: true,
        name: true,
        host: true,
        port: true,
        username: true,
        database: true,
        schema: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(connections);
    
  } catch (error) {
    console.error("Error fetching database connections:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 