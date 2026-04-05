import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJwtToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success: rateLimitSuccess } = await rateLimit(ip, 5, 60000); // 5 attempts per minute

  if (!rateLimitSuccess) {
    return NextResponse.json({ success: false, error: "Too many login attempts." }, { status: 429 });
  }

  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // Fallback to old plain text if NOT hashed yet, to prevent breaking production immediately.
  // We strongly recommend storing the bcrypt hash in ADMIN_PASSWORD_HASH instead.
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const storedPlain = process.env.ADMIN_PASSWORD;

  let isValid = false;

  if (storedHash) {
    isValid = bcrypt.compareSync(password, storedHash);
  } else if (storedPlain) {
    isValid = password === storedPlain;
  }

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // Issue JWT Session
  const token = await signJwtToken({ admin: true });
  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return response;
}