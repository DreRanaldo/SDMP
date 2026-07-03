import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "sdmp_session";

/**
 * Fast gate: unauthenticated requests to app routes bounce to /login.
 * (Cookie presence only — cryptographic verification happens server-side in
 * lib/auth.getCurrentUser on every page/action, since Edge middleware lacks
 * Node crypto.)
 */
export function middleware(req: NextRequest) {
  if (!req.cookies.get(SESSION_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/project/:path*",
    "/wallet/:path*",
    "/messages/:path*",
    "/post-project/:path*",
    "/admin/:path*",
  ],
};
