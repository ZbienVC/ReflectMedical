export type TreatmentCategory =
  | "NEUROTOXIN"
  | "FILLER"
  | "FACIAL"
  | "CHEMICAL_PEEL"
  | "MEDICAL_DEVICE"
  | "LASER"
  | "BODY"
  | "WELLNESS"
  | "PRODUCT";

export type MembershipTier = "core" | "evolve" | "transform";

export interface Treatment {
  id: string;
  name: string;
  category: TreatmentCategory;
  basePrice: number;
  unitType?: "unit" | "session" | "syringe";
  memberPricing?: Partial<Record<MembershipTier, number>>;
  memberDiscount?: Partial<Record<MembershipTier, number>>;
  description?: string;
}

export interface MembershipPlan {
  id: MembershipTier;
  name: string;
  monthlyPrice: number;
  monthlyCredits: number; // "Beauty Bank" value
  description: string;
  highlighted?: boolean;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "core",
    name: "Core",
    monthlyPrice: 79,
    monthlyCredits: 99,
    description: "Essential aesthetic maintenance",
  },
  {
    id: "evolve",
    name: "Evolve",
    monthlyPrice: 129,
    monthlyCredits: 150,
    description: "Enhanced treatments & savings",
    highlighted: true,
  },
  {
    id: "transform",
    name: "Transform",
    monthlyPrice: 199,
    monthlyCredits: 250,
    description: "Maximum value & premium access",
  },
];

