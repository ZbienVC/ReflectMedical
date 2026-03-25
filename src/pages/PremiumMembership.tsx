import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { addMonthlyCredits } from "../services/membershipService";

const PremiumMembership: React.FC = () => {
  const { profile, user } = useAuth();
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "membershipTiers")).then((snap) => {
      setTiers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as MembershipTier)));
      setLoading(false);
    });
  }, []);

  const handleJoin = async (tier: MembershipTier) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        membershipTierId: tier.id,
        status: "active"
      });
      
      await addMonthlyCredits(user.uid, tier);
      alert(`Welcome to the ${tier.name} membership!`);
    } catch (error) {
      console.error("Error joining membership:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-on-surface-variant font-label">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Premium Glass Header */}
      <header className="fixed top-0 w-full z-50 glass-effect border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-headline font-bold tracking-tight text-primary">
              Reflect Medical
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-headline tracking-tight font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Treatments
            </a>
            <a className="font-headline tracking-tight font-semibold text-primary font-bold" href="#">
              Memberships
            </a>
            <a className="font-headline tracking-tight font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Locations
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-secondary">notifications</span>
            </button>
            <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-outline-variant/20 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-secondary">account_circle</span>
              <span className="text-sm font-medium">Sign In</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section - Premium Health-Tech Aesthetic */}
        <section className="text-center mb-16 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-secondary uppercase bg-secondary-fixed/30 px-4 py-1.5 rounded-full">
            Elevate Your Ritual
          </span>
          
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-primary max-w-4xl mx-auto leading-[1.1]">
            Your Journey to{" "}
            <span className="text-secondary italic font-headline">Radiance</span>{" "}
            Starts Here.
          </h1>
          
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Join our exclusive community and unlock tiered benefits designed to maintain your natural aesthetic with clinical precision and concierge care.
          </p>

          {/* Premium Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <span className={`text-sm font-semibold transition-colors ${!isAnnual ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              Monthly
            </span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full p-1 flex items-center transition-colors ${isAnnual ? 'bg-primary-container' : 'bg-surface-container'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-premium transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-primary' : 'text-on-surface-variant'}`}>
                Annual
              </span>
              <span className="text-[10px] font-black bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full tracking-wider uppercase">
                Save 15%
              </span>
            </div>
          </div>
        </section>

        {/* Premium Membership Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
          {tiers.map((tier, index) => {
            const isCurrent = profile?.membershipTierId === tier.id;
            const isPopular = tier.name === "Evolve";
            const annualPrice = isAnnual ? tier.monthlyPrice * 12 * 0.85 : tier.monthlyPrice;
            const displayPrice = isAnnual ? annualPrice / 12 : annualPrice;

            return (
              <div
                key={tier.id}
                className={`relative rounded-6xl p-8 space-y-8 transition-all duration-500 group ${
                  isPopular 
                    ? "bg-surface-container-lowest shadow-ambient border-2 border-primary-fixed scale-105 z-10 overflow-hidden" 
                    : "bg-surface-container-low border border-transparent hover:border-outline-variant/20"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-clinical-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-2xl">
                    Most Popular
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className={`font-headline font-bold tracking-tight text-primary ${isPopular ? 'text-3xl' : 'text-2xl'}`}>
                    {tier.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {tier.name === 'Core' && 'Essential maintenance for lasting glow.'}
                    {tier.name === 'Evolve' && 'Enhanced rejuvenation and expert care.'}
                    {tier.name === 'Transform' && 'The ultimate aesthetic concierge experience.'}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className={`font-headline font-black tracking-tighter text-primary ${isPopular ? 'text-5xl' : 'text-4xl'}`}>
                    {formatCurrency(displayPrice)}
                  </span>
                  <span className="text-on-surface-variant text-sm">
                    /{isAnnual ? 'month' : 'month'}
                  </span>
                </div>

                {/* Beauty Bucks Display */}
                <div className="pt-6 border-t border-outline-variant/10 space-y-4">
                  <div className={`flex items-center gap-4 rounded-2xl p-4 ${
                    isPopular 
                      ? "bg-primary-fixed/20" 
                      : "bg-surface-container-lowest shadow-sm"
                  }`}>
                    <div className={`rounded-full flex items-center justify-center shadow-lg ${
                      isPopular 
                        ? "w-10 h-10 bg-primary" 
                        : "w-8 h-8 bg-surface-container-lowest"
                    }`}>
                      <span className={`material-symbols-outlined ${
                        isPopular 
                          ? "text-white" 
                          : "text-secondary"
                      }`}>
                        {isPopular ? "auto_awesome" : "payments"}
                      </span>
                    </div>
                    <div>
                      <p className={`font-black uppercase tracking-[0.2em] ${
                        isPopular 
                          ? "text-[10px] text-primary" 
                          : "text-xs text-on-surface-variant"
                      }`}>
                        Beauty Bucks
                      </p>
                      <p className={`font-bold ${
                        isPopular 
                          ? "text-lg text-primary" 
                          : "text-sm text-on-surface"
                      }`}>
                        {formatCurrency(tier.monthlyCredits)} Monthly Credit
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefits List */}
                <ul className="space-y-5 pt-4">
                  <BenefitItem 
                    icon={isPopular ? "verified" : "check_circle"}
                    filled={isPopular}
                    primary={`Botox: ${formatCurrency(tier.toxinDiscountBotox)}/unit`}
                    secondary={tier.name === 'Evolve' ? "(Best Value)" : `(Reg. ${formatCurrency(15)})`}
                    isHighlight={isPopular}
                  />
                  <BenefitItem 
                    icon={isPopular ? "verified" : "check_circle"}
                    filled={isPopular}
                    primary={`${tier.fillerDiscountPercent}% Off All Skincare & Fillers`}
                    isHighlight={isPopular}
                  />
                  {tier.name === 'Core' && (
                    <BenefitItem 
                      icon="check_circle"
                      primary="Priority Booking Window"
                    />
                  )}
                  {tier.name === 'Evolve' && (
                    <>
                      <BenefitItem 
                        icon="verified"
                        filled
                        primary="Complimentary Monthly B12 Shot"
                        isHighlight
                      />
                      <BenefitItem 
                        icon="verified"
                        filled
                        primary="Early Access to Seasonal Events"
                        isHighlight
                      />
                    </>
                  )}
                  {tier.name === 'Transform' && (
                    <>
                      <BenefitItem 
                        icon="check_circle"
                        primary="20% Off All Medical Services"
                      />
                      <BenefitItem 
                        icon="check_circle"
                        primary="Unlimited Hydrafacial Upgrades"
                      />
                      <BenefitItem 
                        icon="check_circle"
                        primary="VIP Concierge Support Line"
                      />
                    </>
                  )}
                </ul>

                {/* Premium CTA Button */}
                <button
                  onClick={() => handleJoin(tier)}
                  disabled={isCurrent}
                  className={`w-full py-5 rounded-2xl font-bold tracking-tight transition-all ${
                    isCurrent 
                      ? "bg-surface-container text-on-surface-variant cursor-default" 
                      : isPopular 
                        ? "bg-clinical-gradient text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 inner-glow" 
                        : "bg-surface-container-high text-primary hover:bg-surface-container-highest"
                  }`}
                >
                  {isCurrent 
                    ? "Current Plan" 
                    : isPopular 
                      ? "Select Evolve Plan"
                      : tier.name === 'Core'
                        ? "Get Started"
                        : "Go Transform"
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Bento Grid */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-secondary/5 rounded-6xl p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-headline font-bold tracking-tight text-primary">
                Beauty Bucks: Your Digital Wellness Currency
              </h2>
              <p className="text-on-surface-variant max-w-sm">
                Every dollar spent on your membership is returned as credit for any treatment or product in our center. It's not a fee; it's a deposit in your future self.
              </p>
            </div>
            <div className="mt-8 flex gap-4 overflow-hidden">
              <div className="w-24 h-24 rounded-2xl bg-surface-container-lowest shadow-premium flex items-center justify-center -rotate-6 border border-primary-fixed/30">
                <span className="material-symbols-outlined text-4xl text-primary">currency_exchange</span>
              </div>
              <div className="w-24 h-24 rounded-2xl bg-clinical-gradient text-white shadow-premium flex items-center justify-center rotate-3 translate-y-4">
                <span className="material-symbols-outlined text-4xl">stars</span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-50"></div>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-6xl space-y-4 border border-outline-variant/10 shadow-sm">
              <span className="material-symbols-outlined text-secondary text-3xl">event_available</span>
              <h4 className="font-headline font-bold text-primary">Priority Access</h4>
              <p className="text-sm text-on-surface-variant">
                Skip the waitlist with 48-hour early booking for all new product launches and seasonal specials.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-6xl space-y-4 border border-outline-variant/10 shadow-sm">
              <span className="material-symbols-outlined text-secondary text-3xl">medical_information</span>
              <h4 className="font-headline font-bold text-primary">Custom Care Plans</h4>
              <p className="text-sm text-on-surface-variant">
                Annual 3D skin analysis and 1-on-1 aesthetic mapping with our board-certified practitioners.
              </p>
            </div>
          </div>
        </section>

        {/* The Reflect Path */}
        <section className="mt-32 text-center">
          <h2 className="text-4xl font-headline font-black text-primary tracking-tight mb-16">
            The Reflect Path
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent z-0"></div>
            
            {[
              { step: "01", title: "Select Your Tier", desc: "Choose the membership that aligns with your aesthetic goals and lifestyle." },
              { step: "02", title: "Clinical Consultation", desc: "Visit us for a digital skin analysis and personalized treatment roadmap." },
              { step: "03", title: "Begin Transformation", desc: "Use your Beauty Bucks to start your restorative treatments immediately." }
            ].map((item, index) => (
              <div key={index} className="relative z-10 space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border ${
                  index === 1 
                    ? "bg-primary shadow-premium" 
                    : "bg-surface-container-lowest shadow-premium border-primary-fixed/20"
                }`}>
                  <span className={`text-xl font-headline font-black ${
                    index === 1 ? "text-white" : "text-primary"
                  }`}>
                    {item.step}
                  </span>
                </div>
                <h4 className="font-headline font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-on-surface-variant px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Premium Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 glass-effect border-t border-outline-variant/10 shadow-premium z-50">
        {[
          { icon: "home", label: "Home", active: false },
          { icon: "grid_view", label: "Catalog", active: true },
          { icon: "payments", label: "Wallet", active: false },
          { icon: "calendar_today", label: "Visits", active: false }
        ].map((item, index) => (
          <div key={index} className={`flex flex-col items-center justify-center ${
            item.active 
              ? "bg-primary text-white rounded-full w-14 h-14 -mt-6 shadow-premium" 
              : "text-on-surface-variant"
          }`}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label text-[10px] uppercase font-bold tracking-tighter">
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
};

const BenefitItem: React.FC<{
  icon: string;
  filled?: boolean;
  primary: string;
  secondary?: string;
  isHighlight?: boolean;
}> = ({ icon, filled, primary, secondary, isHighlight }) => (
  <li className={`flex items-center gap-3 text-sm ${isHighlight ? 'text-on-surface' : 'text-on-surface-variant'}`}>
    <span 
      className={`material-symbols-outlined text-primary ${isHighlight ? 'text-xl' : 'text-lg'}`}
      style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
    >
      {icon}
    </span>
    <span>
      {primary}{" "}
      {secondary && (
        <span className="text-xs opacity-60">{secondary}</span>
      )}
    </span>
  </li>
);

export default PremiumMembership;