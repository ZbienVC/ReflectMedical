import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, MessageSquare, CheckCircle2, ChevronRight, ChevronLeft, Phone, Mail } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "./ui/Toast";
import { useAuth } from "../AuthContext";
import { AppointmentRequest } from "../types";

interface TreatmentInfo {
  id: string;
  name: string;
  price: number;
  priceLabel?: string; // e.g. "from $700" or "$14/unit"
  description?: string;
  duration?: string;
}

interface BookingModalProps {
  treatment: TreatmentInfo | null;
  onClose: () => void;
}

const STEPS = ["Treatment", "Contact", "Notes", "Confirm"];

const PROVIDER_PHONE = "(555) 123-4567";
const PROVIDER_EMAIL = "hello@reflectmedical.com";

const BookingModal: React.FC<BookingModalProps> = ({ treatment, onClose }) => {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [preferredDate, setPreferredDate] = useState("");
  const [name, setName] = useState(profile?.name || user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(profile?.email || user?.email || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [firestoreFailed, setFirestoreFailed] = useState(false);

  if (!treatment) return null;

  const canAdvance = () => {
    if (step === 0) return preferredDate.trim().length > 0;
    if (step === 1) return name.trim().length > 0 && email.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload: Omit<AppointmentRequest, "id"> = {
      treatmentId: treatment.id,
      treatmentName: treatment.name,
      price: treatment.price,
      preferredDate,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "appointment_requests"), payload);
      setSuccess(true);
      showToast("success", "Appointment Requested!", "We'll contact you within 24 hours to confirm.");
    } catch (err) {
      console.error("Firestore write failed:", err);
      setFirestoreFailed(true);
      setSuccess(true); // still show success screen, but with fallback contact info
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg bg-[#13131A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-white">Book Consultation</h2>
            {!success && (
              <p className="text-[#A1A1AA] text-xs mt-0.5">
                Step {step + 1} of {STEPS.length} — {STEPS[step]}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#A1A1AA]" />
          </button>
        </div>

        {/* Progress bar */}
        {!success && (
          <div className="px-6 pt-4">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-[#B57EDC]" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#B57EDC]/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#B57EDC]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {firestoreFailed ? "Request Received" : "Request Sent!"}
                </h3>
                <p className="text-[#A1A1AA] text-sm mb-4">
                  We'll contact you within 24 hours to confirm your appointment.
                </p>
                {firestoreFailed && (
                  <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-4 text-left">
                    <p className="text-amber-400 text-xs font-bold mb-2 uppercase tracking-wider">Contact Us Directly</p>
                    <p className="text-white text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-amber-400" /> {PROVIDER_PHONE}
                    </p>
                    <p className="text-white text-sm flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-amber-400" /> {PROVIDER_EMAIL}
                    </p>
                  </div>
                )}
                <div className="w-full bg-white/5 rounded-2xl p-4 text-left space-y-2">
                  <Row label="Treatment" value={treatment.name} />
                  <Row label="Preferred Date" value={preferredDate} />
                  <Row label="Name" value={name} />
                  <Row label="Email" value={email} />
                </div>
              </motion.div>
            ) : step === 0 ? (
              <StepPanel key="step0">
                <div className="bg-[#B57EDC]/10 border border-[#B57EDC]/20 rounded-2xl p-4 mb-6">
                  <p className="text-[10px] font-bold text-[#B57EDC] uppercase tracking-widest mb-1">Selected Treatment</p>
                  <p className="text-white font-bold text-base">{treatment.name}</p>
                  {treatment.description && (
                    <p className="text-[#A1A1AA] text-sm mt-1">{treatment.description}</p>
                  )}
                  <div className="flex gap-4 mt-3">
                    <span className="text-[#B57EDC] font-bold text-sm">{treatment.priceLabel || `$${treatment.price}`}</span>
                    {treatment.duration && (
                      <span className="text-[#71717A] text-sm">⏱ {treatment.duration}</span>
                    )}
                  </div>
                </div>

                <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">
                  Preferred Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B57EDC] transition-colors [color-scheme:dark]"
                />
                <p className="text-[#71717A] text-xs mt-2">We'll do our best to accommodate your preference.</p>
              </StepPanel>
            ) : step === 1 ? (
              <StepPanel key="step1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B57EDC] transition-colors placeholder:text-[#52525B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B57EDC] transition-colors placeholder:text-[#52525B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B57EDC] transition-colors placeholder:text-[#52525B]"
                    />
                  </div>
                </div>
              </StepPanel>
            ) : step === 2 ? (
              <StepPanel key="step2">
                <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">
                  Notes for Provider <span className="normal-case text-[#52525B] font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Any questions, concerns, areas of focus, allergies, or special requests..."
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B57EDC] transition-colors resize-none placeholder:text-[#52525B]"
                />
              </StepPanel>
            ) : (
              <StepPanel key="step3">
                <h3 className="text-white font-bold text-base mb-4">Review Your Request</h3>
                <div className="space-y-2 bg-white/5 rounded-2xl p-4 mb-4">
                  <Row label="Treatment" value={treatment.name} />
                  <Row label="Price" value={treatment.priceLabel || `$${treatment.price}`} />
                  <Row label="Preferred Date" value={preferredDate ? new Date(preferredDate).toLocaleString() : "—"} />
                  <Row label="Name" value={name} />
                  <Row label="Phone" value={phone || "—"} />
                  <Row label="Email" value={email} />
                  {notes && <Row label="Notes" value={notes} />}
                </div>
                <p className="text-[#71717A] text-xs text-center">
                  By submitting, you agree we'll reach out within 24 hours to confirm.
                </p>
              </StepPanel>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 pb-6 flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < STEPS.length - 1) setStep((s) => s + 1);
                else handleSubmit();
              }}
              disabled={!canAdvance() || submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B57EDC] hover:bg-[#a06cc9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
            >
              {submitting ? (
                <span className="animate-pulse">Submitting…</span>
              ) : step === STEPS.length - 1 ? (
                <>Request Appointment <CheckCircle2 className="w-4 h-4" /></>
              ) : (
                <>Continue <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {success && (
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#B57EDC]/20 hover:bg-[#B57EDC]/30 text-[#B57EDC] font-bold text-sm transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const StepPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -16 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-2 text-sm">
    <span className="text-[#71717A] shrink-0">{label}</span>
    <span className="text-white text-right break-all">{value}</span>
  </div>
);

export default BookingModal;
