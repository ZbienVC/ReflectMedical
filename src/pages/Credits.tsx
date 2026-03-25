import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  Inbox,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { onBalanceChange, getTransactionHistory } from "../services/beautyBankService";
import { treatments } from "../data/treatments";
import { formatCurrency } from "../data/bankingData";

interface CreditActivity {
  id: string;
  treatment: string;
  date: string;
  amountUsed: number;
}

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
      result.push({ name: v.name, price, covered: balance >= price, deficit: Math.max(0, price - balance) });
    }
  }
  return result.sort((a, b) => {
    if (a.covered && !b.covered) return -1;
    if (!a.covered && b.covered) return 1;
    return a.price - b.price;
  });
}

const Credits: React.FC = () => {
  const { user, profile } = useAuth();
  const [balance, setBalance] = useState(0);
  const [activity, setActivity] = useState<CreditActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = onBalanceChange(user.uid, setBalance);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getTransactionHistory(user.uid, 10)
      .then((txns) => {
        const mapped: CreditActivity[] = txns.map((tx) => ({
          id: tx.id ?? String(Math.random()),
          treatment: tx.description,
          date: new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          amountUsed: tx.type === "debit" ? tx.amount : 0,
        }));
        setActivity(mapped);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  const tierRaw = profile?.membershipTierId ?? "";
  const displayTier = tierRaw ? tierRaw.charAt(0).toUpperCase() + tierRaw.slice(1) : "Silver";
  const affordability = getAffordability(balance);

  return (
    <motion.div
      className="space-y-6 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Credits</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your balance, spending power, and recent activity.</p>
      </div>

      {/* Hero Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 dark:bg-violet-900/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold mb-1 relative">Available Credits</p>
        <p className="text-5xl font-black text-gray-900 dark:text-white mb-6 relative">{formatCurrency(balance)}</p>
        <Link
          to="/appointments"
          className="relative inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Book Treatment Using Credits
        </Link>
      </div>

      {/* Membership Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Membership Tier", value: displayTier, icon: <Award className="w-4 h-4 text-violet-600 dark:text-violet-400" /> },
          { label: "Next Credit Drop", value: "-", icon: <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" /> },
          { label: "Monthly Contribution", value: "$0", icon: <DollarSign className="w-4 h-4 text-violet-600 dark:text-violet-400" /> },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-1">
              {item.icon}
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">{item.label}</p>
            </div>
            <p className="text-gray-900 dark:text-white font-bold text-lg">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Spending Power */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">What You Can Do Now</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">Your current balance covers these treatments.</p>
          </div>
          <DollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {affordability.slice(0, 20).map((a) => (
            <div key={a.name} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-3">
                {a.covered ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-900 dark:text-white font-medium">{a.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(a.price)}</span>
                {a.covered ? (
                  <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">Covered</span>
                ) : (
                  <span className="ml-2 text-xs text-gray-400">{formatCurrency(a.deficit)} needed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Credit Usage</h2>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />)}
          </div>
        ) : activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">No activity yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your credit usage will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{a.treatment}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{a.date}</p>
                  </div>
                </div>
                {a.amountUsed > 0 && (
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(a.amountUsed)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Credits;
