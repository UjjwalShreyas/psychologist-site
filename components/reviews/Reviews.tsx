"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import ReviewForm from "./ReviewForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Review = {
  id: string;
  rating: number;
  review: string;
  session_type: string;
  created_at: string;
};

function ReviewCard({ r, i }: { r: Review; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, duration: 0.5 }}
      className="break-inside-avoid mb-5 rounded-2xl p-6 flex flex-col gap-4"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--teal-soft)",
        boxShadow: "0 2px 16px rgba(11,94,86,0.06)",
      }}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-base"
            style={{ color: r.rating >= star ? "var(--gold)" : "#e5e7eb" }}>
            ★
          </span>
        ))}
      </div>

      <p className="font-display text-xl italic leading-relaxed" style={{ color: "var(--ink)" }}>
        "{r.review}"
      </p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--teal-soft)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: "var(--teal-soft)" }}>
            🔒
          </div>
          <div>
            <p className="text-xs font-sans font-semibold" style={{ color: "var(--ink)" }}>Verified Client</p>
            <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>Name withheld</p>
          </div>
        </div>
        {r.session_type && (
          <span className="text-xs font-sans px-2.5 py-1 rounded-full font-medium"
            style={{ backgroundColor: "var(--teal-soft)", color: "var(--teal)" }}>
            {r.session_type}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, review, session_type, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      console.log("reviews data:", data);
      console.log("reviews error:", error);
      if (data) setReviews(data);
    }
    fetchReviews();
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const col1 = reviews.filter((_, i) => i % 3 === 0);
  const col2 = reviews.filter((_, i) => i % 3 === 1);
  const col3 = reviews.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-24" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--gold)" }}>
            Client Experiences
          </span>
          <h2 className="font-display text-5xl md:text-6xl italic text-ink">
            What People Say
          </h2>
          <div className="mt-4 w-12 h-0.5 rounded-full mx-auto" style={{ backgroundColor: "var(--gold)" }} />
        </motion.div>

        {avgRating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-14"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--teal-soft)",
                boxShadow: "0 2px 16px rgba(11,94,86,0.08)"
              }}>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-sm"
                    style={{ color: Number(avgRating) >= star ? "var(--gold)" : "#e5e7eb" }}>
                    ★
                  </span>
                ))}
              </div>
              <span className="font-display italic text-xl font-semibold" style={{ color: "var(--teal)" }}>
                {avgRating}
              </span>
              <span className="text-xs font-sans" style={{ color: "var(--muted)" }}>
                · {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </motion.div>
        )}

        {reviews.length > 0 ? (
          <>
            <div className="hidden md:grid grid-cols-3 gap-5 items-start">
              <div>{col1.map((r, i) => <ReviewCard key={r.id} r={r} i={i * 3} />)}</div>
              <div className="mt-8">{col2.map((r, i) => <ReviewCard key={r.id} r={r} i={i * 3 + 1} />)}</div>
              <div>{col3.map((r, i) => <ReviewCard key={r.id} r={r} i={i * 3 + 2} />)}</div>
            </div>
            <div className="md:hidden flex flex-col gap-4">
              {reviews.map((r, i) => <ReviewCard key={r.id} r={r} i={i} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-16 rounded-3xl border"
            style={{ borderColor: "var(--teal-soft)", backgroundColor: "var(--card)" }}>
            <p className="font-display italic text-3xl mb-2" style={{ color: "var(--teal)" }}>No reviews yet</p>
            <p className="text-sm font-sans" style={{ color: "var(--muted)" }}>Be the first to share your experience ✦</p>
          </div>
        )}

        <ReviewForm />

      </div>
    </section>
  );
}