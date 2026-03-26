import React, { useState, useEffect } from "react";
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
  Inbox,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import {
  getUserReferralCode,
  getReferrals,
  getReferralStats,
} from "../services/referralService";
import type { Referral, ReferralStats } from "../services/referralService";
import { Skeleton, SkeletonCard } from "../components/ui/Skeleton";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const BASE_URL = "https://reflect-medical.web.app";

const ReferralCenter: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "referrals" | "share">("overview");
  const [selectedShareMethod, setSelectedShareMethod] = useState<"link" | "sms" | "email">("link");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [referralCode, setReferralCode] = useState<string>("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalCreditsEarned: 0,
    totalEarned: 0,
  });

  const referralLink = referralCode ? `${BASE_URL}/signup?ref=${referralCode}` : "";

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [code, refs, s] = await Promise.all([
          getUserReferralCode(user.uid),
          getReferrals(user.uid),
          getReferralStats(user.uid),
        ]);
        setReferralCode(code);
        setReferrals(refs);
        setStats(s);
      } catch (err) {
        console.warn("ReferralCenter load error", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareViaSMS = () => {
    const msg = `I've been going to Reflect Medical in Hawthorne NJ and it's amazing! Use my code ${referralCode} for $25 Beauty Bank credits when you sign up: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(msg)}`);
  };

  const shareViaEmail = () => {
    const subject = "You're invited to Reflect Medical!";
    const body = `Hi!\n\nI've been going to Reflect Medical in Hawthorne NJ and the results have been amazing! I wanted to share my referral link with you.\n\nUse my code ${referralCode} when you sign up and you'll get $25 Beauty Bank credits after your first appointment!\n\nSign up here: ${referralLink}\n\nHope to see you there!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const statusColor = (status: string) => {
    if (status === "rewarded") return "bg-green-50 text-green-700 border-green-200";
    if (status === "joined") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const StatusIcon = ({ status }: { status: string }) => {
    const cls = "w-4 h-4";
    if (status === "pending") return <Clock className={`${cls} text-yellow-500`} />;
    if (status === "joined") return <Users className={`${cls} text-blue-500`} />;
    if (status === "rewarded") return <CheckCircle className={`${cls} text-green-500`} />;
    return <Clock className={`${cls} text-gray-400`} />;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "referrals", label: "My Referrals", icon: Users },
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
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Credits Earned</p>
                <p className="text-2xl font-black">${stats.totalEarned}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Total</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-violet-600">referrals sent</p>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Rewarded</p>
                <p className="text-2xl font-black text-gray-900">{stats.completedReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">completed referrals</p>
          </motion.div>

          <motion.div variants={item} className="p-5 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Pending</p>
                <p className="text-2xl font-black text-gray-900">{stats.pendingReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">awaiting completion</p>
          </motion.div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "overview" | "referrals" | "share")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-colors whitespace-nowrap min-w-0 ${
              activeTab === tab.id
                ? "bg-violet-600 text-white"
                : "text-gray-500 hover:text-gray-700"
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
              {/* How it works */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { icon: Share2, title: "Share Your Link", desc: "Send your unique referral link to friends" },
                    { icon: Users, title: "Friend Signs Up", desc: "They create an account using your code" },
                    { icon: Gift, title: "Both Earn $25", desc: "You and your friend each get $25 Beauty Bank credits after their first appointment" },
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

                {isLoading ? (
                  <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                ) : referrals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                      <Inbox className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-semibold">No referrals yet</p>
                    <p className="text-gray-500 text-sm mt-1">Share your link to start earning rewards.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.slice(0, 4).map((referral) => (
                      <div key={referral.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <StatusIcon status={referral.status} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{referral.refereeName || referral.refereeEmail}</p>
                          <p className="text-xs text-gray-500 capitalize">{referral.status}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              {/* Quick Share */}
              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Share2 className="w-5 h-5 text-white" />
                  <h3 className="text-base font-bold text-white">Your Referral Link</h3>
                </div>
                <p className="text-white/80 mb-4 text-sm">Earn $25 Beauty Bank for each friend who joins</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-xl text-white text-xs bg-white/15 border border-white/20 focus:outline-none truncate"
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

              {/* Your Code */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Your Referral Code</h3>
                <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 text-center">
                  {isLoading ? (
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

        {activeTab === "referrals" && (
          <motion.div
            key="referrals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {isLoading ? (
              <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : referrals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No referrals yet</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">Share your link and bring friends to Reflect.</p>
                <motion.button
                  onClick={() => setActiveTab("share")}
                  className="mt-6 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
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
                {referrals.map((referral) => (
                  <motion.div
                    key={referral.id}
                    variants={item}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center font-bold text-sm text-violet-700">
                          {(referral.refereeName || referral.refereeEmail || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{referral.refereeName || "Friend"}</h4>
                          <p className="text-xs text-gray-500">{referral.refereeEmail}</p>
                        </div>
                      </div>
                      <StatusIcon status={referral.status} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Credits Earned</span>
                        <span className="font-semibold text-gray-900 text-sm">${referral.creditsEarned}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Sent</span>
                        <span className="text-sm text-gray-900">{new Date(referral.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
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
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900">Share Your Referral Link</h3>

              {/* Method Selection */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "link", label: "Copy Link", icon: Copy },
                  { id: "sms", label: "SMS", icon: MessageSquare },
                  { id: "email", label: "Email", icon: Mail },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    onClick={() => setSelectedShareMethod(method.id as "link" | "sms" | "email")}
                    className={`p-4 rounded-xl border transition-colors ${
                      selectedShareMethod === method.id
                        ? "border-violet-300 bg-violet-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <method.icon className={`w-5 h-5 mx-auto mb-2 ${selectedShareMethod === method.id ? "text-violet-600" : "text-gray-500"}`} />
                    <p className={`text-xs font-medium ${selectedShareMethod === method.id ? "text-violet-600" : "text-gray-500"}`}>{method.label}</p>
                  </motion.button>
                ))}
              </div>

              {/* Share Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                {selectedShareMethod === "link" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Your Referral Link</h4>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none bg-gray-50 text-gray-900 text-sm"
                      />
                      <motion.button
                        onClick={() => copyToClipboard(referralLink)}
                        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {copiedLink ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-500">Share this link with friends to earn $25 Beauty Bank credits!</p>
                  </div>
                )}

                {selectedShareMethod === "sms" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Share via Text</h4>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                      I've been going to Reflect Medical in Hawthorne NJ and it's amazing! Use my code{" "}
                      <span className="font-bold text-violet-700">{referralCode}</span> for $25 Beauty Bank credits when you sign up:{" "}
                      <span className="text-violet-600">{referralLink}</span>
                    </div>
                    <motion.button
                      onClick={shareViaSMS}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <MessageSquare className="w-4 h-4" /> Open Messages
                    </motion.button>
                  </div>
                )}

                {selectedShareMethod === "email" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Share via Email</h4>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2">
                      <p><span className="font-semibold">Subject:</span> You're invited to Reflect Medical!</p>
                      <p className="leading-relaxed">
                        I've been going to Reflect Medical in Hawthorne NJ and it's amazing! Use my code{" "}
                        <span className="font-bold text-violet-700">{referralCode}</span> when you sign up for $25 in Beauty Bank credits.
                      </p>
                    </div>
                    <motion.button
                      onClick={shareViaEmail}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Mail className="w-4 h-4" /> Open Email Client
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900">Referral Tips</h3>

              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5">
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

              <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Reward Details</h4>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "You earn per referral", value: "$25 Beauty Bank" },
                    { label: "Your friend earns", value: "$25 Beauty Bank" },
                    { label: "When credited", value: "After friend's 1st appt" },
                    { label: "No limit on referrals", value: "✓ Unlimited" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="font-semibold text-green-700 text-sm">{value}</span>
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
