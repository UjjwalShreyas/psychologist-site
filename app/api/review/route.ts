import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

import { rateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success: rateLimitSuccess } = await rateLimit(ip, 3, 3600000); // 3 reviews/hr
    if (!rateLimitSuccess) {
      return NextResponse.json({ success: false, message: "Too many requests. Try again later." }, { status: 429 });
    }

    let { rating, review, sessionType, email } = await req.json();

    review = review?.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();

    if (!rating || rating < 1 || rating > 5)
      return NextResponse.json({ success: false, message: "Invalid rating" }, { status: 400 });

    if (!review || review.length < 10)
      return NextResponse.json({ success: false, message: "Review is too short (min 10 characters)" }, { status: 400 });

    if (review.length > 1000)
      return NextResponse.json({ success: false, message: "Review is too long" }, { status: 400 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 });

    const token = randomUUID();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sumakavitha.online";

    const { error } = await supabase.from("reviews").insert([{
      rating,
      review: review.trim(),
      session_type: sessionType || null,
      email,
      token,
      status: "unverified",
    }]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ success: false, message: "Failed to save review" }, { status: 500 });
    }

    await transporter.sendMail({
      from: `"G. Suma Kavitha" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Please verify your review — G. Suma Kavitha",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e0edeb;border-radius:16px;">
          <h2 style="color:#0B5E56;">Thank you for your review! 🙏</h2>
          <p>Please click the button below to verify your review. It will then be reviewed by us before going live.</p>
          <div style="margin:24px 0;">
            <a href="${siteUrl}/verify-review?token=${token}" 
               style="background:#0B5E56;color:white;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
              Verify My Review
            </a>
          </div>
          <p style="color:#888;font-size:12px;">If you didn't submit a review, you can safely ignore this email.</p>
          <p style="color:#888;font-size:12px;">G. Suma Kavitha | Counselling Psychologist, Hyderabad</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, message: "Unexpected error" }, { status: 500 });
  }
}