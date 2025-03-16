import { NextResponse } from "next/server";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token");
  const userRole = request.cookies.get("userRole");

  // Handle admin routes
  if (pathname.startsWith("/admin")) {
    // No token or not admin -> redirect to login
    if (!token || userRole?.value !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Logged in users trying to access login page
  if (pathname === "/login" && token) {
    if (userRole?.value === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
