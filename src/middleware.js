import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  const { pathname } = request.nextUrl;

  // Nếu đã login mà vào lại /login → redirect về trang chủ
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu chưa login mà vào route không phải /login → redirect về login
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu truy cập admin mà không có token hoặc không có userRole → redirect
  if (pathname.startsWith("/admin") && (!token || !userRole)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: ["/login", "/admin/:path*"],
};
