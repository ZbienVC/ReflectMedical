import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Shield, Sparkles, Phone } from "lucide-react";
import { getPaymentLink } from "../services/stripeService";

const TIERS: Record<string, { name: string; price: number; annualPrice: number; credits: number }> = {
  core:      { name: "Core",      price: 84,  annualPrice: 74,  credits: 99  },
  evolve:    { name: "Evolve",    price: 124, annualPrice: 109, credits: 150 },
  transform: { name: "Transform", price: 200, annualPrice: 175, credits: 250 },
  // legacy aliases
  silver:    { name: "Core",      price: 84,  annualPrice: 74,  credits: 99  },
  gold:      { name: "Evolve",    price: 124, annualPrice: 109, credits: 150 },
  platinum:  { name: "Transform", price: 200, annualPrice: 175, credits: 250 },
};

const StripeWordmark: React.FC = () => (
  <svg viewBox="0 0 60 25" fill="none" className="h-5 inline-block" aria-label="Stripe">
    <path
      d="M5.25 10.25c0-.69.56-1.25 1.25-1.25s1.25.56 1.25 1.25v4.5c0 .69-.56 1.25-1.25 1.25S5.25 15.44 5.25 14.75v-4.5zM12 8c-2.48 0-4 1.52-4 4s1.52 4 4 4 4-1.52 4-4-1.52-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.5-5.75A.75.75 0 0118.25 7.5h.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75v-7.5zm3.5 0a.75.75 0 01.75-.75h.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75v-7.5zM25 8c-2.48 0-4 1.52-4 4s1.52 4 4 4 4-1.52 4-4-1.52-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
      fill="#635BFF"
    />
  </svg>
);

const Checkout: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tierParam = (params.get("tier") ?? "evolve").toLowerCase();
  const billing = (params.get("billing") ?? "monthly") as "monthly" | "annual";

  const tier = TIERS[tierParam] ?? TIERS.evolve;
  const displayPrice = billing === "annual" ? tier.annualPrice : tier.price;
  const paymentLink = getPaymentLink(tierParam.replace(/^(silver|gold|platinum)$/, (m) =>
    m === "silver" ? "core" : m === "gold" ? "evolve" : "transform"
  ), billing);
  const isConfigured = paymentLink !== "#";

  const handleStart = () => {
    if (isConfigured) {
      window.location.href = paymentLink;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FB] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 mb-4">
            <span className="text-white font-black text-xl">R</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Start your membership</h1>
          <p className="text-gray-500 text-sm mt-1">Reflect Medical {tier.name} Plan — {billing === "annual" ? "Annual" : "Monthly"}</p>
        </div>

        {/* Plan Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold">{tier.name} Membership</p>
              <p className="text-gray-500 text-xs">{billing === "annual" ? "Annual subscription (billed yearly)" : "Monthly subscription"}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-gray-900 font-bold text-lg">${displayPrice}/mo</p>
              {billing === "annual" && (
                <p className="text-xs text-green-600 font-medium">Save ${(tier.price - tier.annualPrice) * 12}/yr</p>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly fee</span>
              <span className="text-gray-900">${displayPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Beauty Bank value</span>
              <span className="text-green-600 font-medium">+${tier.credits}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-100 pt-2 mt-2">
              <span className="text-gray-600">Net value per month</span>
              <span className="text-green-600">+${tier.credits - displayPrice} in savings</span>
            </div>
          </div>
        </div>

        {/* Payment Action */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-violet-600" />
            Secure Payment
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            You'll be redirected to Stripe's secure checkout to complete your enrollment. Your payment info is encrypted and never stored on our servers.
          </p>

          {isConfigured ? (
            <button
              onClick={handleStart}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Start {tier.name} Membership — ${displayPrice}/mo
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 mb-4">
                <p className="text-amber-800 text-sm font-medium">Payment setup in progress</p>
                <p className="text-amber-700 text-sm mt-1">
                  Our online checkout is being configured. To enroll now, please call us directly.
                </p>
              </div>
              <a
                href="tel:+12018821050"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm"
              >
                <Phone className="w-4 h-4" />
                Call (201) 882-1050 to Enroll
              </a>
            </div>
          )}

          {/* Stripe badge */}
          <div className="flex items-center justify-center gap-1.5 mt-5 text-gray-400 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Powered by</span>
            <StripeWordmark />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
