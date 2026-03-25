import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { MembershipTier } from "../types";
import { formatCurrency } from "../lib/utils";
import { addMonthlyCredits } from "../services/membershipService";
import { membershipTiers, realStats, realReviews, practiceInfo } from "../data/practiceData";
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
import Logo from "../components/Logo";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Multi-layer Background System */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-medical-green/8" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-navy/8 to-medical-green/8 rounded-full blur-2xl" />
          <div className="absolute top-60 right-10 w-32 h-32 bg-gradient-to-br from-medical-green/6 to-navy/6 rounded-full blur-xl" />
          <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-gradient-to-br from-premium-gold/5 to-navy/5 rounded-full blur-2xl" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
      </div>

      {/* Premium Medical Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-soft"
        style={{ opacity: headerOpacity }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="md" animate={true} fallbackIcon={<Sparkles className="w-5 h-5 text-white" />} />
          </motion.div>
          
          <motion.nav 
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href="/treatments"
              className="font-semibold text-gray-600 hover:text-navy transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              Treatments
            </a>
            <a
              href="/membership"
              className="font-semibold text-navy px-3 py-1.5 bg-navy/5 rounded-lg border border-navy/10"
            >
              Memberships
            </a>
            <a
              href="/locations"
              className="font-semibold text-gray-600 hover:text-navy transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              Locations
            </a>
          </motion.nav>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-medical-green">notifications</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="rounded-full font-semibold shadow-soft hover:shadow-medium hover:scale-105 hover:-translate-y-0.5 transition-all duration-200"
              onClick={() => window.location.href = `tel:${practiceInfo.phone}`}
              leftIcon={<span className="material-symbols-outlined">phone</span>}
            >
              {practiceInfo.phone}
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="pt-32 relative z-10">
        {/* 1. HERO SECTION - Emotional Hook */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="space-y-6"
            >
              <Badge variant="success" size="md" className="font-semibold shadow-soft">
                Transform Your Beauty Journey
              </Badge>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-navy leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
              >
                Unlock Your Best Self with{" "}
                <span className="text-medical-green">Premium Care</span>
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
                    !isAnnual ? 'text-navy bg-white shadow-soft' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsAnnual(false)}
                >
                  Monthly
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-16 h-8 rounded-full p-1 flex items-center transition-all duration-200 shadow-soft ${
                    isAnnual ? 'bg-navy' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-medium transition-all duration-300 ${
                    isAnnual ? 'translate-x-8' : 'translate-x-0'
                  }`} />
                </button>
              
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    className={`px-4 py-2 text-base font-semibold transition-all duration-200 rounded-xl ${
                      isAnnual ? 'text-navy bg-white shadow-soft' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsAnnual(true)}
                  >
                    Annual
                  </button>
                  <Badge variant="premium" size="sm" className="tracking-wider uppercase shadow-soft">
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
              <Badge variant="outline" size="md" className="mb-6">
                Trusted by Thousands
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Join 3,200+ Happy Members
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
                  <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-all duration-200">
                    <div className="w-12 h-12 bg-medical-green rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:scale-110 transition-transform duration-200">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy mb-2">{stat.number}</h3>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
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
                  text: "The Evolve tier has been incredible! My confidence has never been higher, and the Beauty Bucks make every treatment feel like an investment that pays for itself.",
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
                  <Card variant="elevated" padding="lg" hover className="h-full group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-navy to-medical-green rounded-full flex items-center justify-center text-white font-bold shadow-soft group-hover:scale-110 transition-transform duration-200">
                        {review.image}
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">{review.name}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-premium-gold fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic leading-relaxed mb-4">"{review.text}"</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" size="sm">{review.treatment}</Badge>
                      <Badge variant="success" size="sm">{review.tier} Member</Badge>
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
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-medical-green/4 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-navy/4 to-transparent rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" size="md" className="mb-6">
                Choose Your Investment
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Pick Your Perfect Plan
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every membership pays for itself through exclusive pricing and Beauty Bucks rewards. 
                <span className="text-navy font-semibold"> Start saving from day one.</span>
              </p>
            </div>
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
            >
              {tiers.map((tier, index) => {
                const isCurrent = profile?.membershipTierId === tier.id;
                const isPopular = tier.name === "Evolve";
                const annualPrice = isAnnual ? tier.monthlyPrice * 12 * 0.85 : tier.monthlyPrice;
                const displayPrice = isAnnual ? Math.round(annualPrice / 12) : tier.monthlyPrice;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.2, ease: "easeInOut" }}
                    className={`relative ${
                      isPopular ? "scale-105 z-10" : "hover:scale-105"
                    } transition-all duration-200`}
                  >
                    <Card
                      variant={tier.name === 'Transform' ? 'premium' : tier.name === 'Evolve' ? 'elevated' : 'default'}
                      padding="lg"
                      className={`h-full relative overflow-visible ${
                        tier.name === 'Core' 
                          ? "bg-white border border-gray-200 shadow-soft hover:shadow-medium hover:border-gray-300"
                        : tier.name === 'Evolve'
                          ? "bg-gradient-to-br from-white to-medical-green/5 border-2 border-medical-green/30 shadow-medium hover:shadow-elevated shadow-medical-green/15 hover:border-medical-green/40"
                        : "bg-gradient-to-br from-navy/95 to-navy text-white border-2 border-premium-gold/50 shadow-elevated hover:shadow-premium shadow-premium-gold/20 hover:border-premium-gold/60"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                          <Badge
                            variant="success"
                            size="md"
                            className="uppercase tracking-wider font-semibold shadow-elevated animate-pulse"
                          >
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                              tier.name === 'Core' ? 'bg-gray-100 border border-gray-300' :
                              tier.name === 'Evolve' ? 'bg-medical-green shadow-lg shadow-medical-green/20' :
                              'bg-premium-gold shadow-lg shadow-premium-gold/30'
                            }`}
                          >
                            {tier.name === 'Core' ? <Zap className="w-7 h-7 text-gray-600" /> :
                             tier.name === 'Evolve' ? <Sparkles className="w-8 h-8 text-white" /> :
                             <Crown className="w-8 h-8 text-white" />}
                          </div>
                          <div>
                            <h3 className={`font-bold tracking-tight ${
                              tier.name === 'Transform' ? 'text-white text-2xl md:text-3xl' :
                              tier.name === 'Evolve' ? 'text-navy text-2xl md:text-3xl' : 
                              'text-gray-700 text-xl md:text-2xl'
                            }`}>
                              {tier.name}
                            </h3>
                            <p className={`text-sm ${
                              tier.name === 'Transform' ? 'text-gray-200' :
                              tier.name === 'Evolve' ? 'text-gray-600' :
                              'text-gray-500'
                            }`}>
                              {tier.name === 'Core' && 'Essential maintenance for lasting glow.'}
                              {tier.name === 'Evolve' && 'Enhanced rejuvenation and expert care.'}
                              {tier.name === 'Transform' && 'The ultimate aesthetic concierge experience.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-4 md:mb-6">
                          <span className={`font-black tracking-tighter ${
                            tier.name === 'Transform' ? 'text-white text-4xl md:text-6xl' :
                            tier.name === 'Evolve' ? 'text-navy text-4xl md:text-6xl' :
                            'text-gray-700 text-3xl md:text-5xl'
                          }`}>
                            {formatCurrency(displayPrice)}
                          </span>
                          <span className={`text-lg font-medium ${
                            tier.name === 'Transform' ? 'text-gray-200' :
                            tier.name === 'Evolve' ? 'text-gray-600' :
                            'text-gray-500'
                          }`}>
                            /month
                          </span>
                          {isAnnual && (
                            <Badge
                              variant="success"
                              size="sm"
                              className="font-semibold"
                              animate={true}
                            >
                              15% OFF
                            </Badge>
                          )}
                        </div>

                        {/* Beauty Bucks Display */}
                        <div 
                          className={`rounded-2xl p-6 mb-6 border ${
                            tier.name === 'Transform'
                              ? "bg-white/10 border-white/20"
                              : tier.name === 'Evolve'
                                ? "bg-medical-green/5 border-medical-green/20" 
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className={`rounded-xl flex items-center justify-center ${
                                tier.name === 'Transform'
                                  ? "w-12 h-12 bg-premium-gold"
                                  : tier.name === 'Evolve'
                                    ? "w-12 h-12 bg-medical-green" 
                                    : "w-10 h-10 bg-gray-400"
                              }`}
                            >
                              <Gift className={`${
                                tier.name === 'Core' ? 'w-5 h-5' : 'w-6 h-6'
                              } text-white`} />
                            </div>
                            <div>
                              <p className={`font-semibold uppercase tracking-wider text-xs ${
                                tier.name === 'Transform'
                                  ? "text-premium-gold" 
                                  : tier.name === 'Evolve'
                                    ? "text-medical-green" 
                                    : "text-gray-600"
                              }`}>
                                Beauty Bucks
                              </p>
                              <p 
                                className={`font-semibold ${
                                  tier.name === 'Transform'
                                    ? "text-xl text-white"
                                    : tier.name === 'Evolve'
                                      ? "text-xl text-navy" 
                                      : "text-lg text-gray-700"
                                }`}
                              >
                                {formatCurrency(tier.monthlyCredits)} Monthly
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Benefits List */}
                        <ul className="space-y-4 mb-8">
                          {[
                            { 
                              text: `Botox: ${formatCurrency(tier.toxinDiscountBotox)}/unit`, 
                              highlight: tier.name === 'Evolve' ? "Best Value" : `Reg. ${formatCurrency(15)}`,
                              icon: CheckCircle2
                            },
                            { 
                              text: `${tier.fillerDiscountPercent}% Off All Skincare & Fillers`,
                              icon: Heart
                            },
                            ...(tier.name === 'Core' ? [
                              { text: "Priority Booking Window", icon: Calendar },
                              { text: "Monthly Skin Analysis", icon: Shield }
                            ] : []),
                            ...(tier.name === 'Evolve' ? [
                              { text: "Complimentary Monthly B12 Shot", icon: Zap },
                              { text: "Early Access to Seasonal Events", icon: Star },
                              { text: "Dedicated Aesthetician", icon: Users }
                            ] : []),
                            ...(tier.name === 'Transform' ? [
                              { text: "20% Off All Medical Services", icon: Shield },
                              { text: "Unlimited Hydrafacial Upgrades", icon: Sparkles },
                              { text: "VIP Concierge Support Line", icon: Crown },
                              { text: "Quarterly 3D Skin Mapping", icon: TrendingUp }
                            ] : [])
                          ].map((benefit, idx) => (
                            <li
                              key={idx}
                              className={`flex items-center gap-3 text-sm ${
                                tier.name === 'Transform' ? 'text-gray-200' : 'text-gray-700'
                              }`}
                            >
                              <benefit.icon className={`w-5 h-5 flex-shrink-0 ${
                                tier.name === 'Transform' ? 'text-premium-gold' :
                                tier.name === 'Evolve' ? 'text-medical-green' :
                                'text-gray-500'
                              }`} />
                              <span className="font-medium">
                                {benefit.text}
                                {benefit.highlight && (
                                  <span className="ml-2">
                                    <Badge variant="success" size="sm">
                                      {benefit.highlight}
                                    </Badge>
                                  </span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="relative z-10">
                          <Button
                            onClick={() => handleJoin(tier)}
                            disabled={isCurrent}
                            variant={
                              isCurrent ? "ghost" : 
                              tier.name === 'Transform' ? "primary" :
                              tier.name === 'Evolve' ? "secondary" : 
                              "ghost"
                            }
                            size="lg"
                            className={`w-full font-semibold ${
                              tier.name === 'Transform' 
                                ? "bg-premium-gold text-navy hover:bg-premium-gold/90 border-0" :
                              tier.name === 'Evolve' 
                                ? "" :
                              isCurrent 
                                ? "opacity-50 cursor-not-allowed" :
                              "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                            }`}
                            rightIcon={!isCurrent ? <ArrowRight className="w-5 h-5" /> : undefined}
                          >
                          {isCurrent 
                            ? "✅ Current Plan" 
                            : tier.name === 'Evolve'
                              ? "Choose Evolve"
                              : tier.name === 'Core'
                                ? "Start Basic"
                                : "Go Premium"
                          }
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Enhanced Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-soft z-50">
        <div className="flex justify-around items-center px-6 py-4">
          {[
            { icon: "home", label: "Home", active: false, href: "/" },
            { icon: "grid_view", label: "Memberships", active: true, href: "/membership" },
            { icon: "medical_services", label: "Treatments", active: false, href: "/treatments" },
            { icon: "location_on", label: "Location", active: false, href: "/locations" }
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ease-in-out touch-manipulation min-h-[44px] ${
                item.active 
                  ? "bg-navy text-white shadow-soft scale-105" 
                  : "text-gray-600 hover:text-navy hover:bg-gray-50 hover:scale-105"
              }`}
            >
              <span className="material-symbols-outlined text-lg mb-1">
                {item.icon}
              </span>
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default EnhancedMembership;