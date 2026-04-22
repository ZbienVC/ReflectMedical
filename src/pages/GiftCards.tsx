import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Tag,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Download,
  ExternalLink,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import {
  purchaseGiftCard,
  validatePromoCode,
  GiftCard,
  PromoCode,
} from "../services/giftCardService";
import { downloadCertificate, openCertificatePreview } from "../utils/giftCardCertificate";
import { useToast } from "../components/ui/Toast";

const PRESET_AMOUNTS = [50, 100, 150, 200, 250, 500];

const STEPS = ["Amount", "Promo", "Recipient", "Review"];

interface FormState {
  amount: number | "";
  customAmount: string;
  promoCode: string;
  appliedPromo: PromoCode | null;
  promoDiscount: number;
  isGift: boolean;
  recipientName: string;
  recipientEmail: string;
  message: string;
  deliveryMethod: "email" | "sms" | "both";
  phone: string;
  purchaserName: string;
  purchaserEmail: string;
}

// Mini gift card visual
function GiftCardVisual({ amount, recipientName }: { amount: number | ""; recipientName?: string }) {
  return (
    <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1050 50%, #1a0533 100%)", padding: "28px 24px 20px" }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #B57EDC, #7C3AED, #B57EDC)" }} />
      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full" style={{ background: "rgba(180,100,255,0.15)" }} />
      <p className="text-xs text-purple-200/60 uppercase tracking-widest mb-1">Reflect Medical</p>
      <p className="text-xs text-white/30 uppercase tracking-widest mb-6">Gift Card</p>
      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Value</p>
      <p className="font-bold text-white mb-1" style={{ fontSize: 40, fontFamily: "Georgia, serif", lineHeight: 1 }}>
        {amount ? `$${amount}` : "$—"}
      </p>
      {recipientName && (
        <p className="text-xs text-purple-200/50 mt-3">For {recipientName}</p>
      )}
    </div>
  );
}

