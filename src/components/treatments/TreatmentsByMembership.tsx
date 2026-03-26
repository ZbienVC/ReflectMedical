import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TREATMENTS,
  MEMBERSHIP_PLANS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  getMemberPrice,
  getSavings,
  applyCredits,
  type MembershipTier,
  type TreatmentCategory,
} from "../../data/skinBank";

const UNIT_LABELS: Record<string, string> = {
  unit: "per unit",
  session: "per session",
  syringe: "per syringe",
};

const TreatmentsByMembership: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<MembershipTier>("evolve");

  const plan = MEMBERSHIP_PLANS.find((p) => p.id === selectedTier)!;

  // Group treatments by category in order
  const categoriesWithTreatments = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    treatments: TREATMENTS.filter((t) => t.category === cat),
  })).filter((g) => g.treatments.length > 0);

  // Example treatment for Skin Bank section (RF Microneedling)
  const rfMicroneedling = TREATMENTS.find((t) => t.id === "rf_microneedling")!;
  const rfMemberPrice = getMemberPrice(rfMicroneedling, selectedTier);
  const rfAfterBank = applyCredits(rfMemberPrice, plan.monthlyCredits);

  return (
    <div className="space-y-6">
      {/* Tier Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-full p-1 flex gap-1">
          {MEMBERSHIP_PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedTier(p.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedTier === p.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Plan summary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTier}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Treatment list by category */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {categoriesWithTreatments.map((group, gi) => (
              <div key={group.category}>
                {gi > 0 && <div className="border-t border-gray-100" />}
                {/* Category header */}
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {group.label}
                  </h3>
                </div>
                {/* Treatments */}
                {group.treatments.map((treatment, ti) => {
                  const memberPrice = getMemberPrice(treatment, selectedTier);
                  const savings = getSavings(treatment, selectedTier);
                  const hasSavings = savings > 0;
                  const unitLabel = treatment.unitType
                    ? UNIT_LABELS[treatment.unitType]
                    : "";

                  return (
                    <div
                      key={treatment.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 ${
                        ti < group.treatments.length - 1
                          ? "border-b border-gray-50"
                          : ""
                      }`}
                    >
                      {/* Left: name + description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            {treatment.name}
                          </span>
                          {unitLabel && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              {unitLabel}
                            </span>
                          )}
                        </div>
                        {treatment.description && (
                          <p className="text-gray-500 text-xs mt-0.5">
                            {treatment.description}
                          </p>
                        )}
                      </div>

                      {/* Right: pricing */}
                      <div className="flex items-center gap-3 shrink-0">
                        {hasSavings && (
                          <span className="text-gray-400 text-sm line-through">
                            ${treatment.basePrice}
                          </span>
                        )}
                        <span className="font-bold text-violet-700 text-base">
                          ${memberPrice}
                        </span>
                        {hasSavings ? (
                          <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                            Save ${savings}
                          </span>
                        ) : (
                          <span className="text-xs font-medium bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full">
                            Member Price
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Skin Bank section */}
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">$</span>
              </div>
              <div>
                <p className="font-bold text-violet-900 text-sm">
                  Your ${plan.monthlyCredits} Skin Bank
                </p>
                <p className="text-violet-700 text-xs">
                  Applies to any treatment above · Unused value rolls over while
                  your membership is active
                </p>
              </div>
            </div>

            {/* Example walkthrough */}
            <div className="bg-white rounded-xl border border-violet-100 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Example
              </p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-700 font-medium">
                  RF Microneedling
                </span>
                <span className="text-gray-400">
                  (${rfMicroneedling.basePrice})
                </span>
                <span className="text-gray-300">→</span>
                <span className="text-violet-700 font-semibold">
                  After member pricing: ${rfMemberPrice}
                </span>
                <span className="text-gray-300">→</span>
                <span className="font-bold text-green-700">
                  After Skin Bank: ${rfAfterBank}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TreatmentsByMembership;
