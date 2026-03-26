import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Gift,
  Share2,
  Copy,
  Mail,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Inbox,
  Star,
  Zap,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import {
  getUserReferralCode,
  getReferralStats,
  subscribeToReferrals,
} from "../services/referralService";
import type { Referral, ReferralStats } from "../services/referralService";
import { SkeletonCard } from "../components/ui/Skeleton";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const BASE_URL = "https://reflect-medical.web.app";

type TabId = "overview" | "referrals" | "rewards" | "share";

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusBadgeClass(status: Referral["status"]): string {
  switch (status) {
    case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "signed_up": return "bg-blue-50 text-blue-700 border-blue-200";
    case "first_treatment": return "bg-orange-50 text-orange-700 border-orange-200";
    case "completed": return "bg-green-50 text-green-700 border-green-200";
    case "expired": return "bg-gray-50 text-gray-500 border-gray-200";
  }
}

function statusLabel(status: Referral["status"]): string {
  switch (status) {
    case "pending": return "Pending";
    case "signed_up": return "Signed Up";
    case "first_treatment": return "Treatment Done";
    case "completed": return "Completed";
    case "expired": return "Expired";
  }
}

const StatusIcon = ({ status }: { status: Referral["status"] }) => {
  const cls = "w-4 h-4";
  if (status === "pending") return <Clock className={`${cls} text-yellow-500`} />;
  if (status === "signed_up") return <Users className={`${cls} text-blue-500`} />;
  if (status === "first_treatment") return <Star className={`${cls} text-orange-500`} />;
  if (status === "completed") return <CheckCircle className={`${cls} text-green-500`} />;
  return <Clock className={`${cls} text-gray-400`} />;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const StatSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
    {[...Array(4)].map((_, i) => (
      <SkeletonCard key={i} className="h-28" />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ReferralCenter: React.FC = () => {
  const { user, profile } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [copied, setCopied] = useState(false);
  const [referralFilter, setReferralFilter] = useState<"all" | "pending" | "successful">("all");

  const referralLink = referralCode ? `${BASE_URL}/signup?ref=${referralCode}` : "";

  useEffect(() => {
    if (!user) return;
    let unsub: (() => void) | undefined;

    Promise.all([
      getUserReferralCode(user.uid, profile?.name),
      getReferralStats(user.uid),
    ]).then(([code, s]) => {
      setReferralCode(code);
      setStats(s);
      setLoading(false);
    });

    unsub = subscribeToReferrals(user.uid, setReferrals);
    return () => unsub?.();
  }, [user]);

  const copyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaSMS = () => {
    const msg = `Hey! I've been going to Reflect Medical in Hawthorne NJ and it's been amazing! Use my code ${referralCode} when you sign up to earn Beauty Bank credits: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(msg)}`);
  };

  const shareViaEmail = () => {
    const subject = "You're invited to Reflect Medical!";
    const body = `Hi!\n\nI've been going to Reflect Medical in Hawthorne NJ and the results have been incredible. I wanted to share my referral link with you!\n\nUse my code ${referralCode} when you sign up and you'll earn Beauty Bank credits after your first appointment!\n\nSign up here: ${referralLink}\n\nHope to see you there!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareViaWhatsApp = () => {
    const msg = `Hey! I've been going to Reflect Medical in Hawthorne NJ 🌟 Use my code ${referralCode} when you sign up to earn Beauty Bank credits: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  const filteredReferrals = referrals.filter((r) => {
    if (referralFilter === "pending") return r.status === "pending" || r.status === "signed_up" || r.status === "first_treatment";
    if (referralFilter === "successful") return r.status === "completed";
    return true;
  });

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
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
          <h1 className="text-2xl font-bold text-gray-900">Referral Center</h1>
          <p className="text-gray-500 mt-1">Share the experience and earn Beauty Bank credits</p>
        </div>
        <motion.button
          onClick={() => setActiveTab("share")}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <Share2 className="w-4 h-4" />
          Share Now
        </motion.button>
      </div>

      {/* Stats Row */}
      {loading ? (
        <StatSkeleton />
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="p-5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <Gift className="w-9 h-9 text-white/80" />
              <div>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Total Points</p>
                <p className="text-2xl font-black">{stats?.totalPoints ?? 0}</p>
              </div>
            </div>
            <p className="text-white/60 text-xs mt-2">${stats?.totalPoints ?? 0} Beauty Bank value</p>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Successful</p>
                <p className="text-2xl font-black text-gray-900">{stats?.successfulReferrals ?? 0}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">completed referrals</p>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Pending</p>
                <p className="text-2xl font-black text-gray-900">{stats?.pendingReferrals ?? 0}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">in progress</p>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Streak</p>
                <p className="text-2xl font-black text-gray-900">{stats?.streak ?? 0}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">months active</p>
          </motion.div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-200 overflow-x-auto gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-colors whitespace-nowrap min-w-0 ${
              activeTab === tab.id
                ? "bg-violet-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <tab.icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-5">
              {/* Recent Referrals */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Referrals</h3>
                  <button
                    onClick={() => setActiveTab("referrals")}
                    className="text-violet-600 hover:text-violet-700 font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                ) : referrals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-3">
                      <Users className="w-7 h-7 text-violet-400" />
                    </div>
                    <p className="text-gray-900 font-semibold">No referrals yet</p>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs">You haven't referred anyone yet. Share your link to start earning!</p>
                    <motion.button
                      onClick={() => setActiveTab("share")}
                      className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Share My Link
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.slice(0, 3).map((referral) => (
                      <div key={referral.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center font-bold text-sm text-violet-700 flex-shrink-0">
                          {(referral.referredName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {referral.referredName || "Pending signup"}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{statusLabel(referral.status)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusBadgeClass(referral.status)}`}>
                            {statusLabel(referral.status)}
                          </span>
                          {(referral.pointsEarned + referral.bonusPoints) > 0 && (
                            <p className="text-xs text-violet-600 font-semibold mt-1">
                              +{referral.pointsEarned + referral.bonusPoints} pts
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* How it works */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { icon: Share2, title: "Share Your Link", desc: "Send your unique referral link to friends and family" },
                    { icon: Users, title: "Friend Signs Up", desc: "They create an account using your code — you earn 100 pts ($100 Beauty Bank)" },
                    { icon: Gift, title: "Earn More as They Progress", desc: "First treatment: +50 pts. Membership: +50 pts more. Total: 200 pts = $200 Beauty Bank!" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-violet-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm">{title}</h5>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Share2 className="w-5 h-5 text-white" />
                  <h3 className="text-base font-bold text-white">Your Referral Link</h3>
                </div>
                <p className="text-white/80 mb-4 text-sm">Earn points for every friend who joins</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-xl text-white text-xs bg-white/15 border border-white/20 focus:outline-none truncate"
                  />
                  <motion.button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Your Referral Code</h3>
                <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 text-center">
                  {loading ? (
                    <div className="h-7 w-32 bg-violet-100 rounded animate-pulse mx-auto" />
                  ) : (
                    <span className="font-mono font-bold text-violet-700 text-lg">{referralCode}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Share this code or the link above</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── My Referrals ── */}
        {activeTab === "referrals" && (
          <motion.div
            key="referrals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Filter tabs */}
            <div className="flex gap-2">
              {(["all", "pending", "successful"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setReferralFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    referralFilter === f
                      ? "bg-violet-600 text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : filteredReferrals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">
                  {referralFilter === "all" ? "No referrals yet" : `No ${referralFilter} referrals`}
                </h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">
                  {referralFilter === "all"
                    ? "Share your link and bring friends to Reflect."
                    : `You don't have any ${referralFilter} referrals right now.`}
                </p>
                {referralFilter === "all" && (
                  <motion.button
                    onClick={() => setActiveTab("share")}
                    className="mt-6 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Share My Link
                  </motion.button>
                )}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredReferrals.map((referral) => (
                  <motion.div
                    key={referral.id}
                    variants={item}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-violet-100 rounded-full flex items-center justify-center font-bold text-sm text-violet-700 flex-shrink-0">
                          {(referral.referredName || referral.referredEmail || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {referral.referredName || "Awaiting signup..."}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {referral.referredEmail || "—"}
                          </p>
                        </div>
                      </div>
                      <StatusIcon status={referral.status} />
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusBadgeClass(referral.status)}`}>
                          {statusLabel(referral.status)}
                        </span>
                      </div>
                      {referral.membershipTier && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Membership</span>
                          <span className="text-sm font-semibold text-violet-700">{referral.membershipTier}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Points Earned</span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {referral.pointsEarned + referral.bonusPoints} pts
                          {referral.bonusPoints > 0 && (
                            <span className="text-xs text-violet-500 ml-1">(+{referral.bonusPoints} bonus)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Date Sent</span>
                        <span className="text-sm text-gray-900">{referral.createdAt.toLocaleDateString()}</span>
                      </div>
                      {referral.completedAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Completed</span>
                          <span className="text-sm text-gray-900">{referral.completedAt.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Rewards ── */}
        {activeTab === "rewards" && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900">How Rewards Work</h3>

              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    icon: Users,
                    title: "Friend Signs Up",
                    desc: "Friend signs up with your code",
                    reward: "You earn 100 pts ($100 Beauty Bank)",
                    color: "bg-violet-50",
                    iconColor: "text-violet-600",
                  },
                  {
                    step: 2,
                    icon: Star,
                    title: "First Treatment",
                    desc: "Friend books their first treatment",
                    reward: "+50 pts bonus ($50 more)",
                    color: "bg-orange-50",
                    iconColor: "text-orange-600",
                  },
                  {
                    step: 3,
                    icon: Award,
                    title: "Becomes a Member",
                    desc: "Friend activates a membership",
                    reward: "+50 pts more = 200 pts total ($200 Beauty Bank!)",
                    color: "bg-green-50",
                    iconColor: "text-green-600",
                  },
                ].map(({ step, icon: Icon, title, desc, reward, color, iconColor }) => (
                  <div key={step} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 bg-gray-900 text-white rounded-full text-xs font-bold flex items-center justify-center">{step}</span>
                        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{desc}</p>
                      <p className="text-xs font-semibold text-violet-600">{reward}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Current balance */}
              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-6 h-6 text-white/80" />
                  <h3 className="text-lg font-bold">Your Points Balance</h3>
                </div>
                {loading ? (
                  <div className="h-10 bg-white/20 rounded-xl animate-pulse" />
                ) : (
                  <>
                    <p className="text-4xl font-black mb-1">{stats?.totalPoints ?? 0} pts</p>
                    <p className="text-white/70 text-sm">${stats?.totalPoints ?? 0} Beauty Bank credit value</p>
                  </>
                )}
              </div>

              {/* Conversion rate */}
              {stats && stats.successfulReferrals + stats.pendingReferrals > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Your Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Conversion Rate</span>
                      <span className="font-semibold text-gray-900 text-sm">{stats.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Lifetime Value</span>
                      <span className="font-semibold text-gray-900 text-sm">${stats.lifetimeValue} Beauty Bank</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Redeem */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-2">Redeem Points</h4>
                <p className="text-sm text-gray-500 mb-4">Points are automatically applied to your Beauty Bank account as you earn them. Visit the front desk or ask staff to redeem your Beauty Bank balance toward services.</p>
                <div className="bg-violet-50 rounded-xl p-3 border border-violet-100 text-center">
                  <p className="text-xs text-violet-600 font-medium">1 point = $1 Beauty Bank credit</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Share & Invite ── */}
        {activeTab === "share" && (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-5">
              {/* Code display */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Code</h3>
                <div className="bg-violet-50 rounded-xl border border-violet-200 p-4 text-center mb-4">
                  {loading ? (
                    <div className="h-8 w-40 bg-violet-100 rounded animate-pulse mx-auto" />
                  ) : (
                    <span className="font-mono font-black text-violet-700 text-2xl tracking-wider">{referralCode}</span>
                  )}
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Referral Link</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none bg-gray-50 text-gray-900 text-sm"
                  />
                  <motion.button
                    onClick={copyToClipboard}
                    className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {copied ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                  </motion.button>
                </div>
              </div>

              {/* Share buttons */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Via</h3>
                <div className="space-y-3">
                  <motion.button
                    onClick={shareViaSMS}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors text-left"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Share via SMS</p>
                      <p className="text-xs text-gray-500">Send a text message to a friend</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </motion.button>

                  <motion.button
                    onClick={shareViaEmail}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors text-left"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Share via Email</p>
                      <p className="text-xs text-gray-500">Send a personalized email invite</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </motion.button>

                  <motion.button
                    onClick={shareViaWhatsApp}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors text-left"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Share via WhatsApp</p>
                      <p className="text-xs text-gray-500">Send via WhatsApp messenger</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h4 className="text-base font-bold text-white">Referral Tips</h4>
                </div>
                <div className="space-y-3">
                  {[
                    "Share with friends who are interested in skincare, aesthetic treatments, or self-care",
                    "Explain the membership savings — they can save hundreds on their first treatment",
                    "Share your own results and experiences to build trust and excitement",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-white/85">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Reward Summary</h4>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Friend signs up", value: "100 pts = $100 Beauty Bank" },
                    { label: "Friend's first treatment", value: "+50 pts = $50 more" },
                    { label: "Friend becomes member", value: "+50 pts = $50 more" },
                    { label: "Maximum per referral", value: "200 pts = $200 Beauty Bank" },
                    { label: "No limit on referrals", value: "✓ Unlimited" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="font-semibold text-green-700 text-sm text-right">{value}</span>
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
