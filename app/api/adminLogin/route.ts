import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJwtToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limiter";
import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success: rateLimitSuccess } = await rateLimit(`login_${ip}`, 5, 60000); // 5 attempts per minute

  if (!rateLimitSuccess) {
    return NextResponse.json({ success: false, error: "Too many login attempts." }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { password } = parsed.data;

  const storedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!storedHash) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const isValid = bcrypt.compareSync(password, storedHash);

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