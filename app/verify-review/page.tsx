"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "invalid" | "already">("loading");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }

    async function verify() {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, status")
        .eq("token", token)
        .single();

      if (error || !data) { setStatus("invalid"); return; }
      if (data.status !== "unverified") { setStatus("already"); return; }

      const { error: updateError } = await supabase
        .from("reviews")
        .update({ status: "pending" })
        .eq("token", token);

      if (updateError) { setStatus("invalid"); return; }

      setStatus("success");
    }

    verify();
  }, [token]);

  const content = {
    loading: { emoji: "⏳", title: "Verifying...", text: "Please wait a moment.", color: "var(--teal)" },
    success: { emoji: "✅", title: "Review Verified!", text: "Thank you! Your review has been submitted and will appear after approval.", color: "var(--teal)" },
    already: { emoji: "ℹ️", title: "Already Verified", text: "This review has already been verified.", color: "var(--gold)" },
    invalid: { emoji: "❌", title: "Invalid Link", text: "This verification link is invalid or has expired.", color: "var(--crimson)" },
  }[status];

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="max-w-md w-full text-center rounded-3xl p-12 border bg-white shadow-lg"
        style={{ borderColor: "var(--teal-soft)" }}>
        <p className="text-5xl mb-4">{content.emoji}</p>
        <h1 className="font-display text-3xl italic mb-3" style={{ color: content.color }}>
          {content.title}
        </h1>
        <p className="font-sans text-sm mb-8" style={{ color: "var(--muted)" }}>
          {content.text}
        </p>
        <Link href="/">
          <button
            className="px-8 py-3 rounded-full text-white font-sans font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--teal)" }}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Verifying..." : "Back to Home"}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display italic text-2xl" style={{ color: "var(--teal)" }}>Loading...</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}