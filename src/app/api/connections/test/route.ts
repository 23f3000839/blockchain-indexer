import { NextRequest, NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

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
    const { host, port, username, password, database, schema = "public", useSSL = true } = data;
    
    // Validate input
    if (!host || !port || !username || !password || !database) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    console.log("Testing connection with params:", { host, port, database, schema, useSSL });
    
    // Test the connection
    const testResult = await testDatabaseConnection(
      host, 
      parseInt(port.toString()), 
      username, 
      password, 
      database,
      schema,
      useSSL
    );
    
    if (testResult.success) {
      return NextResponse.json({ success: true, message: "Connection successful" });
    } else {
      return NextResponse.json(
        { success: false, error: testResult.message },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error("Error testing database connection:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 