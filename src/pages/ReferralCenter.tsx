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
    if (status === "completed" || status === "first_treatment") return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
    if (status === "signed_up") return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    if (status === "pending") return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    return "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600";
  };

  const StatusIcon = ({ status }: { status: string }) => {
    const cls = "w-4 h-4";
    if (status === "pending") return <Clock className={`${cls} text-yellow-500 dark:text-yellow-400`} />;
    if (status === "signed_up") return <Users className={`${cls} text-blue-500 dark:text-blue-400`} />;
    if (status === "first_treatment" || status === "completed") return <CheckCircle className={`${cls} text-green-500 dark:text-green-400`} />;
    return <Clock className={`${cls} text-gray-400`} />;
  };

  const TierCard = ({ tier, isCurrent, isNext }: { tier: any; isCurrent: boolean; isNext: boolean }) => (
    <motion.div
      className={`p-4 rounded-xl border transition-colors ${
        isCurrent
          ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700"
          : isNext
          ? "bg-white dark:bg-gray-800 border-violet-200 dark:border-violet-800 border-dashed"
          : "bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600"
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
          isCurrent ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
        }`}>
          {tier.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${isCurrent ? "text-violet-700 dark:text-violet-400" : "text-gray-900 dark:text-white"}`}>{tier.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tier.threshold}+ referrals</p>
        </div>
        {isCurrent && <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-700">Current</span>}
        {isNext && <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">Next</span>}
      </div>
      <div className="space-y-1">
        {tier.benefits.slice(0, 2).map((benefit: string, i: number) => (
          <p key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-violet-500 dark:text-violet-400 flex-shrink-0" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Referral Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Share the experience and earn rewards</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-violet-200 dark:border-violet-700">
            {currentTier.icon} {currentTier.name}
          </span>
          <motion.button
            onClick={() => setActiveTab("share")}
            className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
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
          <motion.div variants={item} className="p-5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <Gift className="w-10 h-10 text-white/80" />
              <div>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Points Earned</p>
                <p className="text-2xl font-black">{formatPoints(referralStats.totalPointsEarned)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-semibold">Successful</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{referralStats.successfulReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-violet-600 dark:text-violet-400">{insights.conversionRate}% conversion</p>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-semibold">Pending</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{referralStats.pendingReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting signup</p>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-semibold">Streak</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{referralStats.currentStreak}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Consecutive months</p>
          </motion.div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-colors whitespace-nowrap min-w-0 ${
              activeTab === tab.id
                ? "bg-violet-600 dark:bg-violet-500 text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Your Referral Journey</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <TierCard tier={currentTier} isCurrent={true} isNext={false} />
                  {nextTier && <TierCard tier={nextTier} isCurrent={false} isNext={true} />}
                </div>
                {nextTier && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Progress to {nextTier.name}</h4>
                      <span className="text-violet-600 dark:text-violet-400 font-semibold text-sm">{insights.referralsUntilNextTier} more</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <motion.div
                        className="bg-gradient-to-r from-violet-600 to-violet-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(referralStats.successfulReferrals / nextTier.threshold) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Referrals */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Referrals</h3>
                  <button onClick={() => setActiveTab("referrals")} className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium text-sm flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {userReferrals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                      <Inbox className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">No referrals yet</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Share your link to start earning rewards.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userReferrals.slice(0, 4).map((referral) => (
                      <div key={referral.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                        <StatusIcon status={referral.status} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{referral.friendName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{referral.status.replace("_", " ")}{referral.membershipTier ? ` · ${referral.membershipTier}` : ""}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{formatPoints(referral.pointsEarned)}</p>
                          {referral.bonusPointsEarned && (
                            <p className="text-xs text-green-600 dark:text-green-400">+{formatPoints(referral.bonusPointsEarned)} bonus</p>
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
              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
                <div className="space-y-3">
                  {[
                    { label: "Conversion Rate", value: `${insights.conversionRate}%` },
                    { label: "Avg Points/Referral", value: `${insights.avgPointsPerReferral}` },
                    { label: "Lifetime Value", value: `$${referralStats.lifetimeValue.toLocaleString()}`, accent: "text-green-600 dark:text-green-400" },
                    { label: "Global Rank", value: `#${referralStats.rank}`, accent: "text-violet-600 dark:text-violet-400" },
                  ].map(({ label, value, accent }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                      <span className={`font-semibold text-sm ${accent || "text-gray-900 dark:text-white"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Milestone */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Next Milestone</h3>
                </div>
                <p className="text-gray-900 dark:text-white font-bold mb-1">{formatPoints(insights.projectedMonthlyEarnings)} this month</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Based on current pace</p>
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
                <span key={f.status} className="px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 transition-colors whitespace-nowrap">
                  {f.label} ({f.count})
                </span>
              ))}
            </div>

            {userReferrals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">No referrals yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xs">Share your link and bring friends to Reflect.</p>
                <motion.button
                  onClick={() => setActiveTab("share")}
                  className="mt-6 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
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
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                          referral.status === "completed" || referral.status === "first_treatment" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                          referral.status === "signed_up" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" :
                          referral.status === "pending" ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" :
                          "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}>
                          {referral.friendName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{referral.friendName}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{referral.friendEmail}</p>
                        </div>
                      </div>
                      <StatusIcon status={referral.status} />
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor(referral.status)}`}>
                          {referral.status.replace("_", " ")}
                        </span>
                      </div>
                      {referral.membershipTier && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Membership</span>
                          <span className="text-sm text-gray-900 dark:text-white font-medium">{referral.membershipTier}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Points Earned</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{formatPoints(referral.pointsEarned)}</span>
                      </div>
                      {referral.bonusPointsEarned && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Bonus Points</span>
                          <span className="font-semibold text-green-600 dark:text-green-400 text-sm">+{formatPoints(referral.bonusPointsEarned)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Sent</span>
                        <span className="text-sm text-gray-900 dark:text-white">{referral.sentDate}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reward Milestones</h3>
              {referralRewards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <Gift className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-900 dark:text-white font-semibold">No milestones yet</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Keep referring friends to unlock rewards.</p>
                </div>
              ) : (
                <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
                  {referralRewards.map((reward) => (
                    <motion.div
                      key={reward.id}
                      variants={item}
                      className={`p-5 rounded-2xl border transition-colors ${
                        reward.isCompleted ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          reward.isCompleted ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                        }`}>
                          {reward.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{reward.milestone}</h4>
                            <span className={`font-bold text-sm ${reward.isCompleted ? "text-green-600 dark:text-green-400" : "text-violet-600 dark:text-violet-400"}`}>
                              {formatPoints(reward.pointsEarned)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{reward.description}</p>
                          {reward.isCompleted ? (
                            <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                              Completed {reward.completedDate}
                            </span>
                          ) : (
                            <span className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Referral Tiers</h3>
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
                        isCurrent ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700" :
                        isNext ? "bg-white dark:bg-gray-800 border-violet-200 dark:border-violet-800 border-dashed" :
                        isUnlocked ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" :
                        "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                          isCurrent ? "bg-violet-100 dark:bg-violet-900/30" : "bg-gray-100 dark:bg-gray-700"
                        }`}>
                          {tier.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold ${isCurrent ? "text-violet-700 dark:text-violet-400" : "text-gray-900 dark:text-white"}`}>{tier.name}</h4>
                            {isCurrent && <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-700">Current</span>}
                            {isNext && <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">Next</span>}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{tier.threshold}+ referrals · {tier.bonusMultiplier}x multiplier</p>
                          <div className="space-y-1.5">
                            {tier.benefits.map((benefit: string, i: number) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isUnlocked ? "text-green-600 dark:text-green-400" : "text-gray-400"}`} />
                                <span className={`text-xs ${isUnlocked ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>{benefit}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Your Referral Link</h3>

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
                        ? "border-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <method.icon className={`w-5 h-5 mx-auto mb-2 ${selectedShareMethod === method.id ? "text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}`} />
                    <p className={`text-xs font-medium ${selectedShareMethod === method.id ? "text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}`}>{method.label}</p>
                  </motion.button>
                ))}
              </div>

              {/* Share Content */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                {selectedShareMethod === "link" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Your Referral Link</h4>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <motion.button
                        onClick={() => copyToClipboard(referralLink)}
                        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {copiedLink ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Share this link with friends to earn referral points!</p>
                  </div>
                )}

                {selectedShareMethod === "email" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email Template</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                      <input type="text" value={shareTemplates.email.subject} readOnly className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                      <textarea value={shareTemplates.email.body.replace("{referralLink}", referralLink).replace("{yourName}", "Sarah")} rows={7} readOnly className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none resize-none" />
                    </div>
                    <motion.button className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                      <Mail className="w-4 h-4" /> Open Email Client
                    </motion.button>
                  </div>
                )}

                {selectedShareMethod === "sms" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">SMS Template</h4>
                    <textarea value={shareTemplates.sms.message.replace("{referralLink}", referralLink)} rows={4} readOnly className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none resize-none" />
                    <motion.button className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                      <MessageSquare className="w-4 h-4" /> Open Messages
                    </motion.button>
                  </div>
                )}

                {selectedShareMethod === "social" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Social Media</h4>
                    <textarea value={shareTemplates.social.message} rows={4} readOnly className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none resize-none" />
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { platform: "Instagram", icon: Instagram, color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30" },
                        { platform: "Facebook", icon: Facebook, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30" },
                        { platform: "Twitter", icon: Twitter, color: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/30" },
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Referral Tips</h3>

              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h4 className="text-base font-bold text-white">Maximize Your Earnings</h4>
                </div>
                <div className="space-y-3">
                  {[
                    "Share with friends interested in skincare and aesthetic treatments",
                    "Explain the membership savings - they can save hundreds on their first treatment",
                    "Share your own results and experiences to build trust",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-white/85">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">How It Works</h4>
                <div className="space-y-4">
                  {[
                    { icon: Share2, title: "Share Your Link", desc: "Send your unique referral link to friends" },
                    { icon: Users, title: "Friend Signs Up", desc: "They create an account and choose a membership" },
                    { icon: Gift, title: "Earn Points", desc: "Get points when they complete their first treatment" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Bonus Opportunities</h4>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Premium tier signup", value: "+75 pts bonus" },
                    { label: "Monthly streak", value: "+200 pts bonus" },
                    { label: "Tier advancement", value: "Multiplier boost" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                      <span className="font-semibold text-green-600 dark:text-green-400 text-sm">{value}</span>
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
