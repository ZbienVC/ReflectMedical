"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Inbox,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../AuthContext";
import { onBalanceChange, getTransactionHistory } from "../services/beautyBankService";
import { treatments } from "../data/treatments";
import { formatCurrency } from "../data/bankingData";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserCredits {
  balance: number;
  totalPaid: number;
  totalValueReceived: number;
  totalSaved: number;
  monthlyContribution: number;
  nextCreditDate: string;
  membershipTier: "Silver" | "Gold" | "Platinum";
}

interface CreditActivity {
  id: string;
  treatment: string;
  date: string;
  amountUsed: number;
  savings: number;
}

// ── Mock fallback data ────────────────────────────────────────────────────────

const MOCK_CREDITS: UserCredits = {
  balance: 1420,
  totalPaid: 2160,
  totalValueReceived: 3580,
  totalSaved: 1420,
  monthlyContribution: 180,
  nextCreditDate: "April 1, 2026",
  membershipTier: "Gold",
};

const MOCK_ACTIVITY: CreditActivity[] = [
  { id: "1", treatment: "Botox – Forehead & Crow's Feet", date: "Mar 15, 2026", amountUsed: 165, savings: 60 },
  { id: "2", treatment: "HydraFacial Deluxe", date: "Mar 8, 2026", amountUsed: 180, savings: 45 },
  { id: "3", treatment: "VI Peel (Medium)", date: "Feb 28, 2026", amountUsed: 180, savings: 45 },
  { id: "4", treatment: "Juvederm Voluma – Cheeks", date: "Feb 15, 2026", amountUsed: 720, savings: 180 },
];

// ── Spending power helper ─────────────────────────────────────────────────────

interface TreatmentAffordability {
  name: string;
  price: number;
  covered: boolean;
  deficit: number;
}

function getAffordability(balance: number): TreatmentAffordability[] {
  const result: TreatmentAffordability[] = [];
  for (const t of treatments) {
    for (const v of t.variants) {
      const price = v.flatPrice ?? (v.pricePerUnit ? v.pricePerUnit * 30 : 0);
      if (price === 0) continue;
      result.push({
        name: v.name,
        price,
        covered: balance >= price,
        deficit: Math.max(0, price - balance),
      });
    }
  }
  // Sort: covered first, then by price asc
  return result.sort((a, b) => {
    if (a.covered && !b.covered) return -1;
    if (!a.covered && b.covered) return 1;
    return a.price - b.price;
  });
}

// ── Animations ────────────────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const Credits: React.FC = () => {
  const { user, profile } = useAuth();
  const [credits, setCredits] = useState<UserCredits>(MOCK_CREDITS);
  const [activity, setActivity] = useState<CreditActivity[]>(MOCK_ACTIVITY);
  const [isLoading, setIsLoading] = useState(false);

  // Live balance from Firebase
  useEffect(() => {
    if (!user) return;
    const unsub = onBalanceChange(user.uid, (bal) => {
      setCredits((prev) => ({ ...prev, balance: bal }));
    });
    return () => unsub();
  }, [user]);

  // Transaction history from Firebase
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getTransactionHistory(user.uid, 10)
      .then((txns) => {
        if (txns.length > 0) {
          const mapped: CreditActivity[] = txns.map((tx) => ({
            id: tx.id ?? String(Math.random()),
            treatment: tx.description,
            date: new Date(tx.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            amountUsed: tx.type === "debit" ? tx.amount : 0,
            savings: 0,
          }));
          setActivity(mapped);
        }
      })
      .catch(() => {/* use mock */})
      .finally(() => setIsLoading(false));
  }, [user]);

  const tierFromProfile = (profile?.membershipTierId ?? "") as string;
  const displayTier: UserCredits["membershipTier"] =
    tierFromProfile === "platinum"
      ? "Platinum"
      : tierFromProfile === "gold"
      ? "Gold"
      : "Silver";

  const displayCredits: UserCredits = {
    ...credits,
    membershipTier: displayTier,
  };

  const affordability = getAffordability(displayCredits.balance);

  const tierColor: Record<string, string> = {
    Silver: "text-gray-300",
    Gold: "text-yellow-400",
    Platinum: "text-purple-400",
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6 pb-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Page Title */}
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-white">Your Credits</h1>
          <p className="text-gray-400 mt-1">Track your balance, spending power, and recent activity.</p>
        </motion.div>

        {/* ── 1. Hero Card ── */}
        <motion.div
          variants={item}
          className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 shadow-xl shadow-purple-900/30"
        >
          <p className="text-white/70 text-sm uppercase tracking-widest font-semibold mb-1">
            Available Credits
          </p>
          <p className="text-5xl font-black text-white mb-6">
            {formatCurrency(displayCredits.balance)}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">You Paid</p>
              <p className="text-xl font-bold text-white">{formatCurrency(displayCredits.totalPaid)}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Value Received</p>
              <p className="text-xl font-bold text-white">{formatCurrency(displayCredits.totalValueReceived)}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Saved</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(displayCredits.totalSaved)}</p>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Membership Info Strip ── */}
        <motion.div
          variants={item}
          className="grid grid-cols-3 gap-4"
        >
          <div className="rounded-2xl bg-gray-900 border border-white/5 p-4 flex flex-col gap-1">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Monthly Contribution</p>
            <p className="text-white font-bold text-lg">{formatCurrency(displayCredits.monthlyContribution)}</p>
          </div>
          <div className="rounded-2xl bg-gray-900 border border-white/5 p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <p className="text-gray-400 text-xs uppercase tracking-wide">Next Credit Drop</p>
            </div>
            <p className="text-white font-bold text-lg">{displayCredits.nextCreditDate}</p>
          </div>
          <div className="rounded-2xl bg-gray-900 border border-white/5 p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <p className="text-gray-400 text-xs uppercase tracking-wide">Membership Tier</p>
            </div>
            <p className={`font-bold text-lg ${tierColor[displayCredits.membershipTier]}`}>
              {displayCredits.membershipTier}
            </p>
          </div>
        </motion.div>

        {/* ── 3. Spending Power ── */}
        <motion.div variants={item} className="rounded-2xl bg-gray-900 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">What You Can Do Now</h2>
              <p className="text-gray-400 text-sm mt-0.5">Your current balance covers these treatments.</p>
            </div>
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {affordability.slice(0, 20).map((a) => (
              <div
                key={a.name}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-950 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  {a.covered ? (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                  <span className="text-sm text-white font-medium">{a.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">{formatCurrency(a.price)}</span>
                  {a.covered ? (
                    <span className="ml-2 text-xs font-semibold text-green-400">Covered ✓</span>
                  ) : (
                    <span className="ml-2 text-xs text-gray-500">{formatCurrency(a.deficit)} needed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 4. Activity Feed ── */}
        <motion.div variants={item} className="rounded-2xl bg-gray-900 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Recent Credit Usage</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-white font-semibold">No activity yet</p>
              <p className="text-gray-500 text-sm mt-1">Your credit usage will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((a) => (
                <motion.div
                  key={a.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-950 border border-white/5 hover:border-white/10 transition-colors"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600/15 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{a.treatment}</p>
                      <p className="text-xs text-gray-500">{a.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {a.amountUsed > 0 && (
                      <p className="text-sm font-bold text-white">{formatCurrency(a.amountUsed)}</p>
                    )}
                    {a.savings > 0 && (
                      <p className="text-xs text-green-400">Saved {formatCurrency(a.savings)}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Credits;
