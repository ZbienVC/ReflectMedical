"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
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
  Zap,
  Inbox
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
import { Skeleton, SkeletonCard, SkeletonRow } from "../components/ui/Skeleton";
import { useAuth } from "../AuthContext";
import { onBalanceChange, getTransactionHistory } from "../services/beautyBankService";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const BankingHub: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [viewMode, setViewMode] = useState<"overview" | "goals" | "transactions">("overview");
  const [isLoading] = useState(false);
  const [liveBalance, setLiveBalance] = useState<number | null>(null);
  const { user } = useAuth();

  // Real-time balance listener
  useEffect(() => {
    if (!user) return;
    const unsub = onBalanceChange(user.uid, (bal) => setLiveBalance(bal));
    return () => unsub();
  }, [user]);

  const insights = getBankingInsights();
  const currentTier = bankingTiers[bankingAccount.accountTier];
  const projectedValue12Months = getProjectedValue(12);

  const GoalCard: React.FC<{ goal: any }> = ({ goal }) => {
    const progress = calculateGoalProgress(goal);
    const monthsToGoal = calculateMonthsToGoal(goal);
    const isNearCompletion = progress >= 90;

    return (
      <motion.div
        className={`p-5 rounded-2xl border cursor-pointer transition-colors duration-200 ${
          selectedGoal === goal.id
            ? "border-purple-500/40 bg-purple-600/5"
            : "border-white/5 bg-[#1C1C24] hover:border-purple-500/20"
        }`}
        onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-semibold text-white">{goal.treatmentName}</h3>
              {isNearCompletion && (
                <span className="bg-purple-600/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/20">
                  Almost there!
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {formatCurrency(goal.targetAmount)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {monthsToGoal === Infinity ? "Paused" : `${monthsToGoal} months`}
              </span>
            </div>
          </div>
          
          <div className="text-right ml-3">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              goal.priority === "high"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : goal.priority === "medium"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-white/5 text-[#A1A1AA] border-white/10"
            }`}>
              {goal.priority}
            </span>
            <p className="text-2xl font-bold text-white mt-1">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-white/5 rounded-full h-2.5 mb-2">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-semibold">{formatCurrency(goal.currentAmount)} saved</span>
            <span className="text-[#71717A]">{formatCurrency(goal.targetAmount - goal.currentAmount)} to go</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-[#A1A1AA]">Monthly contribution</span>
          </div>
          <span className="font-semibold text-white">{formatCurrency(goal.monthlyContribution)}</span>
        </div>

        <AnimatePresence>
          {selectedGoal === goal.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/5 space-y-3 overflow-hidden"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#71717A]">Created</span>
                <span className="text-white">{goal.createdDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#71717A]">Estimated completion</span>
                <span className="text-white">{goal.estimatedCompletion}</span>
              </div>
              {goal.bonusMultiplier && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#71717A]">Completion bonus</span>
                  <span className="text-purple-400 font-semibold">{Math.round((goal.bonusMultiplier - 1) * 100)}% extra</span>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <motion.button
                  className="flex-1 bg-[#6D28D9] text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#5B21B6] transition-colors flex items-center justify-center gap-2 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Funds
                </motion.button>
                <motion.button
                  className="px-3 py-2 border border-white/10 text-[#A1A1AA] rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="px-3 py-2 border border-white/10 text-[#A1A1AA] rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {goal.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const txIcon = (type: string) => {
    if (type === "deposit") return <ArrowRight className="w-5 h-5 rotate-90" />;
    if (type === "interest") return <TrendingUp className="w-5 h-5" />;
    if (type === "bonus") return <Sparkles className="w-5 h-5" />;
    return <DollarSign className="w-5 h-5" />;
  };

  const txColor = (type: string) => {
    if (type === "deposit") return "bg-purple-600/15 text-purple-400";
    if (type === "interest") return "bg-blue-600/15 text-blue-400";
    if (type === "bonus") return "bg-fuchsia-600/15 text-fuchsia-400";
    return "bg-white/5 text-[#A1A1AA]";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Bank Your Points</h1>
            <p className="text-[#A1A1AA] mt-1">Save for your dream treatments with interest rewards</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-purple-600/20 text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full border border-purple-500/30">
              {bankingAccount.accountTier} Banking
            </span>
            <motion.button
              onClick={() => setShowCreateGoal(true)}
              className="bg-[#6D28D9] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#5B21B6] transition-colors flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-4 h-4" />
              New Goal
            </motion.button>
          </div>
        </div>

        {/* Account Overview */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <SkeletonCard className="md:col-span-2 h-36" />
            <SkeletonCard className="h-36" />
            <SkeletonCard className="h-36" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={item}
              className="p-6 bg-gradient-to-br from-purple-700 to-fuchsia-700 text-white rounded-2xl shadow-xl shadow-purple-900/30 col-span-1 md:col-span-2"
            >
              <div className="flex items-center gap-4 mb-5">
                <PiggyBank className="w-10 h-10 text-white/80" />
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Total Banked</p>
                  <p className="text-3xl font-black">{formatCurrency(getTotalBankingValue())}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Principal</p>
                  <p className="text-lg font-bold">{formatCurrency(liveBalance !== null ? liveBalance : bankingAccount.totalBanked)}</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Interest Earned</p>
                  <p className="text-lg font-bold text-purple-200">{formatCurrency(bankingAccount.interestEarned)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="p-5 bg-[#1C1C24] rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-blue-600/15 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[#71717A] text-xs uppercase tracking-widest font-semibold">Interest Rate</p>
                  <p className="text-2xl font-black text-white">{bankingAccount.currentInterestRate}%</p>
                </div>
              </div>
              <p className="text-xs text-[#71717A]">Annual percentage yield</p>
            </motion.div>

            <motion.div variants={item} className="p-5 bg-[#1C1C24] rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-purple-600/15 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-[#71717A] text-xs uppercase tracking-widest font-semibold">Active Goals</p>
                  <p className="text-2xl font-black text-white">{insights.activeGoalsCount}</p>
                </div>
              </div>
              <p className="text-xs text-[#71717A]">Saving for treatments</p>
            </motion.div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex bg-[#1C1C24] rounded-xl p-1 border border-white/5">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "goals", label: "Savings Goals", icon: Target },
            { id: "transactions", label: "Transactions", icon: Clock },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                viewMode === tab.id
                  ? "bg-[#6D28D9] text-white"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
              whileHover={viewMode !== tab.id ? { scale: 1.01 } : {}}
              whileTap={{ scale: 0.97 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left */}
              <div className="lg:col-span-2 space-y-5">
                {/* Banking Insights */}
                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-6">
                  <h3 className="text-lg font-bold text-white mb-5">Banking Insights</h3>
                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div>
                      <p className="text-sm text-[#A1A1AA] mb-1">Monthly Contributions</p>
                      <p className="text-2xl font-black text-white">{formatCurrency(insights.totalMonthlyContributions)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#A1A1AA] mb-1">12-Month Projection</p>
                      <p className="text-2xl font-black text-purple-400">{formatCurrency(projectedValue12Months)}</p>
                    </div>
                  </div>

                  {insights.nearestGoal && (
                    <div className="p-4 bg-[#0F0F14] rounded-xl border border-white/5">
                      <h4 className="font-semibold text-white mb-2">Next Goal Achievement</h4>
                      <p className="text-sm text-[#A1A1AA] mb-3">
                        <span className="font-semibold text-white">{insights.nearestGoal.name}</span> in{" "}
                        <span className="font-bold text-purple-400">{insights.nearestGoal.monthsToCompletion} months</span>
                      </p>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${insights.nearestGoal.progress}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                    <button
                      onClick={() => setViewMode("transactions")}
                      className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center gap-1 transition-colors"
                    >
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {bankingTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                        <Inbox className="w-6 h-6 text-[#A1A1AA]" />
                      </div>
                      <p className="text-white font-semibold">No transactions yet</p>
                      <p className="text-[#71717A] text-sm mt-1">Your banking activity will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bankingTransactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex items-center gap-4 p-3 bg-[#0F0F14] rounded-xl border border-white/5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${txColor(tx.type)}`}>
                            {txIcon(tx.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white text-sm">{tx.description}</p>
                            <p className="text-xs text-[#71717A]">{tx.date}</p>
                          </div>
                          <p className="font-semibold text-purple-400">+{formatCurrency(tx.amount)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="space-y-5">
                {/* Tier Benefits */}
                <div className="bg-[#1C1C24] rounded-2xl border border-white/5 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">{bankingAccount.accountTier} Banking</h3>
                  </div>
                  <div className="space-y-2.5 mb-5">
                    {currentTier.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="text-sm text-[#A1A1AA]">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <button className="w-full text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                      Upgrade Banking Tier →
                    </button>
                  </div>
                </div>

                {/* Next Interest */}
                <div className="bg-[#1C1C24] rounded-2xl border border-purple-500/20 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">Next Interest Payment</h3>
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{bankingAccount.nextInterestPayment}</p>
                  <p className="text-sm text-purple-400">
                    Estimated: {formatCurrency(Math.round(bankingAccount.totalBanked * (bankingAccount.currentInterestRate / 100) / 4))}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-purple-700 to-fuchsia-700 rounded-2xl p-5 shadow-xl shadow-purple-900/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-white" />
                    <h3 className="text-base font-bold text-white">Quick Actions</h3>
                  </div>
                  <div className="space-y-2.5">
                    <motion.button
                      className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Transfer Available Credits
                    </motion.button>
                    <motion.button
                      className="w-full bg-white text-purple-700 font-bold py-2.5 px-4 rounded-xl hover:bg-white/95 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Set Up Auto-Banking
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {savingsGoals.filter((g) => g.isActive).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-[#A1A1AA]" />
                  </div>
                  <h3 className="text-white font-bold text-lg">No active savings goals</h3>
                  <p className="text-[#71717A] text-sm mt-1 max-w-xs">Create your first goal to start saving toward a treatment.</p>
                  <motion.button
                    onClick={() => setShowCreateGoal(true)}
                    className="mt-6 bg-[#6D28D9] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5B21B6] transition-colors"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Create First Goal
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {savingsGoals.filter((g) => g.isActive).map((goal) => (
                    <motion.div key={goal.id} variants={item}>
                      <GoalCard goal={goal} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {viewMode === "transactions" && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#1C1C24] rounded-2xl border border-white/5 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-5">All Transactions</h3>

              {bankingTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                    <Inbox className="w-6 h-6 text-[#A1A1AA]" />
                  </div>
                  <p className="text-white font-semibold">No transactions yet</p>
                  <p className="text-[#71717A] text-sm mt-1">Start banking your points to see activity here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bankingTransactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      className="flex items-center gap-4 p-4 bg-[#0F0F14] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${txColor(tx.type)}`}>
                        {txIcon(tx.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{tx.description}</p>
                        <p className="text-xs text-[#71717A]">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-400">+{formatCurrency(tx.amount)}</p>
                        {tx.interestRate && (
                          <p className="text-xs text-[#71717A]">{tx.interestRate}% APY</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BankingHub;
