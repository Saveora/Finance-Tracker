import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token"); // your cookie name

  const protectedPaths = ["/dashboard", "/profile", "/settings"]; // protect these routes
  const url = req.nextUrl.pathname;

  // If user is not authenticated, redirect to login
  if (protectedPaths.some(path => url.startsWith(path))) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth?type=login", req.url));
    }
  }

  // Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"], // apply only here
};
