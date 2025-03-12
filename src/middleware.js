// middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for these paths to avoid redirect loops
  if (pathname === '/therapist-login' || pathname === '/staff-login') {
    return NextResponse.next();
  }

  const cookieStore = cookies();
  const authToken = cookieStore.get("token");
  const userRole = cookieStore.get("userRole");

  // Public paths that don't require authentication
  const publicPaths = [
    '/login', 
    '/login-selection',
    '/registration',
    '/forgot-password'
  ];
  
  // If the user is authenticated and tries to access login pages, redirect based on role
  if (authToken) {
    if (publicPaths.includes(pathname)) {
      // Redirect based on user role
      if (userRole?.value === 'staff') {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (userRole?.value === 'therapist') {
        return NextResponse.redirect(new URL("/therapist/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // Only redirect /login to /login-selection if it's a direct access
  // Don't redirect if coming from login-selection (to avoid loops)
  const referer = request.headers.get("referer") || "";
  const isComingFromLoginSelection = referer.includes("/login-selection");
  
  if (pathname === '/login' && !isComingFromLoginSelection) {
    return NextResponse.redirect(new URL("/login-selection", request.url));
  }

  // Protected staff routes
  if (pathname.startsWith('/admin') && 
      (!authToken || userRole?.value !== 'staff')) {
    return NextResponse.redirect(new URL("/staff-login", request.url));
  }

  // Protected therapist routes
  if (pathname.startsWith('/therapist') && pathname !== '/therapist-login' && 
      (!authToken || userRole?.value !== 'therapist')) {
    return NextResponse.redirect(new URL("/therapist-login", request.url));
  }

  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: [
    '/login', 
    '/login-selection',
    '/admin/:path*',
    '/therapist/:path*',
    '/profile',
    '/checkout'
  ],
};
