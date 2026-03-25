import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles,
  Zap,
  Clock,
  ArrowUpRight,
  Star,
  Gift,
  Bell,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../AuthContext";
import { onBalanceChange } from "../services/beautyBankService";
import { getBookings } from "../services/treatmentService";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

interface Transaction {
  id: string;
  treatment: string;
  date: string;
  amount: number;
  saved: number;
  status: "completed" | "upcoming" | "cancelled";
}

interface SuggestedTreatment {
  id: string;
  name: string;
  reason: string;
  memberPrice: number;
  regularPrice: number;
  category: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
  { id: "1", treatment: "Botox – Forehead & Crow's Feet", date: "Mar 15, 2026", amount: 165, saved: 60, status: "completed" },
  { id: "2", treatment: "HydraFacial Deluxe", date: "Mar 8, 2026", amount: 180, saved: 45, status: "completed" },
  { id: "3", treatment: "VI Peel (Medium)", date: "Feb 28, 2026", amount: 180, saved: 45, status: "completed" },
  { id: "4", treatment: "Juvederm Voluma – Cheeks", date: "Feb 15, 2026", amount: 720, saved: 180, status: "completed" },
  { id: "5", treatment: "Consultation – Spring Refresh", date: "Apr 1, 2026", amount: 0, saved: 0, status: "upcoming" },
];

