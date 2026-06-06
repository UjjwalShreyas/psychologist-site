"use client";

import { motion } from "framer-motion";

const services = [
  { title: "Anxiety Counselling", desc: "Evidence-based strategies to manage anxiety and reclaim calm." },
  { title: "Depression Support", desc: "Compassionate guidance through emotional darkness toward healing." },
  { title: "Child Behavioural Counselling",  desc: "Nurturing healthy development and behaviour in young children." },
  { title: "Teen Counselling", desc: "A safe space for adolescents navigating growth and identity." },
  { title: "Family Therapy",  desc: "Rebuilding connection and communication within families." },
  { title: "Couples Counselling", desc: "Strengthening relationships through understanding and trust." },
  { title: "Career Guidance",  desc: "Aligning your strengths with purpose and professional clarity." },
  { title: "Trauma & Emotional Healing",  desc: "Gentle, safe processing of past wounds toward wholeness." },
  { title :" Group Therapy",  desc: "Shared healing and growth in a supportive group setting." },
  { title : "Stress Management Workshops",  desc: "Practical tools to manage stress and enhance resilience." },
  { title : "Study Skills Coaching",  desc: "Empowering students with effective study habits and mindset." },
];

export default function Services() {
  return (
    <section className="py-28 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase text-gold mb-4">
            What I Offer
          </span>
          <h2 className="font-display text-5xl italic text-ink">
            Areas of Support
          </h2>
          <div className="mt-3 w-12 h-0.5 bg-gold rounded-full mx-auto" />
          <p className="mt-5 text-base font-sans text-muted max-w-lg mx-auto leading-relaxed">
            Personalised psychological support across every stage of life.
          </p>
        </motion.div>

        <div className="grid gap-5 mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(11,94,86,0.1)" }}
              className="bg-card p-6 rounded-2xl border border-teal-soft cursor-default transition-all duration-300 group"
            >
              
              <h3 className="font-display italic text-xl text-ink mt-3 leading-tight group-hover:text-teal transition-colors">
                {service.title}
              </h3>
              <div className="mt-2 w-6 h-0.5 bg-gold rounded-full group-hover:w-10 transition-all duration-300" />
              <p className="mt-3 text-xs font-sans text-muted leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}