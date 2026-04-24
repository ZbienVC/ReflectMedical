import React from "react";
import { motion } from "framer-motion";
import { Star, Sparkles, BadgeCheck } from "lucide-react";
import { Card, Badge } from "./ui";
import { realReviews } from "../data/practiceData";

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
            Real verified patients from New Jersey sharing their Reflect Medical experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {realReviews.map((review, index) => {
            const initials = review.name.split(" ").map((n: string) => n[0]).join("");
            return (
              <motion.div
                key={review.id}
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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B57EDC] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold truncate">{review.name}</p>
                        {review.verified && (
                          <BadgeCheck className="w-4 h-4 text-[#B57EDC] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{review.treatment}</p>
                    </div>
                    <Badge variant="success" size="sm" className="ml-auto bg-[#B57EDC]/10 text-[#B57EDC] flex-shrink-0">
                      {review.membershipTier}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </div>
                    {review.verified && (
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};