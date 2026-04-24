export type MembershipTier = {
  id: string;
  name: string;
  monthlyPrice: number;
  monthlyCredits: number;
  toxinDiscountBotox: number;
  toxinDiscountDysport: number;
  fillerDiscountPercent: number;
  deviceDiscountPercent: number;
  retailDiscountPercent: number;
};

export type Service = {
  id: string;
  name: string;
  category: "injectable" | "filler" | "device" | "wellness" | "retail";
  basePrice: number;
};

export type UserRole = "user" | "admin" | "superadmin";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  membershipTierId?: string;
  beautyBucksBalance: number;
  joinDate: string;
  status: "active" | "paused" | "canceled";
  role: UserRole;
};

export type Transaction = {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  basePrice: number;
  discountedPrice: number;
  beautyBucksUsed: number;
  finalPrice: number;
  savings: number;
  createdAt: string;
};

export type BeautyBucksLedger = {
  id: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  expirationDate?: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  status: "scheduled" | "completed" | "canceled";
};

export type AppointmentRequest = {
  id?: string;
  treatmentId: string;
  treatmentName: string;
  price: number;
  preferredDate: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};