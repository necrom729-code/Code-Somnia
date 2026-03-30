# Recipe: Add Authentication System

Add authentication system with user registration and login functionality.

## When to Use

- User needs secure access to application
- Application requires user accounts
- Features need to be protected by authentication

## Prerequisites

- Database already set up (use add-database recipe first)
- Understanding of user model and authentication flow

## Setup Steps

### Step 1: Install Dependencies

```bash
bun add next-auth@latest
```

### Step 2: Create All Required Files

#### `src/app/api/auth/[...nextauth]/route.ts` - Authentication API route

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  async callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    
    async redirect({ baseUrl, url }) {
      return baseUrl;
    },
    
    async jwt({ token, user }) {
      return token;
    },
    
    async session({ session, token, user }) {
      return session;
    },
  },
});
```

#### `src/lib/auth.ts` - Authentication utilities

```typescript
import { NextRequest } from "next/server";

export async function getAuthUser(request: NextRequest) {
  const { headers } = request;
  const authorization = headers.get("authorization");
  
  if (!authorization) {
    return null;
  }
  
  const token = authorization.replace("Bearer ", "");
  
  // In a real implementation, you would verify the token
  // and fetch user data from your database
  
  // For now, return a mock user
  return {
    id: "mock-user-id",
    name: "Mock User",
    email: "user@example.com",
    avatar: "",
  };
}
```

#### `src/components/AuthProvider.tsx` - Authentication context

```typescript
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      setUser(JSON.parse(existingUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = () => {
    // Implement sign-in logic
    console.log("Sign in");
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

#### `src/components/AuthButton.tsx` - Authentication button

```typescript
import { useAuth } from "@/lib/auth";

export function AuthButton() {
  const { user, signIn, signOut } = useAuth();

  if (user) {
    return (
      <button 
        onClick={signOut}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button 
      onClick={signIn}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Sign In with Google
    </button>
  );
}
```

### Step 3: Update Layout to Include Auth

Update `src/app/layout.tsx` to include the AuthProvider:

```typescript
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
```

### Step 4: Add Authentication Pages

#### `src/app/sign-in/page.tsx` - Sign in page

```typescript
import { AuthProvider, AuthButton } from "@/components/AuthProvider";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <AuthButton />
      </div>
    </div>
  );
}
```

#### `src/app/sign-up/page.tsx` - Sign up page

```typescript
import { AuthProvider, AuthButton } from "@/components/AuthProvider";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <AuthButton />
      </div>
    </div>
  );
}
```

### Step 5: Add Protected Routes

#### `src/components/ProtectedRoute.tsx` - Protected route wrapper

```typescript
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">Please sign in</h1>
          <a href="/sign-in" className="block text-center text-blue-600 hover:text-blue-800">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Usage Examples

### Protecting a Route

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Dashboard content only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Accessing User Data

```typescript
import { useAuth } from "@/lib/auth";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## Memory Bank Updates

After implementing, update `.kilocode/rules/memory-bank/context.md`:

- Add authentication to "Recently Completed" section
- Document the auth components and routes created
- Note any API routes or server actions added

Also update `.kilocode/rules/memory-bank/tech.md`:

- Add next-auth to dependencies
- Document authentication file structure
- Note any environment variables needed

## Environment Variables

Add these to your `.env.local` file:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

You'll need to set up a Google Cloud project and enable the Google+ API to get these credentials.