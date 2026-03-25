import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Calendar, Check, ChevronRight, Sparkles } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

const TIERS = [
  {
    id: "silver",
    name: "Silver",
    price: 84,
    credits: 100,
    savings: 16,
    benefits: ["$100 monthly credits", "10% off all treatments", "Priority booking", "Member-only events"],
    color: "from-gray-400 to-gray-600",
    border: "border-gray-500/40",
    activeBorder: "border-gray-400",
  },
  {
    id: "gold",
    name: "Gold",
    price: 124,
    credits: 150,
    savings: 26,
    benefits: ["$150 monthly credits", "15% off all treatments", "Priority booking", "Free consultations", "Member-only events"],
    color: "from-yellow-400 to-yellow-600",
    border: "border-yellow-500/40",
    activeBorder: "border-yellow-400",
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 200,
    credits: 250,
    savings: 50,
    benefits: ["$250 monthly credits", "20% off all treatments", "VIP priority booking", "Free consultations", "Exclusive events", "Dedicated concierge"],
    color: "from-purple-400 to-purple-600",
    border: "border-purple-500/40",
    activeBorder: "border-purple-400",
  },
];

const ProgressBar: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3].map((s) => (
      <React.Fragment key={s}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            s < step
              ? "bg-purple-600 text-white"
              : s === step
              ? "bg-purple-600 text-white ring-4 ring-purple-600/30"
              : "bg-[#1C1C24] text-[#71717A] border border-white/10"
          }`}
        >
          {s < step ? <Check className="w-4 h-4" /> : s}
        </div>
        {s < 3 && (
          <div className={`h-px w-12 transition-all ${s < step ? "bg-purple-600" : "bg-white/10"}`} />
        )}
      </React.Fragment>
    ))}
    <span className="ml-3 text-[#71717A] text-sm">Step {step} of 3</span>
  </div>
);

const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const nameParts = user?.displayName?.split(" ") ?? [];
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") ?? "");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = () => {
    if (!selectedTier) return;
    setStep(3);
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid, "profile", "onboarding"),
        {
          firstName,
          lastName,
          phone,
          dob,
          membershipTier: selectedTier,
          completedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      // Also update root user doc
      await setDoc(
        doc(db, "users", user.uid),
        { name: `${firstName} ${lastName}`.trim(), membershipTierId: selectedTier },
        { merge: true }
      );
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const selectedTierData = TIERS.find((t) => t.id === selectedTier);

  return (
    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 mb-3">
            <span className="text-white font-black">R</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Reflect Medical</h1>
        </div>

        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-8">
                <h2 className="text-xl font-bold text-white mb-1">Welcome! Tell us about yourself</h2>
                <p className="text-[#71717A] text-sm mb-6">We just need a few details to get you set up.</p>

                <form onSubmit={handleStep1} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          placeholder="Jane"
                          className="w-full bg-[#0F0F14] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#52525B] focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          placeholder="Doe"
                          className="w-full bg-[#0F0F14] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#52525B] focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                        className="w-full bg-[#0F0F14] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#52525B] focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-[#0F0F14] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-8">
                <h2 className="text-xl font-bold text-white mb-1">Choose your membership</h2>
                <p className="text-[#71717A] text-sm mb-6">Select the plan that works best for you.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {TIERS.map((tier) => (
                    <motion.button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      whileHover={{ y: -2 }}
                      className={`relative text-left rounded-2xl border p-5 transition-all ${
                        selectedTier === tier.id
                          ? `${tier.activeBorder} bg-white/5`
                          : `${tier.border} bg-[#0F0F14] hover:border-white/20`
                      }`}
                    >
                      {tier.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                          <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-3 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${tier.color} text-lg font-black mb-1`}>
                        {tier.name}
                      </div>
                      <div className="text-white font-black text-2xl mb-1">
                        ${tier.price}<span className="text-sm font-normal text-[#71717A]">/mo</span>
                      </div>
                      <div className="text-green-400 text-xs font-medium mb-3">${tier.credits} credits/mo</div>
                      <ul className="space-y-1.5">
                        {tier.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-xs text-[#A1A1AA]">
                            <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      {selectedTier === tier.id && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-[#0F0F14] hover:bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStep2}
                    disabled={!selectedTier}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
                <p className="text-[#71717A] text-sm mb-6">Welcome to Reflect Medical, {firstName}.</p>

                <div className="bg-[#0F0F14] rounded-xl border border-white/5 p-5 text-left mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#71717A]">Name</span>
                    <span className="text-white font-medium">{firstName} {lastName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#71717A]">Membership</span>
                    <span className="text-white font-medium capitalize">{selectedTier}</span>
                  </div>
                  {selectedTierData && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#71717A]">Monthly Credits</span>
                      <span className="text-green-400 font-medium">${selectedTierData.credits}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[#71717A] text-xs">
                      Your credits will be added on the 1st of each month. You can start booking treatments right away.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  {saving ? "Setting up your account..." : "Go to Dashboard"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
