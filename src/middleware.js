// middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  const cookieStore = cookies();
  const authToken = cookieStore.get("token");
  const userRole = cookieStore.get("userRole");
  
  console.log("Middleware checking path:", pathname);
  console.log("Middleware checking role:", userRole?.value);

  // Public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/registration',
    '/forgot-password'
  ];
  
  // If the user is authenticated and tries to access login page, redirect based on role
  if (authToken) {
    if (publicPaths.includes(pathname)) {
      // Redirect based on user role
      if (userRole?.value === 'admin' || userRole?.value === 'staff' || userRole?.value === 'therapist') {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // Admin can access everything - skip other checks if user is admin
  if (authToken && userRole?.value === 'admin') {
    return NextResponse.next();
  }

  // Protected admin routes - only admin, staff and therapists can access
  if (pathname.startsWith('/admin') && 
      (!authToken || (userRole?.value !== 'admin' && userRole?.value !== 'staff' && userRole?.value !== 'therapist'))) {
    // If user is a customer, redirect to home page
    if (userRole?.value === 'customer') {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Otherwise redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protected therapist routes - only for therapists and admins
  if (pathname.startsWith('/therapist') && 
      (!authToken || (userRole?.value !== 'therapist' && userRole?.value !== 'admin'))) {
    if (authToken) {
      // If user is logged in but not a therapist or admin, redirect based on role
      if (userRole?.value === 'staff') {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: [
    '/login',
    '/admin/:path*',
    '/therapist/:path*',
    '/profile',
    '/checkout'
  ],
};
