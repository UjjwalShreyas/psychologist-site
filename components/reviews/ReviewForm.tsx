"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review, sessionType, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setRating(0);
        setReview("");
        setSessionType("");
        setEmail("");
      } else {
        setStatus(data.message || "error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-16 rounded-3xl p-8 md:p-10 border"
      style={{ backgroundColor: "var(--teal-soft)", borderColor: "var(--teal-soft)" }}
    >
      <div className="max-w-xl mx-auto">
        <h3 className="font-display text-3xl italic text-ink mb-1">Share Your Experience</h3>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm">🔒</span>
          <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>
            Your name is never displayed. We verify reviews before publishing to ensure authenticity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Star Rating */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>
              Your Rating
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-4xl transition-transform duration-150 hover:scale-110"
                  style={{ color: star <= (hovered || rating) ? "var(--gold)" : "#d1d5db" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--teal)" }}>
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="we'll send a verification link"
              required
              className="w-full px-4 py-3 rounded-xl border font-sans text-sm outline-none transition-all"
              style={{ borderColor: "var(--teal-soft)", backgroundColor: "white", color: "var(--ink)" }}
            />
            <p className="text-xs mt-1 font-sans" style={{ color: "var(--muted)" }}>
              Only used for verification — never shown publicly.
            </p>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--teal)" }}>
              Session Type (optional)
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border font-sans text-sm outline-none transition-all"
              style={{ borderColor: "var(--teal-soft)", backgroundColor: "white", color: "var(--ink)" }}
            >
              <option value="">Prefer not to say</option>
              <option value="In-Person Session">In-Person Session</option>
              <option value="Online Session">Online Session</option>
            </select>
          </div>

          {/* Review */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--teal)" }}>
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share how your experience was..."
              rows={4}
              required
              className="w-full px-4 py-3 rounded-xl border font-sans text-sm outline-none transition-all"
              style={{ borderColor: "var(--teal-soft)", backgroundColor: "white", color: "var(--ink)", resize: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending" || rating === 0}
            className="w-full py-3.5 rounded-full text-white font-sans font-semibold text-sm tracking-wide shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: "var(--teal)" }}
          >
            {status === "sending" ? "Sending..." : "Submit Review"}
          </button>

          {status === "success" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: "white", borderColor: "var(--teal-soft)" }}>
              <p className="text-2xl mb-1">📬</p>
              <p className="font-sans font-semibold text-sm" style={{ color: "var(--teal)" }}>
                Verification email sent!
              </p>
              <p className="text-xs font-sans mt-1" style={{ color: "var(--muted)" }}>
                Check your inbox and click the link to verify your review.
              </p>
            </motion.div>
          )}

          {status !== "" && status !== "sending" && status !== "success" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-500 font-medium text-sm font-sans text-center">
              ❌ {status === "error" ? "Something went wrong. Please try again." : status}
            </motion.p>
          )}

        </form>
      </div>
    </motion.div>
  );
}