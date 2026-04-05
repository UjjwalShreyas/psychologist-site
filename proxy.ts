import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPage) {
    const token = req.cookies.get("admin_session")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await verifyJwtToken(token);
    
    if (!payload?.admin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
