import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

/**
 * Get the current authenticated user data
 * @returns Object containing userId and user data
 */
export async function getCurrentUser() {
  // Properly await the headers function
  const headersList = await headers();
  
  const session = await auth();
  const userId = session.userId;
  
  if (!userId) {
    return null;
  }
  
  const user = await currentUser();
  return { userId, user };
}

/**
 * Check if user is authenticated and redirect to login if not
 * @returns User ID if authenticated
 */
export async function requireAuth() {
  // Properly await the headers function
  const headersList = await headers();
  
  const session = await auth();
  const userId = session.userId;
  
  if (!userId) {
    redirect("/auth/sign-in");
  }
  
  return userId;
}

/**
 * Get user from the database with Clerk integration
 * @param userId Clerk user ID
 * @returns User from database or null
 */
export async function getUserFromDb(userId: string) {
  if (!userId) return null;
  
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

/**
 * Create or update user in database based on Clerk user data
 * @param userId Clerk user ID
 * @returns Created or updated user
 */
export async function syncUserWithDb() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  // Create or update user in the database
  return await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    create: {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
  });
}

/**
 * Check if the current user has created a database connection
 * @param userId User ID
 * @returns Boolean indicating if the user has a database connection
 */
export async function hasDbConnection(userId: string) {
  if (!userId) return false;
  
  const connections = await prisma.databaseConnection.findMany({
    where: { userId },
    take: 1,
  });
  
  return connections.length > 0;
} 