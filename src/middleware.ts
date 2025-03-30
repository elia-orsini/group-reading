import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === "communism.read-with-elia.xyz") {
    return NextResponse.rewrite(new URL(`/communism${request.nextUrl.pathname}`, request.url));
  }

  return NextResponse.next();
}
