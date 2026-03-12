"use client";

import { motion } from "framer-motion";

const stats = [
  { number: "10+", label: "Years of Experience" },
  { number: "1500+", label: "Clients Supported" },
  { number: "20+", label: "Workshops Conducted" },
  { number: "2", label: "Session Formats" },
];

export default function Stats() {
  return (
    <section className="py-24 bg-teal relative overflow-hidden">

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl italic text-ivory">
            A decade of trust, one session at a time.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <p className="font-display text-6xl italic font-semibold text-gold group-hover:scale-110 transition-transform duration-300 inline-block">
                {stat.number}
              </p>
              <div className="mt-2 w-8 h-0.5 bg-white/20 rounded-full mx-auto" />
              <p className="mt-3 font-sans text-sm text-ivory/70 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}