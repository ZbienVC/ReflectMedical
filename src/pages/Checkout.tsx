import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle, Shield, Sparkles } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

const TIERS = {
  silver: { name: "Silver", price: 84, credits: 100, savings: 16 },
  gold: { name: "Gold", price: 124, credits: 150, savings: 26 },
  platinum: { name: "Platinum", price: 200, credits: 250, savings: 50 },
};

type TierKey = keyof typeof TIERS;

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tierParam = (new URLSearchParams(location.search).get("tier") as TierKey) || "gold";
  const tier = TIERS[tierParam] ?? TIERS.gold;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid card number.");
      return;
    }
    if (expiry.length < 5) {
      setError("Please enter a valid expiry date.");
      return;
    }
    if (cvc.length < 3) {
      setError("Please enter a valid CVC.");
      return;
    }

    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    try {
      await setDoc(
        doc(db, "users", user.uid),
        { membershipTierId: tierParam, membershipStartDate: new Date().toISOString(), beautyBucksBalance: tier.credits },
        { merge: true }
      );
      setSuccess(true);
    } catch {
      setError("Payment simulation succeeded but profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors font-mono";

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F7FB] dark:bg-[#0B0B0F] flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Membership activated!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Welcome to Reflect Medical {tier.name}.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Your <span className="text-green-600 dark:text-green-400 font-semibold">${tier.credits} in credits</span> have been added to your account.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FB] dark:bg-[#0B0B0F] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 mb-4">
            <span className="text-white font-black text-xl">R</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Start your membership</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Reflect Medical {tier.name} Plan</p>
        </div>

        {/* Plan Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tier.name} Membership</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Monthly subscription</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-gray-900 dark:text-white font-bold text-lg">${tier.price}/mo</p>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Monthly fee</span>
              <span className="text-gray-900 dark:text-white">${tier.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Credits value</span>
              <span className="text-green-600 dark:text-green-400">+${tier.credits}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
              <span className="text-gray-600 dark:text-gray-300">Net value</span>
              <span className="text-green-600 dark:text-green-400">+${tier.savings}/mo in savings</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-gray-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Payment Information
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className={`${inputClass} pl-10 pr-4`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className={`${inputClass} px-4`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVC</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    className={`${inputClass} pl-10 pr-4`}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2"
            >
              {loading ? "Processing..." : `Start ${tier.name} Membership - $${tier.price}/mo`}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 dark:text-gray-500 text-xs">
            <Shield className="w-3.5 h-3.5" />
            Powered by Stripe - your payment info is secure
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
