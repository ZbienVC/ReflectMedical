export interface Referral {
  id: string;
  friendName: string;
  friendEmail: string;
  status: "pending" | "signed_up" | "first_treatment" | "completed" | "expired";
  sentDate: string;
  signUpDate?: string;
  firstTreatmentDate?: string;
  membershipTier?: string;
  pointsEarned: number;
  bonusPointsEarned?: number;
  expiryDate: string;
}

export interface ReferralReward {
  id: string;
  milestone: string;
  description: string;
  pointsRequired: number;
  pointsEarned: number;
  type: "signup" | "first_treatment" | "tier_upgrade" | "loyalty_bonus";
  multiplier?: number;
  isCompleted: boolean;
  completedDate?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalPointsEarned: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  nextRankThreshold: number;
  lifetimeValue: number;
}

export interface ReferralTier {
  name: string;
  threshold: number;
  benefits: string[];
  bonusMultiplier: number;
  icon: string;
  color: string;
}

// Sample referral data
export const userReferrals: Referral[] = [
  {
    id: "ref-1",
    friendName: "Sarah Mitchell",
    friendEmail: "sarah.m@email.com", 
    status: "completed",
    sentDate: "January 15, 2026",
    signUpDate: "January 18, 2026",
    firstTreatmentDate: "February 2, 2026",
    membershipTier: "Evolve",
    pointsEarned: 200,
    bonusPointsEarned: 50,
    expiryDate: "July 15, 2026"
  },
  {
    id: "ref-2",
    friendName: "Jessica Chen",
    friendEmail: "jess.chen@email.com",
    status: "first_treatment", 
    sentDate: "February 3, 2026",
    signUpDate: "February 5, 2026",
    firstTreatmentDate: "March 12, 2026",
    membershipTier: "Core",
    pointsEarned: 150,
    expiryDate: "August 3, 2026"
  },
  {
    id: "ref-3",
    friendName: "Amanda Rodriguez",
    friendEmail: "amanda.r@email.com",
    status: "signed_up",
    sentDate: "March 1, 2026", 
    signUpDate: "March 8, 2026",
    membershipTier: "Transform",
    pointsEarned: 100,
    expiryDate: "September 1, 2026"
  },
  {
    id: "ref-4",
    friendName: "Emily Johnson", 
    friendEmail: "emily.j@email.com",
    status: "pending",
    sentDate: "March 18, 2026",
    pointsEarned: 0,
    expiryDate: "September 18, 2026"
  },
  {
    id: "ref-5",
    friendName: "Rachel Park",
    friendEmail: "rachel.park@email.com",
    status: "expired",
    sentDate: "October 1, 2025",
    pointsEarned: 0,
    expiryDate: "April 1, 2026"
  }
];

export const referralRewards: ReferralReward[] = [
  {
    id: "reward-1",
    milestone: "Friend Signs Up",
    description: "Earn points when your friend creates an account and joins any membership tier",
    pointsRequired: 1,
    pointsEarned: 100,
    type: "signup",
    isCompleted: true,
    completedDate: "January 18, 2026"
  },
  {
    id: "reward-2", 
    milestone: "First Treatment",
    description: "Bonus points when your friend completes their first treatment",
    pointsRequired: 1,
    pointsEarned: 150,
    type: "first_treatment",
    isCompleted: true,
    completedDate: "February 2, 2026"
  },
  {
    id: "reward-3",
    milestone: "Premium Tier Signup",
    description: "Extra bonus if your friend joins Evolve or Transform tier",
    pointsRequired: 1,
    pointsEarned: 75,
    type: "tier_upgrade",
    multiplier: 1.5,
    isCompleted: true,
    completedDate: "January 18, 2026"
  },
  {
    id: "reward-4",
    milestone: "Loyalty Streak",
    description: "Consecutive months with successful referrals",
    pointsRequired: 3,
    pointsEarned: 200,
    type: "loyalty_bonus",
    multiplier: 2.0,
    isCompleted: false
  }
];

export const referralStats: ReferralStats = {
  totalReferrals: 5,
  successfulReferrals: 3,
  pendingReferrals: 1, 
  totalPointsEarned: 675,
  currentStreak: 2,
  longestStreak: 3,
  rank: 4, // Out of all users
  nextRankThreshold: 750,
  lifetimeValue: 1250 // Total value generated from referrals
};

