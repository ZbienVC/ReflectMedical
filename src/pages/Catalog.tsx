import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Service, MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { calculateDiscountedPrice } from "../services/membershipService";
import { ShoppingCart, Sparkles, Tag, ArrowRight, PackageSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton, SkeletonCard } from "../components/ui/Skeleton";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const Catalog: React.FC = () => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [tier, setTier] = useState<MembershipTier | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return (
        <div className="pt-6 space-y-10">
        {/* Header skeleton */}
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

        {/* Cards skeleton */}
        {[...Array(2)].map((_, si) => (
          <div key={si} className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, ci) => <SkeletonCard key={ci} className="h-52" />)}
            </div>
          </div>
        ))}
      </div>
    );

  const hasServices = services.length > 0;

  return (
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
              {tier
                ? <span className="text-purple-400">{tier.name} discounts are active.</span>
                : "Join a membership to unlock exclusive pricing."}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#1C1C24] p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-purple-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest">Your Balance</p>
              <p className="text-lg font-bold text-white">{formatCurrency(profile?.beautyBucksBalance || 0)}</p>
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
            <p className="text-[#71717A] text-sm mt-1 max-w-xs">Check back soon — we're always adding new services.</p>
          </div>
        )}

        {/* Categories */}
        {categories.map((cat) => {
          const catServices = services.filter((s) => s.category === cat);
          if (catServices.length === 0) return null;

          return (
            <section key={cat} className="space-y-5">
              <h2 className="text-lg font-bold text-white capitalize flex items-center gap-3">
                <div className="w-1 h-5 bg-purple-500 rounded-full" />
                {cat}s
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

                  return (
                    <motion.div
                      key={service.id}
                      variants={item}
                      className="group bg-[#1C1C24] rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-colors duration-200"
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-purple-600/15 transition-colors">
                          <Tag className="text-[#71717A] group-hover:text-purple-400 w-5 h-5 transition-colors" />
                        </div>
                        {savings > 0 && (
                          <div className="bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">
                            Save {formatCurrency(savings)}
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">{service.name}</h3>
                      <p className="text-xs text-[#71717A] font-medium mb-5 uppercase tracking-wider">{service.category}</p>

                      <div className="flex items-end justify-between mb-5">
                        <div>
                          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest mb-1">Member Price</p>
                          <p className="text-2xl font-bold text-white">
                            {formatCurrency(discountedPrice)}
                            {isInjectable && <span className="text-xs text-[#71717A] ml-1">/unit</span>}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest mb-1">Base</p>
                          <p className="text-sm text-[#71717A] line-through">{formatCurrency(service.basePrice)}</p>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => navigate(`/checkout/${service.id}`)}
                        className="w-full py-2.5 bg-[#6D28D9] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#5B21B6] transition-colors text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Book Treatment <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>
          );
        })}
      </motion.div>
    );
};

export default Catalog;