const SUGGESTED: SuggestedTreatment[] = [
  { id: "s1", name: "Dysport", reason: "Due for a touch-up (3 months since Botox)", memberPrice: 150, regularPrice: 200, category: "Neurotoxins" },
  { id: "s2", name: "IPL Photofacial", reason: "Popular this season — great for sun damage", memberPrice: 280, regularPrice: 350, category: "Laser" },
  { id: "s3", name: "Restylane Kysse", reason: "Complete your look with natural lip volume", memberPrice: 560, regularPrice: 700, category: "Fillers" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, trend, color }) => (
  <motion.div
    className="bg-[#1C1C24] rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-all"
    whileHover={{ y: -2 }}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      {trend && (
        <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" />{trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="text-[#71717A] text-sm mt-0.5">{label}</p>
    {sub && <p className="text-purple-400 text-xs mt-1">{sub}</p>}
  </motion.div>
);

const StatusBadge: React.FC<{ status: Transaction["status"] }> = ({ status }) => {
  const styles = {
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-white/5 rounded-xl animate-pulse ${className}`} />
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"activity" | "upcoming">("activity");
  const [isLoading, setIsLoading] = useState(false);
  const [liveBalance, setLiveBalance] = useState<number | null>(null);
  const [firebaseTransactions, setFirebaseTransactions] = useState<Transaction[] | null>(null);
  const { user, profile } = useAuth();

  // Real-time balance listener
  useEffect(() => {
    if (!user) return;
    const unsub = onBalanceChange(user.uid, (bal) => setLiveBalance(bal));
    return () => unsub();
  }, [user]);

  // Load bookings from Firebase
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getBookings(user.uid)
      .then((bookings) => {
        if (bookings.length > 0) {
          const mapped: Transaction[] = bookings.map((b) => ({
            id: b.id,
            treatment: b.serviceName,
            date: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            amount: 0,
            saved: 0,
            status: b.status === "canceled" ? "cancelled" : b.status === "scheduled" ? "upcoming" : b.status as "completed" | "upcoming" | "cancelled",
          }));
          setFirebaseTransactions(mapped);
        }
      })
      .catch(() => {/* fall back to mock */})
      .finally(() => setIsLoading(false));
  }, [user]);

  const transactions = firebaseTransactions ?? TRANSACTIONS;
  const completedTransactions = transactions.filter((t) => t.status === "completed");
  const upcomingTransactions = transactions.filter((t) => t.status === "upcoming");
  const totalSaved = completedTransactions.reduce((sum, t) => sum + t.saved, 0);

  const displayName = profile?.name ?? user?.displayName ?? "Sarah";
  const beautyBalance = liveBalance !== null ? liveBalance : 1420;
  const membershipLabel = profile?.membershipTierId
    ? profile.membershipTierId.charAt(0).toUpperCase() + profile.membershipTierId.slice(1) + " Member"
    : "Evolve Member";

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* ── Welcome Bar ── */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Good morning, {displayName} 👋</h1>
            <p className="text-[#71717A] text-sm mt-1">Here's your Reflect Medical dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-purple-600/20 text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full border border-purple-500/30">
              {membershipLabel}
            </span>
            <button className="w-9 h-9 rounded-xl bg-[#1C1C24] border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ── Section 1: Overview Stats ── */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Beauty Balance"
              value={`$${beautyBalance.toLocaleString()}`}
              sub="Credits available to spend"
              icon={<CreditCard className="w-5 h-5 text-white" />}
              color="bg-gradient-to-br from-purple-600 to-purple-700"
              trend="+$150 this month"
            />
            <StatCard
              label="Total Saved"
              value={`$${totalSaved.toLocaleString()}`}
              sub="Since joining Reflect"
              icon={<TrendingUp className="w-5 h-5 text-white" />}
              color="bg-gradient-to-br from-green-600 to-green-700"
              trend="+$285 this month"
            />
            <StatCard
              label="Treatments Done"
              value={`${completedTransactions.length}`}
              sub="This membership cycle"
              icon={<Sparkles className="w-5 h-5 text-white" />}
              color="bg-gradient-to-br from-fuchsia-600 to-fuchsia-700"
            />
            <StatCard
              label="Next Appointment"
              value="Apr 1"
              sub="Consultation – Spring Refresh"
              icon={<Calendar className="w-5 h-5 text-white" />}
              color="bg-gradient-to-br from-blue-600 to-blue-700"
            />
          </div>
        )}

        {/* ── Section 2 + 3: Activity & Suggestions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Activity */}
          <div className="lg:col-span-3 bg-[#1C1C24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-bold text-white">Activity</h2>
              <div className="flex gap-1 bg-[#0F0F14] rounded-lg p-1">
                {(["activity", "upcoming"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                      activeTab === tab ? "bg-purple-600 text-white" : "text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {(activeTab === "activity" ? completedTransactions : upcomingTransactions).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <Clock className="w-6 h-6 text-[#A1A1AA]" />
                    </div>
                    <p className="text-white font-semibold">No {activeTab} yet</p>
                    <p className="text-[#71717A] text-sm mt-1">
                      {activeTab === "upcoming" ? "Book your next appointment below." : "Your treatment history will appear here."}
                    </p>
                  </div>
                ) : (
                  (activeTab === "activity" ? completedTransactions : upcomingTransactions).map((t) => (
                    <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium leading-tight">{t.treatment}</p>
                          <p className="text-[#71717A] text-xs mt-0.5">{t.date}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <StatusBadge status={t.status} />
                        {t.amount > 0 && (
                          <div>
                            <span className="text-white text-sm font-semibold">${t.amount}</span>
                            {t.saved > 0 && (
                              <span className="text-green-400 text-xs ml-1">-${t.saved}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Suggested Treatments */}
          <div className="lg:col-span-2 bg-[#1C1C24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-bold text-white">Suggested for You</h2>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>

            {isLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {SUGGESTED.map((s) => (
                  <motion.div
                    key={s.id}
                    className="bg-[#0F0F14] rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-purple-400 font-medium">{s.category}</span>
                        </div>
                        <p className="text-white text-sm font-semibold">{s.name}</p>
                        <p className="text-[#71717A] text-xs mt-1 leading-relaxed">{s.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-white font-bold text-sm">${s.memberPrice}</span>
                        <span className="text-[#71717A] line-through text-xs ml-1">${s.regularPrice}</span>
                      </div>
                      <button className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-lg border border-purple-500/20 hover:bg-purple-600/30 transition-colors">
                        Book
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Section 4: Quick Actions ── */}
        <div>
          <h2 className="text-white font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Book Appointment",
                desc: "Schedule your next visit",
                icon: <Calendar className="w-5 h-5" />,
                color: "from-purple-600 to-purple-700",
                href: "/appointments",
              },
              {
                label: "Upgrade Plan",
                desc: "Unlock more savings",
                icon: <Zap className="w-5 h-5" />,
                color: "from-fuchsia-600 to-fuchsia-700",
                href: "/membership",
              },
              {
                label: "Refer a Friend",
                desc: "Earn beauty credits",
                icon: <Gift className="w-5 h-5" />,
                color: "from-rose-600 to-rose-700",
                href: "/referrals",
              },
              {
                label: "Beauty Bank",
                desc: "View your credits & history",
                icon: <CreditCard className="w-5 h-5" />,
                color: "from-blue-600 to-blue-700",
                href: "/wallet",
              },
            ].map((action) => (
              <motion.a
                key={action.label}
                href={action.href}
                className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white hover:opacity-90 transition-opacity group`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    {action.icon}
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="font-bold">{action.label}</p>
                <p className="text-white/70 text-sm mt-0.5">{action.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
