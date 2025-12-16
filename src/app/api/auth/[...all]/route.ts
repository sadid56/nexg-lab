import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Bypassing better-auth entirely for diagnostics.
// This will tell us if the route itself is timing out.

export const { POST, GET } = toNextJsHandler(auth);
