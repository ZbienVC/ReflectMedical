import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gift, Mail, MessageSquare, Star, Check, Sparkles } from "lucide-react";
import { createGiftCard, generateGiftCardCode } from "../services/giftCardService";

const AMOUNTS = [50, 100, 150, 250];

function creditsLabel(amount: number) {
  return `~${amount} Beauty Bank credits`;
}

interface FormState {
  amount: number;
  customAmount: string;
  senderName: string;
  recipientName: string;
  deliveryMethod: "email" | "sms";
  recipientContact: string;
  message: string;
  sendNow: boolean;
  scheduledDate: string;
}

const GiftCards: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    amount: 100,
    customAmount: "",
    senderName: "",
    recipientName: "",
    deliveryMethod: "email",
    recipientContact: "",
    message: "",
    sendNow: true,
    scheduledDate: "",
  });
  const [useCustom, setUseCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<{ code: string; amount: number } | null>(null);
  const [error, setError] = useState("");

  const selectedAmount = useCustom ? Number(form.customAmount) || 0 : form.amount;

  const handlePurchase = async () => {
    if (!form.senderName || !form.recipientName || !form.recipientContact) {
      setError("Please fill in all required fields.");
      return;
    }
    if (selectedAmount <= 0) {
      setError("Please select or enter a valid amount.");
      return;
    }
    setError("");
    setLoading(true);

    const code = generateGiftCardCode();
    try {
      await createGiftCard({
        code,
        amount: selectedAmount,
        senderName: form.senderName,
        recipientName: form.recipientName,
        recipientContact: form.recipientContact,
        deliveryMethod: form.deliveryMethod,
        message: form.message,
        scheduledDate: form.sendNow ? "" : form.scheduledDate,
        status: "active",
      });
      setConfirmed({ code, amount: selectedAmount });
    } catch {
      setError("Something went wrong. Please try again or call (201) 882-1050.");
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <motion.div
        className="max-w-lg mx-auto py-16 px-4 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-violet-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your gift card is on its way!</h1>
        <p className="text-gray-500 mb-8">
          We've sent a <span className="font-semibold text-gray-800">${confirmed.amount}</span> gift card to {form.recipientName}.
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-2">Gift Card Code</p>
          <p className="text-2xl font-mono font-bold text-violet-700 tracking-widest">{confirmed.code}</p>
          <p className="text-sm text-gray-500 mt-2">This code can be redeemed in the Beauty Bank section.</p>
        </div>
        <button
          onClick={() => {
            setConfirmed(null);
            setForm({
              amount: 100,
              customAmount: "",
              senderName: "",
              recipientName: "",
              deliveryMethod: "email",
              recipientContact: "",
              message: "",
              sendNow: true,
              scheduledDate: "",
            });
          }}
          className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
        >
          Send Another Gift Card
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8 pb-16"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100 mb-4">
          <Gift className="w-8 h-8 text-violet-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Give the Gift of Beauty</h1>
        <p className="text-gray-500 mt-2 text-lg">Send a Reflect Medical gift card instantly by email or text.</p>
        <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Gift cards convert directly to Beauty Bank credits — redeemable on any treatment.
        </p>
      </div>

      {/* Amount selection */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">Choose Amount</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setForm({ ...form, amount: amt }); setUseCustom(false); }}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                !useCustom && form.amount === amt
                  ? "border-violet-600 bg-violet-50"
                  : "border-gray-200 hover:border-violet-300 bg-white"
              }`}
            >
              <p className="text-xl font-bold text-gray-900">${amt}</p>
              <p className="text-xs text-gray-400 mt-0.5">{creditsLabel(amt)}</p>
            </button>
          ))}
        </div>
        <button
          onClick={() => setUseCustom(!useCustom)}
          className={`w-full py-3 border-2 rounded-2xl text-sm font-semibold transition-all ${
            useCustom ? "border-violet-600 bg-violet-50 text-violet-700" : "border-dashed border-gray-300 text-gray-500 hover:border-violet-300"
          }`}
        >
          {useCustom ? "Custom Amount" : "+ Custom Amount"}
        </button>
        {useCustom && (
          <div className="mt-3">
            <input
              type="number"
              min={10}
              placeholder="Enter amount (e.g. 75)"
              value={form.customAmount}
              onChange={(e) => setForm({ ...form, customAmount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 text-gray-900"
            />
          </div>
        )}
      </div>

      {/* Recipient form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Gift Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Name *</label>
            <input
              type="text"
              value={form.senderName}
              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
              placeholder="Jane Smith"
              className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recipient Name *</label>
            <input
              type="text"
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              placeholder="Alex Johnson"
              className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>

        {/* Delivery method */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Delivery Method</label>
          <div className="flex gap-3">
            <button
              onClick={() => setForm({ ...form, deliveryMethod: "email", recipientContact: "" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.deliveryMethod === "email" ? "border-violet-600 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600"
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => setForm({ ...form, deliveryMethod: "sms", recipientContact: "" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.deliveryMethod === "sms" ? "border-violet-600 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> SMS
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Recipient {form.deliveryMethod === "email" ? "Email" : "Phone"} *
          </label>
          <input
            type={form.deliveryMethod === "email" ? "email" : "tel"}
            value={form.recipientContact}
            onChange={(e) => setForm({ ...form, recipientContact: e.target.value })}
            placeholder={form.deliveryMethod === "email" ? "alex@example.com" : "(555) 123-4567"}
            className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Personal Message (optional)</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Wishing you a beautiful day…"
            rows={3}
            className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />
        </div>

        {/* Delivery date */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Delivery Date</label>
          <div className="flex gap-3">
            <button
              onClick={() => setForm({ ...form, sendNow: true })}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.sendNow ? "border-violet-600 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600"
              }`}
            >
              Send Now
            </button>
            <button
              onClick={() => setForm({ ...form, sendNow: false })}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                !form.sendNow ? "border-violet-600 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600"
              }`}
            >
              Schedule
            </button>
          </div>
          {!form.sendNow && (
            <input
              type="date"
              value={form.scheduledDate}
              onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-3 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          )}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-900">Total</p>
            <p className="text-2xl font-bold text-violet-700">${selectedAmount || "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Secure payment</p>
            <p className="text-xs text-gray-400 font-semibold">Powered by Stripe</p>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          onClick={handlePurchase}
          disabled={loading || selectedAmount <= 0}
          className="w-full py-3.5 bg-violet-600 text-white rounded-xl font-bold text-base hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Gift className="w-5 h-5" />
              Purchase Gift Card — ${selectedAmount || "—"}
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Need help? Call <a href="tel:+12018821050" className="text-violet-600 font-semibold">(201) 882-1050</a>
        </p>
      </div>
      </div>
    </motion.div>
  );
};

export default GiftCards;

