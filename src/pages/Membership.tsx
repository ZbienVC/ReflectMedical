import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { getMembershipTiers, updateMembership } from "../services/membershipService";
import { addMonthlyCredits } from "../services/membershipService";

const Membership: React.FC = () => {
  const { profile, user } = useAuth();
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembershipTiers().then((t) => {
      setTiers(t);
      setLoading(false);
    });
  }, []);

  const handleJoin = async (tier: MembershipTier) => {
    if (!user) return;
    
    try {
      await updateMembership(user.uid, tier.id);
      
      // Initial credit allocation
      await addMonthlyCredits(user.uid, tier);
      
      alert(`Welcome to the ${tier.name} membership!`);
    } catch (error) {
      console.error("Error joining membership:", error);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading tiers...</div>;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Elevate Your Aesthetic Journey</h1>
        <p className="text-slate-600 text-lg">
          Join a Reflect membership to unlock exclusive pricing, monthly Beauty Bucks, and a personalized treatment plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => {
          const isCurrent = profile?.membershipTierId === tier.id;
          const isPopular = tier.name === "Evolve";

          return (
            <div
              key={tier.id}
              className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 ${
                isPopular ? "border-emerald-500 shadow-xl shadow-emerald-100 scale-105 z-10" : "border-slate-100 shadow-sm"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  tier.name === "Core" ? "bg-slate-100 text-slate-600" : 
                  tier.name === "Evolve" ? "bg-emerald-100 text-emerald-600" : 
                  "bg-amber-100 text-amber-600"
                }`}>
                  {tier.name === "Core" ? <Zap className="w-6 h-6" /> : 
                   tier.name === "Evolve" ? <Sparkles className="w-6 h-6" /> : 
                   <Crown className="w-6 h-6" />}
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">{tier.name}</h2>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-serif font-bold text-slate-900">{formatCurrency(tier.monthlyPrice)}</span>
                  <span className="text-slate-400 font-medium">/mo</span>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <BenefitItem label={`${formatCurrency(tier.monthlyCredits)} Beauty Bucks`} sub="Added to your wallet monthly" />
                <BenefitItem label={`${formatCurrency(tier.toxinDiscountBotox)}/unit Botox`} sub={`Save ${formatCurrency(14 - tier.toxinDiscountBotox)} per unit`} />
                <BenefitItem label={`${tier.fillerDiscountPercent}% off Fillers`} sub="All premium dermal fillers" />
                <BenefitItem label={`${tier.deviceDiscountPercent}% off Devices`} sub="Laser, RF, and Microneedling" />
                <BenefitItem label={`${tier.retailDiscountPercent}% off Retail`} sub="Medical-grade skincare" />
              </div>

              <button
                onClick={() => handleJoin(tier)}
                disabled={isCurrent}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  isCurrent 
                    ? "bg-slate-100 text-slate-400 cursor-default" 
                    : isPopular 
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200" 
                      : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {isCurrent ? "Current Plan" : profile?.membershipTierId ? "Switch to Plan" : "Join Now"}
              </button>
            </div>
          );
        })}
      </div>

      <section className="bg-slate-900 text-white rounded-[3rem] p-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6">How Beauty Bucks Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-serif font-bold text-emerald-400 mb-2">1. Credit</div>
              <p className="text-sm text-slate-400">Monthly credits are added automatically to your digital wallet.</p>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-emerald-400 mb-2">2. Save</div>
              <p className="text-sm text-slate-400">Your credits never expire as long as your membership is active.</p>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-emerald-400 mb-2">3. Spend</div>
              <p className="text-sm text-slate-400">Apply your balance to any treatment or product during checkout.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const BenefitItem = ({ label, sub }: { label: string; sub: string }) => (
  <div className="flex gap-3">
    <div className="mt-1 w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3 text-emerald-600" />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="text-xs text-slate-400 font-medium">{sub}</p>
    </div>
  </div>
);

export default Membership;