const GiftCards: React.FC = () => {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [purchasedCard, setPurchasedCard] = useState<GiftCard | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    amount: "",
    customAmount: "",
    promoCode: "",
    appliedPromo: null,
    promoDiscount: 0,
    isGift: false,
    recipientName: "",
    recipientEmail: "",
    message: "",
    deliveryMethod: "email",
    phone: "",
    purchaserName: profile?.displayName || "",
    purchaserEmail: user?.email || "",
  });

  const set = (k: keyof FormState, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const effectiveAmount = form.customAmount ? parseFloat(form.customAmount) || 0 : (form.amount as number) || 0;
  const finalPrice = Math.max(0, effectiveAmount - form.promoDiscount);

  const handleApplyPromo = async () => {
    if (!form.promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const result = await validatePromoCode(form.promoCode.trim(), effectiveAmount);
      if (!result.valid) {
        setPromoError(result.error || "Invalid promo code.");
        set("appliedPromo", null);
        set("promoDiscount", 0);
      } else {
        set("appliedPromo", result.promo!);
        set("promoDiscount", result.discount);
        showToast("success", "Promo Applied", `Save $${result.discount.toFixed(2)}!`);
      }
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const card = await purchaseGiftCard({
        type: "fixed",
        originalValue: effectiveAmount,
        purchasePrice: finalPrice,
        promoCodeUsed: form.appliedPromo?.code,
        purchaserEmail: form.purchaserEmail,
        purchaserName: form.purchaserName,
        recipientEmail: form.isGift ? form.recipientEmail : undefined,
        recipientName: form.isGift ? form.recipientName : undefined,
        message: form.message || undefined,
        deliveryMethod: form.deliveryMethod,
        phone: form.phone || undefined,
      });
      setPurchasedCard(card);
      showToast("success", "Gift Card Purchased!");
    } catch (err) {
      showToast("error", "Purchase Failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (purchasedCard) {
    return (
      <motion.div className="space-y-6 pb-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex w-20 h-20 rounded-full items-center justify-center bg-green-100 dark:bg-green-900/30 mb-4"
          >
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gift Card Purchased!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Certificate {purchasedCard.deliveryMethod !== "sms" ? `sent to ${purchasedCard.purchaserEmail}` : `sent to ${purchasedCard.phone}`}
          </p>
        </div>

        <GiftCardVisual amount={purchasedCard.originalValue} recipientName={purchasedCard.recipientName} />

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">Redemption Code</p>
          <p className="font-mono text-2xl font-bold text-violet-600 dark:text-violet-400 tracking-widest">{purchasedCard.code}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => downloadCertificate(purchasedCard)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" /> Download Certificate
          </button>
          <button
            onClick={() => openCertificatePreview(purchasedCard)}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View in Full
          </button>
          <button
            onClick={() => { setPurchasedCard(null); setStep(0); setForm(f => ({ ...f, amount: "", customAmount: "", promoCode: "", appliedPromo: null, promoDiscount: 0, isGift: false, recipientName: "", recipientEmail: "", message: "" })); }}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Purchase Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-6 pb-12 max-w-xl mx-auto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1050 60%, #3b0d6e 100%)", padding: "40px 32px 32px" }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #B57EDC, #7C3AED, #B57EDC)" }} />
        <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full" style={{ background: "rgba(180,100,255,0.12)" }} />
        <Gift className="w-8 h-8 text-purple-300 mb-3 relative" />
        <h1 className="text-3xl font-bold text-white relative mb-2">Give the gift of beauty</h1>
        <p className="text-purple-200/60 relative text-sm">Treat someone to a luxury experience at Reflect Medical.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${i === step ? "text-violet-600 dark:text-violet-400" : i < step ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i === step ? "bg-violet-600 text-white" : i < step ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-green-400" : "bg-gray-200 dark:bg-gray-700"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <GiftCardVisual amount={effectiveAmount || ""} recipientName={form.isGift ? form.recipientName : undefined} />
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Choose Amount</h2>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((a) => (
                  <button key={a}
                    onClick={() => { set("amount", a); set("customAmount", ""); }}
                    className={`rounded-xl py-3 text-sm font-semibold border transition-colors ${form.amount === a && !form.customAmount ? "bg-violet-600 border-violet-600 text-white" : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-violet-400"}`}>
                    ${a}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number" min="10" max="5000"
                    placeholder="Enter amount"
                    value={form.customAmount}
                    onChange={(e) => { set("customAmount", e.target.value); set("amount", ""); }}
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!effectiveAmount || effectiveAmount < 10}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl py-3 font-semibold transition-colors"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Promo Code</h2>
              </div>
              {form.appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">{form.appliedPromo.code} applied</p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      Save ${form.promoDiscount.toFixed(2)} — Pay ${finalPrice.toFixed(2)} for a ${effectiveAmount} gift card
                    </p>
                  </div>
                  <button onClick={() => { set("appliedPromo", null); set("promoDiscount", 0); set("promoCode", ""); }}
                    className="text-green-500 hover:text-green-700"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="e.g. MOTHERSDAY25"
                      value={form.promoCode}
                      onChange={(e) => set("promoCode", e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    />
                    <button onClick={handleApplyPromo} disabled={promoLoading || !form.promoCode}
                      className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors">
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                </div>
              )}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Gift card value</span>
                  <span className="font-medium text-gray-900 dark:text-white">${effectiveAmount}</span>
                </div>
                {form.promoDiscount > 0 && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-green-600 dark:text-green-400">Promo discount</span>
                    <span className="text-green-600 dark:text-green-400">-${form.promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">You pay</span>
                  <span className="text-violet-600 dark:text-violet-400">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(0)} className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 font-semibold transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Recipient Details</h2>
              </div>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {["For myself", "Send as a gift"].map((opt, i) => (
                  <button key={opt} onClick={() => set("isGift", i === 1)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${form.isGift === (i === 1) ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-500"}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {form.isGift && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Recipient Name</label>
                    <input type="text" placeholder="Jane Smith" value={form.recipientName} onChange={(e) => set("recipientName", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Recipient Email</label>
                    <input type="email" placeholder="jane@example.com" value={form.recipientEmail} onChange={(e) => set("recipientEmail", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Personal Message (optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea placeholder="Enjoy your treatment! 💜" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Delivery Method</label>
                <div className="flex gap-2">
                  {(["email", "sms", "both"] as const).map((m) => (
                    <button key={m} onClick={() => set("deliveryMethod", m)}
                      className={`flex-1 rounded-xl py-2 text-sm font-medium border transition-colors capitalize ${form.deliveryMethod === m ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300" : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"}`}>
                      {m === "sms" ? "SMS" : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {(form.deliveryMethod === "sms" || form.deliveryMethod === "both") && (
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Purchaser info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Your Info</h2>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Your Name</label>
                <input type="text" value={form.purchaserName} onChange={(e) => set("purchaserName", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Your Email</label>
                <input type="email" value={form.purchaserEmail} onChange={(e) => set("purchaserEmail", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 font-semibold transition-colors">
                Review <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <GiftCardVisual amount={effectiveAmount} recipientName={form.isGift ? form.recipientName : undefined} />
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
              <h2 className="font-semibold text-gray-900 dark:text-white">Order Summary</h2>
              {[
                { label: "Gift card value", value: `$${effectiveAmount}` },
                form.promoDiscount > 0 ? { label: `Promo (${form.appliedPromo?.code})`, value: `-$${form.promoDiscount.toFixed(2)}`, green: true } : null,
                { label: "You pay", value: `$${finalPrice.toFixed(2)}`, bold: true },
                { label: "Delivery", value: form.deliveryMethod.toUpperCase() },
                form.isGift && form.recipientName ? { label: "Recipient", value: form.recipientName } : null,
                { label: "Purchaser", value: form.purchaserName || form.purchaserEmail },
              ].filter(Boolean).map((row, i) => row && (
                <div key={i} className={`flex justify-between text-sm pt-2 ${row.bold ? "border-t border-gray-100 dark:border-gray-700 font-bold" : ""}`}>
                  <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                  <span className={(row as { green?: boolean }).green ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}>{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">
              {/* TODO: Integrate Stripe payment processing */}
              No actual charge will be made — this is a demo purchase flow.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handlePurchase} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl py-3 font-semibold transition-colors">
                {loading ? "Processing..." : `Purchase Gift Card — $${finalPrice.toFixed(2)}`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GiftCards;
