import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Service, MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { calculateDiscountedPrice, processTransaction } from "../services/membershipService";
import { ShoppingCart, Sparkles, CreditCard, Wallet, ArrowLeft, CheckCircle2 } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";

const Checkout: React.FC = () => {
  const { serviceId } = useParams();
  const { profile, user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [tier, setTier] = useState<MembershipTier | null>(null);
  const [units, setUnits] = useState(1);
  const [useBucks, setUseBucks] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (serviceId) {
      getDoc(doc(db, "services", serviceId)).then((snap) => {
        if (snap.exists()) setService({ id: snap.id, ...snap.data() } as Service);
      });
    }
    if (profile?.membershipTierId) {
      getDoc(doc(db, "membershipTiers", profile.membershipTierId)).then((snap) => {
        if (snap.exists()) setTier(snap.data() as MembershipTier);
      });
    }
  }, [serviceId, profile]);

  if (!service) return (
    <AppLayout>
      <main className="pt-6">
        <div className="py-20 text-center text-slate-400">Loading checkout...</div>
      </main>
    </AppLayout>
  );

  const isInjectable = service.category === "injectable";
  const { discountedPrice, savings } = calculateDiscountedPrice(service, tier, units);
  const maxBucksToUse = Math.min(profile?.beautyBucksBalance || 0, discountedPrice);
  const bucksToApply = useBucks ? maxBucksToUse : 0;
  const finalTotal = discountedPrice - bucksToApply;

  const handleCheckout = async () => {
    if (!user || !service) return;
    setProcessing(true);
    try {
      await processTransaction(user.uid, service, tier, bucksToApply, units);
      setSuccess(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <AppLayout>
        <main className="pt-6">
          <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="text-emerald-600 w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Treatment Booked!</h1>
        <p className="text-slate-600 mb-8">
          Your appointment for {service.name} has been confirmed. Your savings have been applied to your dashboard.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
        >
          Return to Dashboard
        </button>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="pt-6">
        <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Treatment Details</h2>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{service.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-serif font-bold text-slate-900">{formatCurrency(service.basePrice)}</p>
                <p className="text-xs text-slate-400 font-medium">Base Price</p>
              </div>
            </div>

            {isInjectable && (
              <div className="mt-8 space-y-4">
                <label className="text-sm font-bold text-slate-900">Number of Units</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    value={units}
                    onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-slate-400 font-medium">Units of {service.name}</span>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Payment Method</h2>
            <div className="space-y-4">
              <div 
                onClick={() => setUseBucks(!useBucks)}
                className={`flex items-center justify-between p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                  useBucks ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${useBucks ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Beauty Bucks Wallet</p>
                    <p className="text-xs text-slate-400 font-medium">Available: {formatCurrency(profile?.beautyBucksBalance || 0)}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${useBucks ? "border-emerald-500 bg-emerald-500" : "border-slate-200"}`}>
                  {useBucks && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 bg-white opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Credit Card</p>
                    <p className="text-xs text-slate-400 font-medium">Ending in 4242</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 sticky top-24">
            <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({units} units)</span>
                <span>{formatCurrency(service.basePrice * units)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Member Discount</span>
                <span>-{formatCurrency(savings)}</span>
              </div>
              {useBucks && bucksToApply > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Beauty Bucks Applied</span>
                  <span>-{formatCurrency(bucksToApply)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-1">Total Due</p>
                  <p className="text-3xl font-serif font-bold">{formatCurrency(finalTotal)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full mt-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-950/20 disabled:opacity-50"
            >
              {processing ? "Processing..." : "Confirm Booking"}
            </button>
            
            <p className="text-[10px] text-slate-500 text-center mt-4 font-bold uppercase tracking-widest">
              Secure Medical Checkout
            </p>
          </section>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-bold text-emerald-900">Membership Value</p>
            </div>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              By booking as a {tier?.name || "Guest"}, you are saving {formatCurrency(savings)} on this treatment.
            </p>
          </div>
        </div>
      </div>
      </div>
    </main>
  </AppLayout>
);
};

export default Checkout;
