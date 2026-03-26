import React from "react";
import { motion } from "framer-motion";
import { Tag, Check, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PACKAGES = [
  {
    id: "botox-filler",
    name: "Refresh & Restore Bundle",
    description: "The perfect combination for natural-looking rejuvenation",
    includes: ["Botox (40 units)", "1 Syringe Juvederm Filler of choice"],
    regularPrice: 1350,
    bundlePrice: 1150,
    savings: 200,
    popular: true,
    category: "Most Popular",
  },
  {
    id: "lhr-6pack",
    name: "Laser Hair Removal 6-Pack",
    description: "Complete your hair-free journey with our best value package",
    includes: ["6 Laser Hair Removal sessions", "Free consultation included"],
    regularPrice: 900,
    bundlePrice: 700,
    savings: 200,
    popular: false,
    category: "Best Value",
  },
  {
    id: "glow-package",
    name: "Glow Up Package",
    description: "Full skin transformation for radiant, youthful skin",
    includes: ["3 HydraFacial sessions", "1 Chemical Peel", "Skincare consultation"],
    regularPrice: 875,
    bundlePrice: 699,
    savings: 176,
    popular: false,
    category: "Skincare",
  },
  {
    id: "rf-series",
    name: "RF Microneedling Series",
    description: "Maximum skin tightening with our most advanced device",
    includes: ["3 RF Microneedling sessions", "Post-care serum kit"],
    regularPrice: 2100,
    bundlePrice: 1750,
    savings: 350,
    popular: false,
    category: "Devices",
  },
  {
    id: "new-patient",
    name: "New Patient Welcome Bundle",
    description: "The perfect introduction to Reflect Medical",
    includes: [
      "Comprehensive consultation",
      "1 HydraFacial",
      "Skincare assessment",
      "$50 Beauty Bank credit",
    ],
    regularPrice: 375,
    bundlePrice: 250,
    savings: 125,
    popular: false,
    category: "New Patients",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

const Packages: React.FC = () => {
  const navigate = useNavigate();

  const handleBook = (pkg: typeof PACKAGES[0]) => {
    navigate(`/appointments?package=${pkg.id}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment Packages</h1>
          <p className="text-gray-500 mt-1">Bundle your favorite treatments and save.</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2">
          <Tag className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700">Exclusive bundle savings</span>
        </div>
      </div>

      {/* Packages Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {PACKAGES.map((pkg) => (
          <motion.div
            key={pkg.id}
            variants={item}
            className={`relative bg-white rounded-2xl border ${
              pkg.popular ? "border-violet-300 shadow-violet-100 shadow-md" : "border-gray-200"
            } p-6 flex flex-col`}
          >
            {/* Popular badge */}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  {pkg.category}
                </span>
              </div>
            )}

            {/* Category tag (non-popular) */}
            {!pkg.popular && (
              <div className="mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{pkg.category}</span>
              </div>
            )}

            {/* Title & Description */}
            <div className={pkg.popular ? "mt-4" : ""}>
              <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
            </div>

            {/* Includes list */}
            <ul className="mt-4 space-y-2 flex-1">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 line-through">${pkg.regularPrice.toLocaleString()} regular</p>
                <p className="text-2xl font-black text-gray-900">${pkg.bundlePrice.toLocaleString()}</p>
              </div>
              <span className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                Save ${pkg.savings}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleBook(pkg)}
              className={`mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                pkg.popular
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "bg-gray-50 hover:bg-violet-50 border border-gray-200 hover:border-violet-300 text-gray-800 hover:text-violet-700"
              }`}
            >
              Book This Package
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom note */}
      <p className="text-center text-xs text-gray-400">
        Package pricing valid for a limited time. Contact us at (201) 882-1050 for custom bundles.
      </p>
    </div>
  );
};

export default Packages;
