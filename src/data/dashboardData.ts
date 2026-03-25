import { treatments, calculateSavings } from './treatments';

export interface DashboardStats {
  availableCredit: number;
  monthlyValueUsed: number;
  savingsThisMonth: number;
  totalSavingsLifetime: number;
  treatmentsThisMonth: number;
  memberSince: string;
  nextAppointment?: {
    treatment: string;
    date: string;
    time: string;
    provider: string;
  };
}

export interface RecentActivity {
  id: string;
  type: 'treatment' | 'credit' | 'booking';
  treatment: string;
  date: string;
  amount: number;
  savings?: number;
  status: 'completed' | 'upcoming' | 'cancelled';
}

export interface UpcomingVisit {
  id: string;
  treatment: string;
  provider: string;
  date: string;
  time: string;
  duration: string;
  cost: number;
  savings: number;
  notes?: string;
}

// Sample dashboard data for Evolve member
export const sampleDashboardData: DashboardStats = {
  availableCredit: 1420,
  monthlyValueUsed: 680,
  savingsThisMonth: 285,
  totalSavingsLifetime: 3850,
  treatmentsThisMonth: 3,
  memberSince: "January 2024",
  nextAppointment: {
    treatment: "HydraFacial MD Deluxe",
    date: "March 28, 2026",
    time: "2:30 PM",
    provider: "Dr. Sarah Chen"
  }
};

export const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "treatment",
    treatment: "Juvéderm Ultra",
    date: "March 15, 2026",
    amount: 520,
    savings: 130,
    status: "completed"
  },
  {
    id: "2", 
    type: "credit",
    treatment: "Monthly Membership Credit",
    date: "March 1, 2026",
    amount: 450,
    status: "completed"
  },
  {
    id: "3",
    type: "treatment", 
    treatment: "HydraFacial MD Deluxe",
    date: "March 8, 2026",
    amount: 180,
    savings: 45,
    status: "completed"
  },
  {
    id: "4",
    type: "booking",
    treatment: "Botox Cosmetic",
    date: "April 5, 2026", 
    amount: 360,
    savings: 90,
    status: "upcoming"
  },
  {
    id: "5",
    type: "treatment",
    treatment: "Dermaplaning + Custom Facial",
    date: "February 22, 2026",
    amount: 150,
    savings: 35,
    status: "completed"
  }
];

export const upcomingVisits: UpcomingVisit[] = [
  {
    id: "1",
    treatment: "HydraFacial MD Deluxe", 
    provider: "Dr. Sarah Chen",
    date: "March 28, 2026",
    time: "2:30 PM",
    duration: "60 minutes",
    cost: 180,
    savings: 45,
    notes: "Follow-up facial for skin texture improvement"
  },
  {
    id: "2",
    treatment: "Botox Cosmetic - Forehead",
    provider: "Dr. Michael Rodriguez", 
    date: "April 5, 2026",
    time: "11:00 AM",
    duration: "20 minutes",
    cost: 360,
    savings: 90,
    notes: "30 units for forehead lines"
  },
  {
    id: "3",
    treatment: "Restylane Lyft - Cheeks",
    provider: "Dr. Sarah Chen",
    date: "April 12, 2026", 
    time: "3:15 PM",
    duration: "45 minutes",
    cost: 600,
    savings: 150,
    notes: "1 syringe for mid-face volume"
  }
];

// Credit usage breakdown for visualization
export const creditUsageData = [
  { category: "Neurotoxin", amount: 450, percentage: 35 },
  { category: "Fillers", amount: 380, percentage: 30 },
  { category: "Facials", amount: 290, percentage: 23 },
  { category: "Device Treatments", amount: 155, percentage: 12 }
];

// Monthly usage trend (last 6 months)
export const monthlyUsage = [
  { month: "Oct '25", spent: 320, saved: 95 },
  { month: "Nov '25", spent: 410, saved: 125 },
  { month: "Dec '25", spent: 290, saved: 85 },
  { month: "Jan '26", spent: 520, saved: 160 },
  { month: "Feb '26", spent: 475, saved: 140 },
  { month: "Mar '26", spent: 680, saved: 285 }
];

export const getMembershipProgress = (tier: string) => {
  const tiers = {
    "Core": { current: 0, next: "Evolve", creditsToNext: 200 },
    "Evolve": { current: 1, next: "Transform", creditsToNext: 350 },
    "Transform": { current: 2, next: null, creditsToNext: 0 }
  };
  
  return tiers[tier as keyof typeof tiers] || tiers.Core;
};

// Personalized recommendations based on usage
export const getPersonalizedRecommendations = (membershipTier: string) => {
  const baseRecommendations = [
    {
      title: "Continue Your Routine",
      treatments: ["HydraFacial MD Deluxe", "Dermaplaning + Custom Facial"],
      reason: "Based on your recent facial treatments"
    },
    {
      title: "Popular This Month", 
      treatments: ["Botox Cosmetic", "Juvéderm Ultra"],
      reason: "Most booked by Evolve members"
    }
  ];

  if (membershipTier === "Transform") {
    baseRecommendations.push({
      title: "Premium Options",
      treatments: ["VI Peel Precision Plus", "Microneedling + PRF"],
      reason: "Exclusive Transform member benefits"
    });
  }

  return baseRecommendations;
};