export const TREATMENTS: Treatment[] = [
  // NEUROTOXINS
  {
    id: "botox",
    name: "Botox",
    category: "NEUROTOXIN",
    basePrice: 15,
    unitType: "unit",
    description: "FDA-approved wrinkle relaxer (Allergan)",
    memberPricing: { core: 12, evolve: 10, transform: 9 },
  },
  {
    id: "dysport",
    name: "Dysport",
    category: "NEUROTOXIN",
    basePrice: 14,
    unitType: "unit",
    description: "Fast-acting neurotoxin (Galderma)",
    memberPricing: { core: 12, evolve: 10, transform: 9 },
  },
  {
    id: "xeomin",
    name: "Xeomin",
    category: "NEUROTOXIN",
    basePrice: 13,
    unitType: "unit",
    description: "Pure neurotoxin, no additives (Merz)",
    memberPricing: { core: 11, evolve: 10, transform: 9 },
  },
  {
    id: "jeuveau",
    name: "Jeuveau",
    category: "NEUROTOXIN",
    basePrice: 13,
    unitType: "unit",
    description: "Modern neurotoxin (Evolus)",
    memberPricing: { core: 11, evolve: 10, transform: 9 },
  },

  // FILLERS
  {
    id: "juvederm",
    name: "Juvéderm",
    category: "FILLER",
    basePrice: 750,
    unitType: "syringe",
    description: "HA filler — lips, cheeks, folds (Allergan)",
    memberDiscount: { evolve: 75, transform: 150 },
  },
  {
    id: "restylane",
    name: "Restylane",
    category: "FILLER",
    basePrice: 700,
    unitType: "syringe",
    description: "Precise HA filler (Galderma)",
    memberDiscount: { evolve: 70, transform: 140 },
  },
  {
    id: "belotero",
    name: "Belotero Balance",
    category: "FILLER",
    basePrice: 650,
    unitType: "syringe",
    description: "Ultra-fine filler for delicate areas (Merz)",
    memberDiscount: { evolve: 65, transform: 130 },
  },
  {
    id: "radiesse",
    name: "Radiesse",
    category: "FILLER",
    basePrice: 800,
    unitType: "syringe",
    description: "CaHA filler, collagen stimulator (Merz)",
    memberDiscount: { evolve: 80, transform: 160 },
  },
  {
    id: "versa",
    name: "Versa",
    category: "FILLER",
    basePrice: 650,
    unitType: "syringe",
    description: "Smooth HA filler (Revanesse)",
    memberDiscount: { evolve: 65, transform: 130 },
  },
  {
    id: "voluma",
    name: "Juvéderm Voluma",
    category: "FILLER",
    basePrice: 900,
    unitType: "syringe",
    description: "Deep cheek volumizer (Allergan)",
    memberDiscount: { evolve: 90, transform: 180 },
  },

  // CHEMICAL PEELS
  {
    id: "perfect_dermal",
    name: "Perfect Derma™ Peel",
    category: "CHEMICAL_PEEL",
    basePrice: 350,
    unitType: "session",
    description: "Medical-grade peel with Glutathione antioxidant",
    memberDiscount: { core: 35, evolve: 70, transform: 105 },
  },
  {
    id: "vitalize_peel",
    name: "Vitalize Peel",
    category: "CHEMICAL_PEEL",
    basePrice: 225,
    unitType: "session",
    description: "Brightening + tone-evening peel",
    memberDiscount: { core: 22, evolve: 45, transform: 67 },
  },
  {
    id: "tca_peel",
    name: "TCA Peel",
    category: "CHEMICAL_PEEL",
    basePrice: 300,
    unitType: "session",
    description: "Deep resurfacing for wrinkles & sun damage",
    memberDiscount: { core: 30, evolve: 60, transform: 90 },
  },

  // MEDICAL DEVICES
  {
    id: "microneedling",
    name: "Microneedling",
    category: "MEDICAL_DEVICE",
    basePrice: 500,
    unitType: "session",
    description: "Collagen induction therapy for texture & scars",
    memberDiscount: { evolve: 75, transform: 150 },
  },
  {
    id: "rf_microneedling",
    name: "RF Microneedling",
    category: "MEDICAL_DEVICE",
    basePrice: 700,
    unitType: "session",
    description: "Radiofrequency + microneedling for tightening",
    memberDiscount: { evolve: 100, transform: 200 },
  },
  {
    id: "neveskin",
    name: "Neveskin™ Body Contouring",
    category: "MEDICAL_DEVICE",
    basePrice: 400,
    unitType: "session",
    description: "Head-to-toe shaping & toning in under an hour",
    memberDiscount: { evolve: 60, transform: 120 },
  },

  // LASER
  {
    id: "laser_hair",
    name: "Laser Hair Removal",
    category: "LASER",
    basePrice: 150,
    unitType: "session",
    description: "Permanent hair reduction — specializing in skin of color",
    memberDiscount: { core: 15, evolve: 30, transform: 45 },
  },

  // WELLNESS
  {
    id: "semaglutide",
    name: "Semaglutide (GLP-1)",
    category: "WELLNESS",
    basePrice: 299,
    unitType: "session",
    description: "Medical weight management program",
    memberDiscount: { evolve: 30, transform: 60 },
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide (GLP-1)",
    category: "WELLNESS",
    basePrice: 399,
    unitType: "session",
    description: "Dual GIP/GLP-1 weight management",
    memberDiscount: { evolve: 40, transform: 80 },
  },
];

// Pricing engine
export function getMemberPrice(treatment: Treatment, tier: MembershipTier): number {
  if (treatment.memberPricing?.[tier] !== undefined) {
    return treatment.memberPricing[tier]!;
  }
  if (treatment.memberDiscount?.[tier] !== undefined) {
    return treatment.basePrice - treatment.memberDiscount[tier]!;
  }
  return treatment.basePrice;
}

export function getSavings(treatment: Treatment, tier: MembershipTier): number {
  return treatment.basePrice - getMemberPrice(treatment, tier);
}

export function applyCredits(price: number, credits: number): number {
  return Math.max(price - credits, 0);
}

export const CATEGORY_LABELS: Record<TreatmentCategory, string> = {
  NEUROTOXIN: "Neurotoxins",
  FILLER: "Dermal Fillers",
  FACIAL: "Facials",
  CHEMICAL_PEEL: "Chemical Peels",
  MEDICAL_DEVICE: "Medical Devices",
  LASER: "Laser",
  BODY: "Body",
  WELLNESS: "Wellness",
  PRODUCT: "Products",
};

export const CATEGORY_ORDER: TreatmentCategory[] = [
  "NEUROTOXIN",
  "FILLER",
  "CHEMICAL_PEEL",
  "MEDICAL_DEVICE",
  "LASER",
  "WELLNESS",
  "FACIAL",
  "BODY",
  "PRODUCT",
];

