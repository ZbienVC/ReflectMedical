import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Calendar,
  Sparkles,
  Gift,
  Clock,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { onBalanceChange, creditMonthlyBeautyBank, hasReceivedMonthlyCredit } from "../services/beautyBankService";
import { getBookings } from "../services/treatmentService";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface Transaction {
  id: string;
  treatment: string;
  date: string;
  status: "completed" | "upcoming" | "cancelled";
}

const TIER_CREDIT_MAP: Record<string, number> = {
  core: 99, silver: 99,
  evolve: 150, gold: 150,
  transform: 250, platinum: 250,
};

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activationBanner, setActivationBanner] = useState(false);
  const [creditBanner, setCreditBanner] = useState<number | null>(null);
  const [hasIntake, setHasIntake] = useState<boolean | null>(null);

  // Handle ?membership=activated query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("membership") === "activated") {
      setActivationBanner(true);
      params.delete("membership");
      navigate({ search: params.toString() }, { replace: true });
      setTimeout(() => setActivationBanner(false), 6000);
    }
  }, []);

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

  // Auto-credit Beauty Bank if active membership and not yet credited this month
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "intakeForms", user.uid)).then((snap) => setHasIntake(snap.exists())).catch(() => setHasIntake(false));
  }, [user]);
  useEffect(() => {
    if (!user || !profile?.membershipTierId) return;
    const tierId = profile.membershipTierId.toLowerCase();
    const creditAmount = TIER_CREDIT_MAP[tierId];
    if (!creditAmount) return;

    hasReceivedMonthlyCredit(user.uid).then((received) => {
      if (!received) {
        creditMonthlyBeautyBank(user.uid, tierId).then(() => {
          setCreditBanner(creditAmount);
          setTimeout(() => setCreditBanner(null), 6000);
        }).catch(console.warn);
      }
    }).catch(console.warn);
  }, [user, profile?.membershipTierId]);

  const firstName = (profile?.name ?? user?.displayName ?? "there").split(" ")[0];

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
    { label: "Your Beauty Bank", desc: "View balance & history", icon: <CreditCard className="w-5 h-5" />, href: "/credits" },
    { label: "Refer a Friend", desc: "Earn Beauty Bank credits", icon: <Gift className="w-5 h-5" />, href: "/referrals" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Activation Banner */}
      <AnimatePresence>
        {activationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold text-sm">Welcome to Reflect Medical!</p>
              <p className="text-green-700 text-sm">Your membership is being activated. We'll notify you once it's confirmed.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beauty Bank Credit Banner */}
      <AnimatePresence>
        {creditBanner !== null && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-violet-50 border border-violet-200 rounded-2xl px-6 py-4 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0" />
            <p className="text-violet-800 font-semibold text-sm">
              Beauty Bank credited ${creditBanner}! Your monthly value has been added.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Card */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName} </h1>
            <p className="text-gray-500 mt-1">
              You have <span className="font-semibold text-violet-600">${liveBalance.toLocaleString()}</span> in Beauty Bank available
            </p>
          </div>
          <div className="flex items-center gap-3">
            {membershipTier ? (
              <span className="bg-violet-50 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-violet-200">
                {membershipTier} Member
              </span>
            ) : (
              <Link
                to="/membership"
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
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
            label: "Beauty Bank Balance",
            value: `$${liveBalance.toLocaleString()}`,
            icon: <CreditCard className="w-5 h-5 text-violet-600" />,
            bg: "bg-violet-50",
          },
          {
            label: "Membership",
            value: membershipTier ? `${membershipTier} Active` : "Not enrolled",
            icon: <Sparkles className="w-5 h-5 text-violet-600" />,
            bg: "bg-violet-50",
          },
          {
            label: "Treatments This Year",
            value: isLoading ? "-" : completedCount.toString(),
            icon: <Calendar className="w-5 h-5 text-violet-600" />,
            bg: "bg-violet-50",
          },
        ].map((card) => (
          <motion.div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900">No treatments yet</h3>
            <p className="text-gray-500 text-sm mt-1">Book your first appointment to get started.</p>
            <Link
              to="/appointments"
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.treatment}</p>
                    <p className="text-xs text-gray-500">{t.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  t.status === "completed" ? "bg-green-50 text-green-700" :
                  t.status === "upcoming" ? "bg-blue-50 text-blue-700" :
                  "bg-red-50 text-red-700"
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:border-violet-200 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3 text-violet-600 group-hover:bg-violet-100 transition-colors">
                {action.icon}
              </div>
              <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Intake Form CTA */}
      {hasIntake === false && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-violet-50 border border-violet-200 rounded-2xl p-5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Complete Your Patient Intake Form</p>
              <p className="text-gray-500 text-xs mt-0.5">Required before your first visit — takes about 3 minutes.</p>
            </div>
          </div>
          <Link
            to="/intake"
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
          >
            Start Now
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
