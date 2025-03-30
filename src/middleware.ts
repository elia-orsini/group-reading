import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.includes(".") || // Files with extensions
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  if (host === "communism.read-with-elia.xyz") {
    return NextResponse.rewrite(new URL(`/communism${request.nextUrl.pathname}`, request.url));
  }

  return NextResponse.next();
}
