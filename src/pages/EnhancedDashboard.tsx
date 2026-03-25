"use client";

import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, Badge } from "../components/ui";
import { 
  CreditCard,
  TrendingUp,
  Calendar,
  Star,
  ArrowRight,
  Clock,
  DollarSign,
  Activity,
  Award,
  ChevronRight,
  Sparkles,
  Target,
  Gift,
  PiggyBank,
  Users,
  Plus,
  Share2
} from "lucide-react";
import { 
  sampleDashboardData, 
  recentActivities, 
  upcomingVisits, 
  creditUsageData,
  getPersonalizedRecommendations 
} from "../data/dashboardData";
import { getRecommendedTreatments, formatPrice } from "../data/treatments";

const EnhancedDashboard: React.FC = () => {
  const membershipTier = "Evolve"; // Would come from auth context
  const dashboardData = sampleDashboardData;
  const recommendations = getPersonalizedRecommendations(membershipTier);
  const recommendedTreatments = getRecommendedTreatments(membershipTier, 4);

  const stats = [
    {
      label: "Available Credit",
      value: formatPrice(dashboardData.availableCredit),
      icon: Gift,
      color: "bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB]",
      textColor: "text-white"
    },
    {
      label: "This Month Used", 
      value: formatPrice(dashboardData.monthlyValueUsed),
      icon: Activity,
      color: "bg-white",
      textColor: "text-[#1F2937]",
      border: "border border-black/6"
    },
    {
      label: "Savings This Month",
      value: formatPrice(dashboardData.savingsThisMonth), 
      icon: TrendingUp,
      color: "bg-white",
      textColor: "text-[#1F2937]",
      border: "border border-black/6"
    },
    {
      label: "Next Appointment",
      value: dashboardData.nextAppointment ? "Mar 28" : "None",
      icon: Calendar,
      color: "bg-white", 
      textColor: "text-[#1F2937]",
      border: "border border-black/6"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Welcome back, Sarah!</h1>
            <p className="text-[#6B7280] mt-1">Here's your wellness summary</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] text-white px-4 py-2 shadow-lg">
              {membershipTier} Member
            </Badge>
            <Badge variant="outline" className="border-[#B57EDC]/20 text-[#6B7280]">
              Member since {dashboardData.memberSince}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`p-6 rounded-2xl shadow-lg ${stat.color} ${stat.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color.includes('gradient') ? 'bg-white/20' : 'bg-[#B57EDC]/10'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color.includes('gradient') ? 'text-white' : 'text-[#B57EDC]'
                  }`} />
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  stat.color.includes('gradient') ? 'text-white/70' : 'text-[#6B7280]'
                }`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${
                  stat.color.includes('gradient') ? 'text-white/80' : 'text-[#6B7280]'
                }`}>
                  {stat.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Visits */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#1F2937]">Upcoming Visits</h3>
                <button className="text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingVisits.slice(0, 3).map((visit, index) => (
                  <div key={visit.id} className="flex items-start gap-4 p-4 bg-[#F7F6FB] rounded-xl hover:bg-[#F4EEFB] transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {new Date(visit.date).getDate()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1F2937] mb-1">{visit.treatment}</h4>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {visit.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {visit.time}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280]">{visit.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#1F2937]">{formatPrice(visit.cost)}</p>
                      <p className="text-sm text-[#B57EDC]">Save {formatPrice(visit.savings)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {upcomingVisits.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                  <h4 className="font-semibold text-[#1F2937] mb-2">No upcoming appointments</h4>
                  <p className="text-[#6B7280] text-sm mb-4">Ready to book your next treatment?</p>
                  <button className="bg-[#B57EDC] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#9F6BCB] transition-colors">
                    Browse Treatments
                  </button>
                </div>
              )}
            </Card>

            {/* Recommended Treatments */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-[#1F2937]">Recommended for You</h3>
                  <Badge className="bg-[#B57EDC]/10 text-[#B57EDC] text-xs">
                    {membershipTier} Benefits
                  </Badge>
                </div>
                <button className="text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium">
                  View All Treatments
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedTreatments.map((treatment) => (
                  <div key={treatment.id} className="p-4 bg-[#F7F6FB] rounded-xl hover:bg-[#F4EEFB] transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-[#1F2937] group-hover:text-[#B57EDC] transition-colors">
                        {treatment.name}
                      </h4>
                      <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#B57EDC] transition-colors" />
                    </div>
                    <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{treatment.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-[#1F2937]">
                          {formatPrice(treatment.memberPrice)}{treatment.units && ` ${treatment.units}`}
                        </span>
                        <span className="text-sm line-through text-[#9CA3AF]">
                          {formatPrice(treatment.basePrice)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs border-[#B57EDC]/20 text-[#B57EDC]">
                        {treatment.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Ready for your next treatment?</h3>
              </div>
              <p className="text-white/90 mb-6 text-sm">
                Book your appointment and continue your wellness journey with member pricing
              </p>
              <button className="w-full bg-white text-[#B57EDC] font-semibold py-3 px-4 rounded-xl hover:bg-white/95 transition-colors shadow-lg">
                Browse Treatments
              </button>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 py-3 border-b border-black/5 last:border-b-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'treatment' 
                        ? 'bg-[#B57EDC]/10 text-[#B57EDC]' 
                        : activity.type === 'credit'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {activity.type === 'treatment' ? (
                        <Star className="w-5 h-5" />
                      ) : activity.type === 'credit' ? (
                        <Gift className="w-5 h-5" />
                      ) : (
                        <Calendar className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#1F2937] text-sm">{activity.treatment}</p>
                      <p className="text-xs text-[#6B7280]">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        activity.type === 'credit' ? 'text-green-600' : 'text-[#1F2937]'
                      }`}>
                        {activity.type === 'credit' ? '+' : ''}{formatPrice(activity.amount)}
                      </p>
                      {activity.savings && (
                        <p className="text-xs text-[#B57EDC]">Saved {formatPrice(activity.savings)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Banking Widget */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <PiggyBank className="w-5 h-5 text-[#B57EDC]" />
                <h3 className="text-lg font-semibold text-[#1F2937]">Bank Your Points</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Total Banked</span>
                  <span className="font-semibold text-[#1F2937]">$2,850</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Interest Rate</span>
                  <span className="font-semibold text-green-600">3.5% APY</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Active Goals</span>
                  <span className="font-semibold text-[#B57EDC]">4 treatments</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-black/5">
                <button className="w-full text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" />
                  Create Savings Goal →
                </button>
              </div>
            </Card>

            {/* Referral Widget */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-[#B57EDC]" />
                <h3 className="text-lg font-semibold text-[#1F2937]">Referral Rewards</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Points Earned</span>
                  <span className="font-semibold text-[#1F2937]">675 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Successful Referrals</span>
                  <span className="font-semibold text-green-600">3 friends</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Current Tier</span>
                  <span className="font-semibold text-[#B57EDC]">⭐ Ambassador</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-black/5">
                <button className="w-full text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium flex items-center justify-center gap-1">
                  <Share2 className="w-4 h-4" />
                  Share Referral Link →
                </button>
              </div>
            </Card>

            {/* Membership Progress */}
            <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-[#B57EDC]" />
                <h3 className="text-lg font-semibold text-[#1F2937]">Membership Perks</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Monthly Credit</span>
                  <span className="font-semibold text-[#1F2937]">$450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Lifetime Savings</span>
                  <span className="font-semibold text-[#1F2937]">{formatPrice(dashboardData.totalSavingsLifetime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Member Discount</span>
                  <span className="font-semibold text-[#B57EDC]">15-25%</span>
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

export default EnhancedDashboard;