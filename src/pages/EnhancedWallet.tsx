"use client";

import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, Badge } from "../components/ui";
import { 
  CreditCard,
  ArrowRight,
  Plus,
  Gift,
  TrendingUp,
  Calendar,
  DollarSign,
  Star,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap
} from "lucide-react";
import { 
  sampleDashboardData, 
  recentActivities,
  creditUsageData,
  monthlyUsage 
} from "../data/dashboardData";
import { formatPrice } from "../data/treatments";

const EnhancedWallet: React.FC = () => {
  const [timeRange, setTimeRange] = useState("3months"); // 1month, 3months, 6months, year
  const membershipTier = "Evolve";
  const dashboardData = sampleDashboardData;

  // Credit balance breakdown
  const creditBreakdown = {
    monthlyCredit: 450,
    rolloverCredit: 520,
    bonusCredit: 285,
    referralCredit: 165
  };

  const totalAvailable = Object.values(creditBreakdown).reduce((sum, value) => sum + value, 0);

  // Earning opportunities
  const earningOpportunities = [
    {
      title: "Refer a Friend",
      description: "Get $100 when your friend joins any membership tier",
      reward: 100,
      icon: Gift,
      action: "Share Link",
      difficulty: "Easy"
    },
    {
      title: "Write Reviews",
      description: "Earn $25 for each verified treatment review",
      reward: 25,
      icon: Star,
      action: "Write Review",
      difficulty: "Easy"
    },
    {
      title: "Social Media Share",
      description: "Share your transformation photos and earn credits",
      reward: 50,
      icon: Sparkles,
      action: "Share Now",
      difficulty: "Easy"
    },
    {
      title: "Upgrade Membership", 
      description: "Upgrade to Transform and receive a $200 welcome bonus",
      reward: 200,
      icon: Award,
      action: "Learn More",
      difficulty: "Premium"
    },
    {
      title: "Birthday Bonus",
      description: "Receive special birthday credits every year",
      reward: 75,
      icon: Gift,
      action: "Auto Applied",
      difficulty: "Annual"
    },
    {
      title: "Loyalty Milestone",
      description: "Earn bonus credits for every 12 treatments",
      reward: 150,
      icon: Target,
      action: "7 more visits",
      difficulty: "Progress"
    }
  ];

  // Transaction filters
  const [transactionFilter, setTransactionFilter] = useState("all"); // all, earned, spent

  const filteredActivities = recentActivities.filter(activity => {
    if (transactionFilter === "earned") return activity.type === "credit";
    if (transactionFilter === "spent") return activity.type === "treatment" || activity.type === "booking";
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Beauty Bucks Wallet</h1>
            <p className="text-[#6B7280] mt-1">Track your credits, earnings, and savings</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] text-white px-4 py-2">
              {membershipTier} Member
            </Badge>
            <button className="bg-[#B57EDC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9F6BCB] transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Credits
            </button>
          </div>
        </div>

        {/* Credit Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-12 h-12 text-white/80" />
              <div className="text-right">
                <p className="text-white/80 text-sm uppercase tracking-wider font-medium">Total Available</p>
                <p className="text-4xl font-bold">{formatPrice(totalAvailable)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wider mb-1">This Month</p>
                <p className="text-xl font-semibold">{formatPrice(creditBreakdown.monthlyCredit)}</p>
              </div>
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Rollover</p>
                <p className="text-xl font-semibold">{formatPrice(creditBreakdown.rolloverCredit)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">This Month</p>
                <p className="text-2xl font-bold text-[#1F2937]">{formatPrice(dashboardData.monthlyValueUsed)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Used</span>
              <span className="text-green-600 font-semibold">↗ 12%</span>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#B57EDC]/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#B57EDC]" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">Total Saved</p>
                <p className="text-2xl font-bold text-[#1F2937]">{formatPrice(dashboardData.totalSavingsLifetime)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Lifetime</span>
              <span className="text-[#B57EDC] font-semibold">Since Jan 2024</span>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction History */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#1F2937]">Transaction History</h3>
                <div className="flex items-center gap-2">
                  <div className="flex bg-[#F7F6FB] rounded-lg p-1">
                    {[
                      { id: "all", label: "All" },
                      { id: "earned", label: "Earned" },
                      { id: "spent", label: "Spent" }
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setTransactionFilter(filter.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          transactionFilter === filter.id
                            ? 'bg-[#B57EDC] text-white'
                            : 'text-[#6B7280] hover:text-[#B57EDC]'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <button className="text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium flex items-center gap-1">
                    Export
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-[#F7F6FB] rounded-xl hover:bg-[#F4EEFB] transition-colors">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activity.type === 'treatment' || activity.type === 'booking'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {activity.type === 'credit' ? (
                        <ArrowDownRight className="w-6 h-6" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1F2937] mb-1">{activity.treatment}</h4>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {activity.date}
                        </span>
                        <Badge variant="outline" className={`text-xs ${
                          activity.status === 'completed' ? 'border-green-200 text-green-700' :
                          activity.status === 'upcoming' ? 'border-blue-200 text-blue-700' :
                          'border-gray-200 text-gray-700'
                        }`}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        activity.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.type === 'credit' ? '+' : '-'}{formatPrice(activity.amount)}
                      </p>
                      {activity.savings && (
                        <p className="text-sm text-[#B57EDC] font-medium">
                          Saved {formatPrice(activity.savings)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-[#B57EDC] hover:text-[#9F6BCB] font-medium flex items-center gap-1 mx-auto">
                  Load More Transactions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>

            {/* Usage Analytics */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#1F2937]">Credit Usage Analysis</h3>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-[#F7F6FB] border border-black/10 rounded-lg px-3 py-2 text-sm font-medium text-[#1F2937]"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Credit Usage Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {creditUsageData.map((category) => (
                  <div key={category.category} className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-[#B57EDC]">{category.percentage}%</span>
                    </div>
                    <p className="text-sm font-medium text-[#1F2937] mb-1">{category.category}</p>
                    <p className="text-xs text-[#6B7280]">{formatPrice(category.amount)}</p>
                  </div>
                ))}
              </div>

              {/* Monthly Trend */}
              <div className="pt-6 border-t border-black/5">
                <h4 className="font-semibold text-[#1F2937] mb-4">6-Month Usage Trend</h4>
                <div className="flex items-end gap-3 h-32">
                  {monthlyUsage.map((month, index) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-[#F7F6FB] rounded-t-lg flex flex-col justify-end h-full">
                        <div 
                          className="bg-gradient-to-t from-[#B57EDC] to-[#9F6BCB] rounded-t-lg transition-all duration-300 hover:from-[#9F6BCB] hover:to-[#8B5FBD]"
                          style={{ height: `${(month.spent / 700) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#6B7280] mt-2 font-medium">{month.month}</p>
                      <p className="text-xs text-[#B57EDC] font-semibold">{formatPrice(month.spent)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-colors backdrop-blur-sm">
                  Purchase Gift Cards
                </button>
                <button className="w-full bg-white text-[#B57EDC] font-semibold py-3 px-4 rounded-xl hover:bg-white/95 transition-colors">
                  Add Payment Method
                </button>
              </div>
            </Card>

            {/* Earning Opportunities */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Earn More Credits</h3>
              <div className="space-y-4">
                {earningOpportunities.slice(0, 4).map((opportunity, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-[#B57EDC]/5 to-[#9F6BCB]/5 rounded-xl border border-[#B57EDC]/10 hover:border-[#B57EDC]/20 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <opportunity.icon className="w-5 h-5 text-[#B57EDC]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#1F2937] text-sm">{opportunity.title}</h4>
                          <Badge className="bg-[#B57EDC] text-white text-xs px-2 py-1">
                            +{formatPrice(opportunity.reward)}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">{opportunity.description}</p>
                        <button className="text-[#B57EDC] font-medium text-xs hover:text-[#9F6BCB] transition-colors">
                          {opportunity.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-black/5">
                <button className="w-full text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium">
                  View All Opportunities →
                </button>
              </div>
            </Card>

            {/* Membership Perks */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-[#B57EDC]" />
                <h3 className="text-lg font-semibold text-[#1F2937]">{membershipTier} Perks</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Monthly Credit</span>
                  <span className="font-semibold text-[#1F2937]">{formatPrice(creditBreakdown.monthlyCredit)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Member Discount</span>
                  <span className="font-semibold text-[#B57EDC]">15-25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Rollover Credits</span>
                  <span className="font-semibold text-[#1F2937]">Unlimited</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Priority Booking</span>
                  <span className="font-semibold text-[#B57EDC]">✓ Included</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-black/5">
                <button className="w-full text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium">
                  Upgrade to Transform →
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedWallet;