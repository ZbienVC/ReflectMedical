import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Service, MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { calculateDiscountedPrice } from "../services/membershipService";
import { ShoppingCart, Sparkles, Tag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

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
    <AppLayout>
      <div className="py-20 text-center text-slate-400">Loading catalog...</div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <main className="pt-6">
        <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Treatment Catalog</h1>
          <p className="text-slate-500 font-medium">
            Browse our medical-grade treatments and products. {tier ? `Your ${tier.name} discounts are active.` : "Join a membership to unlock exclusive pricing."}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Sparkles className="text-emerald-600 w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Balance</p>
            <p className="text-lg font-serif font-bold text-slate-900">{formatCurrency(profile?.beautyBucksBalance || 0)}</p>
          </div>
        </div>
      </header>

      {categories.map((cat) => {
        const catServices = services.filter((s) => s.category === cat);
        if (catServices.length === 0) return null;

        return (
          <section key={cat} className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-slate-900 capitalize flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full" />
              {cat}s
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catServices.map((service) => {
                const { discountedPrice, savings } = calculateDiscountedPrice(service, tier);
                const isInjectable = service.category === "injectable";

                return (
                  <div key={service.id} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <Tag className="text-slate-400 group-hover:text-emerald-600 w-5 h-5 transition-colors" />
                      </div>
                      {savings > 0 && (
                        <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          Save {formatCurrency(savings)}
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">{service.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mb-6 uppercase tracking-wider">{service.category}</p>

                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Price</p>
                        <p className="text-2xl font-serif font-bold text-slate-900">
                          {formatCurrency(discountedPrice)}
                          {isInjectable && <span className="text-xs text-slate-400 ml-1">/unit</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base</p>
                        <p className="text-sm font-medium text-slate-400 line-through">
                          {formatCurrency(service.basePrice)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/checkout/${service.id}`)}
                      className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all group-hover:shadow-lg group-hover:shadow-emerald-200"
                    >
                      Book Treatment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      </div>
    </main>
  </AppLayout>
);
};

export default Catalog;
