// middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("token");

  // If the user is authenticated and tries to access /login, redirect to /
  if (authToken && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: ["/login"],
};
