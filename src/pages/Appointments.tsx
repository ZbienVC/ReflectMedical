import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Phone } from "lucide-react";
import SchedulingFlow from "../components/appointments/SchedulingFlow";

const PRACTICE_PHONE = "(201) 882-1050";

const Appointments: React.FC = () => {
  const [showFlow, setShowFlow] = useState(false);

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-7 h-7 text-violet-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Schedule your next visit at Reflect Cosmetic &amp; Medical Aesthetics. Our team is ready to help you look and feel your best.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setShowFlow(true)}
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Schedule Online
          </button>
          <a
            href={`tel:${PRACTICE_PHONE.replace(/\D/g, "")}`}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-violet-300 text-gray-700 rounded-xl px-6 py-3 font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call {PRACTICE_PHONE}
          </a>
        </div>
      </div>

      {/* Scheduling Flow */}
      {showFlow && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SchedulingFlow />
        </motion.div>
      )}

      {/* If not yet shown, show a gentle prompt */}
      {!showFlow && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
          {[
            { label: "Monday", hours: "9:00 AM – 7:00 PM" },
            { label: "Tuesday", hours: "9:00 AM – 2:00 PM" },
            { label: "Wednesday", hours: "9:00 AM – 5:00 PM" },
            { label: "Thursday", hours: "9:00 AM – 5:00 PM" },
            { label: "Friday", hours: "9:00 AM – 4:00 PM" },
            { label: "Sunday", hours: "Closed" },
          ].map((day) => (
            <div key={day.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <span className="font-medium text-gray-700">{day.label}</span>
              <span className={day.hours === "Closed" ? "text-red-400 font-medium" : "text-violet-600 font-medium"}>{day.hours}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Appointments;
