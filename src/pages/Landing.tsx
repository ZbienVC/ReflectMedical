import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Star,
  Users,
  Award,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Heart,
  Gem,
} from "lucide-react";
import {
  practiceInfo,
  membershipTiers,
  realReviews,
  realStats,
  physicians,
} from "../data/practiceData";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const services = [
  {
    name: "Botox Cosmetic",
    price: "From $15/unit",
    description:
      "FDA-approved neurotoxin to smooth fine lines and wrinkles with natural-looking results.",
    icon: Sparkles,
  },
  {
    name: "Juvederm Fillers",
    price: "From $650/syringe",
    description:
      "Premium hyaluronic acid fillers for volume restoration, lip enhancement, and facial contouring.",
    icon: Gem,
  },
  {
    name: "HydraFacial MD",
    price: "From $175/session",
    description:
      "Multi-step medical facial that deep cleanses, extracts, and hydrates for an instant glow.",
    icon: Heart,
  },
  {
    name: "Laser Hair Removal",
    price: "From $150/session",
    description:
      "Advanced laser technology for permanent hair reduction across all body areas.",
    icon: Award,
  },
];

const whyReflect = [
  {
    icon: Shield,
    title: "Board-Certified Team",
    description:
      "Every treatment is supervised by board-certified physicians with advanced aesthetic training.",
  },
  {
    icon: Sparkles,
    title: "Member Savings",
    description:
      "Unlock exclusive pricing, monthly credits, and Beauty Bucks through our membership tiers.",
  },
  {
    icon: Gem,
    title: "Premium Experience",
    description:
      "From your first consultation to follow-up care, expect a luxury medical spa experience.",
  },
];

const tierColors: Record<string, { border: string; badge: string; btn: string }> = {
  core: {
    border: "border-blue-400/30",
    badge: "bg-blue-500/10 text-blue-300",
    btn: "from-blue-500 to-blue-600",
  },
  evolve: {
    border: "border-[#B57EDC]/50",
    badge: "bg-[#B57EDC]/15 text-[#B57EDC]",
    btn: "from-[#B57EDC] to-[#9F6BCB]",
  },
  transform: {
    border: "border-[#C9A84C]/40",
    badge: "bg-[#C9A84C]/10 text-[#C9A84C]",
    btn: "from-[#C9A84C] to-[#b89540]",
  },
};

