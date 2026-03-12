"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-white/70 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-xl italic" style={{ color: "var(--teal)" }}>
          G. Suma Kavitha
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium transition-colors duration-200 tracking-wide text-gray-600 hover:text-teal-700"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <a href="/#booking" className="hidden md:block">
          <button
            className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-200 tracking-wide shadow-sm hover:shadow-md"
            style={{ backgroundColor: "var(--teal)" }}
          >
            Book Session
          </button>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ backgroundColor: "var(--teal)" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} style={{ backgroundColor: "var(--teal)" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ backgroundColor: "var(--teal)" }} />
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 border-t border-gray-100">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
            >
              {label}
            </Link>
          ))}
          <a href="/#booking" onClick={() => setMenuOpen(false)}>
            <button
              className="w-full text-white py-2.5 rounded-full text-sm font-medium mt-1"
              style={{ backgroundColor: "var(--teal)" }}
            >
              Book Session
            </button>
          </a>
        </div>
      )}
    </nav>
  );
}