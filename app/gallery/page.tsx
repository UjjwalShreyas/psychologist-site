import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const BASE = "https://crrnxtuhatdpehghlwrf.supabase.co/storage/v1/object/public/images";

const galleryImages = [
  { src: `${BASE}/workshop-1.jpg.jpeg`, label: "Group Workshop" },
  { src: `${BASE}/workshop-2.jpg.jpeg`, label: "Awareness Session" },
  { src: `${BASE}/workshop-3.jpg.jpeg`, label: "Teen Counselling Camp" },
  { src: `${BASE}/workshop-4.jpg.jpeg`, label: " Therapy Session" },
];

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--ivory)" }}>
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--gold)" }}>
              Moments & Milestones
            </span>
            <h1 className="font-display text-5xl italic text-ink">Gallery</h1>
            <div className="mt-3 w-12 h-0.5 rounded-full mx-auto" style={{ backgroundColor: "var(--gold)" }} />
            <p className="mt-5 text-base font-sans max-w-md mx-auto leading-relaxed" style={{ color: "var(--muted)" }}>
              A glimpse into workshops, sessions, and the healing spaces we create together.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden border aspect-[4/3]"
                style={{ borderColor: "var(--teal-soft)" }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: "linear-gradient(to top, rgba(26,26,26,0.6), transparent)" }}>
                  <span className="font-display italic text-white text-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* When clinic photos are ready — just add to galleryImages array */}
          <div className="mt-8 text-center">
            <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>
              More photos coming very soon ✦
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-sm font-sans mb-5" style={{ color: "var(--muted)" }}>
              Ready to begin your journey?
            </p>
            <a href="/#booking">
              <button
                className="px-8 py-3.5 rounded-full text-white font-sans font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: "var(--teal)" }}
              >
                Book a Session
              </button>
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}