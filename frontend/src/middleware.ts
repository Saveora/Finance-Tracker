// middleware.ts

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const refreshToken = req.cookies.get("refresh_token"); // your cookie name

//   const protectedPaths = ["/dashboard", "/profile", "/settings"]; // protect these routes
//   const url = req.nextUrl.pathname;

//   // If user is not authenticated, redirect to login
//   if (protectedPaths.some(path => url.startsWith(path))) {
//     if (!refreshToken) {
//       return NextResponse.redirect(new URL("/auth?type=login", req.url));
//     }
//   }

//   // Otherwise, continue
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"], // apply only here
// };




import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token"); // cookie on this domain (likely absent)
  const url = req.nextUrl.pathname;

  // NOTE: we intentionally do NOT protect /dashboard SSR in dev when using different domains.
  const protectPathsServerSide = ["/profile", "/settings"]; // server-only protected routes

  // If you want to temporarily bypass server-side auth, set NEXT_PUBLIC_SKIP_SSR_AUTH=true in .env
  const skipSsrAuth = process.env.NEXT_PUBLIC_SKIP_SSR_AUTH === "true";

  if (!skipSsrAuth && protectPathsServerSide.some(path => url.startsWith(path))) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth?type=login", req.url));
    }
  }

  // allow /dashboard to proceed (client-side will call /api/me)
  return NextResponse.next();
}

export const config = {
  // remove /dashboard from matcher so middleware won't run for it (optional)
  matcher: ["/profile/:path*", "/settings/:path*"],
};
