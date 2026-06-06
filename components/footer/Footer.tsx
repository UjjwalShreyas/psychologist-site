import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--ink)", color: "white" }} className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <h3 className="font-display italic text-2xl" style={{ color: "white" }}>
              G. Suma Kavitha
            </h3>
            <p className="mt-2 text-sm font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Counselling Psychologist<br />Hyderabad, Telangana
            </p>
          </div>
          <div>
            <p className="text-xs font-sans uppercase tracking-widest mb-4" style={{ color: "var(--gold)" }}>
              Navigate
            </p>
            <div className="flex flex-col gap-2">
              {["Home", "About", "Services", "Gallery", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-sm font-sans transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-sans uppercase tracking-widest mb-4" style={{ color: "var(--gold)" }}>
              Get Started
            </p>
            <p className="text-sm font-sans leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              Ready to take the first step? Book a session today.
            </p>
            <Link href="/#booking">
              <button
                className="px-6 py-2.5 rounded-full font-sans text-sm font-medium transition-all"
                style={{ backgroundColor: "var(--teal)", color: "white" }}
              >
                Book Appointment
              </button>
            </Link>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.3)" }}>
            {`© ${new Date().getFullYear()} G. Suma Kavitha. All rights reserved.`}
          </p>
          <div className="flex items-center gap-2">
  <p className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.25)" }}>
    Hyderabad, India 
  </p>
  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
  <a
    href="https://github.com/UjjwalShreyas"
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs font-sans transition-colors hover:text-white"
    style={{ color: "rgba(255,255,255,0.25)" }}
  >
    Built by Ujjwal Shreyas .G
  </a>
</div>
        </div>
      </div>
    </footer>
  );
}