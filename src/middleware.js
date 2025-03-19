// middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token");

  // If the user is authenticated and tries to access /login, redirect to /
  if (authToken && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is not authenticated and tries to access a protected route, redirect to /login
  if (!authToken && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Get tokens from cookies
  const token = request.cookies.get("token");
  const userRole = request.cookies.get("userRole");

  // Check if trying to access admin paths
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If no token or role, redirect to login
    if (!token || !userRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: ["/login", "/admin/:path*"],
};
