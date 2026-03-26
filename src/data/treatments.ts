export const treatmentCategories = [
  { id: "all", label: "All" },
  { id: "neurotoxins", label: "Neurotoxins" },
  { id: "fillers", label: "Fillers" },
  { id: "devices", label: "Devices" },
  { id: "skincare", label: "Skincare" },
  { id: "laser", label: "Laser" },
  { id: "wellness", label: "Wellness" },
];

export interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  unitType?: "unit" | "session" | "syringe";
  typicalRange?: string;
  basePrice?: number;
  memberPricing?: { core?: number; evolve?: number; transform?: number };
  memberDiscount?: { core?: number; evolve?: number; transform?: number };
  duration?: string;
  results?: string;
  variants?: { name: string; price: number; memberPrices: { core: number; evolve: number; transform: number } }[];
}

export const treatments: Treatment[] = [
  // NEUROTOXINS
  { id: "botox", name: "Botox Cosmetic", category: "neurotoxins", description: "Smooth fine lines and wrinkles with the most popular injectable treatment.", unitType: "unit", typicalRange: "20–60 units", basePrice: 15, memberPricing: { core: 12, evolve: 10, transform: 9 }, duration: "15–20 min", results: "3–4 months" },
  { id: "dysport", name: "Dysport", category: "neurotoxins", description: "Fast-acting neurotoxin ideal for larger treatment areas.", unitType: "unit", typicalRange: "50–150 units", basePrice: 14, memberPricing: { core: 12, evolve: 10, transform: 9 }, duration: "15–20 min", results: "3–4 months" },
  { id: "xeomin", name: "Xeomin", category: "neurotoxins", description: "Purified neurotoxin with no additives, ideal for resistant patients.", unitType: "unit", typicalRange: "20–60 units", basePrice: 13, memberPricing: { core: 11, evolve: 10, transform: 9 }, duration: "15–20 min", results: "3–6 months" },

  // FILLERS
  { id: "dermal_fillers", name: "Dermal Fillers", category: "fillers", description: "Restore volume, enhance contours, and improve facial balance. Includes Juvéderm, Restylane, Belotero, Radiesse, and Versa.", unitType: "syringe", typicalRange: "1–3 syringes", basePrice: 750, memberDiscount: { evolve: 75, transform: 150 }, duration: "30–45 min", results: "6–18 months" },

  // DEVICES
  { id: "microneedling", name: "Microneedling", category: "devices", description: "Stimulates collagen production to improve skin texture and tone.", unitType: "session", basePrice: 500, memberDiscount: { evolve: 75, transform: 150 }, duration: "45–60 min", results: "4–6 weeks" },
  { id: "rf_microneedling", name: "RF Microneedling", category: "devices", description: "Advanced collagen remodeling with radiofrequency for tighter, smoother skin.", unitType: "session", basePrice: 700, memberDiscount: { evolve: 100, transform: 200 }, duration: "60 min", results: "6–8 weeks" },
  { id: "trilift", name: "TriLift", category: "devices", description: "Non-invasive facial lifting and muscle stimulation treatment.", unitType: "session", basePrice: 600, memberDiscount: { evolve: 75, transform: 150 }, duration: "45 min", results: "Progressive" },

  // SKINCARE
  { id: "hydrafacial", name: "HydraFacial", category: "skincare", description: "Deep cleansing, exfoliation, and hydration for glowing skin.", unitType: "session", basePrice: 200, memberDiscount: { core: 20, evolve: 40, transform: 60 }, duration: "30–45 min", results: "Immediate" },
  { id: "chemical_peel", name: "Chemical Peel", category: "skincare", description: "Resurface and renew skin to improve tone, texture, and clarity. Options include Perfect Derma™, Vitalize, and TCA.", unitType: "session", basePrice: 300, memberDiscount: { core: 30, evolve: 60, transform: 90 }, duration: "30–45 min", results: "1–2 weeks" },
  { id: "diamond_glow", name: "DiamondGlow Facial", category: "skincare", description: "Medical-grade dermabrasion with serum infusion for instant radiance.", unitType: "session", basePrice: 250, memberDiscount: { core: 25, evolve: 50, transform: 75 }, duration: "45 min", results: "Immediate" },

  // LASER
  { id: "laser_hair_removal", name: "Laser Hair Removal", category: "laser", description: "Long-term hair reduction across face and body areas. Specializing in all skin tones.", unitType: "session", basePrice: 150, memberDiscount: { core: 15, evolve: 30, transform: 45 }, duration: "15–60 min", results: "Permanent reduction" },
  { id: "skin_resurfacing_laser", name: "Laser Skin Resurfacing", category: "laser", description: "Targets pigmentation, texture, and overall skin quality with advanced laser technology.", unitType: "session", basePrice: 600, memberDiscount: { evolve: 75, transform: 150 }, duration: "30–60 min", results: "Long-lasting" },

  // WELLNESS
  { id: "weight_loss", name: "Medical Weight Loss", category: "wellness", description: "GLP-1 based programs including semaglutide and tirzepatide with physician supervision.", unitType: "session", basePrice: 299, memberDiscount: { evolve: 30, transform: 60 }, duration: "Ongoing", results: "Progressive" },
  { id: "suboxone", name: "Suboxone Treatment", category: "wellness", description: "Medication-assisted treatment program with compassionate, ongoing medical care.", unitType: "session", basePrice: 200, duration: "Ongoing", results: "Ongoing" },
  { id: "office_visit", name: "General Office Visit", category: "wellness", description: "Primary care consultations and routine medical visits with Dr. Douglas Bienstock, DO.", unitType: "session", basePrice: 150, duration: "30 min", results: "Same day" },
];

export const MEMBERSHIP_DISCOUNTS = {
  core: { label: "Core", savings: "Save 10–20%" },
  evolve: { label: "Evolve", savings: "Save 10–30%" },
  transform: { label: "Transform", savings: "Save 15–40%" },
};

export function getMemberPrice(treatment: Treatment, tier: "core" | "evolve" | "transform"): number {
  if (treatment.memberPricing?.[tier] !== undefined) return treatment.memberPricing[tier]!;
  if (treatment.memberDiscount?.[tier] !== undefined) return treatment.basePrice! - treatment.memberDiscount[tier]!;
  return treatment.basePrice ?? 0;
}

export function getSavings(treatment: Treatment, tier: "core" | "evolve" | "transform"): number {
  if (!treatment.basePrice) return 0;
  return treatment.basePrice - getMemberPrice(treatment, tier);
}

export function calculateSavings(base: number, member: number) {
  return { amount: base - member, percent: Math.round(((base - member) / base) * 100) };
}
