import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Check, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";

// Progress indicator
const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
            i + 1 < current
              ? "bg-violet-600 text-white"
              : i + 1 === current
              ? "bg-violet-600 text-white ring-4 ring-violet-100"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {i + 1 < current ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`h-0.5 w-8 transition-all ${i + 1 < current ? "bg-violet-600" : "bg-gray-200"}`} />
        )}
      </div>
    ))}
    <span className="ml-2 text-sm text-gray-500">Section {current} of {total}</span>
  </div>
);

interface IntakeFormData {
  // Section 1
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  // Section 2
  medications: string;
  allergies: string;
  previousTreatments: string[];
  medicalConditions: string[];
  pregnantOrBreastfeeding: "yes" | "no" | "na";
  // Section 3
  reasonForVisit: string;
  areasOfConcern: string[];
  desiredOutcome: string;
  // Section 4
  consentTreatment: boolean;
  consentCancellation: boolean;
  signature: string;
  signatureDate: string;
}

const PREVIOUS_TREATMENTS = ["Botox", "Fillers", "Laser", "Chemical Peel", "None"];
const MEDICAL_CONDITIONS = ["Diabetes", "Blood thinners", "Autoimmune", "Pregnancy", "None"];
const AREAS_OF_CONCERN = ["Forehead", "Crow's feet", "Lips", "Cheeks", "Jawline", "Neck", "Body", "Other"];

const IntakeForm: React.FC = () => {
  const { user, profile } = useAuth();
  const [section, setSection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<IntakeFormData>({
    fullName: profile?.name ?? "",
    dob: "",
    phone: (profile as any)?.phone ?? "",
    email: user?.email ?? "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medications: "",
    allergies: "",
    previousTreatments: [],
    medicalConditions: [],
    pregnantOrBreastfeeding: "na",
    reasonForVisit: "",
    areasOfConcern: [],
    desiredOutcome: "",
    consentTreatment: false,
    consentCancellation: false,
    signature: "",
    signatureDate: today,
  });

  useEffect(() => {
    if (profile?.name) setForm((f) => ({ ...f, fullName: profile.name }));
    if (user?.email) setForm((f) => ({ ...f, email: user.email! }));
    if ((profile as any)?.phone) setForm((f) => ({ ...f, phone: (profile as any).phone }));
  }, [profile, user]);

  const toggleArr = (key: keyof IntakeFormData, value: string) => {
    setForm((f) => {
      const arr = f[key] as string[];
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await setDoc(doc(db, "intakeForms", user.uid), {
        ...form,
        userId: user.uid,
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn("IntakeForm submit error", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <Check className="w-8 h-8 text-green-600" strokeWidth={2.5} />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Intake Form Submitted!</h2>
        <p className="text-gray-500">Thank you. Your medical history has been saved securely. We'll review it before your visit.</p>
      </div>
    );
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white";
  const textareaCls = `${inputCls} resize-none`;

  const CheckboxGroup = ({
    options,
    selected,
    onChange,
  }: {
    options: string[];
    selected: string[];
    onChange: (val: string) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            selected.includes(opt)
              ? "bg-violet-600 text-white border-violet-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-violet-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const renderSection1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
      <p className="text-gray-500 text-sm">Please confirm your contact and personal details.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input type="text" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
          <input type="date" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
          <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
          <input type="text" value={form.emergencyContactName} onChange={(e) => setForm((f) => ({ ...f, emergencyContactName: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
          <input type="tel" value={form.emergencyContactPhone} onChange={(e) => setForm((f) => ({ ...f, emergencyContactPhone: e.target.value }))} className={inputCls} />
        </div>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Medical History</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
        <textarea rows={3} value={form.medications} onChange={(e) => setForm((f) => ({ ...f, medications: e.target.value }))} placeholder="List any medications you're currently taking..." className={textareaCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
        <textarea rows={2} value={form.allergies} onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))} placeholder="List any allergies (medications, latex, etc.)..." className={textareaCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Previous Cosmetic Treatments</label>
        <CheckboxGroup options={PREVIOUS_TREATMENTS} selected={form.previousTreatments} onChange={(v) => toggleArr("previousTreatments", v)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
        <CheckboxGroup options={MEDICAL_CONDITIONS} selected={form.medicalConditions} onChange={(v) => toggleArr("medicalConditions", v)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pregnant or breastfeeding?</label>
        <div className="flex gap-3">
          {(["yes", "no", "na"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setForm((f) => ({ ...f, pregnantOrBreastfeeding: opt }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                form.pregnantOrBreastfeeding === opt
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-400"
              }`}
            >
              {opt === "na" ? "N/A" : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Treatment Goals</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What brings you in today?</label>
        <textarea rows={3} value={form.reasonForVisit} onChange={(e) => setForm((f) => ({ ...f, reasonForVisit: e.target.value }))} placeholder="Describe your primary concern or goal..." className={textareaCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Concern</label>
        <CheckboxGroup options={AREAS_OF_CONCERN} selected={form.areasOfConcern} onChange={(v) => toggleArr("areasOfConcern", v)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Desired Outcome</label>
        <textarea rows={3} value={form.desiredOutcome} onChange={(e) => setForm((f) => ({ ...f, desiredOutcome: e.target.value }))} placeholder="Describe the result you're hoping to achieve..." className={textareaCls} />
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Consent & Signature</h2>
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consentTreatment}
            onChange={(e) => setForm((f) => ({ ...f, consentTreatment: e.target.checked }))}
            className="mt-0.5 w-4 h-4 accent-violet-600 rounded"
          />
          <span className="text-sm text-gray-700">
            I consent to treatment and understand the risks associated with the procedures performed at Reflect Cosmetic & Medical Aesthetics. <span className="text-red-500">*</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consentCancellation}
            onChange={(e) => setForm((f) => ({ ...f, consentCancellation: e.target.checked }))}
            className="mt-0.5 w-4 h-4 accent-violet-600 rounded"
          />
          <span className="text-sm text-gray-700">
            I have read and agree to the cancellation policy. <span className="text-red-500">*</span>
          </span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Electronic Signature — type your full name to sign <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.signature}
          onChange={(e) => setForm((f) => ({ ...f, signature: e.target.value }))}
          placeholder="Full legal name"
          className={`${inputCls} font-semibold`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input type="text" value={form.signatureDate} disabled className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
      </div>
    </div>
  );

  const sections = [renderSection1, renderSection2, renderSection3, renderSection4];

  const canProceed = () => {
    if (section === 1) return form.fullName && form.dob && form.phone && form.email;
    if (section === 4) return form.consentTreatment && form.consentCancellation && form.signature;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Intake Form</h1>
          <p className="text-gray-500 text-sm">Please complete before your first visit.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <ProgressBar current={section} total={4} />

        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {sections[section - 1]()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {section > 1 ? (
            <button
              onClick={() => setSection((s) => s - 1)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}
          {section < 4 ? (
            <button
              disabled={!canProceed()}
              onClick={() => setSection((s) => s + 1)}
              className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-6 py-2.5 font-semibold text-sm"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!canProceed() || submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-6 py-2.5 font-semibold text-sm"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><Check className="w-4 h-4" /> Submit Form</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntakeForm;
