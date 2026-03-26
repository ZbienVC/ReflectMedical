import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, animate } from "framer-motion";
import {
  Star, MapPin, Phone, Clock, Instagram, Facebook, ChevronRight,
  Menu, X, CheckCircle, ArrowRight, Sparkles, Calendar, Gift, ChevronDown, ChevronUp
} from "lucide-react";
import { practiceInfo, physicians } from "../data/practiceData";
import { realReviews } from "../data/reviews";
import { realServices } from "../data/practiceData";
import { MEMBERSHIP_PLANS } from "../data/skinBank";

// ─── Scroll-triggered section wrapper ───────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Treatment category tabs ─────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  "All": [],
  "Neurotoxins": ["Neurotoxins"],
  "Fillers": ["Dermal Fillers"],
  "Chemical Peels": ["Chemical Peel"],
  "Devices": ["Medical Device"],
  "Laser": ["LHR"],
  "Wellness": ["GLP"],
};

// ─── Star row ────────────────────────────────────────────────────────────────
function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </span>
  );
}

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

// ─── Is open helper ──────────────────────────────────────────────────────────
function isOfficeOpen(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const hour = now.getHours() + now.getMinutes() / 60;
  // Mon(1): 9-19, Tue(2): 9-14, Wed(3): 9-17, Thu(4): 9-17, Fri(5): 9-16
  const hours: Record<number, [number, number]> = {
    1: [9, 19],
    2: [9, 14],
    3: [9, 17],
    4: [9, 17],
    5: [9, 16],
  };
  const range = hours[day];
  if (!range) return false;
  return hour >= range[0] && hour < range[1];
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ_DATA = [
  { q: "How does the Beauty Bank work?", a: "Each month, credits automatically load to your account based on your tier ($99–$250). Use them toward any treatment. Unused credits roll over while your membership is active." },
  { q: "Can I cancel my membership anytime?", a: "Yes. You can cancel or pause your membership anytime from your account settings. No long-term contracts." },
  { q: "Do you offer same-day appointments?", a: "Yes! We frequently have same-day availability. Call (201) 882-1050 or book online." },
  { q: "What's the difference between the membership tiers?", a: "All tiers include member pricing and monthly Beauty Bank credits. Higher tiers offer more credits and bigger discounts on premium treatments like fillers and devices." },
  { q: "Is there a consultation fee?", a: "No. We offer free consultations for new patients. Book online or call us." },
  { q: "What areas do you treat with Botox?", a: "Forehead lines, crow's feet, frown lines (11s), brow lift, bunny lines, lip flip, neck bands, and more." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-12">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">FAQ</p>
          <h2 className="text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
        </FadeIn>
        <div className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                  {open === i ? (
                    <ChevronUp className="w-4 h-4 text-violet-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {open === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [isOpen] = useState(isOfficeOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredServices = activeTab === "All"
    ? realServices.filter(s => !["Douglas Patients"].includes(s.category))
    : realServices.filter(s => CATEGORY_MAP[activeTab]?.includes(s.category));

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ══════════════════════════════════════════════════════════
          1. NAVIGATION
      ══════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/reflect-logo.png" alt="Reflect Medical" className="h-9 w-auto object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            {[
              { label: "Services", id: "services" },
              { label: "Membership", id: "membership" },
              { label: "About", id: "about" },
              { label: "Location", id: "location" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="hover:text-violet-600 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${isOpen ? "text-green-700 border-green-200 bg-green-50" : "text-gray-500 border-gray-200 bg-gray-50"}`}>
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500" : "bg-gray-400"}`} />
              {isOpen ? "Open Now" : "Closed"}
            </span>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition"
            >
              Sign In
            </Link>
            <Link
              to="/appointments"
              className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {[
              { label: "Services", id: "services" },
              { label: "Membership", id: "membership" },
              { label: "About", id: "about" },
              { label: "Location", id: "location" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block w-full text-left py-2 text-gray-700 font-medium hover:text-violet-600"
              >
                {label}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                className="flex-1 text-center py-2 text-sm font-semibold text-violet-600 border border-violet-200 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/appointments"
                className="flex-1 text-center py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════
          2. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">
        {/* Decorative gradient blob top-right */}
        <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-violet-50 via-violet-50/40 to-transparent" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-40 right-40 w-64 h-64 bg-violet-200 rounded-full blur-2xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-4"
            >
              Hawthorne, NJ · Est. 2017
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6"
            >
              Your Best Self,{" "}
              <span className="text-violet-600">Elevated.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
            >
              Premium aesthetic treatments and membership care at Reflect Medical.
              Real results. Natural beauty.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                to="/membership"
                className="px-6 py-3 text-base font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition shadow-lg shadow-violet-200 flex items-center gap-2"
              >
                Start Membership <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/appointments"
                className="px-6 py-3 text-base font-semibold text-violet-600 border-2 border-violet-200 rounded-xl hover:bg-violet-50 transition"
              >
                Book Appointment
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 text-sm text-gray-500"
            >
              {[
                "⭐ 4.9/5 Rating",
                "195+ Reviews",
                "8+ Years",
                "Same-Day Available",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-violet-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: decorative card cluster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex flex-col gap-4 relative"
          >
            {/* Floating badge */}
            <div className="absolute -top-6 -left-4 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1.5 animate-bounce">
              <Calendar className="w-3 h-3" /> Same Day Appointments Available
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Patients Served", to: 3250, suffix: "+" },
                { label: "Google Reviews", to: 195, suffix: "+" },
                { label: "Average Rating", to: 4.9, suffix: " ⭐" },
                { label: "Years in Business", to: 8, suffix: "+" },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100"
                >
                  <p className="text-3xl font-black text-violet-600 mb-1">
                    <AnimatedCounter to={card.to} suffix={card.suffix} />
                  </p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Bottom decorative bar */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-5 text-white">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Beauty Bank Membership
              </p>
              <p className="text-sm text-violet-200">Auto-loaded credits every month. Use on any service.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. SOCIAL PROOF MARQUEE
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-y border-gray-100 py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) =>
            [
              "3,250+ Patients Served",
              "4.9 ⭐ Average Rating",
              "195+ Google Reviews",
              "8+ Years in Business",
              "Same-Day Appointments",
            ].map((stat) => (
              <span
                key={`${i}-${stat}`}
                className="inline-flex items-center gap-2 mx-10 text-sm font-semibold text-gray-600"
              >
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                {stat}
              </span>
            ))
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. HOW IT WORKS (id="membership")
      ══════════════════════════════════════════════════════════ */}
      <section id="membership" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">Simple Process</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Join the Beauty Bank membership and unlock exclusive pricing on every visit.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Sparkles className="w-7 h-7 text-violet-600" />,
                title: "Join a Membership",
                desc: "Choose Core, Evolve, or Transform — each tier unlocks better pricing and more monthly Beauty Bank credits.",
              },
              {
                step: "02",
                icon: <Gift className="w-7 h-7 text-violet-600" />,
                title: "Receive Monthly Beauty Bank",
                desc: "Credits auto-load to your account each month. Use them on any treatment — they never expire.",
              },
              {
                step: "03",
                icon: <Calendar className="w-7 h-7 text-violet-600" />,
                title: "Book & Save",
                desc: "Apply your credits plus member pricing on every visit. The more you invest, the more you save.",
              },
            ].map((card, i) => (
              <FadeIn key={card.step} delay={i * 0.12}>
                <div className="relative bg-gray-50 rounded-2xl p-7 h-full border border-gray-100 hover:border-violet-200 hover:shadow-lg transition">
                  <span className="absolute top-5 right-6 text-6xl font-black text-gray-100 select-none">
                    {card.step}
                  </span>
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. TREATMENT SHOWCASE (id="services")
      ══════════════════════════════════════════════════════════ */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-10">
            <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">Our Treatments</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">What We Offer</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Premium aesthetic services tailored to your unique goals.
            </p>
          </FadeIn>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {Object.keys(CATEGORY_MAP).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-violet-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Treatment cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.slice(0, 9).map((svc, i) => (
              <FadeIn key={svc.id} delay={i * 0.05}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition h-full flex flex-col">
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full self-start mb-3">
                    {svc.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{svc.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1 leading-relaxed line-clamp-3">
                    {svc.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-bold text-gray-900">
                      From ${svc.price.base}
                      <span className="text-xs text-gray-400 font-normal ml-1">{svc.price.unit}</span>
                    </span>
                    <Link
                      to="/appointments"
                      className="text-sm font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
                    >
                      Book <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-violet-200 text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition"
            >
              View All Treatments — Sign In Required <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. MEMBERSHIP PRICING (id="pricing")
      ══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">Membership Plans</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Choose Your Membership</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Every plan includes monthly Beauty Bank credits and exclusive member pricing on all services.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {MEMBERSHIP_PLANS.map((plan, i) => (
              <FadeIn key={plan.id} delay={i * 0.12}>
                <div
                  className={`relative rounded-2xl p-8 border-2 transition h-full flex flex-col ${
                    plan.highlighted
                      ? "border-violet-600 shadow-2xl shadow-violet-100 bg-violet-600 text-white scale-105"
                      : "border-gray-100 bg-gray-50 hover:border-violet-200 hover:shadow-lg"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-violet-600 text-xs font-bold px-3 py-1 rounded-full border border-violet-200 shadow">
                      Most Popular
                    </span>
                  )}
                  <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${plan.highlighted ? "text-violet-200" : "text-violet-600"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-5xl font-black ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                      ${plan.monthlyPrice}
                    </span>
                    <span className={`mb-2 text-sm ${plan.highlighted ? "text-violet-200" : "text-gray-400"}`}>/mo</span>
                  </div>
                  <p className={`text-sm mb-6 ${plan.highlighted ? "text-violet-100" : "text-gray-500"}`}>
                    {plan.description}
                  </p>
                  <div className={`rounded-xl p-4 mb-6 ${plan.highlighted ? "bg-violet-700" : "bg-white border border-gray-100"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${plan.highlighted ? "text-violet-300" : "text-gray-400"}`}>
                      Monthly Beauty Bank
                    </p>
                    <p className={`text-2xl font-black ${plan.highlighted ? "text-white" : "text-violet-600"}`}>
                      ${plan.monthlyCredits} Credits
                    </p>
                  </div>
                  <Link
                    to="/signup"
                    className={`mt-auto w-full text-center py-3 rounded-xl font-semibold text-sm transition ${
                      plan.highlighted
                        ? "bg-white text-violet-600 hover:bg-violet-50"
                        : "bg-violet-600 text-white hover:bg-violet-700"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-10">
            <p className="text-gray-500 text-sm">
              Questions? Call us at{" "}
              <a href={`tel:${practiceInfo.phone}`} className="text-violet-600 font-semibold hover:underline">
                {practiceInfo.phone}
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. REVIEWS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">Patient Reviews</p>
            <h2 className="text-4xl font-black text-gray-900 mb-2">What Our Patients Say</h2>
            <p className="text-gray-500">4.9 stars · 195+ verified reviews</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {realReviews.slice(0, 6).map((review, i) => (
              <FadeIn key={review.id} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-md transition h-full flex flex-col">
                  <Stars n={review.rating} />
                  <p className="text-gray-700 text-sm leading-relaxed mt-3 mb-4 flex-1">
                    "{review.text}"
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.treatment}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                      {review.source}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. PROVIDERS (id="about")
      ══════════════════════════════════════════════════════════ */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">Our Team</p>
            <h2 className="text-4xl font-black text-gray-900">Meet Your Providers</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {physicians.map((doc, i) => (
              <FadeIn key={doc.id} delay={i * 0.15}>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition h-full">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white text-2xl font-black mb-5">
                    {doc.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                  <p className="text-violet-600 text-sm font-medium mb-4">{doc.title}</p>
                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.specialties.slice(0, 4).map((s) => (
                      <span key={s} className="text-xs bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">{doc.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8.5 FAQ
      ══════════════════════════════════════════════════════════ */}
      <FAQSection />

      {/* ══════════════════════════════════════════════════════════
          9. LOCATION + HOURS (id="location")
      ══════════════════════════════════════════════════════════ */}      <section id="location" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">Find Us</p>
            <h2 className="text-4xl font-black text-gray-900">Location & Hours</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Hours table */}
            <FadeIn>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-violet-600" /> Office Hours
                  </h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(practiceInfo.hours).map(([day, hours]) => (
                      <tr key={day} className="border-b border-gray-50 last:border-0">
                        <td className="px-6 py-3 font-semibold text-gray-700 capitalize">{day}</td>
                        <td className="px-6 py-3 text-gray-500 text-right">{hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>

            {/* Address + map placeholder */}
            <FadeIn delay={0.1}>
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-violet-600" /> Address
                  </h3>
                  <p className="text-gray-700 mb-1">{practiceInfo.address.street}</p>
                  <p className="text-gray-700 mb-4">
                    {practiceInfo.address.city}, {practiceInfo.address.state} {practiceInfo.address.zipCode}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(practiceInfo.address.full)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition"
                    >
                      Get Directions
                    </a>
                    <a
                      href={`tel:${practiceInfo.phone}`}
                      className="flex-1 text-center py-2.5 border-2 border-violet-200 text-violet-600 text-sm font-semibold rounded-xl hover:bg-violet-50 transition"
                    >
                      Call Now
                    </a>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-gray-100 rounded-2xl h-52 flex items-center justify-center border border-gray-200">
                  <div className="text-center text-gray-400">
                    <MapPin className="w-10 h-10 mx-auto mb-2 text-violet-300" />
                    <p className="text-sm font-medium">150 Lafayette Ave</p>
                    <p className="text-xs">Hawthorne, NJ 07506</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          10. FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-violet-600 to-violet-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-violet-200 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of patients who trust Reflect Medical for natural, beautiful results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="px-7 py-3.5 bg-white text-violet-600 font-bold rounded-xl hover:bg-violet-50 transition shadow-lg"
              >
                Start Membership
              </Link>
              <Link
                to="/appointments"
                className="px-7 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition"
              >
                Book Appointment
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          11. FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <img src="/reflect-logo.png" alt="Reflect Medical" className="h-9 w-auto object-contain mb-3 brightness-0 invert" />
              <p className="text-sm leading-relaxed max-w-xs">{practiceInfo.tagline}</p>
              <div className="flex gap-4 mt-4">
                <a
                  href={practiceInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={practiceInfo.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Quick Links</p>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Services", id: "services" },
                  { label: "Membership", id: "membership" },
                  { label: "About", id: "about" },
                  { label: "Location", id: "location" },
                ].map(({ label, id }) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)} className="hover:text-white transition">
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/login" className="hover:text-white transition">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Contact</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <a href={`tel:${practiceInfo.phone}`} className="hover:text-white transition">
                    {practiceInfo.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{practiceInfo.address.full}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
            © 2026 Reflect Medical & Cosmetic Center. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
