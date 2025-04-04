import { PrismaClient } from "@prisma/client";
import CryptoJS from "crypto-js";

// Create a singleton instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Encryption/decryption utilities for sensitive data
export const encryptData = (data: string): string => {
  const encryptionKey = process.env.ENCRYPTION_KEY || "";
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY not set in environment variables");
  }
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
};

export const decryptData = (encryptedData: string): string => {
  const encryptionKey = process.env.ENCRYPTION_KEY || "";
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY not set in environment variables");
  }
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Helper for testing PostgreSQL connections
export const testDatabaseConnection = async (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
  schema: string = "public",
  useSSL: boolean = true
): Promise<{ success: boolean; message: string }> => {
  const { Client } = await import("pg");
  
  // Prepare connection options
  const connectionOptions = {
    host,
    port,
    user: username,
    password,
    database,
    ssl: useSSL ? { rejectUnauthorized: false } : false, // Enable SSL with rejectUnauthorized set to false
    connectionTimeoutMillis: 10000, // 10 seconds timeout
  };

  console.log("Testing connection to:", host, port, database, "with SSL:", useSSL);
  
  const client = new Client(connectionOptions);

  try {
    await client.connect();
    // Test the connection by executing a simple query
    await client.query(`SET search_path TO ${schema}`);
    await client.query("SELECT NOW()");
    return { success: true, message: "Connection successful" };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  } finally {
    try {
      await client.end();
    } catch (endError) {
      console.error("Error closing client:", endError);
    }
  }
}; 