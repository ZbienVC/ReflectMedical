import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TreatmentProgress } from "../../services/treatmentProgressService";

const CATEGORY_MAP: Record<string, string> = {
  "Laser Hair Removal": "Laser",
  "RF Microneedling": "Device",
  "Microneedling": "Skincare",
};

interface Props {
  progress: TreatmentProgress;
}

export default function TreatmentProgressCard({ progress }: Props) {
  const [notesOpen, setNotesOpen] = useState(false);
  const category = CATEGORY_MAP[progress.treatmentName] ?? "Treatment";

  const dots = Array.from({ length: progress.totalSessions }, (_, i) => i < progress.completedSessions);

  const nextDate = progress.nextRecommendedDate
    ? new Date(progress.nextRecommendedDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{progress.treatmentName}</h3>
          <span className="inline-block mt-1 text-xs bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-0.5 rounded-full font-medium">
            {category}
          </span>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          Session {progress.completedSessions} of {progress.totalSessions}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full border-2 transition-colors ${
              filled
                ? "bg-violet-600 border-violet-600"
                : "bg-white border-gray-300"
            }`}
            title={filled ? `Session ${i + 1} complete` : `Session ${i + 1} remaining`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div
          className="bg-violet-600 h-2 rounded-full transition-all"
          style={{ width: `${(progress.completedSessions / progress.totalSessions) * 100}%` }}
        />
      </div>

      {nextDate && (
        <p className="text-sm text-gray-500 mb-4">
          📅 Next recommended: <span className="font-semibold text-gray-700">{nextDate}</span>
        </p>
      )}

      <div className="flex items-center gap-3">
        <Link
          to={`/appointments?service=${encodeURIComponent(progress.treatmentName)}`}
          className="flex-1 text-center py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Book Next Session
        </Link>
        {progress.notes && (
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors"
          >
            Notes {notesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {notesOpen && progress.notes && (
        <div className="mt-3 bg-gray-50 rounded-xl p-3 text-sm text-gray-600 border border-gray-100">
          {progress.notes}
        </div>
      )}
    </div>
  );
}
