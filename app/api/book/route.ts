import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { z } from "zod";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

import { rateLimit } from "@/lib/rate-limiter";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100, "Name is too long").regex(/^[^<>]+$/, "Invalid characters"),
  phone: z.string().regex(/^[0-9+\-\s]{7,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  sessionType: z.enum(["online", "offline"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}\s?(AM|PM)$/i, "Invalid time format"),
  message: z.string().max(500, "Message too long").optional().transform(v => v?.replace(/</g, "").replace(/>/g, "").trim()),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success: rateLimitSuccess } = await rateLimit(`book_${ip}`, 5, 3600000); // 5 bookings/hr
    if (!rateLimitSuccess) {
      return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid payload format" }, { status: 400 });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, phone, email, sessionType, date, time, message } = parsed.data;
    const sessionLabel = sessionType === "online" ? "Online Session" : "In-Person Session";

    // Double booking check
    if (sessionType === "offline") {
      const { data: existing, error: checkError } = await supabase
        .from("appointments")
        .select("id")
        .eq("date", date)
        .eq("time", time)
        .eq("status", "approved");

      if (checkError) {
        return NextResponse.json({ success: false, message: "Error checking availability" }, { status: 500 });
      }

      if (existing && existing.length > 0) {
        return NextResponse.json({ success: false, message: "This slot is already booked. Please choose another time." }, { status: 409 });
      }
    }

    // Save to Supabase
    const { error: insertError } = await supabase.from("appointments").insert([{
      name,
      phone,
      email,
      session_type: sessionLabel,
      date,
      time,
      message: message || null,
      status: "pending",
    }]);

    if (insertError) {
      console.error("Database error:", insertError);
      return NextResponse.json({ success: false, message: "Failed to save appointment" }, { status: 500 });
    }

   // Email to doctor
await transporter.sendMail({
  from: `"Appointment System" <${process.env.GMAIL_USER}>`,
  to: process.env.GMAIL_USER,
  subject: `New Appointment Request from ${name}`,
  html: `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;">
      <h2 style="color:#0B5E56;">New Appointment Booking</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Session:</strong> ${sessionLabel}</p>
      <p><strong>Date:</strong> ${date} at ${time}</p>
      <p><strong>Message:</strong> ${message || "None"}</p>
    </div>
  `,
}).catch(err => console.error("Doctor email failed:", err));

// Confirmation email to patient
await transporter.sendMail({
  from: `"G. Suma Kavitha" <${process.env.GMAIL_USER}>`,
  to: email,
  subject: "Appointment Request Received – G. Suma Kavitha",
  html: `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e0edeb;border-radius:16px;">
      <h2 style="color:#0B5E56;">Thank you, ${name}! 🙏</h2>
      <p>Your appointment request has been received and is pending confirmation.</p>
      <div style="background:#f0f9f8;border-radius:12px;padding:16px 20px;margin:20px 0;">
        <p style="margin:4px 0;"><strong>Session:</strong> ${sessionLabel}</p>
        <p style="margin:4px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin:4px 0;"><strong>Time:</strong> ${time}</p>
      </div>
      <p>You will receive another email once your slot is confirmed.</p>
      <br/>
      <p style="color:#888;font-size:12px;">G. Suma Kavitha | Counselling Psychologist, Hyderabad</p>
    </div>
  `,
}).catch(err => console.error("Patient email failed:", err));

    return NextResponse.json({ success: true, message: "Appointment request submitted successfully!" });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}