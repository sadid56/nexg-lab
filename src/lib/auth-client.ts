import { createAuthClient } from "better-auth/react";

// Create the auth client instance with proper baseURL
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// Export the methods from the SAME configured instance
export const { signIn, signUp, useSession, signOut } = authClient;
