# Authentication System

This application uses Clerk for authentication. Clerk is a comprehensive authentication and user management solution that provides secure login, registration, and profile management.

## Structure

- `/auth/sign-in`: Sign-in page
- `/auth/sign-up`: Registration page
- `/auth/sign-out`: Confirmation page for signing out

## Usage

### Server Components
For server components, use:

```typescript
import { requireAuth, getCurrentUser } from "@/lib/auth";

// Force authentication and redirect if not authenticated
export default async function ProtectedPage() {
  const userId = await requireAuth(); // Redirects to /auth/sign-in if not authenticated
  
  // Remaining code...
}

// Get user data if authenticated
export default async function ConditionalPage() {
  const userData = await getCurrentUser(); // Returns null if not authenticated
  
  if (!userData) {
    // Handle unauthenticated state
  }
  
  // Remaining code...
}
```

### Client Components 
For client components, use the `ProtectedRoute` component:

```typescript
import { ProtectedRoute } from "@/components/protected-route";

export function ProtectedComponent() {
  return (
    <ProtectedRoute>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

### Database Integration

The auth system automatically syncs Clerk users with our database. To access this functionality:

```typescript
import { syncUserWithDb, getUserFromDb, hasDbConnection } from "@/lib/auth";

// Sync current user data with database
await syncUserWithDb();

// Get user from database
const user = await getUserFromDb(userId);

// Check if user has database connections
const hasConnections = await hasDbConnection(userId);
```

## Environment Variables

The following environment variables must be set:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
``` 