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
import { onBalanceChange, getTransactionHistory, getBeautyBankHistory, BeautyBankTransaction } from "../services/beautyBankService";
import { treatments } from "../data/treatments";
import { formatCurrency } from "../data/bankingData";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface TreatmentAffordability {
  name: string;
  price: number;
  covered: boolean;
  deficit: number;
}

function getAffordability(balance: number): TreatmentAffordability[] {
  const result: TreatmentAffordability[] = [];
  for (const t of treatments) {
    const price = t.basePrice ?? 0;
    if (price === 0) continue;
    const unitLabel = t.unitType ? `/${t.unitType}` : "";
    result.push({
      name: `${t.name}${unitLabel}`,
      price,
      covered: balance >= price,
      deficit: Math.max(0, price - balance)
    });
  }
  return result.sort((a, b) => {
    if (a.covered && !b.covered) return -1;
    if (!a.covered && b.covered) return 1;
    return a.price - b.price;
  });
}

function getNextCreditDate(lastCreditDate: string | undefined): string {
  if (!lastCreditDate) return "—";
  const last = new Date(lastCreditDate);
  const next = new Date(last.getFullYear(), last.getMonth() + 1, 1);
  return next.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

const TIER_CREDITS: Record<string, number> = {
  core: 99, silver: 99,
  evolve: 150, gold: 150,
  transform: 250, platinum: 250,
};

const Credits: React.FC = () => {
  const { user, profile } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<BeautyBankTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCreditDate, setLastCreditDate] = useState<string | undefined>();

  useEffect(() => {
    if (!user) return;
    const unsub = onBalanceChange(user.uid, setBalance);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);

    // Try new beautyBank/transactions first, fall back to legacy ledger
    getBeautyBankHistory(user.uid)
      .then((txns) => {
        if (txns.length > 0) {
          setTransactions(txns);
        } else {
          // Fallback: map legacy ledger to BeautyBankTransaction shape
          return getTransactionHistory(user.uid, 20).then((legacy) => {
            const mapped: BeautyBankTransaction[] = legacy.map((tx) => ({
              id: tx.id ?? String(Math.random()),
              type: tx.type,
              amount: tx.amount,
              description: tx.description,
              date: tx.createdAt,
            }));
            setTransactions(mapped);
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    // Fetch lastCreditDate from beautyBank/ledger
    getDoc(doc(db, `users/${user.uid}/beautyBank/ledger`))
      .then((snap) => {
        if (snap.exists()) setLastCreditDate(snap.data().lastCreditDate as string | undefined);
      })
      .catch(() => {});
  }, [user]);

  const tierRaw = profile?.membershipTierId ?? "";
  const displayTier = tierRaw ? tierRaw.charAt(0).toUpperCase() + tierRaw.slice(1) : "—";
  const monthlyContribution = tierRaw ? TIER_CREDITS[tierRaw.toLowerCase()] ?? 0 : 0;
  const nextCredit = getNextCreditDate(lastCreditDate);
  const affordability = getAffordability(balance);

  const formatDate = (date: BeautyBankTransaction["date"]): string => {
    if (!date) return "";
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    // Firestore Timestamp
    return date.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      className="space-y-6 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Beauty Bank</h1>
        <p className="text-gray-500 mt-1">Track your Beauty Bank balance, spending power, and recent activity. Unused value rolls over while your membership is active.</p>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-1 relative">Beauty Bank Balance</p>
        <p className="text-5xl font-black text-gray-900 mb-6 relative">{formatCurrency(balance)}</p>
        <Link
          to="/appointments"
          className="relative inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Book Treatment Using Beauty Bank
        </Link>
      </div>

      {/* Membership Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Membership Tier", value: displayTier, icon: <Award className="w-4 h-4 text-violet-600" /> },
          { label: "Next Beauty Bank Drop", value: nextCredit, icon: <Calendar className="w-4 h-4 text-violet-600" /> },
          { label: "Monthly Contribution", value: monthlyContribution ? `$${monthlyContribution}` : "$0", icon: <DollarSign className="w-4 h-4 text-violet-600" /> },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              {item.icon}
              <p className="text-gray-500 text-xs uppercase tracking-wide">{item.label}</p>
            </div>
            <p className="text-gray-900 font-bold text-lg">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Spending Power */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">What You Can Do Now</h2>
            <p className="text-gray-600 text-sm mt-0.5">Your current balance covers these treatments.</p>
          </div>
          <DollarSign className="w-5 h-5 text-violet-600" />
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {affordability.slice(0, 20).map((a) => (
            <div key={a.name} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                {a.covered ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-900 font-medium">{a.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">{formatCurrency(a.price)}</span>
                {a.covered ? (
                  <span className="ml-2 text-xs font-semibold text-green-600">Covered</span>
                ) : (
                  <span className="ml-2 text-xs text-gray-400">{formatCurrency(a.deficit)} needed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Beauty Bank History</h2>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900">No activity yet</h3>
            <p className="text-gray-500 text-sm mt-1">Your Beauty Bank usage will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.type === "credit" ? "bg-green-50" : "bg-red-50"
                  }`}>
                    <DollarSign className={`w-4 h-4 ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                  {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Credits;