import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;

  if (token) {
    const payload = await verifyJwtToken(token);
    if (payload?.admin) {
      return NextResponse.json({ authenticated: true });
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}