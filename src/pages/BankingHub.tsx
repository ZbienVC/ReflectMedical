"use client";

import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, Badge } from "../components/ui";
import { 
  PiggyBank,
  TrendingUp,
  Target,
  Calendar,
  Plus,
  ArrowRight,
  DollarSign,
  Award,
  Sparkles,
  Clock,
  CheckCircle,
  Edit3,
  Pause,
  Play,
  BarChart3,
  Zap
} from "lucide-react";
import { 
  bankingAccount,
  savingsGoals,
  bankingTransactions,
  bankingTiers,
  calculateGoalProgress,
  calculateMonthsToGoal,
  getTotalBankingValue,
  getProjectedValue,
  getBankingInsights,
  formatCurrency
} from "../data/bankingData";

const BankingHub: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [viewMode, setViewMode] = useState<"overview" | "goals" | "transactions">("overview");
  
  const insights = getBankingInsights();
  const currentTier = bankingTiers[bankingAccount.accountTier];
  const projectedValue12Months = getProjectedValue(12);

  const GoalCard: React.FC<{ goal: any }> = ({ goal }) => {
    const progress = calculateGoalProgress(goal);
    const monthsToGoal = calculateMonthsToGoal(goal);
    const isNearCompletion = progress >= 90;

    return (
      <Card className={`p-6 rounded-2xl shadow-lg border transition-all duration-200 cursor-pointer hover:shadow-xl ${
        selectedGoal === goal.id 
          ? 'border-[#B57EDC] bg-gradient-to-br from-[#B57EDC]/5 to-[#9F6BCB]/5' 
          : 'border-black/5 bg-white hover:border-[#B57EDC]/20'
      }`}
      onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[#1F2937]">{goal.treatmentName}</h3>
              {isNearCompletion && (
                <Badge className="bg-[#B57EDC]/10 text-[#B57EDC] text-xs">
                  Almost there!
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {formatCurrency(goal.targetAmount)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {monthsToGoal === Infinity ? 'Paused' : `${monthsToGoal} months`}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-2">
              <Badge className={`text-xs px-2 py-1 ${
                goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {goal.priority} priority
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[#1F2937]">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-[#F7F6FB] rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#1F2937] font-semibold">
              {formatCurrency(goal.currentAmount)} saved
            </span>
            <span className="text-[#6B7280]">
              {formatCurrency(goal.targetAmount - goal.currentAmount)} to go
            </span>
          </div>
        </div>

        {/* Monthly Contribution */}
        <div className="flex items-center justify-between pt-4 border-t border-black/5">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-[#B57EDC]" />
            <span className="text-sm text-[#6B7280]">Monthly contribution</span>
          </div>
          <span className="font-semibold text-[#1F2937]">
            {formatCurrency(goal.monthlyContribution)}
          </span>
        </div>

        {/* Goal Details (Expanded) */}
        {selectedGoal === goal.id && (
          <div className="mt-4 pt-4 border-t border-black/5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Created</span>
              <span className="text-[#1F2937]">{goal.createdDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Estimated completion</span>
              <span className="text-[#1F2937]">{goal.estimatedCompletion}</span>
            </div>
            {goal.bonusMultiplier && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">Completion bonus</span>
                <span className="text-[#B57EDC] font-semibold">
                  {Math.round((goal.bonusMultiplier - 1) * 100)}% extra
                </span>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-[#B57EDC] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#9F6BCB] transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Funds
              </button>
              <button className="px-4 py-2 border border-[#B57EDC]/20 text-[#B57EDC] rounded-lg hover:bg-[#B57EDC]/5 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 border border-[#B57EDC]/20 text-[#B57EDC] rounded-lg hover:bg-[#B57EDC]/5 transition-colors">
                {goal.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Bank Your Points</h1>
            <p className="text-[#6B7280] mt-1">Save for your dream treatments with interest rewards</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] text-white px-4 py-2">
              {bankingAccount.accountTier} Banking
            </Badge>
            <button 
              onClick={() => setShowCreateGoal(true)}
              className="bg-[#B57EDC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9F6BCB] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Goal
            </button>
          </div>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <PiggyBank className="w-12 h-12 text-white/80" />
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wider font-medium">Total Banked</p>
                <p className="text-4xl font-bold">{formatCurrency(getTotalBankingValue())}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Principal</p>
                <p className="text-xl font-semibold">{formatCurrency(bankingAccount.totalBanked)}</p>
              </div>
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Interest Earned</p>
                <p className="text-xl font-semibold text-purple-200">{formatCurrency(bankingAccount.interestEarned)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#B57EDC]/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#B57EDC]" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">Interest Rate</p>
                <p className="text-2xl font-bold text-[#1F2937]">{bankingAccount.currentInterestRate}%</p>
              </div>
            </div>
            <p className="text-xs text-[#6B7280]">Annual percentage yield</p>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#B57EDC]/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#B57EDC]" />
              </div>
              <div>
                <p className="text-[#6B7280] text-sm uppercase tracking-wider font-medium">Active Goals</p>
                <p className="text-2xl font-bold text-[#1F2937]">{insights.activeGoalsCount}</p>
              </div>
            </div>
            <p className="text-xs text-[#6B7280]">Saving for treatments</p>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#F7F6FB] rounded-lg p-1">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "goals", label: "Savings Goals", icon: Target },
            { id: "transactions", label: "Transactions", icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-colors ${
                viewMode === tab.id
                  ? 'bg-[#B57EDC] text-white shadow-lg'
                  : 'text-[#6B7280] hover:text-[#B57EDC]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Based on View Mode */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Banking Insights */}
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                <h3 className="text-xl font-semibold text-[#1F2937] mb-6">Banking Insights</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Monthly Contributions</p>
                    <p className="text-3xl font-bold text-[#1F2937]">{formatCurrency(insights.totalMonthlyContributions)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">12-Month Projection</p>
                    <p className="text-3xl font-bold text-[#B57EDC]">{formatCurrency(projectedValue12Months)}</p>
                  </div>
                </div>

                {insights.nearestGoal && (
                  <div className="p-4 bg-[#F7F6FB] rounded-xl">
                    <h4 className="font-semibold text-[#1F2937] mb-2">Next Goal Achievement</h4>
                    <p className="text-sm text-[#6B7280] mb-3">
                      <span className="font-medium">{insights.nearestGoal.name}</span> in{" "}
                      <span className="font-semibold text-[#B57EDC]">{insights.nearestGoal.monthsToCompletion} months</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] h-2 rounded-full"
                        style={{ width: `${insights.nearestGoal.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </Card>

              {/* Recent Transactions */}
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#1F2937]">Recent Activity</h3>
                  <button 
                    onClick={() => setViewMode("transactions")}
                    className="text-[#B57EDC] hover:text-[#9F6BCB] font-medium text-sm flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {bankingTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-4 p-3 bg-[#F7F6FB] rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-[#B57EDC]/10 text-[#B57EDC]' :
                        transaction.type === 'interest' ? 'bg-blue-100 text-blue-600' :
                        transaction.type === 'bonus' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {transaction.type === 'deposit' ? <ArrowRight className="w-5 h-5 rotate-90" /> :
                         transaction.type === 'interest' ? <TrendingUp className="w-5 h-5" /> :
                         transaction.type === 'bonus' ? <Sparkles className="w-5 h-5" /> :
                         <DollarSign className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1F2937] text-sm">{transaction.description}</p>
                        <p className="text-xs text-[#6B7280]">{transaction.date}</p>
                      </div>
                      <p className="font-semibold text-[#B57EDC]">+{formatCurrency(transaction.amount)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Account Tier Benefits */}
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-[#B57EDC]" />
                  <h3 className="text-lg font-semibold text-[#1F2937]">{bankingAccount.accountTier} Banking</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  {currentTier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#B57EDC]" />
                      <span className="text-sm text-[#6B7280]">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-black/5">
                  <button className="w-full text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium">
                    Upgrade Banking Tier →
                  </button>
                </div>
              </Card>

              {/* Next Interest Payment */}
              <Card className="p-6 bg-gradient-to-br from-[#B57EDC]/5 to-[#9F6BCB]/5 rounded-2xl border border-[#B57EDC]/10">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[#B57EDC]" />
                  <h3 className="text-lg font-semibold text-[#1F2937]">Next Interest Payment</h3>
                </div>
                <p className="text-2xl font-bold text-[#1F2937] mb-2">{bankingAccount.nextInterestPayment}</p>
                <p className="text-sm text-[#B57EDC]">
                  Estimated: {formatCurrency(Math.round(bankingAccount.totalBanked * (bankingAccount.currentInterestRate / 100) / 4))}
                </p>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-colors backdrop-blur-sm">
                    Transfer Available Credits
                  </button>
                  <button className="w-full bg-white text-[#B57EDC] font-semibold py-3 px-4 rounded-xl hover:bg-white/95 transition-colors">
                    Set Up Auto-Banking
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {viewMode === "goals" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savingsGoals.filter(goal => goal.isActive).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {viewMode === "transactions" && (
          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6">All Transactions</h3>
            <div className="space-y-4">
              {bankingTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 p-4 bg-[#F7F6FB] rounded-xl">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-[#B57EDC]/10 text-[#B57EDC]' :
                    transaction.type === 'interest' ? 'bg-blue-100 text-blue-600' :
                    transaction.type === 'bonus' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {transaction.type === 'deposit' ? <ArrowRight className="w-6 h-6 rotate-90" /> :
                     transaction.type === 'interest' ? <TrendingUp className="w-6 h-6" /> :
                     transaction.type === 'bonus' ? <Sparkles className="w-6 h-6" /> :
                     <DollarSign className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1F2937]">{transaction.description}</p>
                    <p className="text-sm text-[#6B7280]">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#B57EDC] text-lg">+{formatCurrency(transaction.amount)}</p>
                    {transaction.interestRate && (
                      <p className="text-xs text-[#6B7280]">{transaction.interestRate}% APY</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BankingHub;