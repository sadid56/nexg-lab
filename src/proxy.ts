import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname.startsWith("/_next/") || pathname.includes(".")) return NextResponse.next();

  const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up", "/auth", "/read", "/read/[slug]", "/auth/reset-password", "/api/feedbacks"];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(route + "/")) || pathname === "/"
  );

  // Get user session from Better Auth
  let user = null;
  try {
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({ headers });
    if (session) user = session.user;
  } catch (err) {
    console.error("Failed to get session:", err);
  }

  if (isPublicRoute) return NextResponse.next();

  if (pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up")) {
    if (user) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (!user) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|logos/|images/|favicon.ico|sw.js).*)"],
};
