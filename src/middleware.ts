import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Define routes that can be accessed without authentication
  publicRoutes: [
    "/",
    "/api/webhooks(.*)",
    "/api/webhook(.*)",
    "/auth/(.*)",  // Auth pages (sign-in, sign-up, etc.)
    "/sign-out"    // Sign-out page
  ]
});

// Ensure Clerk middleware covers all routes that need authentication
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/(api|trpc)(.*)',
  ],
}; 