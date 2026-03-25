import { MembershipTier, Service } from "./types";

export const INITIAL_MEMBERSHIP_TIERS: Omit<MembershipTier, "id">[] = [
  {
    name: "Core",
    monthlyPrice: 99,
    monthlyCredits: 50,
    toxinDiscountBotox: 12, // $12/unit
    toxinDiscountDysport: 4, // $4/unit
    fillerDiscountPercent: 5,
    deviceDiscountPercent: 5,
    retailDiscountPercent: 10,
  },
  {
    name: "Evolve",
    monthlyPrice: 199,
    monthlyCredits: 125,
    toxinDiscountBotox: 11,
    toxinDiscountDysport: 3.5,
    fillerDiscountPercent: 10,
    deviceDiscountPercent: 10,
    retailDiscountPercent: 15,
  },
  {
    name: "Transform",
    monthlyPrice: 299,
    monthlyCredits: 225,
    toxinDiscountBotox: 10,
    toxinDiscountDysport: 3,
    fillerDiscountPercent: 15,
    deviceDiscountPercent: 15,
    retailDiscountPercent: 20,
  },
];

export const INITIAL_SERVICES: Omit<Service, "id">[] = [
  { name: "Botox (per unit)", category: "injectable", basePrice: 14 },
  { name: "Dysport (per unit)", category: "injectable", basePrice: 5 },
  { name: "Juvederm Voluma", category: "filler", basePrice: 800 },
  { name: "Restylane Kysse", category: "filler", basePrice: 700 },
  { name: "Microneedling", category: "device", basePrice: 350 },
  { name: "RF Microneedling", category: "device", basePrice: 750 },
  { name: "Laser Hair Removal (Small Area)", category: "device", basePrice: 150 },
  { name: "Chemical Peel", category: "wellness", basePrice: 175 },
  { name: "GLP-1 Consultation", category: "wellness", basePrice: 250 },
  { name: "Premium Cleanser", category: "retail", basePrice: 45 },
  { name: "Vitamin C Serum", category: "retail", basePrice: 120 },
];
