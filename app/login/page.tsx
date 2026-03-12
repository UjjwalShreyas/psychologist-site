"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/adminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      
      if (data.success) {
        router.push("/admin");
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="absolute top-[-120px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-60 blur-3xl" style={{ backgroundColor: "var(--teal-soft)" }} />
      <div className="absolute bottom-[-100px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-50 blur-3xl" style={{ backgroundColor: "var(--gold-soft)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl shadow-2xl border p-10" style={{ backgroundColor: "var(--card)", borderColor: "var(--teal-soft)" }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: "var(--teal-soft)" }}>
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="font-display text-4xl italic text-ink">Admin Portal</h1>
            <p className="mt-2 text-sm font-sans" style={{ color: "var(--muted)" }}>
              G. Suma Kavitha · Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="w-full rounded-xl px-4 py-3.5 font-sans text-sm text-ink focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--ivory)",
                border: `1px solid ${error ? "#fca5a5" : "var(--teal-soft)"}`,
              }}
              autoFocus
              disabled={loading}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-sans text-red-500 text-center"
              >
                Incorrect password. Please try again.
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-3.5 rounded-xl font-sans font-semibold text-sm tracking-wide shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--teal)" }}
            >
              {loading ? "Verifying..." : "Sign In"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs font-sans" style={{ color: "rgba(0,0,0,0.2)" }}>
            Secure access · Admin only
          </p>
        </div>
      </motion.div>
    </div>
  );
}