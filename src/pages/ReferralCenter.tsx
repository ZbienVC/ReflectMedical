"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users,
  Gift,
  Share2,
  Copy,
  Mail,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Plus,
  Inbox
} from "lucide-react";
import { 
  userReferrals,
  referralRewards,
  referralStats,
  referralTiers,
  getCurrentTier,
  getNextTier,
  getPendingReferrals,
  getSuccessfulReferrals,
  generateReferralLink,
  calculateProjectedEarnings,
  formatPoints,
  getReferralInsights,
  shareTemplates
} from "../data/referralData";
import { Skeleton, SkeletonCard } from "../components/ui/Skeleton";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const ReferralCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "referrals" | "rewards" | "share">("overview");
  const [selectedShareMethod, setSelectedShareMethod] = useState<"email" | "sms" | "social" | "link">("link");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading] = useState(false);

  const insights = getReferralInsights();
  const currentTier = getCurrentTier(referralStats.successfulReferrals);
  const nextTier = getNextTier(referralStats.successfulReferrals);
  const pendingReferrals = getPendingReferrals();
  const successfulReferrals = getSuccessfulReferrals();
  const referralLink = generateReferralLink("user-123");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const statusColor = (status: string) => {
    if (status === "completed" || status === "first_treatment") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === "signed_up") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (status === "pending") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-white/5 text-[#A1A1AA] border-white/10";
  };

  const StatusIcon = ({ status }: { status: string }) => {
    const cls = "w-4 h-4";
    if (status === "pending") return <Clock className={`${cls} text-yellow-400`} />;
    if (status === "signed_up") return <Users className={`${cls} text-blue-400`} />;
    if (status === "first_treatment" || status === "completed") return <CheckCircle className={`${cls} text-green-400`} />;
    return <Clock className={`${cls} text-[#71717A]`} />;
  };

  const TierCard = ({ tier, isCurrent, isNext }: { tier: any; isCurrent: boolean; isNext: boolean }) => (
    <motion.div
      className={`p-4 rounded-xl border transition-colors ${
        isCurrent
          ? "bg-purple-600/10 border-purple-500/40"
          : isNext
          ? "bg-white/3 border-purple-500/20 border-dashed"
          : "bg-[#0F0F14] border-white/5"
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
          isCurrent ? "bg-purple-600 text-white" : "bg-white/5 text-[#A1A1AA]"
        }`}>
          {tier.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${isCurrent ? "text-purple-400" : "text-white"}`}>{tier.name}</h4>
          <p className="text-xs text-[#71717A]">{tier.threshold}+ referrals</p>
        </div>
        {isCurrent && <span className="bg-purple-600/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/20">Current</span>}
        {isNext && <span className="bg-white/5 text-[#A1A1AA] text-xs px-2 py-0.5 rounded-full border border-white/10">Next</span>}
      </div>
      <div className="space-y-1">
        {tier.benefits.slice(0, 2).map((benefit: string, i: number) => (
          <p key={i} className="text-xs text-[#A1A1AA] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
            {benefit}
          </p>
        ))}
      </div>
    </motion.div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "referrals", label: "My Referrals", icon: Users },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "share", label: "Share & Invite", icon: Share2 },
  ];

  return (
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Referral Center</h1>
            <p className="text-[#A1A1AA] mt-1">Share the beauty experience and earn rewards</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-purple-600/20 text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full border border-purple-500/30">
              {currentTier.icon} {currentTier.name}
            </span>
            <motion.button
              onClick={() => setActiveTab("share")}
              className="bg-[#6D28D9] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#5B21B6] transition-colors flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Share2 className="w-4 h-4" />
              Share Now
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} className="h-32" />)}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="p-5 bg-gradient-to-br from-purple-700 to-fuchsia-700 text-white rounded-2xl shadow-xl shadow-purple-900/30">
              <div className="flex items-center gap-3">
                <Gift className="w-10 h-10 text-white/80" />
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Points Earned</p>
                  <p className="text-2xl font-black">{formatPoints(referralStats.totalPointsEarned)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="p-5 bg-[#1C1C24] rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-purple-600/15 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-[#71717A] text-xs uppercase tracking-widest font-semibold">Successful</p>
                  <p className="text-2xl font-black text-white">{referralStats.successfulReferrals}</p>
                </div>
              </div>
              <p className="text-xs text-purple-400">{insights.conversionRate}% conversion</p>
            </motion.div>

            <motion.div variants={item} className="p-5 bg-[#1C1C24] rounded-2xl border border-white/5 hover:border-yellow-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-[#71717A] text-xs uppercase tracking-widest font-semibold">Pending</p>
                  <p className="text-2xl font-black text-white">{referralStats.pendingReferrals}</p>
                </div>
              </div>
              <p className="text-xs text-[#71717A]">Awaiting signup</p>
            </motion.div>

            <motion.div variants={item} className="p-5 bg-[#1C1C24] rounded-2xl border border-white/5 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[#71717A] text-xs uppercase tracking-widest font-semibold">Streak</p>
                  <p className="text-2xl font-black text-white">{referralStats.currentStreak}</p>
                </div>
              </div>
              <p className="text-xs text-[#71717A]">Consecutive months</p>
            </motion.div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex bg-[#1C1C24] rounded-xl p-1 border border-white/5 overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-colors whitespace-nowrap min-w-0 ${
                activeTab === tab.id ? "bg-[#6D28D9] text-white" : "text-[#A1A1AA] hover:text-white"
              }`}
              whileHover={activeTab !== tab.id ? { scale: 1.01 } : {}}
              whileTap={{ scale: 0.97 }}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-5">
                {/* Tier Progress */}
                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-6">
                  <h3 className="text-lg font-bold text-white mb-5">Your Referral Journey</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <TierCard tier={currentTier} isCurrent={true} isNext={false} />
                    {nextTier && <TierCard tier={nextTier} isCurrent={false} isNext={true} />}
                  </div>
                  {nextTier && (
                    <div className="p-4 bg-[#0F0F14] rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white text-sm">Progress to {nextTier.name}</h4>
                        <span className="text-purple-400 font-semibold text-sm">{insights.referralsUntilNextTier} more</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2.5">
                        <motion.div
                          className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(referralStats.successfulReferrals / nextTier.threshold) * 100}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Referrals */}
                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white">Recent Referrals</h3>
                    <button onClick={() => setActiveTab("referrals")} className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center gap-1 transition-colors">
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {userReferrals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                        <Inbox className="w-6 h-6 text-[#A1A1AA]" />
                      </div>
                      <p className="text-white font-semibold">No referrals yet</p>
                      <p className="text-[#71717A] text-sm mt-1">Share your link to start earning rewards.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userReferrals.slice(0, 4).map((referral) => (
                        <div key={referral.id} className="flex items-center gap-4 p-3 bg-[#0F0F14] rounded-xl border border-white/5">
                          <StatusIcon status={referral.status} />
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{referral.friendName}</p>
                            <p className="text-xs text-[#71717A] capitalize">{referral.status.replace("_", " ")}{referral.membershipTier ? ` · ${referral.membershipTier}` : ""}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white text-sm">{formatPoints(referral.pointsEarned)}</p>
                            {referral.bonusPointsEarned && (
                              <p className="text-xs text-green-400">+{formatPoints(referral.bonusPointsEarned)} bonus</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="space-y-5">
                {/* Quick Share */}
                <div className="bg-gradient-to-br from-purple-700 to-fuchsia-700 rounded-2xl p-5 shadow-xl shadow-purple-900/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Share2 className="w-5 h-5 text-white" />
                    <h3 className="text-base font-bold text-white">Share Your Link</h3>
                  </div>
                  <p className="text-white/80 mb-4 text-sm">Earn {formatPoints(100)} for each friend who joins</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-xl text-white text-sm bg-white/15 border border-white/20 focus:outline-none"
                    />
                    <motion.button
                      onClick={() => copyToClipboard(referralLink)}
                      className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-5">
                  <h3 className="text-base font-bold text-white mb-4">Performance</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Conversion Rate", value: `${insights.conversionRate}%` },
                      { label: "Avg Points/Referral", value: `${insights.avgPointsPerReferral}` },
                      { label: "Lifetime Value", value: `$${referralStats.lifetimeValue.toLocaleString()}`, accent: "text-green-400" },
                      { label: "Global Rank", value: `#${referralStats.rank}`, accent: "text-purple-400" },
                    ].map(({ label, value, accent }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-[#A1A1AA]">{label}</span>
                        <span className={`font-semibold text-sm ${accent || "text-white"}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Milestone */}
                <div className="bg-[#1C1C24] rounded-2xl border border-green-500/20 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <h3 className="text-base font-bold text-white">Next Milestone</h3>
                  </div>
                  <p className="text-white font-bold mb-1">{formatPoints(insights.projectedMonthlyEarnings)} this month</p>
                  <p className="text-sm text-[#A1A1AA]">Based on current pace</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "referrals" && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Filters */}
              <div className="flex gap-3 overflow-x-auto">
                {[
                  { status: "all", label: "All", count: userReferrals.length },
                  { status: "pending", label: "Pending", count: pendingReferrals.length },
                  { status: "successful", label: "Successful", count: successfulReferrals.length },
                ].map((f) => (
                  <span key={f.status} className="px-4 py-1.5 rounded-full border border-white/10 text-sm text-[#A1A1AA] cursor-pointer hover:border-purple-500/40 hover:text-purple-400 transition-colors whitespace-nowrap">
                    {f.label} ({f.count})
                  </span>
                ))}
              </div>

              {userReferrals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-[#A1A1AA]" />
                  </div>
                  <h3 className="text-white font-bold text-lg">No referrals yet</h3>
                  <p className="text-[#71717A] text-sm mt-1 max-w-xs">Share your link and bring friends to Reflect.</p>
                  <motion.button
                    onClick={() => setActiveTab("share")}
                    className="mt-6 bg-[#6D28D9] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5B21B6] transition-colors"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Share My Link
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {userReferrals.map((referral) => (
                    <motion.div
                      key={referral.id}
                      variants={item}
                      className="bg-[#1C1C24] rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm ${
                            referral.status === "completed" || referral.status === "first_treatment" ? "bg-green-600/20 text-green-400" :
                            referral.status === "signed_up" ? "bg-blue-600/20 text-blue-400" :
                            referral.status === "pending" ? "bg-yellow-600/20 text-yellow-400" :
                            "bg-white/5 text-[#A1A1AA]"
                          }`}>
                            {referral.friendName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-sm">{referral.friendName}</h4>
                            <p className="text-xs text-[#71717A]">{referral.friendEmail}</p>
                          </div>
                        </div>
                        <StatusIcon status={referral.status} />
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#A1A1AA]">Status</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor(referral.status)}`}>
                            {referral.status.replace("_", " ")}
                          </span>
                        </div>
                        {referral.membershipTier && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#A1A1AA]">Membership</span>
                            <span className="text-sm text-white font-medium">{referral.membershipTier}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#A1A1AA]">Points Earned</span>
                          <span className="font-semibold text-white text-sm">{formatPoints(referral.pointsEarned)}</span>
                        </div>
                        {referral.bonusPointsEarned && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#A1A1AA]">Bonus Points</span>
                            <span className="font-semibold text-green-400 text-sm">+{formatPoints(referral.bonusPointsEarned)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#A1A1AA]">Sent</span>
                          <span className="text-sm text-white">{referral.sentDate}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "rewards" && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Milestones */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Reward Milestones</h3>
                {referralRewards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-[#1C1C24] rounded-2xl border border-white/5">
                    <Gift className="w-10 h-10 text-[#A1A1AA] mb-3" />
                    <p className="text-white font-semibold">No milestones yet</p>
                    <p className="text-[#71717A] text-sm mt-1">Keep referring friends to unlock rewards.</p>
                  </div>
                ) : (
                  <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
                    {referralRewards.map((reward) => (
                      <motion.div
                        key={reward.id}
                        variants={item}
                        className={`p-5 rounded-2xl border transition-colors ${
                          reward.isCompleted ? "bg-green-500/5 border-green-500/20" : "bg-[#1C1C24] border-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            reward.isCompleted ? "bg-green-500/20 text-green-400" : "bg-purple-600/15 text-purple-400"
                          }`}>
                            {reward.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white text-sm">{reward.milestone}</h4>
                              <span className={`font-bold text-sm ${reward.isCompleted ? "text-green-400" : "text-purple-400"}`}>
                                {formatPoints(reward.pointsEarned)}
                              </span>
                            </div>
                            <p className="text-xs text-[#A1A1AA] mb-2">{reward.description}</p>
                            {reward.isCompleted ? (
                              <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20">
                                Completed {reward.completedDate}
                              </span>
                            ) : (
                              <span className="bg-white/5 text-[#A1A1AA] text-xs px-2 py-0.5 rounded-full border border-white/10">
                                {reward.pointsRequired} referral{reward.pointsRequired > 1 ? "s" : ""} needed
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Tiers */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Referral Tiers</h3>
                <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
                  {referralTiers.map((tier) => {
                    const isCurrent = tier.name === currentTier.name;
                    const isNext = tier.name === nextTier?.name;
                    const isUnlocked = referralStats.successfulReferrals >= tier.threshold;

                    return (
                      <motion.div
                        key={tier.name}
                        variants={item}
                        className={`p-5 rounded-2xl border transition-colors ${
                          isCurrent ? "bg-purple-600/10 border-purple-500/40" :
                          isNext ? "bg-white/2 border-purple-500/20 border-dashed" :
                          isUnlocked ? "bg-[#1C1C24] border-white/5" :
                          "bg-[#1C1C24] border-white/3 opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                            isCurrent ? "bg-purple-600/20" : "bg-white/5"
                          }`}>
                            {tier.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-bold ${isCurrent ? "text-purple-400" : "text-white"}`}>{tier.name}</h4>
                              {isCurrent && <span className="bg-purple-600/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/20">Current</span>}
                              {isNext && <span className="bg-white/5 text-[#A1A1AA] text-xs px-2 py-0.5 rounded-full border border-white/10">Next</span>}
                            </div>
                            <p className="text-xs text-[#71717A] mb-3">{tier.threshold}+ referrals · {tier.bonusMultiplier}x multiplier</p>
                            <div className="space-y-1.5">
                              {tier.benefits.map((benefit: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isUnlocked ? "text-green-400" : "text-[#71717A]"}`} />
                                  <span className={`text-xs ${isUnlocked ? "text-[#A1A1AA]" : "text-[#71717A]"}`}>{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "share" && (
            <motion.div
              key="share"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Share Methods */}
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-white">Share Your Referral Link</h3>

                {/* Method Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "link", label: "Copy Link", icon: Copy },
                    { id: "email", label: "Email", icon: Mail },
                    { id: "sms", label: "SMS", icon: MessageSquare },
                    { id: "social", label: "Social", icon: Share2 },
                  ].map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setSelectedShareMethod(method.id as any)}
                      className={`p-4 rounded-xl border transition-colors ${
                        selectedShareMethod === method.id
                          ? "border-purple-500/40 bg-purple-600/10"
                          : "border-white/5 bg-[#1C1C24] hover:border-white/10"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <method.icon className={`w-5 h-5 mx-auto mb-2 ${selectedShareMethod === method.id ? "text-purple-400" : "text-[#A1A1AA]"}`} />
                      <p className={`text-xs font-medium ${selectedShareMethod === method.id ? "text-purple-400" : "text-[#A1A1AA]"}`}>{method.label}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Share Content */}
                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-6">
                  {selectedShareMethod === "link" && (
                    <div>
                      <h4 className="font-semibold text-white mb-4">Your Referral Link</h4>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={referralLink}
                          readOnly
                          className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/40 bg-[#0F0F14] text-white text-sm"
                        />
                        <motion.button
                          onClick={() => copyToClipboard(referralLink)}
                          className="px-5 py-2.5 bg-[#6D28D9] text-white rounded-xl font-semibold hover:bg-[#5B21B6] transition-colors flex items-center gap-2 text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {copiedLink ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                        </motion.button>
                      </div>
                      <p className="text-sm text-[#71717A]">Share this link with friends to earn referral points!</p>
                    </div>
                  )}

                  {selectedShareMethod === "email" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Email Template</h4>
                      <div>
                        <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Subject</label>
                        <input type="text" value={shareTemplates.email.subject} readOnly className="w-full px-4 py-2.5 border border-white/10 rounded-xl bg-[#0F0F14] text-white text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Message</label>
                        <textarea value={shareTemplates.email.body.replace("{referralLink}", referralLink).replace("{yourName}", "Sarah")} rows={7} readOnly className="w-full px-4 py-2.5 border border-white/10 rounded-xl bg-[#0F0F14] text-white text-sm focus:outline-none resize-none" />
                      </div>
                      <motion.button className="w-full bg-[#6D28D9] text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-[#5B21B6] transition-colors flex items-center justify-center gap-2 text-sm" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                        <Mail className="w-4 h-4" /> Open Email Client
                      </motion.button>
                    </div>
                  )}

                  {selectedShareMethod === "sms" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">SMS Template</h4>
                      <textarea value={shareTemplates.sms.message.replace("{referralLink}", referralLink)} rows={4} readOnly className="w-full px-4 py-2.5 border border-white/10 rounded-xl bg-[#0F0F14] text-white text-sm focus:outline-none resize-none" />
                      <motion.button className="w-full bg-[#6D28D9] text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-[#5B21B6] transition-colors flex items-center justify-center gap-2 text-sm" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                        <MessageSquare className="w-4 h-4" /> Open Messages
                      </motion.button>
                    </div>
                  )}

                  {selectedShareMethod === "social" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Social Media</h4>
                      <textarea value={shareTemplates.social.message} rows={4} readOnly className="w-full px-4 py-2.5 border border-white/10 rounded-xl bg-[#0F0F14] text-white text-sm focus:outline-none resize-none" />
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { platform: "Instagram", icon: Instagram, color: "bg-pink-600/20 text-pink-400 border-pink-500/20 hover:bg-pink-600/30" },
                          { platform: "Facebook", icon: Facebook, color: "bg-blue-600/20 text-blue-400 border-blue-500/20 hover:bg-blue-600/30" },
                          { platform: "Twitter", icon: Twitter, color: "bg-sky-600/20 text-sky-400 border-sky-500/20 hover:bg-sky-600/30" },
                        ].map((s) => (
                          <motion.button key={s.platform} className={`border py-2.5 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm ${s.color}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <s.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{s.platform}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-white">Referral Tips</h3>

                <div className="bg-gradient-to-br from-purple-700 to-fuchsia-700 rounded-2xl p-5 shadow-xl shadow-purple-900/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-white" />
                    <h4 className="text-base font-bold text-white">Maximize Your Earnings</h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Share with friends interested in skincare and aesthetic treatments",
                      "Explain the membership savings — they can save hundreds on their first treatment",
                      "Share your own results and experiences to build trust",
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">{i + 1}</div>
                        <p className="text-sm text-white/85">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-5">
                  <h4 className="font-bold text-white mb-4">How It Works</h4>
                  <div className="space-y-4">
                    {[
                      { icon: Share2, title: "Share Your Link", desc: "Send your unique referral link to friends" },
                      { icon: Users, title: "Friend Signs Up", desc: "They create an account and choose a membership" },
                      { icon: Gift, title: "Earn Points", desc: "Get points when they complete their first treatment" },
                    ].map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-purple-600/15 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-white text-sm">{title}</h5>
                          <p className="text-xs text-[#A1A1AA] mt-0.5">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1C1C24] rounded-2xl border border-green-500/20 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-green-400" />
                    <h4 className="font-bold text-white">Bonus Opportunities</h4>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Premium tier signup", value: "+75 pts bonus" },
                      { label: "Monthly streak", value: "+200 pts bonus" },
                      { label: "Tier advancement", value: "Multiplier boost" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-[#A1A1AA]">{label}</span>
                        <span className="font-semibold text-green-400 text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default ReferralCenter;

