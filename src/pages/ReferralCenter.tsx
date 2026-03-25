"use client";

import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, Badge } from "../components/ui";
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
  ExternalLink,
  ArrowRight,
  Sparkles,
  Target,
  Crown,
  Zap,
  Plus
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

const ReferralCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "referrals" | "rewards" | "share">("overview");
  const [selectedShareMethod, setSelectedShareMethod] = useState<"email" | "sms" | "social" | "link">("link");
  const [copiedLink, setCopiedLink] = useState(false);
  
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

  const StatusIcon = ({ status }: { status: string }) => {
    const iconProps = { className: "w-4 h-4" };
    switch (status) {
      case "pending":
        return <Clock {...iconProps} className="w-4 h-4 text-yellow-500" />;
      case "signed_up":
        return <Users {...iconProps} className="w-4 h-4 text-blue-500" />;
      case "first_treatment":
        return <CheckCircle {...iconProps} className="w-4 h-4 text-[#B57EDC]" />;
      case "completed":
        return <Award {...iconProps} className="w-4 h-4 text-[#B57EDC]" />;
      case "expired":
        return <Clock {...iconProps} className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock {...iconProps} className="w-4 h-4 text-gray-400" />;
    }
  };

  const TierCard = ({ tier, isCurrent, isNext }: { tier: any, isCurrent: boolean, isNext: boolean }) => (
    <div className={`p-4 rounded-xl border transition-all ${
      isCurrent 
        ? 'bg-gradient-to-br from-[#B57EDC]/10 to-[#9F6BCB]/10 border-[#B57EDC] shadow-lg' 
        : isNext
          ? 'bg-[#F7F6FB] border-[#B57EDC]/30 border-dashed'
          : 'bg-white border-black/5'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
          isCurrent ? 'bg-[#B57EDC] text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {tier.icon}
        </div>
        <div>
          <h4 className={`font-semibold ${isCurrent ? 'text-[#B57EDC]' : 'text-[#1F2937]'}`}>
            {tier.name}
          </h4>
          <p className="text-xs text-[#6B7280]">{tier.threshold}+ referrals</p>
        </div>
        {isCurrent && (
          <Badge className="bg-[#B57EDC] text-white text-xs ml-auto">Current</Badge>
        )}
        {isNext && (
          <Badge variant="outline" className="border-[#B57EDC]/30 text-[#B57EDC] text-xs ml-auto">Next</Badge>
        )}
      </div>
      <div className="space-y-1">
        {tier.benefits.slice(0, 2).map((benefit: string, index: number) => (
          <p key={index} className="text-xs text-[#6B7280] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#B57EDC]" />
            {benefit}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Referral Center</h1>
            <p className="text-[#6B7280] mt-1">Share the beauty experience and earn rewards</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] text-white px-4 py-2">
              {currentTier.icon} {currentTier.name}
            </Badge>
            <button 
              onClick={() => setActiveTab("share")}
              className="bg-[#B57EDC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9F6BCB] transition-colors flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Now
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
            <div className="flex items-center gap-4">
              <Gift className="w-12 h-12 text-white/80" />
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wider font-medium">Points Earned</p>
                <p className="text-3xl font-bold">{formatPoints(referralStats.totalPointsEarned)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#B57EDC]/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#B57EDC]" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">Successful Referrals</p>
                <p className="text-2xl font-bold text-[#1F2937]">{referralStats.successfulReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-[#B57EDC]">{insights.conversionRate}% conversion rate</p>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">Pending</p>
                <p className="text-2xl font-bold text-[#1F2937]">{referralStats.pendingReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-[#6B7280]">Awaiting signup</p>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#B57EDC]/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#B57EDC]" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-[#1F2937]">{referralStats.currentStreak}</p>
              </div>
            </div>
            <p className="text-xs text-[#6B7280]">Consecutive months</p>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#F7F6FB] rounded-lg p-1">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "referrals", label: "My Referrals", icon: Users },
            { id: "rewards", label: "Rewards", icon: Gift },
            { id: "share", label: "Share & Invite", icon: Share2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#B57EDC] text-white shadow-lg'
                  : 'text-[#6B7280] hover:text-[#B57EDC]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tier Progress */}
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                <h3 className="text-xl font-semibold text-[#1F2937] mb-6">Your Referral Journey</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <TierCard tier={currentTier} isCurrent={true} isNext={false} />
                  {nextTier && <TierCard tier={nextTier} isCurrent={false} isNext={true} />}
                </div>

                {nextTier && (
                  <div className="p-4 bg-[#F7F6FB] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-[#1F2937]">Progress to {nextTier.name}</h4>
                      <span className="text-[#B57EDC] font-semibold">
                        {insights.referralsUntilNextTier} more referrals
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(referralStats.successfulReferrals / nextTier.threshold) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>

              {/* Recent Referrals */}
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#1F2937]">Recent Referrals</h3>
                  <button 
                    onClick={() => setActiveTab("referrals")}
                    className="text-[#B57EDC] hover:text-[#9F6BCB] font-medium text-sm flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {userReferrals.slice(0, 4).map((referral) => (
                    <div key={referral.id} className="flex items-center gap-4 p-4 bg-[#F7F6FB] rounded-xl">
                      <StatusIcon status={referral.status} />
                      <div className="flex-1">
                        <p className="font-medium text-[#1F2937]">{referral.friendName}</p>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <span className="capitalize">{referral.status.replace('_', ' ')}</span>
                          {referral.membershipTier && (
                            <>
                              <span>•</span>
                              <span>{referral.membershipTier} tier</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1F2937]">
                          {formatPoints(referral.pointsEarned)}
                        </p>
                        {referral.bonusPointsEarned && (
                          <p className="text-sm text-green-600">
                            +{formatPoints(referral.bonusPointsEarned)} bonus
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Share */}
              <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Share Your Link</h3>
                </div>
                <p className="text-white/90 mb-6 text-sm">
                  Send your referral link and earn {formatPoints(100)} for each friend who joins
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg text-[#1F2937] text-sm bg-white/90"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  >
                    {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </Card>

              {/* Performance Stats */}
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Performance</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Conversion Rate</span>
                    <span className="font-semibold text-[#1F2937]">{insights.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Avg Points/Referral</span>
                    <span className="font-semibold text-[#1F2937]">{insights.avgPointsPerReferral}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Lifetime Value</span>
                    <span className="font-semibold text-green-600">${referralStats.lifetimeValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Global Rank</span>
                    <span className="font-semibold text-[#B57EDC]">#{referralStats.rank}</span>
                  </div>
                </div>
              </Card>

              {/* Next Reward */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Next Milestone</h3>
                </div>
                <p className="text-green-800 font-semibold mb-2">
                  {formatPoints(insights.projectedMonthlyEarnings)} this month
                </p>
                <p className="text-sm text-green-600">
                  Based on current pace
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "referrals" && (
          <div className="space-y-6">
            {/* Referral Status Filter */}
            <div className="flex gap-4 overflow-x-auto">
              {[
                { status: "all", label: "All Referrals", count: userReferrals.length },
                { status: "pending", label: "Pending", count: pendingReferrals.length },
                { status: "successful", label: "Successful", count: successfulReferrals.length }
              ].map((filter) => (
                <Badge
                  key={filter.status}
                  variant="outline"
                  className="border-[#B57EDC]/20 text-[#6B7280] whitespace-nowrap cursor-pointer hover:border-[#B57EDC] hover:text-[#B57EDC]"
                >
                  {filter.label} ({filter.count})
                </Badge>
              ))}
            </div>

            {/* Referrals List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userReferrals.map((referral) => (
                <Card key={referral.id} className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        referral.status === 'completed' ? 'bg-[#B57EDC]' :
                        referral.status === 'first_treatment' ? 'bg-green-500' :
                        referral.status === 'signed_up' ? 'bg-blue-500' :
                        referral.status === 'pending' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}>
                        {referral.friendName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1F2937]">{referral.friendName}</h4>
                        <p className="text-sm text-[#6B7280]">{referral.friendEmail}</p>
                      </div>
                    </div>
                    <StatusIcon status={referral.status} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">Status</span>
                      <Badge variant="outline" className={`text-xs ${
                        referral.status === 'completed' ? 'border-[#B57EDC] text-[#B57EDC]' :
                        referral.status === 'first_treatment' ? 'border-green-500 text-green-700' :
                        referral.status === 'signed_up' ? 'border-blue-500 text-blue-700' :
                        referral.status === 'pending' ? 'border-yellow-500 text-yellow-700' :
                        'border-gray-400 text-gray-700'
                      }`}>
                        {referral.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {referral.membershipTier && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6B7280]">Membership</span>
                        <span className="text-sm font-medium text-[#1F2937]">{referral.membershipTier}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">Points Earned</span>
                      <span className="font-semibold text-[#1F2937]">{formatPoints(referral.pointsEarned)}</span>
                    </div>

                    {referral.bonusPointsEarned && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6B7280]">Bonus Points</span>
                        <span className="font-semibold text-green-600">+{formatPoints(referral.bonusPointsEarned)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">Sent</span>
                      <span className="text-sm text-[#1F2937]">{referral.sentDate}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reward Milestones */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1F2937]">Reward Milestones</h3>
              
              {referralRewards.map((reward) => (
                <Card key={reward.id} className={`p-6 rounded-2xl shadow-lg border transition-all ${
                  reward.isCompleted 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-white border-black/5'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      reward.isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[#B57EDC]/10 text-[#B57EDC]'
                    }`}>
                      {reward.isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Gift className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#1F2937]">{reward.milestone}</h4>
                        <span className={`font-bold ${
                          reward.isCompleted ? 'text-green-600' : 'text-[#B57EDC]'
                        }`}>
                          {formatPoints(reward.pointsEarned)}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] mb-3">{reward.description}</p>
                      {reward.isCompleted ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          ✓ Completed {reward.completedDate}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#B57EDC]/20 text-[#B57EDC] text-xs">
                          {reward.pointsRequired} referral{reward.pointsRequired > 1 ? 's' : ''} needed
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Referral Tiers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1F2937]">Referral Tiers</h3>
              
              {referralTiers.map((tier) => {
                const isCurrent = tier.name === currentTier.name;
                const isNext = tier.name === nextTier?.name;
                const isUnlocked = referralStats.successfulReferrals >= tier.threshold;
                
                return (
                  <Card key={tier.name} className={`p-6 rounded-2xl shadow-lg border transition-all ${
                    isCurrent 
                      ? 'bg-gradient-to-br from-[#B57EDC]/10 to-[#9F6BCB]/10 border-[#B57EDC]' 
                      : isNext
                        ? 'bg-[#F7F6FB] border-[#B57EDC]/30 border-dashed'
                        : isUnlocked
                          ? 'bg-white border-black/5'
                          : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                        isCurrent 
                          ? 'bg-[#B57EDC] text-white shadow-lg' 
                          : isUnlocked
                            ? 'bg-white border-2 border-[#B57EDC]/20'
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {tier.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`text-xl font-bold ${isCurrent ? 'text-[#B57EDC]' : 'text-[#1F2937]'}`}>
                            {tier.name}
                          </h4>
                          {isCurrent && (
                            <Badge className="bg-[#B57EDC] text-white text-xs">Current</Badge>
                          )}
                          {isNext && (
                            <Badge variant="outline" className="border-[#B57EDC]/30 text-[#B57EDC] text-xs">Next</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#6B7280] mb-4">
                          {tier.threshold}+ successful referrals • {tier.bonusMultiplier}x multiplier
                        </p>
                        <div className="space-y-2">
                          {tier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${isUnlocked ? 'text-green-500' : 'text-gray-400'}`} />
                              <span className={`text-sm ${isUnlocked ? 'text-[#1F2937]' : 'text-gray-500'}`}>
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "share" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Share Methods */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1F2937]">Share Your Referral Link</h3>
              
              {/* Share Method Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "link", label: "Copy Link", icon: Copy },
                  { id: "email", label: "Email", icon: Mail },
                  { id: "sms", label: "SMS", icon: MessageSquare },
                  { id: "social", label: "Social", icon: Share2 }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedShareMethod(method.id as any)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedShareMethod === method.id
                        ? 'border-[#B57EDC] bg-[#B57EDC]/5'
                        : 'border-black/10 hover:border-[#B57EDC]/20'
                    }`}
                  >
                    <method.icon className={`w-6 h-6 mx-auto mb-2 ${
                      selectedShareMethod === method.id ? 'text-[#B57EDC]' : 'text-[#6B7280]'
                    }`} />
                    <p className={`text-sm font-medium ${
                      selectedShareMethod === method.id ? 'text-[#B57EDC]' : 'text-[#6B7280]'
                    }`}>
                      {method.label}
                    </p>
                  </button>
                ))}
              </div>

              {/* Share Content */}
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                {selectedShareMethod === "link" && (
                  <div>
                    <h4 className="font-semibold text-[#1F2937] mb-4">Your Referral Link</h4>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#B57EDC] bg-[#F7F6FB]"
                      />
                      <button
                        onClick={() => copyToClipboard(referralLink)}
                        className="px-6 py-3 bg-[#B57EDC] text-white rounded-xl font-medium hover:bg-[#9F6BCB] transition-colors flex items-center gap-2"
                      >
                        {copiedLink ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-[#6B7280]">
                      Share this link with friends to start earning referral points!
                    </p>
                  </div>
                )}

                {selectedShareMethod === "email" && (
                  <div>
                    <h4 className="font-semibold text-[#1F2937] mb-4">Email Template</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-2">Subject</label>
                        <input
                          type="text"
                          value={shareTemplates.email.subject}
                          className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#B57EDC] bg-[#F7F6FB]"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-2">Message</label>
                        <textarea
                          value={shareTemplates.email.body.replace('{referralLink}', referralLink).replace('{yourName}', 'Sarah')}
                          rows={8}
                          className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#B57EDC] bg-[#F7F6FB] resize-none"
                          readOnly
                        />
                      </div>
                      <button className="w-full bg-[#B57EDC] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#9F6BCB] transition-colors flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        Open Email Client
                      </button>
                    </div>
                  </div>
                )}

                {selectedShareMethod === "sms" && (
                  <div>
                    <h4 className="font-semibold text-[#1F2937] mb-4">SMS Template</h4>
                    <div className="space-y-4">
                      <textarea
                        value={shareTemplates.sms.message.replace('{referralLink}', referralLink)}
                        rows={4}
                        className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#B57EDC] bg-[#F7F6FB] resize-none"
                        readOnly
                      />
                      <button className="w-full bg-[#B57EDC] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#9F6BCB] transition-colors flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Open Messages
                      </button>
                    </div>
                  </div>
                )}

                {selectedShareMethod === "social" && (
                  <div>
                    <h4 className="font-semibold text-[#1F2937] mb-4">Social Media</h4>
                    <div className="space-y-4">
                      <textarea
                        value={shareTemplates.social.message}
                        rows={4}
                        className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#B57EDC] bg-[#F7F6FB] resize-none"
                        readOnly
                      />
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { platform: "Instagram", icon: Instagram, color: "bg-pink-500" },
                          { platform: "Facebook", icon: Facebook, color: "bg-blue-500" },
                          { platform: "Twitter", icon: Twitter, color: "bg-sky-500" }
                        ].map((social) => (
                          <button
                            key={social.platform}
                            className={`${social.color} text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                          >
                            <social.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{social.platform}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Referral Tips */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1F2937]">Referral Tips</h3>
              
              <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <h4 className="text-lg font-semibold">Maximize Your Earnings</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-sm text-white/90">Share with friends who are interested in skincare and aesthetic treatments</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-sm text-white/90">Explain the membership savings - they can save hundreds on their first treatment</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-sm text-white/90">Share your own results and experiences to build trust</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                <h4 className="font-semibold text-[#1F2937] mb-4">How It Works</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#B57EDC]/10 rounded-lg flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-[#B57EDC]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-[#1F2937]">Share Your Link</h5>
                      <p className="text-sm text-[#6B7280]">Send your unique referral link to friends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#B57EDC]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#B57EDC]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-[#1F2937]">Friend Signs Up</h5>
                      <p className="text-sm text-[#6B7280]">They create an account and choose a membership</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#B57EDC]/10 rounded-lg flex items-center justify-center">
                      <Gift className="w-4 h-4 text-[#B57EDC]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-[#1F2937]">Earn Points</h5>
                      <p className="text-sm text-[#6B7280]">Get points when they complete their first treatment</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Bonus Opportunities</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Premium tier signup</span>
                    <span className="font-semibold text-green-600">+75 pts bonus</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Monthly streak</span>
                    <span className="font-semibold text-green-600">+200 pts bonus</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Tier advancement</span>
                    <span className="font-semibold text-green-600">Multiplier boost</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReferralCenter;