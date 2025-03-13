import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const userRole = cookieStore.get("userRole")?.value;

  // Public paths that don't require authentication
  if (pathname === "/login") {
    if (token) {
      // If already logged in, redirect based on role
      return NextResponse.redirect(
        new URL(userRole === "admin" ? "/admin" : "/", request.url)
      );
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*"],
};
