import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  Sparkles,
  Gift,
  Clock,
  MapPin,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { onBalanceChange } from "../services/beautyBankService";
import { getBookings } from "../services/treatmentService";

interface Transaction {
  id: string;
  treatment: string;
  date: string;
  status: "completed" | "upcoming" | "cancelled";
}

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = onBalanceChange(user.uid, (bal) => setLiveBalance(bal));
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getBookings(user.uid)
      .then((bookings) => {
        const mapped: Transaction[] = bookings.map((b) => ({
          id: b.id,
          treatment: b.serviceName,
          date: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: b.status === "canceled" ? "cancelled" : b.status === "scheduled" ? "upcoming" : b.status as "completed" | "upcoming" | "cancelled",
        }));
        setTransactions(mapped);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  const firstName = (profile?.name ?? user?.displayName ?? "there").split(" ")[0];

  // Normalize legacy tier names (gold→Evolve, silver→Core, platinum→Transform)
  const TIER_MAP: Record<string, string> = {
    silver: "Core", gold: "Evolve", platinum: "Transform",
    core: "Core", evolve: "Evolve", transform: "Transform"
  };
  const membershipTier = profile?.membershipTierId
    ? TIER_MAP[profile.membershipTierId.toLowerCase()] ?? (profile.membershipTierId.charAt(0).toUpperCase() + profile.membershipTierId.slice(1))
    : null;
  const completedCount = transactions.filter((t) => t.status === "completed").length;

  const quickActions = [
    { label: "Book Appointment", desc: "Schedule your next visit", icon: <Calendar className="w-5 h-5" />, href: "/appointments" },
    { label: "View Membership", desc: "Manage your plan", icon: <Sparkles className="w-5 h-5" />, href: "/membership" },
    { label: "Your Skin Bank", desc: "View balance & history", icon: <CreditCard className="w-5 h-5" />, href: "/credits" },
    { label: "Refer a Friend", desc: "Earn Skin Bank credits", icon: <Gift className="w-5 h-5" />, href: "/referrals" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Card */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {firstName} </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              You have <span className="font-semibold text-violet-600 dark:text-violet-400">${liveBalance.toLocaleString()}</span> in Skin Bank available
            </p>
          </div>
          <div className="flex items-center gap-3">
            {membershipTier ? (
              <span className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-violet-200 dark:border-violet-700">
                {membershipTier} Member
              </span>
            ) : (
              <Link
                to="/membership"
                className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
              >
                Start Membership
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Skin Bank Balance",
            value: `$${liveBalance.toLocaleString()}`,
            icon: <CreditCard className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
            bg: "bg-violet-50 dark:bg-violet-900/20",
          },
          {
            label: "Membership",
            value: membershipTier ? `${membershipTier} Active` : "Not enrolled",
            icon: <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
            bg: "bg-violet-50 dark:bg-violet-900/20",
          },
          {
            label: "Treatments This Year",
            value: isLoading ? "-" : completedCount.toString(),
            icon: <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
            bg: "bg-violet-50 dark:bg-violet-900/20",
          },
        ].map((card) => (
          <motion.div
            key={card.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">No treatments yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Book your first appointment to get started.</p>
            <Link
              to="/appointments"
              className="mt-4 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t.treatment}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  t.status === "completed" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                  t.status === "upcoming" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" :
                  "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3 text-violet-600 dark:text-violet-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                {action.icon}
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{action.label}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

