"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingForm() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    sessionType: "offline",
    date: "",
    time: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const timeSlots = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "sessionType") updated.time = "";
    setForm(updated);
  };

  useEffect(() => {
    if (!form.date || form.sessionType !== "offline") return;
    async function fetchBookedSlots() {
      const { data, error } = await supabase
        .from("appointments")
        .select("time")
        .eq("date", form.date)
        .eq("status", "approved");
      if (error) { console.error("Fetch error:", error); return; }
      if (data) setBookedSlots(data.map((item) => item.time));
    }
    fetchBookedSlots();
  }, [form.date, form.sessionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "", sessionType: "offline", date: "", time: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border font-sans text-sm text-ink placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2";
  const inputStyle = { borderColor: "var(--teal-soft)", backgroundColor: "white" };
  const labelClass = "block text-xs font-semibold uppercase tracking-widest mb-2";

  return (
    <section className="py-20 bg-white" id="booking">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--gold)" }}>
              Get Started
            </span>
            <h2 className="font-display text-5xl italic text-ink">
              Book an Appointment
            </h2>
            <div className="mt-3 w-12 h-0.5 rounded-full mx-auto" style={{ backgroundColor: "var(--gold)" }} />
            <p className="mt-4 text-sm font-sans" style={{ color: "var(--muted)" }}>
              Fill the form below and we'll confirm your slot.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label className={labelClass} style={{ color: "var(--teal)" }}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className={labelClass} style={{ color: "var(--teal)" }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className={labelClass} style={{ color: "var(--teal)" }}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className={labelClass} style={{ color: "var(--teal)" }}>Session Type</label>
              <select
                name="sessionType"
                value={form.sessionType}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              >
                <option value="offline">In-Person Session</option>
                <option value="online">Online Session</option>
              </select>
            </div>

            <div>
              <label className={labelClass} style={{ color: "var(--teal)" }}>Preferred Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {form.sessionType === "offline" && (
              <div>
                <label className={labelClass} style={{ color: "var(--teal)" }}>Select Time</label>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setForm({ ...form, time: slot })}
                        className="py-2.5 rounded-xl border text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: isBooked ? "#f3f4f6" : form.time === slot ? "var(--teal)" : "white",
                          color: isBooked ? "#9ca3af" : form.time === slot ? "white" : "var(--ink)",
                          borderColor: isBooked ? "#e5e7eb" : form.time === slot ? "var(--teal)" : "var(--teal-soft)",
                          cursor: isBooked ? "not-allowed" : "pointer",
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {form.sessionType === "online" && (
              <div>
                <label className={labelClass} style={{ color: "var(--teal)" }}>Preferred Time</label>
                <input
                  type="text"
                  name="time"
                  placeholder="e.g. 3:00 PM, evening, flexible"
                  value={form.time}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label className={labelClass} style={{ color: "var(--teal)" }}>Message (optional)</label>
              <textarea
                name="message"
                placeholder="Briefly describe what you'd like to discuss"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className={inputClass}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full text-white py-3.5 rounded-xl font-sans font-semibold text-sm tracking-wide shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: "var(--crimson)" }}
            >
              {status === "sending" ? (
                <div className="spinner">
                  <span></span><span></span><span></span>
                  <span></span><span></span><span></span>
                  <span></span><span></span>
                </div>
              ) : "Book Appointment"}
            </button>

            {status === "success" && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center text-green-600 font-medium text-sm font-sans">
                ✅ Appointment request sent! We'll confirm shortly.
              </motion.p>
            )}

            {status === "error" && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center text-red-500 font-medium text-sm font-sans">
                ❌ {errorMessage}
              </motion.p>
            )}

          </form>
        </motion.div>
      </div>
    </section>
  );
}