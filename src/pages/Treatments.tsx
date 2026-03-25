import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Star, ChevronDown, ChevronUp, Zap, Droplets, Sparkles, Syringe, Layers, FlaskConical } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { treatments, MEMBERSHIP_DISCOUNTS, calculateSavings, Treatment, TreatmentVariant } from "../data/treatments";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Neurotoxins: <Syringe className="w-5 h-5" />,
  Fillers: <Sparkles className="w-5 h-5" />,
  Devices: <Zap className="w-5 h-5" />,
  Skincare: <FlaskConical className="w-5 h-5" />,
  Laser: <Layers className="w-5 h-5" />,
};

const TIER_COLORS: Record<string, string> = {
  core: "from-violet-600 to-violet-700",
  evolve: "from-purple-500 to-purple-600",
  transform: "from-fuchsia-500 to-fuchsia-600",
};

const TIER_BORDER: Record<string, string> = {
  core: "border-violet-500/40",
  evolve: "border-purple-500/40",
  transform: "border-fuchsia-500/40",
};

interface TreatmentCardProps {
  treatment: Treatment;
  selectedTier: "core" | "evolve" | "transform";
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment, selectedTier }) => {
  const [expanded, setExpanded] = useState(false);

  const getBasePrice = (v: TreatmentVariant) =>
    v.flatPrice ?? (v.pricePerUnit ?? 0);

  const primaryVariant = treatment.variants[0];
  const memberPrice = primaryVariant.memberPrices[selectedTier];
  const basePrice = getBasePrice(primaryVariant);
  const savings = calculateSavings(basePrice, memberPrice);

  return (
    <motion.div
      layout
      className={`bg-[#1C1C24] rounded-2xl border ${TIER_BORDER[selectedTier]} overflow-hidden hover:border-purple-500/60 transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TIER_COLORS[selectedTier]} flex items-center justify-center text-white`}>
              {CATEGORY_ICONS[treatment.category] ?? <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">{treatment.name}</h3>
              <span className="text-xs text-purple-400 font-medium">{treatment.category}</span>
            </div>
          </div>
          {savings.percent > 0 && (
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full border border-green-500/30">
              -{savings.percent}%
            </span>
          )}
        </div>

        <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">{treatment.description}</p>

        {/* Pricing */}
        <div className="bg-[#0F0F14] rounded-xl p-4 mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-white">
                ${memberPrice}{primaryVariant.pricePerUnit ? "" : ""}
              </span>
              <span className="text-[#A1A1AA] text-sm ml-1">
                / {primaryVariant.unitLabel}
                {primaryVariant.pricePerUnit ? " · " + primaryVariant.typicalUnits : ""}
              </span>
            </div>
            {savings.amount > 0 && (
              <div className="text-right">
                <span className="line-through text-[#71717A] text-sm">${basePrice}</span>
                <div className="text-green-400 text-sm font-semibold">Save ${savings.amount}</div>
              </div>
            )}
          </div>
          <div className={`mt-2 text-xs font-medium bg-gradient-to-r ${TIER_COLORS[selectedTier]} bg-clip-text text-transparent`}>
            {MEMBERSHIP_DISCOUNTS[selectedTier].label} Member Price · {MEMBERSHIP_DISCOUNTS[selectedTier].savings}
          </div>
        </div>

        {/* Meta */}
        <div className="flex gap-4 text-sm text-[#A1A1AA]">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{treatment.duration}</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{treatment.results}</span>
        </div>
      </div>

      {/* Expand variants & details */}
      {(treatment.variants.length > 1 || treatment.areas || treatment.benefits) && (
        <div className="border-t border-white/5">
          <button
            className="w-full flex items-center justify-between px-6 py-3 text-sm text-[#A1A1AA] hover:text-white transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            <span>{treatment.variants.length > 1 ? `${treatment.variants.length} variants available` : "View details"}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 space-y-4">
                  {/* All variants */}
                  {treatment.variants.length > 1 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">All Options</p>
                      {treatment.variants.map((v) => {
                        const base = getBasePrice(v);
                        const mp = v.memberPrices[selectedTier];
                        const sv = calculateSavings(base, mp);
                        return (
                          <div key={v.name} className="flex items-center justify-between bg-[#0F0F14] rounded-lg px-3 py-2">
                            <span className="text-sm text-white">{v.name}</span>
                            <div className="text-right">
                              <span className="text-sm font-bold text-white">${mp}</span>
                              {sv.amount > 0 && (
                                <span className="text-xs text-green-400 ml-2">-${sv.amount}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Areas or Benefits */}
                  {(treatment.areas || treatment.benefits) && (
                    <div>
                      <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                        {treatment.areas ? "Treatment Areas" : "Key Benefits"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(treatment.areas || treatment.benefits)?.map((item) => (
                          <span key={item} className="bg-white/5 text-[#A1A1AA] text-xs px-2 py-1 rounded-full border border-white/10">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CTA */}
      <div className="px-6 pb-5">
        <motion.button
          className={`w-full bg-gradient-to-r ${TIER_COLORS[selectedTier]} text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Appointment
        </motion.button>
      </div>
    </motion.div>
  );
};

// Loading skeleton
const TreatmentSkeleton = () => (
  <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-6 animate-pulse space-y-4">
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/3" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-5/6" />
    </div>
    <div className="h-20 bg-white/5 rounded-xl" />
    <div className="h-10 bg-white/5 rounded-xl" />
  </div>
);

const CATEGORIES = ["All", "Neurotoxins", "Fillers", "Devices", "Skincare", "Laser"] as const;

const Treatments: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<"core" | "evolve" | "transform">("evolve");
  const [loading] = useState(false);

  const filtered = selectedCategory === "All"
    ? treatments
    : treatments.filter((t) => t.category === selectedCategory);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white">Treatment Menu</h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Premium aesthetic treatments at Reflect Medical. Select your membership tier to see your personalized pricing.
          </p>
        </motion.div>

        {/* Tier Selector */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-[#1C1C24] rounded-2xl p-1.5 flex gap-1 border border-white/10">
            {(["core", "evolve", "transform"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize ${
                  selectedTier === tier
                    ? `bg-gradient-to-r ${TIER_COLORS[tier]} text-white shadow-lg`
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                {MEMBERSHIP_DISCOUNTS[tier].label}
                <span className="ml-2 text-xs opacity-70">{MEMBERSHIP_DISCOUNTS[tier].savings}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#6D28D9] text-white"
                  : "bg-[#1C1C24] text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              {cat !== "All" && CATEGORY_ICONS[cat]}
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <TreatmentSkeleton key={i} />)
            : filtered.length === 0
            ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Droplets className="w-8 h-8 text-[#A1A1AA]" />
                </div>
                <p className="text-white font-semibold text-lg">No treatments found</p>
                <p className="text-[#A1A1AA] text-sm mt-1">Try a different category</p>
              </div>
            )
            : filtered.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                selectedTier={selectedTier}
              />
            ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Treatments;
