import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { addMonthlyCredits } from "../services/membershipService";
import { membershipTiers, realStats, realReviews, practiceInfo } from "../data/practiceData";
import { MEMBERSHIP_PLANS } from "../data/beautyBank";
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
  const [tiers, setTiers] = useState<any[]>(membershipTiers);
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Derive dynamic benefits from beautyBank data

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
    const message = `I'm interested in joining the ${tier.name} membership tier at $${tier.monthlyPrice}/month. Can you help me get started?`;
    const phoneUrl = `tel:${practiceInfo.phone}`;

    if (window.confirm(`Ready to join the ${tier.name} membership?\n\nClick OK to call ${practiceInfo.phone} and speak with our membership team.`)) {
      window.location.href = phoneUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/5 flex items-center justify-center">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-on-surface-variant font-label text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Crafting your premium experience...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background System */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F6FB] via-white to-[#B57EDC]/5" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-[#B57EDC]/10 to-[#9F6BCB]/10 rounded-full blur-2xl" />
          <div className="absolute top-60 right-10 w-32 h-32 bg-gradient-to-br from-[#B57EDC]/8 to-[#9F6BCB]/8 rounded-full blur-xl" />
          <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-gradient-to-br from-[#B57EDC]/6 to-[#9F6BCB]/6 rounded-full blur-2xl" />
        </motion.div>
      </div>

      <main className="relative z-10">
        {/* 1. HERO SECTION - Emotional Hook */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="space-y-6"
            >
              <Badge variant="success" size="lg" className="font-bold shadow-lg px-6 py-2 bg-[#B57EDC]/10 text-[#B57EDC] border border-[#B57EDC]/20">
                Premium Medical Aesthetics
              </Badge>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1F2937] leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
              >
                Unlock Your Best Self with{" "}
                <span className="text-[#B57EDC]">Premium Care</span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              >
                Join thousands who've discovered the confidence that comes from looking and feeling your absolute best.
                Our membership program puts premium aesthetic treatments within reach.
              </motion.p>

              {/* Pricing Toggle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-soft max-w-lg mx-auto"
              >
                <button
                  type="button"
                  className={`px-4 py-2 text-base font-semibold transition-all duration-200 ease-in-out rounded-xl ${
                    !isAnnual ? 'text-[#B57EDC] bg-white shadow-lg' : 'text-[#6B7280] hover:bg-gray-50'
                  }`}
                  onClick={() => setIsAnnual(false)}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-16 h-8 rounded-full p-1 flex items-center transition-all duration-200 shadow-lg ${
                    isAnnual ? 'bg-[#B57EDC]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                    isAnnual ? 'translate-x-8' : 'translate-x-0'
                  }`} />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`px-4 py-2 text-base font-semibold transition-all duration-200 rounded-xl ${
                      isAnnual ? 'text-[#B57EDC] bg-white shadow-lg' : 'text-[#6B7280] hover:bg-gray-50'
                    }`}
                    onClick={() => setIsAnnual(true)}
                  >
                    Annual
                  </button>
                  <Badge variant="premium" size="sm" className="tracking-wider uppercase bg-[#B57EDC] text-white shadow-lg">
                    Save 15%
                  </Badge>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. SOCIAL PROOF - Stats & Reviews */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" size="md" className="mb-6 border-[#B57EDC]/20 text-[#B57EDC]">
                Trusted by Thousands
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
                Join 3,200+ Happy Members
              </h2>
              <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
                Thousands of people have discovered the confidence that comes from premium aesthetic care and proven results
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { number: "3,200+", label: "Active Members", icon: Users },
                { number: "98%", label: "Satisfaction Rate", icon: Heart },
                { number: "15,000+", label: "Treatments Completed", icon: TrendingUp },
                { number: "4.9/5", label: "Average Rating", icon: Star }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1, ease: "easeInOut" }}
                >
                  <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-all duration-200 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-black/5">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1F2937] mb-2">{stat.number}</h3>
                    <p className="text-[#6B7280] text-sm">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Customer Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  rating: 5,
                  text: "The Evolve tier has been incredible! My confidence has never been higher, and the credits make every treatment feel like an investment that pays for itself.",
                  treatment: "HydraFacial",
                  tier: "Evolve",
                  image: "SJ"
                },
                {
                  name: "Michael Chen",
                  rating: 5,
                  text: "I love the priority booking and member pricing. I've saved over $300 this month alone, and the results speak for themselves.",
                  treatment: "Botox",
                  tier: "Transform",
                  image: "MC"
                },
                {
                  name: "Jessica Martinez",
                  rating: 5,
                  text: "Best decision I've made for myself! The personal care team knows exactly what I need, and I never feel like just another patient.",
                  treatment: "Laser Resurfacing",
                  tier: "Core",
                  image: "JM"
                }
              ].map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1, ease: "easeInOut" }}
                >
                  <Card variant="elevated" padding="lg" hover className="h-full group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-black/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                        {review.image}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1F2937]">{review.name}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[#B57EDC] fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#6B7280] italic leading-relaxed mb-4">"{review.text}"</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" size="sm" className="border-[#B57EDC]/20 text-[#6B7280]">{review.treatment}</Badge>
                      <Badge variant="success" size="sm" className="bg-[#B57EDC]/10 text-[#B57EDC]">{review.tier} Member</Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. MEMBERSHIP PLANS - Decision Point */}
        <section id="membership-tiers" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Choose Your Membership
              </h2>
              <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Every membership includes exclusive member pricing and Monthly Beauty Bank toward any treatment.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    !isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
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
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: "easeOut" }}
                    whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(124,58,237,0.12)" }}
                    className={`bg-white rounded-2xl p-6 flex flex-col ${
                      isFeatured
                        ? "border border-violet-300 shadow-md"
                        : "border border-gray-200 shadow-sm"
                    }`}
                  >
                    {/* 1. Badge row */}
                    <div className="h-7 mb-4 flex items-center">
                      {badge && (
                        <span className="bg-violet-600 text-white rounded-full text-xs px-3 py-1 font-semibold">
                          {badge}
                        </span>
                      )}
                    </div>

                    {/* 2. Icon */}
                    <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
                      {tierId === "core" && <Shield className="w-6 h-6 text-violet-600" />}
                      {tierId === "evolve" && <Sparkles className="w-6 h-6 text-violet-600" />}
                      {tierId === "transform" && <Crown className="w-6 h-6 text-violet-600" />}
                    </div>

                    {/* 3. Tier name */}
                    <h3 className="text-xl font-bold text-gray-900">{tierPlan.name}</h3>

                    {/* 4. Description */}
                    <p className="text-sm text-gray-500 mt-1 mb-5">{tierPlan.description}</p>

                    {/* 5. Price */}
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-black text-gray-900">${displayPrice}</span>
                      <span className="text-base font-normal text-gray-500">/month</span>
                    </div>

                    {/* 6. Annual savings note */}
                    <div className="h-5 mb-5">
                      {isAnnual && (
                        <p className="text-xs text-violet-600 font-medium">
                          Billed ${annualTotal}/year - you save ${tierPlan.monthlyPrice * 12 - annualTotal}
                        </p>
                      )}
                    </div>

                    {/* 7. Beauty Bank box */}
                    <div className="bg-violet-50 rounded-xl p-4 text-center mb-5">
                      <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">Monthly Beauty Bank</p>
                      <p className="text-2xl font-black text-violet-700">${tierPlan.monthlyCredits}</p>
                      <p className="text-xs text-gray-500">in treatment value · rolls over</p>
                    </div>

                    {/* 8. Divider */}
                    <hr className="border-gray-100 mb-5" />

                    {/* 9. Feature list */}
                    <ul className="space-y-3 flex-grow mb-6">
                      {tierFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="text-violet-500 w-4 h-4 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* 10. CTA Button */}
                    <button
                      type="button"
                      onClick={() => handleJoin({ ...tierPlan, monthlyPrice: tierPlan.monthlyPrice })}
                      disabled={isCurrent}
                      className={`w-full rounded-xl py-3 font-semibold text-sm transition-all duration-200 ${
                        isCurrent
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isFeatured
                          ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
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

        {/* 4. HOW IT WORKS - Process Clarity */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeInOut" }}
              className="text-center mb-12"
            >
              <Badge variant="outline" size="md" className="mb-6 border-[#B57EDC]/20 text-[#B57EDC]">
                Simple Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
                Your Journey to Radiance
              </h2>
              <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                Getting started is simple. We've designed a seamless experience from membership to transformation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#B57EDC] via-[#9F6BCB] to-[#B57EDC] opacity-30" />

              {[
                {
                  step: "1",
                  title: "Choose Your Plan",
                  description: "Select the membership tier that fits your goals and budget. Every plan includes Beauty Bank rewards.",
                  icon: CheckCircle2,
                  color: "bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB]"
                },
                {
                  step: "2",
                  title: "Book Consultation",
                  description: "Schedule your complimentary consultation. We'll create your personalized treatment roadmap.",
                  icon: Calendar,
                  color: "bg-gradient-to-br from-[#1F2937] to-gray-800"
                },
                {
                  step: "3",
                  title: "Start Your Journey",
                  description: "Begin treatments immediately using your Beauty Bank. Watch your confidence transform.",
                  icon: Star,
                  color: "bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB]"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2, ease: "easeInOut" }}
                >
                  <Card variant="default" padding="lg" className="text-center h-full relative group hover:scale-105 transition-all duration-200 bg-white rounded-2xl shadow-lg border border-black/5">
                    <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-black/5 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-[#B57EDC]">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1F2937] mb-3">{step.title}</h3>
                    <p className="text-[#6B7280] leading-relaxed">{step.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BENEFITS - Reinforcement */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8, ease: "easeInOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
                Why Members Choose Us
              </h2>
              <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
                Beyond the treatments, you're investing in a complete wellness experience designed for lasting confidence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Gift,
                  title: "Beauty Bank Rewards",
                  description: "Every membership dollar becomes treatment credit. It's not a fee-it's your money working for you.",
                  highlight: "100% Value Return"
                },
                {
                  icon: Shield,
                  title: "Member-Only Pricing",
                  description: "Save 10-25% on all treatments and products. Most members save more than their membership cost monthly.",
                  highlight: "Up to 25% Off"
                },
                {
                  icon: Calendar,
                  title: "Priority Booking",
                  description: "Skip the wait lists. Members get first access to appointments, new treatments, and exclusive events.",
                  highlight: "VIP Access"
                },
                {
                  icon: Users,
                  title: "Personal Care Team",
                  description: "Work with the same dedicated aestheticians who understand your goals and track your progress.",
                  highlight: "Consistent Care"
                },
                {
                  icon: TrendingUp,
                  title: "Progress Tracking",
                  description: "Regular skin analysis and progress photos help optimize your treatments for maximum results.",
                  highlight: "Proven Results"
                },
                {
                  icon: Heart,
                  title: "Confidence Guarantee",
                  description: "If you're not completely satisfied within 60 days, we'll work with you to make it right.",
                  highlight: "60-Day Guarantee"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2 + index * 0.1, ease: "easeInOut" }}
                >
                  <Card variant="elevated" padding="lg" hover className="h-full text-center group bg-white rounded-2xl shadow-lg border border-black/5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center justify-center mb-3">
                      <h3 className="text-lg font-semibold text-[#1F2937] mr-3">{benefit.title}</h3>
                      <Badge variant="success" size="sm" className="bg-[#B57EDC]/10 text-[#B57EDC]">{benefit.highlight}</Badge>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ - Objection Handling */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.6, ease: "easeInOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
                Questions & Answers
              </h2>
              <p className="text-lg text-[#6B7280]">
                Everything you need to know about membership
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "Is this really a good value compared to paying per treatment?",
                  answer: "Absolutely. Most members save $200-500+ monthly through member pricing alone, plus your Beauty Bank give you 100% credit value. If you're getting any treatments regularly, membership pays for itself immediately."
                },
                {
                  question: "What happens if I want to cancel my membership?",
                  answer: "No problem. You can cancel anytime with 30 days notice. You'll retain member benefits through your final billing cycle, and any unused Beauty Bank remain available for 90 days after cancellation."
                },
                {
                  question: "Can I use Beauty Bank for any treatment or product?",
                  answer: "Yes! Beauty Bank work like cash for any service or product we offer. There are no restrictions or blackout dates. Use them however best serves your wellness goals."
                },
                {
                  question: "How quickly will I see results?",
                  answer: "Many clients notice improvements after their first treatment, with optimal results developing over 2-4 sessions. Your personal care team will set realistic expectations during your consultation."
                },
                {
                  question: "What if I'm not satisfied with my results?",
                  answer: "We offer a 60-day satisfaction guarantee. If you're not happy with your experience, we'll work with you to adjust your treatment plan or provide alternative solutions."
                },
                {
                  question: "Are there any hidden fees or long-term contracts?",
                  answer: "Never. The monthly price you see is exactly what you pay. No setup fees, no cancellation penalties, no contracts. Just month-to-month flexibility with premium care."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.8 + index * 0.1, ease: "easeInOut" }}
                >
                  <Card variant="default" padding="lg" className="group hover:shadow-xl transition-all duration-200 bg-white rounded-2xl shadow-lg border border-black/5">
                    <h3 className="text-lg font-semibold text-[#1F2937] mb-3 group-hover:text-[#B57EDC] transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-[#6B7280] leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA - Conversion Push */}
        <section className="py-20 bg-gradient-to-br from-[#1F2937] via-[#1F2937] to-[#B57EDC] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2937]/90 to-[#B57EDC]/90"></div>
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.4, ease: "easeInOut" }}
            >
              <Badge variant="outline" size="lg" className="border-white/40 text-white mb-8 px-6 py-2">
                Begin Your Journey
              </Badge>

              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                Experience Premium Medical Aesthetics
              </h2>

              <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
                Join over 3,200 members who've discovered the confidence that comes from looking and feeling their absolute best.
                <span className="font-semibold"> Your transformation starts with one call.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white text-[#1F2937] hover:bg-white/90 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl"
                  onClick={() => window.location.href = `tel:${practiceInfo.phone}`}
                  leftIcon={<Phone className="w-5 h-5" />}
                >
                  Call {practiceInfo.phone}
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 rounded-2xl border-2"
                  onClick={() => {
                    const membershipSection = document.querySelector('#membership-tiers');
                    membershipSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Choose Your Plan
                </Button>
              </div>

              <p className="text-sm text-white/70">
                Free consultation • No setup fees • Cancel anytime
              </p>
            </motion.div>
          </div>

          {/* Background animations */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default EnhancedMembership;

