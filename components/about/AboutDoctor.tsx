"use client";

import { motion } from "framer-motion";

export default function AboutDoctor() {
  return (
    <section className="py-28 bg-card">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2" style={{ borderColor: "var(--teal-soft)" }} />
          <div className="relative rounded-2xl h-[420px] overflow-hidden">
            <img
              src="https://crrnxtuhatdpehghlwrf.supabase.co/storage/v1/object/public/images/about.jpg"
              alt="G. Suma Kavitha"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Floating card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-6 rounded-2xl px-5 py-4 shadow-md border"
            style={{ backgroundColor: "var(--ivory)", borderColor: "var(--teal-soft)" }}
          >
            <p className="font-sans text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Counselling Psycologist</p>
            <p className="font-display italic text-lg mt-0.5" style={{ color: "var(--teal)" }}> &  Psychotherapist</p>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--gold)" }}>
            About the Psychologist
          </span>

          <h2 className="font-display text-5xl italic text-ink leading-tight">
            G. Suma Kavitha
          </h2>

          <div className="mt-2 w-12 h-0.5 rounded-full" style={{ backgroundColor: "var(--gold)" }} />

          <p className="mt-6 text-base font-sans leading-relaxed" style={{ color: "var(--muted)" }}>
            G. Suma Kavitha is a counselling psychologist based in Hyderabad with over 10 years of experience
            supporting individuals, families, and children through life&apos;s most challenging moments.
          </p>

          <p className="mt-4 text-base font-sans leading-relaxed" style={{ color: "var(--muted)" }}>
            Her approach is warm, evidence-based, and deeply personalised — creating a safe space where
            healing and growth happen naturally.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              "Individual Therapy",
              "Child Psychology",
              "Family Counselling",
              " Teen Therapy",
              "Student Counselling",
              "Online & Offline Sessions",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--gold)" }}>✦</span>
                <span className="text-sm font-sans" style={{ color: "var(--ink)" }}>{item}</span>
              </div>
            ))}
          </div>

          <a href="#booking" className="mt-8 inline-block">
            <button
              className="px-7 py-3 rounded-full font-sans font-medium text-sm tracking-wide text-white shadow-sm hover:shadow-md transition-all"
              style={{ backgroundColor: "var(--teal)" }}
            >
              Book a Session
            </button>
          </a>
        </motion.div>

      </div>
    </section>
  );
}