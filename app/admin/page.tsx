"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Add type for Appointment
type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  session_type: string;
  date: string;
  time: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Secure cookie-based auth check
  useEffect(() => {
    let isMounted = true;

    fetch("/api/checkAuth")
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
        } else {
          if (isMounted) setAuthChecked(true);
        }
      })
      .catch(() => {
        if (isMounted) router.push("/login");
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function loadAppointments() {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load error:", error);
        // Show error to user
        alert("Failed to load appointments. Please refresh the page.");
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected', appt: Appointment) {
    // Prevent double-submission
    if (updatingId) return;
    
    // Confirm action
    if (!confirm(`Are you sure you want to ${status} this appointment?`)) {
      return;
    }
    
    setUpdatingId(id);
    
    try {
      // Update status in Supabase
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Update failed:", error);
        alert("Failed to update status. Please try again.");
        return;
      }

      // Send email notification (don't await to improve UI responsiveness)
      if (appt.email) {
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: appt.name || "Patient",
            email: appt.email,
            date: appt.date,
            time: appt.time,
            sessionType: appt.session_type,
            status,
          }),
        }).catch(err => console.error("Email notification failed:", err));
      }

      // Refresh the list
      await loadAppointments();
    } catch (error) {
      console.error("Update error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/adminLogout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
    }
  }

  useEffect(() => {
    if (authChecked) loadAppointments();
  }, [authChecked]);

  // Filter appointments
  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(appt => appt.status === filter);

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--ivory)" }}>
        <div className="text-center">
          <div className="spinner mb-4">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
            <span></span><span></span>
          </div>
          <p className="font-display italic text-2xl" style={{ color: "var(--teal)" }}>
            {!authChecked ? "Verifying..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="font-display italic text-4xl text-ink">Admin Dashboard</h1>
            <p className="text-sm font-sans mt-1" style={{ color: "var(--muted)" }}>
              {filteredAppointments.length} {filteredAppointments.length === 1 ? "appointment" : "appointments"} 
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>
          
          {/* Filter buttons */}
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === f 
                    ? 'bg-teal text-white' 
                    : 'bg-white text-muted border border-teal-soft hover:bg-teal-soft'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="text-sm font-sans px-4 py-2 rounded-full border transition-colors hover:bg-red-50 hover:text-red-500 hover:border-red-200"
            style={{ color: "var(--muted)", borderColor: "var(--teal-soft)" }}
          >
            Logout
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-teal-soft">
            <p className="text-xs text-muted">Total</p>
            <p className="text-2xl font-display text-teal">{appointments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-yellow-200">
            <p className="text-xs text-muted">Pending</p>
            <p className="text-2xl font-display text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-green-200">
            <p className="text-xs text-muted">Approved</p>
            <p className="text-2xl font-display text-green-600">
              {appointments.filter(a => a.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-red-200">
            <p className="text-xs text-muted">Rejected</p>
            <p className="text-2xl font-display text-red-600">
              {appointments.filter(a => a.status === 'rejected').length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--teal-soft)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ backgroundColor: "var(--card)" }}>
              <thead style={{ backgroundColor: "var(--teal-soft)" }}>
                <tr>
                  {["Name", "Phone", "Email", "Session", "Date", "Time", "Message", "Status"].map((h) => (
                    <th key={h} className="p-4 text-left font-sans font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--teal)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-t transition-colors hover:bg-gray-50"
                    style={{ borderColor: "var(--teal-soft)" }}
                  >
                    <td className="p-4 font-sans font-medium text-ink">{appt.name || "—"}</td>
                    <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>{appt.phone || "—"}</td>
                    <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>
                      <a href={`mailto:${appt.email}`} className="hover:text-teal underline">
                        {appt.email || "—"}
                      </a>
                    </td>
                    <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>{appt.session_type || "—"}</td>
                    <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>
                      {appt.date ? new Date(appt.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 font-sans" style={{ color: "var(--muted)" }}>{appt.time || "—"}</td>
                    <td className="p-4 font-sans max-w-[140px] group relative">
                      <div className="truncate cursor-help" style={{ color: "var(--muted)" }}>
                        {appt.message || "—"}
                      </div>
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
                              disabled={updatingId === appt.id}
                              onClick={() => updateStatus(appt.id, "approved", appt)}
                              className="flex-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === appt.id ? "..." : "✓ Approve"}
                            </button>
                            <button
                              disabled={updatingId === appt.id}
                              onClick={() => updateStatus(appt.id, "rejected", appt)}
                              className="flex-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === appt.id ? "..." : "✕ Reject"}
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
                      No {filter !== 'all' ? filter : ''} appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}