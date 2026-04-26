import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function strapiBase() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("jwt")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const res = await fetch(`${strapiBase()}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const data: unknown = await res.json();
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    (data as { error?: unknown }).error
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
