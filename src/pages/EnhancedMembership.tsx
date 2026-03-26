import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { addMonthlyCredits } from "../services/membershipService";
import { trackViewMembership, trackBeginCheckout } from "../services/analyticsService";
import { membershipTiers, realStats, realReviews, practiceInfo } from "../data/practiceData";
import { MEMBERSHIP_PLANS } from "../data/skinBank";
import {
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Star,
  ArrowRight,
  CheckCircle2,
  Crown,
  Zap,
  Heart,
  Shield,
  Calendar,
  Gift,
  Phone
} from "lucide-react";
import { Button, Card, Badge, Section } from "../components/ui";

const EnhancedMembership: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<any[]>(membershipTiers);
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  useEffect(() => {
    trackViewMembership();
  }, []);

  const getTierFeatures = (tierId: "core" | "evolve" | "transform", beautyBankAmount: number): string[] => {
    if (tierId === "core") {
      return [
        "Botox from $12/unit (reg. $15)",
        "$99 monthly Beauty Bank value",
        "10% off chemical peels & skincare",
        "Laser Hair Removal from $135/session",
      ];
    } else if (tierId === "evolve") {
      return [
        "Botox from $10/unit (reg. $15)",
        "$150 monthly Beauty Bank value",
        "Save $75/syringe on fillers",
        "Save $75 on RF Microneedling",
        "Save $40 on HydraFacial",
      ];
    } else {
      return [
        "Botox from $9/unit (reg. $15)",
        "$250 monthly Beauty Bank value",
        "Save $150/syringe on fillers",
        "Save $200 on RF Microneedling",
        "Save $90 on chemical peels",
      ];
    }
  };

  const handleJoin = (tier: any) => {
    const tierId = (tier.id ?? tier.name ?? "evolve").toLowerCase();
    const billing = isAnnual ? "annual" : "monthly";
    trackBeginCheckout(tierId, tier.price ?? tier.monthlyPrice ?? 0);
    navigate(`/checkout?tier=${tierId}&billing=${billing}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full mx-auto animate-spin" />
          <p className="text-gray-500 text-sm">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-0 pb-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* 1. HERO SECTION */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block bg-violet-50 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full border border-violet-100">
            Premium Medical Aesthetics
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Unlock Your Best Self with{" "}
            <span className="text-violet-600">Premium Care</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Join thousands who've discovered the confidence that comes from looking and feeling your absolute best.
            Our membership program puts premium aesthetic treatments within reach.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 p-2 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-sm mx-auto">
            <button
              type="button"
              className={`px-5 py-2 text-sm font-semibold transition-all rounded-xl ${
                !isAnnual ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full p-0.5 flex items-center transition-all ${
                isAnnual ? 'bg-violet-600' : 'bg-gray-200'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`px-5 py-2 text-sm font-semibold transition-all rounded-xl ${
                  isAnnual ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annual
              </button>
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-100">
                Save 15%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF - Stats */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Join 3,250+ Happy Patients
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Real patients. Real results. See what our community says about their experience at Reflect Medical.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { number: "3,250+", label: "Patients Served", icon: Users },
              { number: "4.9/5", label: "Average Rating", icon: Star },
              { number: "195+", label: "Google Reviews", icon: Heart },
              { number: "8+", label: "Years in Business", icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center"
              >
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Customer Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realReviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 italic flex-grow">"{review.text}"</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">{review.treatment}</span>
                  <span className="bg-violet-50 text-violet-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-violet-100">{review.source}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MEMBERSHIP PLANS */}
      <section id="membership-tiers" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Choose Your Membership
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every membership includes exclusive member pricing and Monthly Beauty Bank toward any treatment.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 gap-1">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  !isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Annual
                <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  Save 15%
                </span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {MEMBERSHIP_PLANS.map((tierPlan, index) => {
              const tierId = tierPlan.id;
              const tierFeatures = getTierFeatures(tierId, tierPlan.monthlyCredits);
              const isCurrent = profile?.membershipTierId === tierId;
              const displayPrice = isAnnual ? Math.round(tierPlan.monthlyPrice * 0.85) : tierPlan.monthlyPrice;
              const annualTotal = Math.round(tierPlan.monthlyPrice * 12 * 0.85);
              const isFeatured = tierPlan.highlighted ?? false;
              const badge = tierId === "evolve" ? "Most Popular" : tierId === "transform" ? "Premium" : null;

              return (
                <motion.div
                  key={tierId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  whileHover={{ y: -2 }}
                  className={`bg-white rounded-2xl p-6 flex flex-col ${
                    isFeatured
                      ? "border border-violet-300 shadow-md"
                      : "border border-gray-200 shadow-sm"
                  }`}
                >
                  {/* Badge row */}
                  <div className="h-7 mb-4 flex items-center">
                    {badge && (
                      <span className="bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full border border-violet-100">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                    {tierId === "core" && <Shield className="w-5 h-5 text-violet-600" />}
                    {tierId === "evolve" && <Sparkles className="w-5 h-5 text-violet-600" />}
                    {tierId === "transform" && <Crown className="w-5 h-5 text-violet-600" />}
                  </div>

                  {/* Tier name */}
                  <h3 className="text-lg font-bold text-gray-900">{tierPlan.name}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mt-1 mb-5">{tierPlan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-black text-gray-900">${displayPrice}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>

                  {/* Annual savings note */}
                  <div className="h-5 mb-5">
                    {isAnnual && (
                      <p className="text-xs text-violet-600 font-medium">
                        Billed ${annualTotal}/year — save ${tierPlan.monthlyPrice * 12 - annualTotal}
                      </p>
                    )}
                  </div>

                  {/* Beauty Bank box */}
                  <div className="bg-violet-50 rounded-xl p-4 text-center mb-5">
                    <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">Monthly Beauty Bank</p>
                    <p className="text-2xl font-black text-violet-700">${tierPlan.monthlyCredits}</p>
                    <p className="text-xs text-gray-500">in treatment value · rolls over</p>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-100 mb-5" />

                  {/* Feature list */}
                  <ul className="space-y-3 flex-grow mb-6">
                    {tierFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="text-violet-500 w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleJoin({ ...tierPlan })}
                    disabled={isCurrent}
                    className={`w-full rounded-xl py-3 font-semibold text-sm transition-colors ${
                      isCurrent
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    {isCurrent
                      ? "Current Plan"
                      : tierId === "core"
                      ? "Get Started"
                      : tierId === "evolve"
                      ? "Choose Evolve"
                      : "Go Premium"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Journey to Radiance</h2>
            <p className="text-gray-500">Getting started is simple. Seamless from membership to transformation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Choose Your Plan", description: "Select the membership tier that fits your goals and budget. Every plan includes Beauty Bank rewards.", icon: CheckCircle2 },
              { step: "2", title: "Book Consultation", description: "Schedule your complimentary consultation. We'll create your personalized treatment roadmap.", icon: Calendar },
              { step: "3", title: "Start Your Journey", description: "Begin treatments immediately using your Beauty Bank. Watch your confidence transform.", icon: Star }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center relative"
              >
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BENEFITS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Members Choose Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Beyond the treatments, you're investing in a complete wellness experience designed for lasting confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Gift, title: "Beauty Bank Rewards", description: "Every membership dollar becomes treatment credit. It's not a fee — it's your money working for you.", highlight: "100% Value Return" },
              { icon: Shield, title: "Member-Only Pricing", description: "Save 10–25% on all treatments and products. Most members save more than their membership cost monthly.", highlight: "Up to 25% Off" },
              { icon: Calendar, title: "Priority Booking", description: "Skip the wait lists. Members get first access to appointments, new treatments, and exclusive events.", highlight: "VIP Access" },
              { icon: Users, title: "Personal Care Team", description: "Work with the same dedicated aestheticians who understand your goals and track your progress.", highlight: "Consistent Care" },
              { icon: TrendingUp, title: "Progress Tracking", description: "Regular skin analysis and progress photos help optimize your treatments for maximum results.", highlight: "Proven Results" },
              { icon: Heart, title: "Confidence Guarantee", description: "If you're not completely satisfied within 60 days, we'll work with you to make it right.", highlight: "60-Day Guarantee" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-violet-200 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="text-base font-semibold text-gray-900">{benefit.title}</h3>
                  <span className="bg-violet-50 text-violet-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-violet-100 whitespace-nowrap flex-shrink-0">{benefit.highlight}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions & Answers</h2>
            <p className="text-gray-500">Everything you need to know about membership</p>
          </div>

          <div className="space-y-4">
            {[
              { question: "Is this really a good value compared to paying per treatment?", answer: "Absolutely. Most members save $200–500+ monthly through member pricing alone, plus your Beauty Bank gives you 100% credit value. If you're getting any treatments regularly, membership pays for itself immediately." },
              { question: "What happens if I want to cancel my membership?", answer: "No problem. You can cancel anytime with 30 days notice. You'll retain member benefits through your final billing cycle, and any unused Beauty Bank balance remains available for 90 days after cancellation." },
              { question: "Can I use Beauty Bank for any treatment or product?", answer: "Yes! Beauty Bank works like cash for any service or product we offer. There are no restrictions or blackout dates. Use it however best serves your wellness goals." },
              { question: "How quickly will I see results?", answer: "Many clients notice improvements after their first treatment, with optimal results developing over 2–4 sessions. Your personal care team will set realistic expectations during your consultation." },
              { question: "Are there any hidden fees or long-term contracts?", answer: "Never. The monthly price you see is exactly what you pay. No setup fees, no cancellation penalties, no contracts. Just month-to-month flexibility with premium care." }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-violet-200 hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-16">
        <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-12 text-center text-white">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/30 mb-6">
            Begin Your Journey
          </span>

          <h2 className="text-3xl font-bold mb-4">
            Experience Premium Medical Aesthetics
          </h2>

          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Join over 3,200 members who've discovered the confidence that comes from looking and feeling their absolute best.
            <span className="font-semibold text-white"> Your transformation starts with one call.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => window.location.href = `tel:${practiceInfo.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call {practiceInfo.phone}
            </button>

            <button
              onClick={() => {
                const membershipSection = document.querySelector('#membership-tiers');
                membershipSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Choose Your Plan
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-white/60 text-sm">
            Free consultation · No setup fees · Cancel anytime
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default EnhancedMembership;
