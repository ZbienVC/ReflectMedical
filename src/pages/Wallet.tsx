"use client";

import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, Badge } from "../components/ui";
import { 
  CreditCard, 
  ArrowRight, 
  Plus, 
  Gift,
  TrendingUp,
  Calendar
} from "lucide-react";

const Wallet: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Beauty Bucks Wallet</h1>
            <p className="text-[#6B7280] mt-1">Manage your credits and track spending</p>
          </div>
          <button className="bg-[#B57EDC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9F6BCB] transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Credits
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wider font-medium">Total Balance</p>
                <p className="text-3xl font-bold">$2,450.00</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-[#B57EDC]" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">This Month</p>
                <p className="text-2xl font-bold text-[#1F2937]">$450.00</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#B57EDC]" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">Lifetime Earned</p>
                <p className="text-2xl font-bold text-[#1F2937]">$12,580.00</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1F2937]">Recent Transactions</h3>
              <button className="text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { 
                  type: "earned", 
                  name: "Monthly Membership Credit", 
                  date: "Mar 1, 2026", 
                  amount: "+$450.00",
                  description: "Evolve tier monthly credit"
                },
                { 
                  type: "spent", 
                  name: "HydraFacial Treatment", 
                  date: "Mar 15, 2026", 
                  amount: "-$150.00",
                  description: "Applied to treatment cost"
                },
                { 
                  type: "earned", 
                  name: "Referral Bonus", 
                  date: "Mar 12, 2026", 
                  amount: "+$100.00",
                  description: "Friend signup bonus"
                },
                { 
                  type: "spent", 
                  name: "Botox Treatment", 
                  date: "Mar 10, 2026", 
                  amount: "-$200.00",
                  description: "Applied to treatment cost"
                }
              ].map((transaction, index) => (
                <div key={index} className="flex items-start justify-between py-4 border-b border-black/5 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earned' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? <Plus className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">{transaction.name}</p>
                      <p className="text-[#6B7280] text-sm">{transaction.description}</p>
                      <p className="text-[#6B7280] text-xs mt-1">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Earning Opportunities */}
          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6">Earn More Credits</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#B57EDC]/5 to-[#9F6BCB]/5 rounded-xl border border-[#B57EDC]/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[#1F2937]">Refer a Friend</h4>
                  <Badge className="bg-[#B57EDC]/10 text-[#B57EDC]">+$100</Badge>
                </div>
                <p className="text-[#6B7280] text-sm mb-3">
                  Get $100 in Beauty Bucks when your friend joins any membership tier
                </p>
                <button className="text-[#B57EDC] font-medium text-sm hover:text-[#9F6BCB]">
                  Share Referral Link →
                </button>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#B57EDC]/5 to-[#9F6BCB]/5 rounded-xl border border-[#B57EDC]/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[#1F2937]">Write a Review</h4>
                  <Badge className="bg-[#B57EDC]/10 text-[#B57EDC]">+$25</Badge>
                </div>
                <p className="text-[#6B7280] text-sm mb-3">
                  Share your experience and earn credits for each verified review
                </p>
                <button className="text-[#B57EDC] font-medium text-sm hover:text-[#9F6BCB]">
                  Write Review →
                </button>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#B57EDC]/5 to-[#9F6BCB]/5 rounded-xl border border-[#B57EDC]/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[#1F2937]">Upgrade Membership</h4>
                  <Badge className="bg-[#B57EDC]/10 text-[#B57EDC]">+$200</Badge>
                </div>
                <p className="text-[#6B7280] text-sm mb-3">
                  Upgrade to Transform tier and receive a welcome bonus
                </p>
                <button className="text-[#B57EDC] font-medium text-sm hover:text-[#9F6BCB]">
                  Learn More →
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Usage Stats */}
        <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
          <h3 className="text-xl font-semibold text-[#1F2937] mb-6">Credit Usage This Year</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-[#B57EDC]">68%</span>
              </div>
              <p className="text-[#6B7280] text-sm">Treatments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-[#B57EDC]">22%</span>
              </div>
              <p className="text-[#6B7280] text-sm">Products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-[#B57EDC]">7%</span>
              </div>
              <p className="text-[#6B7280] text-sm">Consultations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-[#B57EDC]">3%</span>
              </div>
              <p className="text-[#6B7280] text-sm">Other</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;