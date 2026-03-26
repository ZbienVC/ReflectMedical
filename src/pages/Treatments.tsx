import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, Star, Sparkles } from "lucide-react";
import {
  treatments,
  treatmentCategories,
  getMemberPrice,
  getSavings,
  Treatment,
} from "../data/treatments";

type Tier = "nonmember" | "core" | "evolve" | "transform";

const TIER_TABS: { id: Tier; label: string }[] = [
  { id: "nonmember", label: "Non-member" },
  { id: "core", label: "Core" },
  { id: "evolve", label: "Evolve" },
  { id: "transform", label: "Transform" },
];

const CATEGORY_LABEL: Record<string, string> = {
  neurotoxins: "Neurotoxins",
  fillers: "Fillers",
  devices: "Devices",
  skincare: "Skincare",
  laser: "Laser",
  wellness: "Wellness",
};

interface TreatmentCardProps {
  treatment: Treatment;
  tier: Tier;
  index: number;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment, tier, index }) => {
  const navigate = useNavigate();

  const basePrice = treatment.basePrice ?? 0;
  const isMember = tier !== "nonmember";
  const memberPrice = isMember ? getMemberPrice(treatment, tier) : basePrice;
  const savings = isMember ? getSavings(treatment, tier) : 0;
  const hasSavings = savings > 0;

  const unitLabel = treatment.unitType === "unit"
    ? "/ unit"
    : treatment.unitType === "syringe"
    ? "/ syringe"
    : "/ session";

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Category badge */}
      <div className="mb-3">
        <span className="inline-block bg-violet-50 text-violet-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          {CATEGORY_LABEL[treatment.category] ?? treatment.category}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{treatment.name}</h3>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{treatment.description}</p>

      {/* Duration + Results */}
      <div className="flex gap-4 text-xs text-gray-400 mb-3">
        {treatment.duration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {treatment.duration}
          </span>
        )}
        {treatment.results && (
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            {treatment.results}
          </span>
        )}
      </div>

      {/* Pricing box */}
      <div className="bg-gray-50 rounded-xl p-3 mt-auto mb-4">
        {!isMember ? (
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-gray-900">${basePrice}</span>
            <span className="text-sm text-gray-500">{unitLabel}</span>
          </div>
        ) : hasSavings ? (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="text-gray-400 line-through text-sm">${basePrice}</span>
              <span className="text-xl font-black text-violet-700">${memberPrice}</span>
              <span className="text-sm text-gray-500">{unitLabel}</span>
            </div>
            <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
              Save ${savings}
            </span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-gray-900">${basePrice}</span>
              <span className="text-sm text-gray-500">{unitLabel}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">No discount for this tier</p>
          </div>
        )}
      </div>

      {/* Book button */}
      <button
        onClick={() => navigate(`/appointments?service=${encodeURIComponent(treatment.name)}`)}
        className="mt-auto bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-2.5 w-full font-semibold text-sm transition-colors"
      >
        Book Appointment
      </button>
    </motion.div>
  );
};

const Treatments: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<Tier>("nonmember");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const filtered = selectedCategory === "all"
    ? treatments
    : treatments.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900">Our Treatments</h1>
        <p className="text-gray-500 text-base">
          Premium aesthetic and medical services at Reflect Medical &amp; Cosmetic Center, Hawthorne NJ
        </p>
      </motion.div>

      {/* Tier selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 flex-wrap"
      >
        {TIER_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTier(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedTier === t.id
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {treatmentCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? "bg-violet-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-semibold text-lg">No treatments in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((treatment, i) => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
              tier={selectedTier}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-violet-50 border border-violet-100 rounded-2xl p-8 text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">Ready to start your transformation?</h2>
        <p className="text-gray-500">Book a consultation or explore our membership plans.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/appointments")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Schedule Appointment
          </button>
          <button
            onClick={() => navigate("/memberships")}
            className="bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            View Memberships
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Treatments;
