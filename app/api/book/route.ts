import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, sessionType, date, time, message } = body;

    if (!name || !phone || !email || !sessionType || !date || !time) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (name.length > 100) {
      return NextResponse.json({ success: false, message: "Name is too long." }, { status: 400 });
    }

    if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
      return NextResponse.json({ success: false, message: "Invalid phone number." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
    }

    if (!["online", "offline"].includes(sessionType)) {
      return NextResponse.json({ success: false, message: "Invalid session type." }, { status: 400 });
    }

    if (message && message.length > 500) {
      return NextResponse.json({ success: false, message: "Message too long." }, { status: 400 });
    }

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