export const referralTiers: ReferralTier[] = [
  {
    name: "Advocate",
    threshold: 0,
    benefits: ["100 points per signup", "Standard rewards"],
    bonusMultiplier: 1.0,
    icon: "👤",
    color: "#6B7280"
  },
  {
    name: "Ambassador", 
    threshold: 3,
    benefits: ["125 points per signup", "Priority support", "Exclusive events"],
    bonusMultiplier: 1.25,
    icon: "⭐", 
    color: "#B57EDC"
  },
  {
    name: "Champion",
    threshold: 8,
    benefits: ["150 points per signup", "VIP treatment access", "Personal consultant"],
    bonusMultiplier: 1.5,
    icon: "👑",
    color: "#9F6BCB"
  },
  {
    name: "Legend",
    threshold: 15,
    benefits: ["200 points per signup", "Exclusive treatments", "Revenue sharing"],
    bonusMultiplier: 2.0,
    icon: "💎",
    color: "#8B5FBD"
  }
];

// Helper functions
export const getCurrentTier = (successfulReferrals: number): ReferralTier => {
  return referralTiers
    .slice()
    .reverse()
    .find(tier => successfulReferrals >= tier.threshold) || referralTiers[0];
};

export const getNextTier = (successfulReferrals: number): ReferralTier | null => {
  return referralTiers.find(tier => successfulReferrals < tier.threshold) || null;
};

export const calculateReferralValue = (referral: Referral, currentTier: ReferralTier): number => {
  let basePoints = 0;
  
  // Base points based on status
  switch (referral.status) {
    case "signed_up":
      basePoints = 100;
      break;
    case "first_treatment": 
      basePoints = 250;
      break;
    case "completed":
      basePoints = 300;
      break;
    default:
      basePoints = 0;
  }
  
  // Apply tier multiplier
  const multipliedPoints = basePoints * currentTier.bonusMultiplier;
  
  // Tier-based bonuses
  if (referral.membershipTier === "Transform") {
    return multipliedPoints + 100; // Premium tier bonus
  } else if (referral.membershipTier === "Evolve") {
    return multipliedPoints + 50;
  }
  
  return multipliedPoints;
};

export const getActiveReferrals = (): Referral[] => {
  return userReferrals.filter(ref => 
    ref.status !== "expired" && new Date(ref.expiryDate) > new Date()
  );
};

export const getPendingReferrals = (): Referral[] => {
  return userReferrals.filter(ref => ref.status === "pending");
};

export const getSuccessfulReferrals = (): Referral[] => {
  return userReferrals.filter(ref => 
    ref.status === "first_treatment" || ref.status === "completed"
  );
};

export const generateReferralLink = (userId: string): string => {
  return `https://app.reflectmedical.com/join?ref=${userId}`;
};

export const calculateProjectedEarnings = (referralsPerMonth: number, months: number): number => {
  const currentTier = getCurrentTier(referralStats.successfulReferrals);
  const avgPointsPerReferral = 250; // Conservative estimate
  const totalReferrals = referralsPerMonth * months;
  
  return Math.round(totalReferrals * avgPointsPerReferral * currentTier.bonusMultiplier);
};

export const formatPoints = (points: number): string => {
  return points.toLocaleString() + " pts";
};

export const getReferralInsights = () => {
  const currentTier = getCurrentTier(referralStats.successfulReferrals);
  const nextTier = getNextTier(referralStats.successfulReferrals);
  const conversionRate = referralStats.totalReferrals > 0 
    ? (referralStats.successfulReferrals / referralStats.totalReferrals * 100).toFixed(1)
    : "0.0";
  
  return {
    currentTier,
    nextTier,
    conversionRate,
    referralsUntilNextTier: nextTier ? nextTier.threshold - referralStats.successfulReferrals : 0,
    avgPointsPerReferral: Math.round(referralStats.totalPointsEarned / Math.max(referralStats.successfulReferrals, 1)),
    projectedMonthlyEarnings: calculateProjectedEarnings(1, 1)
  };
};

// Social sharing templates
export const shareTemplates = {
  email: {
    subject: "You'll love Reflect Medical - exclusive member pricing inside!",
    body: `Hi {friendName},

I've been loving my treatments at Reflect Medical and thought you might be interested! They have amazing membership pricing and the results have been incredible.

Use my referral link to get started: {referralLink}

You'll get exclusive member pricing on treatments like:
• Botox starting at $12/unit (instead of $16)
• HydraFacials for $180 (instead of $225) 
• Dermal fillers with 20-25% savings

The membership pays for itself with just one treatment. Hope to see you there!

{yourName}`
  },
  sms: {
    message: "Hey {friendName}! Check out Reflect Medical - I'm saving hundreds on aesthetic treatments with their membership. Use my link for exclusive pricing: {referralLink}"
  },
  social: {
    message: "Loving my results from @ReflectMedical! Their membership program has saved me over $1,200 this year on treatments. DM me for my referral link! 💜 #SkinGoals #MembershipPerks"
  }
};