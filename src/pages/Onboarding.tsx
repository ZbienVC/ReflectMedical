import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Calendar, Check, ChevronRight, Sparkles } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

const TIERS = [
  {
    id: "core",
    name: "Core",
    price: 79,
    skinBank: 99,
    benefits: [
      "Botox from $12/unit (reg. $15)",
      "$99 monthly Skin Bank value",
      "10% off chemical peels & skincare",
      "Laser Hair Removal from $135/session",
    ],
    border: "border-gray-200",
    activeBorder: "border-violet-500",
  },
  {
    id: "evolve",
    name: "Evolve",
    price: 129,
    skinBank: 150,
    benefits: [
      "Botox from $10/unit (reg. $15)",
      "$150 monthly Skin Bank value",
      "Save $75/syringe on fillers",
      "Save $75 on RF Microneedling",
      "Save $40 on HydraFacial",
    ],
    border: "border-gray-200",
    activeBorder: "border-violet-500",
    popular: true,
  },
  {
    id: "transform",
    name: "Transform",
    price: 199,
    skinBank: 250,
    benefits: [
      "Botox from $9/unit (reg. $15)",
      "$250 monthly Skin Bank value",
      "Save $150/syringe on fillers",
      "Save $200 on RF Microneedling",
      "Save $90 on Chemical Peels",
    ],
    border: "border-gray-200",
    activeBorder: "border-violet-500",
  },
];

const ProgressBar: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3].map((s) => (
      <React.Fragment key={s}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            s < step
              ? "bg-violet-600 text-white"
              : s === step
              ? "bg-violet-600 text-white ring-4 ring-violet-600/30"
              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600"
          }`}
        >
          {s < step ? <Check className="w-4 h-4" /> : s}
        </div>
        {s < 3 && (
          <div className={`h-px w-12 transition-all ${s < step ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-700"}`} />
        )}
      </React.Fragment>
    ))}
    <span className="ml-3 text-gray-500 dark:text-gray-400 text-sm">Step {step} of 3</span>
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
        { firstName, lastName, phone, dob, membershipTier: selectedTier, completedAt: new Date().toISOString() },
        { merge: true }
      );
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
  const inputClass = "w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors";

  return (
    <div className="min-h-screen bg-[#F8F7FB] dark:bg-[#0B0B0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-2">
          <img src="/reflect-logo.png" alt="Reflect Medical" className="h-12 w-auto object-contain mx-auto mb-3" />
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Welcome! Tell us about yourself</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">We just need a few details to get you set up.</p>

                <form onSubmit={handleStep1} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jane" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Choose your membership</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Select the plan that works best for you.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {TIERS.map((tier) => (
                    <motion.button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      whileHover={{ y: -2 }}
                      className={`text-left rounded-2xl border-2 p-5 transition-all ${
                        selectedTier === tier.id
                          ? `${tier.activeBorder} bg-violet-50 dark:bg-violet-900/10`
                          : `${tier.border} bg-white dark:bg-gray-700 hover:border-violet-300 dark:hover:border-violet-600`
                      }`}
                    >
                      {tier.popular && (
                        <span className="inline-block bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                          Most Popular
                        </span>
                      )}
                      <div className="text-violet-700 text-lg font-black mb-1">
                        {tier.name}
                      </div>
                      <div className="text-gray-900 dark:text-white font-black text-2xl mb-1">
                        ${tier.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span>
                      </div>
                      <div className="text-violet-600 text-xs font-semibold mb-3">${tier.skinBank} Skin Bank/mo</div>
                      <ul className="space-y-1.5">
                        {tier.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      {selectedTier === tier.id && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl transition-all text-sm">
                    Back
                  </button>
                  <button onClick={handleStep2} disabled={!selectedTier} className="flex-1 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're all set!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Welcome to Reflect Medical, {firstName}.</p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 p-5 text-left mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Name</span>
                    <span className="text-gray-900 dark:text-white font-medium">{firstName} {lastName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Membership</span>
                    <span className="text-gray-900 dark:text-white font-medium capitalize">{selectedTier}</span>
                  </div>
                  {selectedTierData && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Monthly Skin Bank</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">${selectedTierData.skinBank}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Your Skin Bank will be added on the 1st of each month. You can start booking treatments right away.
                    </p>
                  </div>
                </div>

                <button onClick={handleFinish} disabled={saving} className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm">
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

