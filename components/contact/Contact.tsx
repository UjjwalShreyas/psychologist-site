"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Contact() {
  return (
    <section className="py-28 bg-ivory" id="contact">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--gold)" }}>
            Find Us
          </span>
          <h2 className="font-display text-5xl italic text-ink">Visit the Clinic</h2>
          <div className="mt-3 w-12 h-0.5 rounded-full mx-auto" style={{ backgroundColor: "var(--gold)" }} />
          <p className="mt-5 text-base font-sans max-w-md mx-auto leading-relaxed" style={{ color: "var(--muted)" }}>
            Located in Hayathnagar, Hyderabad. Walk in or book an appointment in advance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-8 space-y-8 border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--teal-soft)" }}
          >

            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ backgroundColor: "var(--teal-soft)" }}>
                📍
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--crimson)" }}>
                  Address
                </p>
                <p className="text-sm font-sans leading-relaxed" style={{ color: "var(--ink)" }}>
                  Sushwasa Chest & Asthma CLinic,<br />
                  Smriti Nilayam Shops, Main Rd<br />
                  Venkateswara Colony, Hayathnagar<br />
                  Beside Sunrise Hospitals<br />
                  Hyderabad, Telangana 501505
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ backgroundColor: "var(--teal-soft)" }}>
                🕐
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--crimson)" }}>
                  Clinic Hours
                </p>
                <p className="text-sm font-sans" style={{ color: "var(--ink)" }}>Monday – Saturday</p>
                <p className="text-sm font-sans font-semibold" style={{ color: "var(--teal)" }}>11:00 AM – 3:00 PM</p>
                <p className="text-xs font-sans mt-1" style={{ color: "var(--muted)" }}>Sunday: Closed</p>
              </div>
            </div>

            {/* Session Types */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ backgroundColor: "var(--teal-soft)" }}>
                💬
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--crimson)" }}>
                  Session Types
                </p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs font-sans px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: "var(--teal-soft)", color: "var(--teal)" }}>
                    ✦ In-Person
                  </span>
                  <span className="text-xs font-sans px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: "var(--gold-soft)", color: "var(--crimson)" }}>
                    ✦ Online
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{ backgroundColor: "var(--teal-soft)" }} />

            {/* CTA */}
            <Link href="/#booking" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-white py-3.5 rounded-xl font-sans font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: "var(--crimson)" }}
              >
                Book an Appointment
              </motion.button>
            </Link>

          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border h-[460px] relative"
            style={{ borderColor: "var(--teal-soft)" }}
          >
            <iframe
            // Map Location
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.234!2d78.5991!3d17.3280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba0e46d9f0001%3A0x1!2sSmriti+Nilayam+Shops%2C+Main+Rd%2C+Hayathnagar%2C+Hyderabad%2C+Telangana+501505!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
}