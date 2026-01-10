// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/nextjs";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie) {
    url.pathname = "/connexion";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mon-espace/:path*", "/intranet/:path*"],
};
