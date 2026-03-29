import React from "react";
import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import { Card, Badge } from "./ui";

const STORIES = [
  {
    name: "Amanda Lewis",
    tier: "Transform",
    treatment: "RF Microneedling + Botox",
    savings: "$312 saved this month",
    quote:
      "The Transform tier basically covers one premium treatment every month. I get concierge scheduling and my skin has never looked better.",
    since: "Member since Aug 2024",
    initials: "AL",
  },
  {
    name: "Jessica Rivera",
    tier: "Evolve",
    treatment: "Juvederm + HydraFacial",
    savings: "$184 saved quarterly",
    quote:
      "The Evolve membership pays for itself with Beauty Bucks. I bank credits for fillers and never stress about pricing",
    since: "Member since Jan 2025",
    initials: "JR",
  },
  {
    name: "Stephanie Moore",
    tier: "Core",
    treatment: "Laser Hair Removal",
    savings: "$95 saved per visit",
    quote:
      "I started with Core to stay consistent with maintenance treatments. The member pricing let me add services I used to skip.",
    since: "Member since Mar 2024",
    initials: "SM",
  },
];

export const MemberStories: React.FC = () => {
  return (
    <section className="py-20 bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">Member Spotlight</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Results You Can Feel</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Real patients from New Jersey sharing why they bring their Beauty Bank back to Reflect every month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORIES.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                variant="elevated"
                padding="lg"
                className="h-full bg-white text-slate-900 rounded-3xl shadow-2xl border border-white/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B57EDC] to-[#7C3AED] text-white flex items-center justify-center font-bold">
                    {story.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{story.name}</p>
                    <p className="text-xs text-slate-500">{story.since}</p>
                  </div>
                  <Badge variant="success" size="sm" className="ml-auto bg-[#B57EDC]/10 text-[#B57EDC]">
                    {story.tier}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mb-4">"{story.quote}"</p>
                <div className="text-xs font-semibold text-slate-500">{story.treatment}</div>
                <div className="text-sm font-bold text-[#0f172a] mt-1">{story.savings}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
