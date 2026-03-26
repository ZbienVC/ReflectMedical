import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Syringe,
  Sparkles,
  Droplets,
  Zap,
  Weight,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  CalendarPlus,
  RotateCcw,
} from "lucide-react";
import { createAppointment, getBookedSlots } from "../../services/appointmentService";
import { sendAppointmentNotification } from "../../services/emailService";
import { useAuth } from "../../AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ServiceOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SERVICES: ServiceOption[] = [
  {
    id: "botox",
    name: "Botox / Neurotoxins",
    description: "Smooth fine lines and wrinkles with FDA-approved neurotoxins.",
    icon: <Syringe className="w-5 h-5" />,
  },
  {
    id: "fillers",
    name: "Dermal Fillers",
    description: "Restore volume and contour with hyaluronic acid fillers.",
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    id: "peel",
    name: "Chemical Peel",
    description: "Refresh and resurface for brighter, smoother skin.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "laser",
    name: "Laser Hair Removal",
    description: "Long-lasting hair reduction with advanced laser technology.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "glp",
    name: "Weight Management (GLP)",
    description: "Medical weight management with GLP-1 therapy.",
    icon: <Weight className="w-5 h-5" />,
  },
  {
    id: "consultation",
    name: "Consultation",
    description: "Meet with our team to discuss your aesthetic goals.",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "other",
    name: "Other",
    description: "Have a specific question or service in mind? Let us know.",
    icon: <HelpCircle className="w-5 h-5" />,
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getSlotsForDay(dayOfWeek: number): string[] {
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  let start = 9 * 60; // 9:00 AM in minutes
  let end: number;
  if (dayOfWeek === 1 || dayOfWeek === 5) end = 19 * 60; // 7:00 PM
  else if (dayOfWeek === 2) end = 14 * 60; // 2:00 PM
  else if (dayOfWeek === 3 || dayOfWeek === 4) end = 17 * 60; // 5:00 PM
  else return [];

  const slots: string[] = [];
  for (let m = start; m < end; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push(`${h12}:${min.toString().padStart(2, "0")} ${ampm}`);
  }
  return slots;
}

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatDisplayDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function googleCalendarUrl(service: string, date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [timePart, ampm] = time.split(" ");
  const [hRaw, min] = timePart.split(":").map(Number);
  let h = hRaw;
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const start = new Date(y, m - 1, d, h, min);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`Reflect Medical — ${service}`)}` +
    `&dates=${fmt(start)}/${fmt(end)}` +
    `&details=${encodeURIComponent("Your appointment at Reflect Cosmetic & Medical Aesthetics. Questions? Call (201) 882-1050.")}` +
    `&location=${encodeURIComponent("Reflect Cosmetic & Medical Aesthetics")}`
  );
}

// ─── Step Progress Indicator ─────────────────────────────────────────────────
const StepPills: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          i + 1 === current
            ? "bg-violet-600 text-white"
            : i + 1 < current
            ? "bg-violet-100 text-violet-700"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {i + 1 < current ? <Check className="w-3 h-3" /> : null}
        Step {i + 1}
      </div>
    ))}
  </div>
);

// ─── Slide variants ──────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SchedulingFlow: React.FC = () => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Selections
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: "", email: "", phone: "", notes: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Calendar state
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  // Time slot state
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    getBookedSlots(selectedDate)
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const go = useCallback((next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  // ── Step 1: Service ───────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Select a Service</h2>
      <p className="text-gray-500 text-sm mb-6">Choose the treatment you'd like to book.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((svc) => {
          const selected = selectedService?.id === svc.id;
          return (
            <button
              key={svc.id}
              onClick={() => setSelectedService(svc)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                selected
                  ? "border-violet-500 bg-violet-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-violet-300"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${selected ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {svc.icon}
              </div>
              <p className={`font-semibold text-sm ${selected ? "text-violet-700" : "text-gray-900"}`}>{svc.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{svc.description}</p>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          disabled={!selectedService}
          onClick={() => go(2)}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-6 py-2.5 font-semibold text-sm transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );

  // ── Step 2: Calendar ──────────────────────────────────────────────────────
  const renderStep2 = () => {
    const firstDow = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Select a Date</h2>
        <p className="text-gray-500 text-sm mb-6">We're open Mon–Fri (excluding Sundays and past dates).</p>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
              else setCalMonth(m => m - 1);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-gray-900">{MONTHS[calMonth]} {calYear}</span>
          <button
            onClick={() => {
              if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
              else setCalMonth(m => m + 1);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_SHORT.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = toDateKey(calYear, calMonth, day);
            const dow = new Date(calYear, calMonth, day).getDay();
            const isPast = dateKey < todayKey;
            const isSun = dow === 0;
            const isSat = dow === 6;
            const disabled = isPast || isSun || isSat;
            const isSelected = selectedDate === dateKey;

            return (
              <button
                key={day}
                disabled={disabled}
                onClick={() => {
                  setSelectedDate(dateKey);
                  setSelectedTime(null);
                }}
                className={`mx-auto w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center transition-all ${
                  disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : isSelected
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Office hours: Mon 9–7, Tue 9–2, Wed/Thu 9–5, Fri 9–4 (alternating extended hours)
        </p>

        <div className="mt-6 flex justify-between">
          <button onClick={() => go(1)} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            disabled={!selectedDate}
            onClick={() => go(3)}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-6 py-2.5 font-semibold text-sm transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // ── Step 3: Time Slots ────────────────────────────────────────────────────
  const renderStep3 = () => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    const allSlots = getSlotsForDay(dow);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const isToday = selectedDate === toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Select a Time</h2>
        <p className="text-gray-500 text-sm mb-6">{formatDisplayDate(selectedDate)}</p>

        {loadingSlots ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : allSlots.length === 0 ? (
          <p className="text-gray-500 text-sm">No slots available on this day. Please pick another date.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {allSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              // check if past for today
              const [timePart, ampm] = slot.split(" ");
              const [hRaw, min] = timePart.split(":").map(Number);
              let h = hRaw;
              if (ampm === "PM" && h !== 12) h += 12;
              if (ampm === "AM" && h === 12) h = 0;
              const slotMins = h * 60 + min;
              const isPastTime = isToday && slotMins <= nowMins;
              const disabled = isBooked || isPastTime;
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  disabled={disabled}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-1 rounded-xl text-sm font-medium transition-all ${
                    disabled
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-violet-400 hover:text-violet-700"
                  }`}
                >
                  {disabled && isBooked ? (
                    <span className="line-through">{slot}</span>
                  ) : slot}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button onClick={() => go(2)} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            disabled={!selectedTime}
            onClick={() => go(4)}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-6 py-2.5 font-semibold text-sm transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // ── Step 4: Patient Info ──────────────────────────────────────────────────
  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!patientInfo.name.trim()) errors.name = "Full name is required.";
    if (!patientInfo.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientInfo.email)) errors.email = "Please enter a valid email.";
    if (!patientInfo.phone.trim()) errors.phone = "Phone number is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!selectedService || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const appointmentPayload = {
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        name: patientInfo.name,
        email: patientInfo.email,
        phone: patientInfo.phone,
        notes: patientInfo.notes || undefined,
        status: "pending" as const,
        userId: user?.uid || undefined,
      };
      const id = await createAppointment(appointmentPayload);
      setConfirmedId(id);
      // Non-blocking email
      sendAppointmentNotification({
        patientName: patientInfo.name,
        service: selectedService.name,
        date: formatDisplayDate(selectedDate),
        time: selectedTime,
        phone: patientInfo.phone,
        email: patientInfo.email,
        notes: patientInfo.notes || undefined,
      });
      setDirection(1);
      setStep(5);
    } catch {
      setSubmitError("Something went wrong. Please try again or call us at (201) 882-1050.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep4 = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Your Information</h2>
      <p className="text-gray-500 text-sm mb-6">We'll use this to confirm your appointment.</p>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={patientInfo.name}
            onChange={(e) => setPatientInfo(p => ({ ...p, name: e.target.value }))}
            placeholder="Jane Smith"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 ${formErrors.name ? "border-red-400" : "border-gray-200"}`}
          />
          {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={patientInfo.email}
            onChange={(e) => setPatientInfo(p => ({ ...p, email: e.target.value }))}
            placeholder="jane@example.com"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 ${formErrors.email ? "border-red-400" : "border-gray-200"}`}
          />
          {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
        </div>
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={patientInfo.phone}
            onChange={(e) => setPatientInfo(p => ({ ...p, phone: e.target.value }))}
            placeholder="(201) 555-0100"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 ${formErrors.phone ? "border-red-400" : "border-gray-200"}`}
          />
          {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
        </div>
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            rows={3}
            value={patientInfo.notes}
            onChange={(e) => setPatientInfo(p => ({ ...p, notes: e.target.value }))}
            placeholder="Any questions or special requests..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 resize-none"
          />
        </div>
      </div>

      {submitError && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{submitError}</p>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={() => go(3)} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl px-6 py-2.5 font-semibold text-sm transition-colors flex items-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Booking…
            </>
          ) : (
            "Confirm Booking"
          )}
        </button>
      </div>
    </div>
  );

  // ── Step 5: Confirmation ──────────────────────────────────────────────────
  const reset = () => {
    setStep(1);
    setDirection(1);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setPatientInfo({ name: "", email: "", phone: "", notes: "" });
    setFormErrors({});
    setConfirmedId(null);
    setSubmitError(null);
  };

  const renderStep5 = () => {
    const gcUrl = selectedService && selectedDate && selectedTime
      ? googleCalendarUrl(selectedService.name, selectedDate, selectedTime)
      : "#";

    return (
      <div className="text-center py-4">
        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <Check className="w-8 h-8 text-green-600" strokeWidth={2.5} />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">You're Booked!</h2>
        <p className="text-gray-500 text-sm mb-6">The office will confirm your appointment shortly.</p>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service</span>
            <span className="font-semibold text-gray-900">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-900">{selectedDate ? formatDisplayDate(selectedDate) : ""}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time</span>
            <span className="font-semibold text-gray-900">{selectedTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Name</span>
            <span className="font-semibold text-gray-900">{patientInfo.name}</span>
          </div>
          {confirmedId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ref #</span>
              <span className="font-mono text-xs text-gray-400">{confirmedId.slice(0, 10).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={gcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-2.5 font-semibold text-sm transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
            Add to Google Calendar
          </a>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl px-5 py-2.5 font-semibold text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Book Another
          </button>
        </div>
      </div>
    );
  };

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      {step < 5 && <StepPills current={step} total={5} />}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {stepContent[step - 1]()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SchedulingFlow;