const Landing: React.FC = () => {
  return (
    <div className="bg-[#0f172a] text-white overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#0f172a] via-[#1a0a3d] to-[#0f172a]">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #B57EDC, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />

        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Logo */}
          <motion.div variants={fadeUp} className="mb-8">
            <img
              src={practiceInfo.logo}
              alt="Reflect Medical & Cosmetic Center"
              className="h-20 w-auto object-contain rounded-2xl shadow-2xl"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ background: "rgba(181,126,220,0.15)", border: "1px solid rgba(181,126,220,0.3)", color: "#B57EDC" }}>
              <Shield className="w-3.5 h-3.5" />
              Board-Certified Aesthetic Medicine
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            Premium Aesthetic Medicine{" "}
            <span style={{ color: "#B57EDC" }}>in Hawthorne, NJ</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Board-certified care. Member savings. Beauty that lasts.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-xl font-bold text-white text-base shadow-2xl transition-all hover:scale-105 hover:shadow-[#B57EDC]/30"
              style={{ background: "linear-gradient(135deg, #B57EDC, #9F6BCB)" }}
            >
              Become a Member
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl font-bold text-white text-base border border-white/20 hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: "#B57EDC" }} />
              3,250+ Patients
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" style={{ color: "#C9A84C" }} />
              4.9 Average Rating
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" style={{ color: "#C9A84C" }} />
              8 Years of Excellence
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-[#0d1117] border-y border-white/5 py-12 px-4">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            { label: "Patients Served", value: realStats.patientsServed.toLocaleString() + "+" },
            { label: "Satisfaction Rate", value: realStats.satisfactionRate + "%" },
            { label: "Years in Business", value: realStats.yearsInBusiness + " Years" },
            { label: "Average Rating", value: realStats.averageRating + " / 5.0" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <p className="text-3xl font-black mb-1" style={{ color: "#B57EDC" }}>{stat.value}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── MEMBERSHIP TIERS ─── */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ background: "rgba(181,126,220,0.12)", color: "#B57EDC" }}>
              Membership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Choose Your Beauty Journey</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Every tier unlocks exclusive pricing, monthly credits, and concierge-level care.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {membershipTiers.map((tier) => {
              const colors = tierColors[tier.id] || tierColors.core;
              return (
                <motion.div
                  key={tier.id}
                  variants={fadeUp}
                  className={`relative rounded-2xl border p-8 flex flex-col ${colors.border} ${
                    tier.popular ? "ring-2 ring-[#B57EDC]/60" : ""
                  }`}
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #B57EDC, #9F6BCB)" }}>
                        Most Popular
                      </span>
                    </div>
                  )}
                  <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 ${colors.badge}`}>
                    {tier.name}
                  </span>
                  <p className="text-4xl font-black mb-1">${tier.monthlyPrice}<span className="text-lg font-medium text-gray-400">/mo</span></p>
                  <p className="text-sm text-gray-400 mb-6">{tier.description}</p>
                  <ul className="space-y-2 flex-1 mb-8">
                    {tier.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#C9A84C" }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`w-full text-center py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r ${colors.btn} transition-all hover:opacity-90 hover:scale-[1.02]`}
                  >
                    Join {tier.name}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED SERVICES ─── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C" }}>
              Treatments
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Our Signature Services</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Medical-grade treatments performed by certified professionals in a luxury setting.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.name}
                  variants={fadeUp}
                  className="rounded-2xl p-6 border border-white/8 hover:border-[#B57EDC]/40 transition-all group"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: "rgba(181,126,220,0.12)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#B57EDC" }} />
                  </div>
                  <h3 className="font-bold text-white mb-1">{svc.name}</h3>
                  <p className="text-xs font-semibold mb-3" style={{ color: "#C9A84C" }}>{svc.price}</p>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{svc.description}</p>
                  <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: "#B57EDC" }}>
                    Learn More <ChevronRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── WHY REFLECT ─── */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Why Choose Reflect?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We combine clinical expertise with a luxury experience — so you always leave looking and feeling your best.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {whyReflect.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} variants={fadeUp} className="text-center px-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: "rgba(181,126,220,0.12)", border: "1px solid rgba(181,126,220,0.2)" }}>
                    <Icon className="w-8 h-8" style={{ color: "#B57EDC" }} />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── PATIENT REVIEWS ─── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C" }}>
              Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">What Our Patients Say</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {realReviews.slice(0, 3).map((review) => (
              <motion.div
                key={review.id}
                variants={fadeUp}
                className="rounded-2xl p-6 border border-white/8"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#C9A84C" }} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #B57EDC, #9F6BCB)" }}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.treatment}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── MEET THE TEAM ─── */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Meet the Team</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our board-certified physicians and certified aesthetic nurses are dedicated to your care.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {physicians.map((doc) => (
              <motion.div
                key={doc.id}
                variants={fadeUp}
                className="rounded-2xl p-8 border border-white/8 text-center"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=B57EDC&color=fff&size=128&bold=true`}
                  alt={doc.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg mb-1">{doc.name}</h3>
                <p className="text-sm mb-4" style={{ color: "#B57EDC" }}>{doc.title}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {doc.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-1 rounded-lg text-xs text-gray-300"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── LOCATION & CONTACT ─── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Visit Us</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(181,126,220,0.12)" }}>
                  <MapPin className="w-5 h-5" style={{ color: "#B57EDC" }} />
                </div>
                <div>
                  <p className="font-semibold mb-1">Address</p>
                  <p className="text-gray-400 text-sm">{practiceInfo.address.full}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(181,126,220,0.12)" }}>
                  <Phone className="w-5 h-5" style={{ color: "#B57EDC" }} />
                </div>
                <div>
                  <p className="font-semibold mb-1">Phone</p>
                  <a href={`tel:${practiceInfo.phone}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {practiceInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(181,126,220,0.12)" }}>
                  <Clock className="w-5 h-5" style={{ color: "#B57EDC" }} />
                </div>
                <div>
                  <p className="font-semibold mb-3">Hours</p>
                  <div className="space-y-1 text-sm text-gray-400">
                    {Object.entries(practiceInfo.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between gap-6">
                        <span className="capitalize font-medium text-gray-300">{day}</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/appointments"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 mt-2"
                style={{ background: "linear-gradient(135deg, #B57EDC, #9F6BCB)" }}
              >
                Book Appointment
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Map */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl overflow-hidden border border-white/8 h-80 lg:h-auto min-h-64"
            >
              <iframe
                title="Reflect Medical Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(practiceInfo.address.full)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#080d14] border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            {/* Brand */}
            <div className="max-w-xs">
              <img
                src={practiceInfo.logo}
                alt="Reflect Medical"
                className="h-12 w-auto object-contain rounded-lg mb-4"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <p className="text-sm text-gray-500 leading-relaxed">
                Premium aesthetic medicine in Hawthorne, NJ. Board-certified care, member savings, beauty that lasts.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Services</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/login" className="hover:text-white transition-colors">Membership</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Treatments</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Locations</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Account</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                  <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Reflect Medical & Cosmetic Center. All rights reserved.</p>
            <p>150 Lafayette Ave, Hawthorne, NJ 07506</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;