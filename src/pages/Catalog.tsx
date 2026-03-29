import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Service, MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { calculateDiscountedPrice } from "../services/membershipService";
import { Sparkles, Tag, PackageSearch, Clock, Calendar } from "lucide-react";
import { Skeleton, SkeletonCard } from "../components/ui/Skeleton";
import BookingModal from "../components/BookingModal";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

// Enriched metadata for treatments
const TREATMENT_META: Record<string, { description: string; duration: string; priceLabel?: string }> = {
  "Botox (per unit)": {
    description: "FDA-approved neurotoxin to smooth fine lines and wrinkles. Natural-looking results lasting 3–4 months.",
    duration: "15–30 min",
    priceLabel: "from $14/unit",
  },
  "Dysport (per unit)": {
    description: "Fast-acting neurotoxin ideal for forehead lines and crow's feet with a natural spread.",
    duration: "15–30 min",
    priceLabel: "from $5/unit",
  },
  "Juvederm Voluma": {
    description: "Premium hyaluronic acid filler for cheek volume and facial contouring. Results last 18–24 months.",
    duration: "30–45 min",
    priceLabel: "from $800",
  },
  "Restylane Kysse": {
    description: "Lip enhancement filler designed for a natural feel, volume, and definition. Lasts 6–12 months.",
    duration: "30–45 min",
    priceLabel: "from $700",
  },
  "Microneedling": {
    description: "Collagen induction therapy for skin texture, pores, and mild scarring. Minimal downtime.",
    duration: "45–60 min",
    priceLabel: "from $350",
  },
  "RF Microneedling": {
    description: "Radiofrequency microneedling for skin tightening and rejuvenation. Advanced resurfacing.",
    duration: "60–90 min",
    priceLabel: "from $750",
  },
  "Laser Hair Removal (Small Area)": {
    description: "Permanent hair reduction for small treatment areas. 6–8 sessions recommended.",
    duration: "15–30 min",
    priceLabel: "from $150/session",
  },
  "Chemical Peel": {
    description: "Medical-grade peel to resurface skin, improve tone, and reduce hyperpigmentation.",
    duration: "30–45 min",
    priceLabel: "from $175",
  },
  "GLP-1 Consultation": {
    description: "Comprehensive weight management consultation with personalized GLP-1 treatment planning.",
    duration: "45–60 min",
    priceLabel: "from $250",
  },
};

const Catalog: React.FC = () => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [tier, setTier] = useState<MembershipTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingTreatment, setBookingTreatment] = useState<{
    id: string;
    name: string;
    price: number;
    priceLabel?: string;
    description?: string;
    duration?: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const sSnap = await getDocs(collection(db, "services"));
      setServices(sSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Service)));

      if (profile?.membershipTierId) {
        const tSnap = await getDoc(doc(db, "membershipTiers", profile.membershipTierId));
        if (tSnap.exists()) setTier(tSnap.data() as MembershipTier);
      }
      setLoading(false);
    };
    fetchData();
  }, [profile]);

  const categories = ["injectable", "filler", "device", "wellness", "retail"];

  const openBooking = (service: Service, discountedPrice: number) => {
    const meta = TREATMENT_META[service.name];
    setBookingTreatment({
      id: service.id,
      name: service.name,
      price: discountedPrice,
      priceLabel: meta?.priceLabel || formatCurrency(discountedPrice),
      description: meta?.description,
      duration: meta?.duration,
    });
  };

  if (loading)
    return (
      <div className="pt-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="bg-[#1C1C24] rounded-2xl p-4 border border-white/5 flex items-center gap-4 w-48">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
        {[...Array(2)].map((_, si) => (
          <div key={si} className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, ci) => (
                <SkeletonCard key={ci} className="h-52" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  const hasServices = services.length > 0;

  return (
    <>
      <motion.div
        className="pt-6 space-y-10 pb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-white mb-2">Treatment Catalog</h1>
            <p className="text-[#A1A1AA]">
              Browse our medical-grade treatments.{" "}
              {tier ? (
                <span className="text-[#B57EDC]">{tier.name} discounts are active.</span>
              ) : (
                "Join a membership to unlock exclusive pricing."
              )}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#1C1C24] p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-[#B57EDC]/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-[#B57EDC] w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest">Your Balance</p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(profile?.beautyBucksBalance || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!hasServices && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <PackageSearch className="w-8 h-8 text-[#A1A1AA]" />
            </div>
            <h3 className="text-white font-bold text-lg">No treatments available</h3>
            <p className="text-[#71717A] text-sm mt-1 max-w-xs">
              Check back soon — we're always adding new services.
            </p>
          </div>
        )}

        {/* Categories */}
        {categories.map((cat) => {
          const catServices = services.filter((s) => s.category === cat);
          if (catServices.length === 0) return null;

          // Skip retail category from booking (products, not appointments)
          const isBookable = cat !== "retail";

          return (
            <section key={cat} className="space-y-5">
              <h2 className="text-lg font-bold text-white capitalize flex items-center gap-3">
                <div className="w-1 h-5 bg-[#B57EDC] rounded-full" />
                {cat === "injectable" ? "Injectables" :
                 cat === "filler" ? "Fillers" :
                 cat === "device" ? "Device Treatments" :
                 cat === "wellness" ? "Wellness" :
                 "Retail Products"}
              </h2>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {catServices.map((service) => {
                  const { discountedPrice, savings } = calculateDiscountedPrice(service, tier);
                  const isInjectable = service.category === "injectable";
                  const meta = TREATMENT_META[service.name];

                  return (
                    <motion.div
                      key={service.id}
                      variants={item}
                      className="group bg-[#1C1C24] rounded-2xl p-6 border border-white/5 hover:border-[#B57EDC]/40 transition-colors duration-200 flex flex-col"
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Top row */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#B57EDC]/15 transition-colors">
                          <Tag className="text-[#71717A] group-hover:text-[#B57EDC] w-5 h-5 transition-colors" />
                        </div>
                        {savings > 0 && (
                          <div className="bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">
                            Save {formatCurrency(savings)}
                          </div>
                        )}
                      </div>

                      {/* Treatment info */}
                      <h3 className="text-base font-bold text-white mb-1">{service.name}</h3>
                      {meta?.description && (
                        <p className="text-xs text-[#71717A] mb-3 leading-relaxed line-clamp-2">
                          {meta.description}
                        </p>
                      )}

                      {/* Duration */}
                      {meta?.duration && (
                        <div className="flex items-center gap-1.5 mb-4">
                          <Clock className="w-3.5 h-3.5 text-[#52525B]" />
                          <span className="text-xs text-[#52525B]">{meta.duration}</span>
                        </div>
                      )}

                      {/* Price row */}
                      <div className="flex items-end justify-between mt-auto mb-4">
                        <div>
                          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest mb-0.5">
                            {tier ? "Member Price" : "Price"}
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {formatCurrency(discountedPrice)}
                            {isInjectable && (
                              <span className="text-xs text-[#71717A] ml-1">/unit</span>
                            )}
                          </p>
                        </div>
                        {savings > 0 && (
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest mb-0.5">Base</p>
                            <p className="text-sm text-[#71717A] line-through">
                              {formatCurrency(service.basePrice)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Book button */}
                      {isBookable && (
                        <motion.button
                          onClick={() => openBooking(service, discountedPrice)}
                          className="w-full py-2.5 bg-[#B57EDC] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#a06cc9] transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Calendar className="w-4 h-4" />
                          Book Consultation
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>
          );
        })}
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingTreatment && (
          <BookingModal
            treatment={bookingTreatment}
            onClose={() => setBookingTreatment(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Catalog;
