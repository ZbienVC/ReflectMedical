import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  Users,
  Calendar,
  Gift,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  X,
  Database,
  TrendingUp,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { AppointmentData } from "../services/appointmentService";
import { GiftCardData, generateGiftCardCode } from "../services/giftCardService";
import { sendPostVisitFollowUp } from "../services/notificationService";
import { sendAppointmentReminder } from "../services/notificationService";
import { INITIAL_MEMBERSHIP_TIERS, INITIAL_SERVICES } from "../constants";
import { writeBatch } from "firebase/firestore";
import { formatCurrency } from "../lib/utils";

// ---- Types ----
interface AdminUser {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  membershipTierId?: string;
  beautyBucksBalance: number;
  joinDate: string;
  role: string;
  status: string;
}

type TabKey = "overview" | "appointments" | "members" | "giftcards";
type ApptFilter = "all" | "today" | "week" | "pending";

// ---- Helpers ----
function statusBadge(status: string) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";
  if (status === "confirmed") return <span className={`${base} bg-green-100 text-green-700`}>Confirmed</span>;
  if (status === "cancelled") return <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>;
  if (status === "redeemed") return <span className={`${base} bg-gray-100 text-gray-600`}>Redeemed</span>;
  if (status === "expired") return <span className={`${base} bg-red-100 text-red-700`}>Expired</span>;
  if (status === "active") return <span className={`${base} bg-green-100 text-green-700`}>Active</span>;
  return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
}

function isToday(dateStr: string) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return d >= weekStart && d <= weekEnd;
}

// ---- Sub-components ----

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ---- OVERVIEW ----
interface OverviewStats {
  todayAppts: number;
  totalMembers: number;
  totalCredits: number;
  monthlyBookings: number;
}

