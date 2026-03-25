import React from "react";
import { motion } from "framer-motion";
import { Calendar, Phone } from "lucide-react";

const PRACTICE_PHONE = "(201) 555-0100";

const Appointments: React.FC = () => {
  return (
    <motion.div
      className="space-y-6 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500 mt-1">Book and manage your visits.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No appointments scheduled</h2>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Online booking is coming soon. In the meantime, contact us directly to schedule your next visit.
          </p>
          <a
            href={`tel:${PRACTICE_PHONE}`}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Us to Book: {PRACTICE_PHONE}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default Appointments;
