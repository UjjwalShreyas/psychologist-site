import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get("admin_auth");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPage && cookie?.value !== "true") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};