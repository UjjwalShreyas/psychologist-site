"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  session_type: string;
  date: string;
  time: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type Review = {
  id: string;
  rating: number;
  review: string;
  session_type: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"appointments" | "reviews">("appointments");

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [updatingApptId, setUpdatingApptId] = useState<string | null>(null);
  const [apptFilter, setApptFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/checkAuth")
      .then((res) => {
        if (!res.ok) router.push("/login");
        else if (isMounted) setAuthChecked(true);
      })
      .catch(() => router.push("/login"));
    return () => { isMounted = false; };
  }, [router]);

  async function loadAppointments() {
    try {
      const res = await fetch("/api/admin/appointments");
      if (!res.ok) { alert("Failed to load appointments."); return; }
      const data = await res.json();
      setAppointments(data || []);
    } catch {
      alert("Failed to load appointments.");
    } finally {
      setApptLoading(false);
    }
  }

  async function loadReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) { alert("Failed to load reviews."); return; }
      const data = await res.json();
      setReviews(data || []);
    } catch {
      alert("Failed to load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }

  useEffect(() => {
    if (authChecked) {
      loadAppointments();
      loadReviews();
    }
  }, [authChecked]);

  async function updateApptStatus(id: string, status: "approved" | "rejected", appt: Appointment) {
    if (updatingApptId) return;
    if (!confirm(`Are you sure you want to ${status} this appointment?`)) return;
    setUpdatingApptId(id);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) { alert("Failed to update."); return; }
      if (appt.email) {
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: appt.name, email: appt.email, date: appt.date, time: appt.time, sessionType: appt.session_type, status }),
        }).catch(console.error);
      }
      await loadAppointments();
    } finally {
      setUpdatingApptId(null);
    }
  }

  async function updateReviewStatus(id: string, status: "approved" | "rejected") {
    if (updatingReviewId) return;
    if (!confirm(`Are you sure you want to ${status} this review?`)) return;
    setUpdatingReviewId(id);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) { alert("Failed to update."); return; }
      await loadReviews();
    } finally {
      setUpdatingReviewId(null);
    }
  }

  async function handleLogout() {
    try { await fetch("/api/adminLogout", { method: "POST" }); }
    catch (e) { console.error(e); }
    finally { router.push("/login"); }
  }

  const filteredAppointments = apptFilter === "all" ? appointments : appointments.filter(a => a.status === apptFilter);
  const filteredReviews = reviewFilter === "all" ? reviews : reviews.filter(r => r.status === reviewFilter);

  if (!authChecked || apptLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--ivory)" }}>
        <div className="text-center">
          <div className="spinner mb-4">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
            <span></span><span></span>
          </div>
          <p className="font-display italic text-2xl" style={{ color: "var(--teal)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display italic text-4xl text-ink">Admin Dashboard</h1>
            <p className="text-sm font-sans mt-1" style={{ color: "var(--muted)" }}>
              G. Suma Kavitha · Counselling Psychologist
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-sans px-4 py-2 rounded-full border transition-colors hover:bg-red-50 hover:text-red-500 hover:border-red-200"
            style={{ color: "var(--muted)", borderColor: "var(--teal-soft)" }}
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border" style={{ borderColor: "var(--teal-soft)" }}>
            <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>Total Appointments</p>
            <p className="text-2xl font-display" style={{ color: "var(--teal)" }}>{appointments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-yellow-200">
            <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>Pending Appointments</p>
            <p className="text-2xl font-display text-yellow-600">{appointments.filter(a => a.status === "pending").length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-green-200">
            <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>Total Reviews</p>
            <p className="text-2xl font-display text-green-600">{reviews.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-yellow-200">
            <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>Pending Reviews</p>
            <p className="text-2xl font-display text-yellow-600">{reviews.filter(r => r.status === "pending").length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["appointments", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-full text-sm font-sans font-semibold transition-all"
              style={{
                backgroundColor: activeTab === tab ? "var(--teal)" : "white",
                color: activeTab === tab ? "white" : "var(--muted)",
                border: `1.5px solid ${activeTab === tab ? "var(--teal)" : "var(--teal-soft)"}`,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "appointments" && appointments.filter(a => a.status === "pending").length > 0 && (
                <span className="ml-2 bg-yellow-400 text-white text-xs rounded-full px-1.5 py-0.5">
                  {appointments.filter(a => a.status === "pending").length}
                </span>
              )}
              {tab === "reviews" && reviews.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-2 bg-yellow-400 text-white text-xs rounded-full px-1.5 py-0.5">
                  {reviews.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── APPOINTMENTS TAB ── */}
        {activeTab === "appointments" && (
          <>
            <div className="flex gap-2 mb-4">
              {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setApptFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    apptFilter === f ? "text-white" : "bg-white border hover:bg-teal-soft"
                  }`}
                  style={{
                    backgroundColor: apptFilter === f ? "var(--teal)" : undefined,
                    borderColor: "var(--teal-soft)",
                    color: apptFilter === f ? "white" : "var(--muted)",
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--teal-soft)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ backgroundColor: "var(--card)" }}>
                  <thead style={{ backgroundColor: "var(--teal-soft)" }}>
                    <tr>
                      {["Name", "Phone", "Email", "Session", "Date", "Time", "Message", "Status"].map((h) => (
                        <th key={h} className="p-4 text-left font-sans font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--teal)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="border-t hover:bg-gray-50" style={{ borderColor: "var(--teal-soft)" }}>
                        <td className="p-4 font-sans font-medium text-ink">{appt.name || "—"}</td>
                        <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>{appt.phone || "—"}</td>
                        <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>
                          <a href={`mailto:${appt.email}`} className="hover:text-teal underline">{appt.email || "—"}</a>
                        </td>
                        <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>{appt.session_type || "—"}</td>
                        <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>
                          {appt.date ? new Date(appt.date).toLocaleDateString() : "—"}
                        </td>
                        <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>{appt.time || "—"}</td>
                        <td className="p-4 font-sans max-w-[140px] group relative">
                          <div className="truncate cursor-help" style={{ color: "var(--muted)" }}>{appt.message || "—"}</div>
                          {appt.message && (
                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 z-10 max-w-xs whitespace-normal">
                              {appt.message}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-2 min-w-[120px]">
                            <span className={`px-3 py-1 text-xs font-sans font-medium rounded-full text-center ${
                              appt.status === "approved" ? "bg-green-100 text-green-700"
                              : appt.status === "rejected" ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {appt.status || "pending"}
                            </span>
                            {appt.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  disabled={updatingApptId === appt.id}
                                  onClick={() => updateApptStatus(appt.id, "approved", appt)}
                                  className="flex-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                  {updatingApptId === appt.id ? "..." : "✓"}
                                </button>
                                <button
                                  disabled={updatingApptId === appt.id}
                                  onClick={() => updateApptStatus(appt.id, "rejected", appt)}
                                  className="flex-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                  {updatingApptId === appt.id ? "..." : "✕"}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-12 text-center font-display italic text-2xl" style={{ color: "var(--teal)" }}>
                          No {apptFilter !== "all" ? apptFilter : ""} appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === "reviews" && (
          <>
            <div className="flex gap-2 mb-4">
              {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setReviewFilter(f)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: reviewFilter === f ? "var(--teal)" : "white",
                    color: reviewFilter === f ? "white" : "var(--muted)",
                    border: `1px solid ${reviewFilter === f ? "var(--teal)" : "var(--teal-soft)"}`,
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border p-6 flex flex-col gap-3" style={{ borderColor: "var(--teal-soft)" }}>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-lg" style={{ color: r.rating >= star ? "var(--gold)" : "#d1d5db" }}>★</span>
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink)" }}>"{r.review}"</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs font-sans" style={{ color: "var(--muted)" }}>
                    <span>🔒 Name withheld</span>
                    {r.session_type && <span className="px-2 py-1 rounded-full" style={{ backgroundColor: "var(--teal-soft)", color: "var(--teal)" }}>{r.session_type}</span>}
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--teal-soft)" }}>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      r.status === "approved" ? "bg-green-100 text-green-700"
                      : r.status === "rejected" ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {r.status}
                    </span>
                    {r.status === "pending" && (
                      <>
                        <button
                          disabled={updatingReviewId === r.id}
                          onClick={() => updateReviewStatus(r.id, "approved")}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingReviewId === r.id ? "..." : "✓ Approve"}
                        </button>
                        <button
                          disabled={updatingReviewId === r.id}
                          onClick={() => updateReviewStatus(r.id, "rejected")}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {updatingReviewId === r.id ? "..." : "✕ Reject"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {filteredReviews.length === 0 && (
                <div className="col-span-2 p-12 text-center font-display italic text-2xl" style={{ color: "var(--teal)" }}>
                  No {reviewFilter !== "all" ? reviewFilter : ""} reviews found.
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}