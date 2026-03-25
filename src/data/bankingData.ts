export interface SavingsGoal {
  id: string;
  treatmentName: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  estimatedCompletion: string;
  priority: "high" | "medium" | "low";
  treatmentImage?: string;
  isActive: boolean;
  createdDate: string;
  bonusMultiplier?: number;
}

export interface BankingTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "interest" | "bonus";
  amount: number;
  date: string;
  description: string;
  goalId?: string;
  interestRate?: number;
}

export interface BankingAccount {
  totalBanked: number;
  availableToBank: number;
  interestEarned: number;
  currentInterestRate: number; // Annual percentage
  nextInterestPayment: string;
  accountTier: "Basic" | "Premium" | "VIP";
}

// Sample banking data
export const bankingAccount: BankingAccount = {
  totalBanked: 2850,
  availableToBank: 420,
  interestEarned: 125,
  currentInterestRate: 3.5, // 3.5% APY for banked credits
  nextInterestPayment: "April 1, 2026",
  accountTier: "Premium"
};

export const savingsGoals: SavingsGoal[] = [
  {
    id: "goal-1",
    treatmentName: "CoolSculpting - Double Chin",
    targetAmount: 760,
    currentAmount: 485,
    monthlyContribution: 150,
    estimatedCompletion: "May 2026",
    priority: "high",
    isActive: true,
    createdDate: "January 15, 2026",
    bonusMultiplier: 1.1 // 10% bonus when goal is reached
  },
  {
    id: "goal-2", 
    treatmentName: "Juvéderm Voluma XC",
    targetAmount: 680,
    currentAmount: 290,
    monthlyContribution: 100,
    estimatedCompletion: "July 2026",
    priority: "medium",
    isActive: true,
    createdDate: "February 3, 2026"
  },
  {
    id: "goal-3",
    treatmentName: "VI Peel Series (3 sessions)",
    targetAmount: 780, // 3 x $260
    currentAmount: 125,
    monthlyContribution: 75,
    estimatedCompletion: "October 2026",
    priority: "low",
    isActive: true,
    createdDate: "March 1, 2026"
  },
  {
    id: "goal-4",
    treatmentName: "Botox Maintenance Fund",
    targetAmount: 1200, // 4 sessions worth
    currentAmount: 720,
    monthlyContribution: 200,
    estimatedCompletion: "June 2026",
    priority: "high",
    isActive: true,
    createdDate: "December 10, 2025"
  }
];

export const bankingTransactions: BankingTransaction[] = [
  {
    id: "txn-1",
    type: "deposit",
    amount: 200,
    date: "March 20, 2026",
    description: "Monthly contribution to CoolSculpting goal",
    goalId: "goal-1"
  },
  {
    id: "txn-2",
    type: "interest", 
    amount: 8,
    date: "March 15, 2026",
    description: "Quarterly interest payment",
    interestRate: 3.5
  },
  {
    id: "txn-3",
    type: "deposit",
    amount: 150,
    date: "March 10, 2026", 
    description: "Banked unused monthly credits",
    goalId: "goal-2"
  },
  {
    id: "txn-4",
    type: "bonus",
    amount: 50,
    date: "March 5, 2026",
    description: "Bonus for consistent banking streak",
    goalId: "goal-4"
  },
  {
    id: "txn-5",
    type: "deposit",
    amount: 300,
    date: "February 28, 2026",
    description: "Referral bonus - Sarah M. completed first treatment"
  }
];

// Banking tier benefits
export const bankingTiers = {
  "Basic": {
    interestRate: 2.0,
    bonusMultiplier: 1.0,
    maxGoals: 2,
    features: ["Basic interest", "2 savings goals"]
  },
  "Premium": {
    interestRate: 3.5,
    bonusMultiplier: 1.05, 
    maxGoals: 5,
    features: ["Premium interest", "5 savings goals", "Quarterly bonuses", "Goal completion rewards"]
  },
  "VIP": {
    interestRate: 5.0,
    bonusMultiplier: 1.1,
    maxGoals: 10,
    features: ["VIP interest", "Unlimited goals", "Monthly bonuses", "Premium rewards", "Priority treatment booking"]
  }
};

// Helper functions
export const calculateGoalProgress = (goal: SavingsGoal): number => {
  return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
};

export const calculateMonthsToGoal = (goal: SavingsGoal): number => {
  if (goal.monthlyContribution === 0) return Infinity;
  const remaining = goal.targetAmount - goal.currentAmount;
  return Math.ceil(remaining / goal.monthlyContribution);
};

export const getTotalBankingValue = (): number => {
  return bankingAccount.totalBanked + bankingAccount.interestEarned;
};

export const getProjectedValue = (months: number): number => {
  const monthlyRate = bankingAccount.currentInterestRate / 100 / 12;
  const totalGoalContributions = savingsGoals
    .filter(g => g.isActive)
    .reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  
  // Compound interest with monthly contributions
  let projectedValue = bankingAccount.totalBanked;
  for (let i = 0; i < months; i++) {
    projectedValue = (projectedValue + totalGoalContributions) * (1 + monthlyRate);
  }
  
  return Math.round(projectedValue);
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString()}`;
};

export const getBankingInsights = () => {
  const activeGoals = savingsGoals.filter(g => g.isActive);
  const totalMonthlyContributions = activeGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const nearestGoal = activeGoals
    .sort((a, b) => calculateMonthsToGoal(a) - calculateMonthsToGoal(b))[0];
  
  return {
    activeGoalsCount: activeGoals.length,
    totalMonthlyContributions,
    nearestGoal: nearestGoal ? {
      name: nearestGoal.treatmentName,
      monthsToCompletion: calculateMonthsToGoal(nearestGoal),
      progress: calculateGoalProgress(nearestGoal)
    } : null,
    projectedYearValue: getProjectedValue(12)
  };
};