function OverviewTab({ stats, loading }: { stats: OverviewStats; loading: boolean }) {
  const cards = [
    { label: "Today's Appointments", value: stats.todayAppts, icon: Calendar, color: "violet" },
    { label: "Total Members", value: stats.totalMembers, icon: Users, color: "blue" },
    { label: "Beauty Bank Credits Issued", value: `$${stats.totalCredits.toLocaleString()}`, icon: Sparkles, color: "emerald" },
    { label: "This Month's Bookings", value: stats.monthlyBookings, icon: TrendingUp, color: "orange" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4
            ${c.color === "violet" ? "bg-violet-100 text-violet-600" :
              c.color === "blue" ? "bg-blue-100 text-blue-600" :
              c.color === "emerald" ? "bg-emerald-100 text-emerald-600" :
              "bg-orange-100 text-orange-600"}`}>
            <c.icon className="w-5 h-5" />
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">{c.label}</p>
          {loading ? (
            <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- APPOINTMENTS ----
function AppointmentsTab({
  appointments,
  loading,
  onConfirm,
  onCancel,
  onRequestReview,
}: {
  appointments: AppointmentData[];
  loading: boolean;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onRequestReview: (id: string, appt: AppointmentData) => void;
}) {
  const [filter, setFilter] = useState<ApptFilter>("all");
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const handleSendReminder = async (a: AppointmentData) => {
    try {
      await sendAppointmentReminder({
        name: a.name,
        email: a.email,
        service: a.service,
        date: a.date,
        time: a.time,
      });
      setReminderSent(a.id!);
      setTimeout(() => setReminderSent(null), 3000);
    } catch {
      // silently ignore
    }
  };

  const filtered = appointments.filter((a) => {
    if (filter === "today") return isToday(a.date);
    if (filter === "week") return isThisWeek(a.date);
    if (filter === "pending") return a.status === "pending";
    return true;
  });

  const filters: { key: ApptFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "pending", label: "Pending" },
  ];

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filter === f.key
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">No appointments found.</td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.service}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.date}<br /><span className="text-xs text-gray-400">{a.time}</span></td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{a.phone}</div>
                    <div className="text-xs text-gray-400">{a.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">{a.notes || "-"}</td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {a.status === "pending" && (
                        <button
                          onClick={() => onConfirm(a.id!)}
                          className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {a.status === "confirmed" && (
                        <button
                          onClick={() => handleSendReminder(a)}
                          className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold hover:bg-violet-200 transition-colors"
                        >
                          {reminderSent === a.id ? "Sent ✓" : "Send Reminder"}
                        </button>
                      )}
                      {a.status === "confirmed" && (
                        <button
                          onClick={() => onRequestReview(a.id!, a)}
                          disabled={!!a.reviewRequested}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            a.reviewRequested
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {a.reviewRequested ? "Review Requested ✓" : "Request Review"}
                        </button>
                      )}
                      {a.status !== "cancelled" && (
                        <button
                          onClick={() => setCancelTarget(a.id!)}
                          className="px-2.5 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Appointment?</h3>
            <p className="text-gray-500 text-sm mb-5">This will mark the appointment as cancelled. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { onCancel(cancelTarget); setCancelTarget(null); }}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
              >
                Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- MEMBERS ----
interface IntakeFormSnapshot {
  fullName?: string;
  dob?: string;
  phone?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medications?: string;
  allergies?: string;
  previousTreatments?: string[];
  medicalConditions?: string[];
  pregnantOrBreastfeeding?: string;
  reasonForVisit?: string;
  areasOfConcern?: string[];
  desiredOutcome?: string;
  signature?: string;
  signatureDate?: string;
}

function IntakeModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [data, setData] = useState<IntakeFormSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "intakeForms", userId));
      setData(snap.exists() ? (snap.data() as IntakeFormSnapshot) : null);
      setLoading(false);
    };
    load();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-violet-600" />
            <h3 className="text-lg font-bold text-gray-900">Patient Intake Form</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-700" /></button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : !data ? (
            <p className="text-gray-500 text-sm">No intake form submitted yet.</p>
          ) : (
            <div className="space-y-4 text-sm">
              {[
                ["Full Name", data.fullName], ["Date of Birth", data.dob], ["Phone", data.phone], ["Email", data.email],
                ["Emergency Contact", data.emergencyContactName], ["Emergency Phone", data.emergencyContactPhone],
                ["Medications", data.medications], ["Allergies", data.allergies],
                ["Previous Treatments", data.previousTreatments?.join(", ")],
                ["Medical Conditions", data.medicalConditions?.join(", ")],
                ["Pregnant/Breastfeeding", data.pregnantOrBreastfeeding],
                ["Reason for Visit", data.reasonForVisit],
                ["Areas of Concern", data.areasOfConcern?.join(", ")],
                ["Desired Outcome", data.desiredOutcome],
                ["Signature", data.signature], ["Signed On", data.signatureDate],
              ].map(([label, value]) => value ? (
                <div key={label as string} className="flex gap-3">
                  <span className="text-gray-400 w-40 flex-shrink-0">{label}</span>
                  <span className="text-gray-900 font-medium">{value as string}</span>
                </div>
              ) : null)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function MembersTab({ members, loading }: { members: AdminUser[]; loading: boolean; }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingTier, setUpdatingTier] = useState<string | null>(null);
  const [viewIntakeUid, setViewIntakeUid] = useState<string | null>(null);

  const filtered = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const tierOptions = ["silver", "gold", "platinum", "diamond"];

  const handleTierChange = async (uid: string, tier: string) => {
    setUpdatingTier(uid);
    await updateDoc(doc(db, "users", uid), { membershipTierId: tier });
    setUpdatingTier(null);
  };

  return (
    <div>
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Beauty Bank</th>
              <th className="px-4 py-3">Update Tier</th>
              <th className="px-4 py-3">Intake</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">No members found.</td>
              </tr>
            ) : (
              filtered.map((m) => (
                <React.Fragment key={m.uid}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === m.uid ? null : m.uid)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                          {m.name?.charAt(0) || "?"}
                        </div>
                        {m.name}
                        {expanded === m.uid ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{m.email}</td>
                    <td className="px-4 py-3 text-gray-600">{m.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                        {m.membershipTierId || "none"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{m.joinDate ? new Date(m.joinDate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${m.beautyBucksBalance?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        defaultValue={m.membershipTierId || ""}
                        onChange={(e) => handleTierChange(m.uid, e.target.value)}
                        disabled={updatingTier === m.uid}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-300 capitalize"
                      >
                        <option value="">- select -</option>
                        {tierOptions.map((t) => (
                          <option key={t} value={t} className="capitalize">{t}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setViewIntakeUid(m.uid)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold hover:bg-violet-200 transition-colors"
                      >
                        <ClipboardList className="w-3 h-3" /> View Intake
                      </button>
                    </td>
                  </tr>
                  {expanded === m.uid && (
                    <tr>
                      <td colSpan={7} className="bg-violet-50 px-6 py-4">
                        <MemberAppointments userId={m.uid} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      {viewIntakeUid && <IntakeModal userId={viewIntakeUid} onClose={() => setViewIntakeUid(null)} />}
    </div>
  );
}

function MemberAppointments({ userId }: { userId: string }) {
  const [appts, setAppts] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { getUserAppointments } = await import("../services/appointmentService");
      const data = await getUserAppointments(userId);
      setAppts(data);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  if (loading) return <div className="text-xs text-gray-400 animate-pulse">Loading appointments...</div>;
  if (appts.length === 0) return <p className="text-sm text-gray-400">No appointments found.</p>;

  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Appointment History</p>
      <div className="space-y-1">
        {appts.map((a) => (
          <div key={a.id} className="flex items-center gap-4 text-sm bg-white border border-gray-100 rounded-xl px-4 py-2">
            <span className="font-medium text-gray-700">{a.service}</span>
            <span className="text-gray-400">{a.date} at {a.time}</span>
            {statusBadge(a.status)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- GIFT CARDS ----
interface CreateGCForm {
  amount: number;
  recipientName: string;
  recipientContact: string;
}

function GiftCardsTab({ giftCards, loading, onRefresh }: { giftCards: GiftCardData[]; loading: boolean; onRefresh: () => void }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateGCForm>({ amount: 100, recipientName: "", recipientContact: "" });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    const { createGiftCard, generateGiftCardCode } = await import("../services/giftCardService");
    const code = generateGiftCardCode();
    await createGiftCard({
      code,
      amount: form.amount,
      senderName: "Admin",
      recipientName: form.recipientName,
      recipientContact: form.recipientContact,
      deliveryMethod: "email",
      status: "active",
    });
    setCreating(false);
    setShowCreate(false);
    setForm({ amount: 100, recipientName: "", recipientContact: "" });
    onRefresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Gift Card
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : giftCards.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">No gift cards yet.</td>
              </tr>
            ) : (
              giftCards.map((gc) => (
                <tr key={gc.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-violet-700">{gc.code}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${gc.amount}</td>
                  <td className="px-4 py-3 text-gray-600">{gc.recipientName}</td>
                  <td className="px-4 py-3">{statusBadge(gc.status)}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {gc.createdAt
                      ? typeof gc.createdAt === "string"
                        ? new Date(gc.createdAt).toLocaleDateString()
                        : (gc.createdAt as { toDate?: () => Date }).toDate?.().toLocaleDateString() ?? "-"
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create Gift Card</h3>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount ($)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recipient Name</label>
                <input
                  type="text"
                  value={form.recipientName}
                  onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recipient Contact</label>
                <input
                  type="text"
                  value={form.recipientContact}
                  onChange={(e) => setForm({ ...form, recipientContact: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={creating || !form.recipientName}
                className="w-full py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50 mt-2"
              >
                {creating ? "Creating..." : "Create Gift Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- MAIN ADMIN ----
const Admin: React.FC = () => {
  const { profile } = useAuth();
  const [tab, setTab] = useState<TabKey>("overview");
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [members, setMembers] = useState<AdminUser[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCardData[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingGC, setLoadingGC] = useState(true);
  const [stats, setStats] = useState<OverviewStats>({ todayAppts: 0, totalMembers: 0, totalCredits: 0, monthlyBookings: 0 });

  const fetchAppointments = useCallback(async () => {
    setLoadingAppts(true);
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppointmentData));
    setAppointments(data);
    setLoadingAppts(false);
    return data;
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AdminUser));
    setMembers(data);
    setLoadingMembers(false);
    return data;
  }, []);

  const fetchGiftCards = useCallback(async () => {
    setLoadingGC(true);
    const snap = await getDocs(collection(db, "giftCards"));
    const data = snap.docs.map((d) => ({ code: d.id, ...d.data() } as GiftCardData));
    setGiftCards(data);
    setLoadingGC(false);
    return data;
  }, []);

  useEffect(() => {
    if (profile?.role !== "admin") return;
    Promise.all([fetchAppointments(), fetchMembers(), fetchGiftCards()]).then(([appts, mems]) => {
      const today = new Date().toISOString().slice(0, 10);
      const monthStart = new Date();
      monthStart.setDate(1);
      const todayAppts = appts.filter((a) => a.date === today).length;
      const monthlyBookings = appts.filter((a) => new Date(a.date) >= monthStart).length;
      const totalCredits = mems.reduce((acc, m) => acc + (m.beautyBucksBalance || 0), 0);
      setStats({ todayAppts, totalMembers: mems.length, totalCredits, monthlyBookings });
    });
  }, [profile, fetchAppointments, fetchMembers, fetchGiftCards]);

  const handleConfirm = async (id: string) => {
    await updateDoc(doc(db, "appointments", id), { status: "confirmed" });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "confirmed" as const } : a));
  };

  const handleCancel = async (id: string) => {
    await updateDoc(doc(db, "appointments", id), { status: "cancelled" });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" as const } : a));
  };

  const handleRequestReview = async (id: string, appt: AppointmentData) => {
    try {
      await sendPostVisitFollowUp({ name: appt.name, email: appt.email, service: appt.service });
      await updateDoc(doc(db, "appointments", id), { reviewRequested: true });
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, reviewRequested: true } : a));
    } catch (err) {
      console.warn("handleRequestReview error", err);
    }
  };

  const handleSeed = async () => {
    const batch = writeBatch(db);
    for (const tier of INITIAL_MEMBERSHIP_TIERS) {
      batch.set(doc(collection(db, "membershipTiers")), tier);
    }
    for (const service of INITIAL_SERVICES) {
      batch.set(doc(collection(db, "services")), service);
    }
    await batch.commit();
    alert("Database seeded successfully!");
  };

  if (profile?.role !== "admin") {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500 mt-2">You do not have administrative privileges.</p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "members", label: "Members", icon: Users },
    { key: "giftcards", label: "Gift Cards", icon: Gift },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage appointments, members, and gift cards.</p>
        </div>
        <button
          onClick={handleSeed}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <Database className="w-4 h-4" /> Seed Database
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 -mb-px ${
              tab === t.key
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === "overview" && <OverviewTab stats={stats} loading={loadingAppts || loadingMembers} />}
        {tab === "appointments" && (
          <AppointmentsTab
            appointments={appointments}
            loading={loadingAppts}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onRequestReview={handleRequestReview}
          />
        )}
        {tab === "members" && <MembersTab members={members} loading={loadingMembers} />}
        {tab === "giftcards" && (
          <GiftCardsTab
            giftCards={giftCards}
            loading={loadingGC}
            onRefresh={fetchGiftCards}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
