"use client";

import { motion } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import AboutDoctor from "../components/about/AboutDoctor";
import Services from "../components/services/Services";
import Stats from "../components/stats/Stats";
import BookingForm from "../components/booking/BookingForm";
import Contact from "../components/contact/Contact";
import Footer from "../components/footer/Footer";
import Reviews from "../components/reviews/Reviews";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center bg-ivory overflow-hidden">

          {/* Background decorative circles */}
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-teal-soft opacity-60 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-gold-soft opacity-50 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase text-gold mb-6">
                  A space to heal & a voice to guide.
              </span>

              <h1 className="font-display text-6xl md:text-7xl italic font-medium text-ink leading-[1.1]">
                Counselling Psychologist ,<br />
                <span className="text-teal"> Hyderabad.</span>
              </h1>

              <p className="mt-6 text-base font-sans text-muted leading-relaxed max-w-md">
                Professional psychological support for individuals, teens, couples, and families. 
                Compassionate. Confidential. Life-changing.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#booking">
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="bg-crimson text-ivory px-8 py-3.5 rounded-full font-sans font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
  >
    Book an Appointment
  </motion.button>
</a>
<p className="text-xs font-sans mt-2" style={{ color: "var(--muted)" }}>
  ✦ Free to book · Pay only after your session
</p>
                <a href="/about">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="border border-teal text-teal px-8 py-3.5 rounded-full font-sans font-medium text-sm tracking-wide hover:bg-teal-soft transition-all"
                  >
                    Learn More
                  </motion.button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex gap-8 text-center">
                {[
                  { number: "10+", label: "Years Experience" },
                  { number: "1500+", label: "Clients Helped" },
                  { number: "20+", label: "Workshops" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  >
                    <p className="font-display text-3xl italic font-semibold text-teal">{item.number}</p>
                    <p className="text-xs font-sans text-muted mt-1 tracking-wide">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
  className="flex items-center justify-center"
>
  <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px]">
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border-2 border-teal-soft animate-[spin_20s_linear_infinite]">
      <div className="absolute top-4 left-1/2 w-3 h-3 bg-gold rounded-full -translate-x-1/2" />
    </div>
    {/* Middle ring */}
    <div className="absolute inset-8 rounded-full border border-dashed border-gold/30" />
    {/* Photo */}
    <div className="absolute inset-12 rounded-full overflow-hidden">
      <img
        src="https://crrnxtuhatdpehghlwrf.supabase.co/storage/v1/object/public/images/doctor.png"
        alt="G. Suma Kavitha"
        className="w-full h-full object-cover object-top"
      />
    </div>
    {/* Badge */}
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-8 -right-4 bg-card rounded-2xl shadow-lg px-4 py-3 border border-teal-soft"
    >
      <p className="font-display italic text-teal text-sm">✦ Safe & Confidential</p>
    </motion.div>
  </div>
</motion.div>

          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-5 h-8 border-2 border-muted/30 rounded-full flex items-start justify-center pt-1.5">
              <div className="w-1 h-1.5 bg-muted/40 rounded-full" />
            </div>
          </motion.div>

        </section>

        <AboutDoctor />
        <Services />
        <Stats />
        <Reviews />
        <BookingForm />
         <Contact />

      </main>
      <Footer />
    </>
  );
}