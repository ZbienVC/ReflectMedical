import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { AppointmentRequest } from "../types";
import { useToast } from "../components/ui/Toast";
import { ShieldCheck, Calendar, CheckCircle2, Clock, RefreshCw } from "lucide-react";

type RequestRow = AppointmentRequest & { id: string };

const AdminBookings: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "appointment_requests"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RequestRow)));
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role !== "admin") return;
    fetchRequests();
  }, [profile]);

  const markConfirmed = async (id: string) => {
    setConfirming(id);
    try {
      await updateDoc(doc(db, "appointment_requests", id), { status: "confirmed" });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r))
      );
      showToast("success", "Appointment confirmed!");
    } catch (err) {
      showToast("error", "Failed to update status");
    } finally {
      setConfirming(null);
    }
  };

  if (profile?.role !== "admin") {
    return (
      <div className="py-20 text-center">
        <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-500">You do not have administrative privileges.</p>
      </div>
    );
  }

  const filtered = requests.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const confirmedCount = requests.filter((r) => r.status === "confirmed").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointment Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and confirm incoming booking requests.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B57EDC]/10 hover:bg-[#B57EDC]/20 text-[#B57EDC] font-semibold text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Requests" value={requests.length} icon={Calendar} color="purple" />
        <StatCard label="Pending" value={pendingCount} icon={Clock} color="amber" />
        <StatCard label="Confirmed" value={confirmedCount} icon={CheckCircle2} color="green" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "confirmed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors capitalize ${
              filter === f
                ? "bg-[#B57EDC] text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#B57EDC]/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">No requests found</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {filter === "all" ? "No appointment requests yet." : `No ${filter} requests.`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Treatment</th>
                    <th className="px-6 py-4">Preferred Date</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">{r.treatmentName}</p>
                        <p className="text-xs text-[#B57EDC] font-semibold">
                          ${r.price}{r.treatmentName.toLowerCase().includes("unit") ? "/unit" : ""}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {r.preferredDate
                            ? new Date(r.preferredDate).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })
                            : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{r.phone || "—"}</p>
                        <p className="text-xs text-gray-400">{r.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-6 py-4">
                        {r.status === "pending" ? (
                          <button
                            onClick={() => markConfirmed(r.id)}
                            disabled={confirming === r.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B57EDC]/10 hover:bg-[#B57EDC]/20 text-[#B57EDC] text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            {confirming === r.id ? (
                              <span className="animate-pulse">Saving…</span>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((r) => (
                <div key={r.id} className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.email}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-3 space-y-1.5 text-sm">
                    <MRow label="Treatment" value={r.treatmentName} />
                    <MRow
                      label="Preferred"
                      value={r.preferredDate ? new Date(r.preferredDate).toLocaleString() : "—"}
                    />
                    <MRow label="Phone" value={r.phone || "—"} />
                    {r.notes && <MRow label="Notes" value={r.notes} />}
                  </div>
                  {r.status === "pending" && (
                    <button
                      onClick={() => markConfirmed(r.id)}
                      disabled={confirming === r.id}
                      className="w-full py-2 rounded-xl bg-[#B57EDC] hover:bg-[#a06cc9] text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {confirming === r.id ? "Confirming…" : "Mark as Confirmed"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
      status === "pending"
        ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50"
        : status === "confirmed"
        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700/50"
        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/50"
    }`}
  >
    {status === "pending" && <Clock className="w-3 h-3" />}
    {status === "confirmed" && <CheckCircle2 className="w-3 h-3" />}
    {status}
  </span>
);

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ElementType;
  color: "purple" | "amber" | "green";
}> = ({ label, value, icon: Icon, color }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
        color === "purple"
          ? "bg-[#B57EDC]/10 text-[#B57EDC]"
          : color === "amber"
          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-500"
          : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
      }`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{label}</p>
  </motion.div>
);

const MRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-2">
    <span className="text-gray-400 text-xs shrink-0">{label}</span>
    <span className="text-gray-900 dark:text-white text-xs text-right break-all">{value}</span>
  </div>
);

export default AdminBookings;
