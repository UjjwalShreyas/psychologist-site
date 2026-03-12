import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {

  const { name, email, date, time, sessionType, status } = await req.json();
  const isApproved = status === "approved";

  try {
    await transporter.sendMail({
      from: `"G. Suma Kavitha" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: isApproved
        ? "Your Appointment is Confirmed – G. Suma Kavitha"
        : "Appointment Update – G. Suma Kavitha",
      html: isApproved
        ? `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e0edeb;border-radius:16px;">
            <h2 style="color:#0B5E56;">Appointment Confirmed ✅</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your appointment has been <strong style="color:#0B5E56;">approved</strong>. We look forward to seeing you.</p>
            <div style="background:#f0f9f8;border-radius:12px;padding:16px 20px;margin:20px 0;">
              <p style="margin:4px 0;"><strong>Session:</strong> ${sessionType}</p>
              <p style="margin:4px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin:4px 0;"><strong>Time:</strong> ${time}</p>
            </div>
            <p>Please be ready 5 minutes before your session. Reply to this email if you need to reschedule.</p>
            <br/>
            <p style="color:#888;font-size:12px;">G. Suma Kavitha | Counselling Psychologist, Hyderabad</p>
          </div>
        `
        : `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #fde8e8;border-radius:16px;">
            <h2 style="color:#7f1d1d;">Appointment Update</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Unfortunately your appointment for <strong>${date} at ${time}</strong> could not be confirmed at this time.</p>
            <p>Please visit our website to book a different slot.</p>
            <br/>
            <p style="color:#888;font-size:12px;">G. Suma Kavitha | Counselling Psychologist, Hyderabad</p>
          </div>
        `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify failed:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}