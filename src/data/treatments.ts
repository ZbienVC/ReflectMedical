// Realistic NJ dermatology treatment pricing data
export interface TreatmentVariant {
  name: string;
  pricePerUnit?: number;
  unitLabel?: string;
  typicalUnits?: string;
  flatPrice?: number;
  memberPrices: {
    core: number;
    evolve: number;
    transform: number;
  };
}

export interface Treatment {
  id: string;
  name: string;
  category: "Neurotoxins" | "Fillers" | "Devices" | "Skincare" | "Laser";
  description: string;
  duration: string;
  results: string;
  icon: string;
  variants: TreatmentVariant[];
  areas?: string[];
  benefits?: string[];
}

export const MEMBERSHIP_DISCOUNTS = {
  core: { label: "Core", color: "#6D28D9", savings: "Save 10-20%" },
  evolve: { label: "Evolve", color: "#8B5CF6", savings: "Save 15-30%" },
  transform: { label: "Transform", color: "#A78BFA", savings: "Save 20-40%" },
};

export const treatments: Treatment[] = [
  {
    id: "botox",
    name: "Botox Cosmetic",
    category: "Neurotoxins",
    description: "FDA-approved neurotoxin to smooth fine lines and wrinkles. Most popular injectable in the world.",
    duration: "15-20 min",
    results: "3-6 months",
    icon: "💉",
    areas: ["Forehead lines", "Crow's feet", "Frown lines (11s)", "Brow lift", "Bunny lines", "Lip flip"],
    variants: [
      {
        name: "Botox",
        pricePerUnit: 15,
        unitLabel: "unit",
        typicalUnits: "20-60 units",
        memberPrices: { core: 13, evolve: 11, transform: 9 },
      },
    ],
  },
  {
    id: "dysport",
    name: "Dysport",
    category: "Neurotoxins",
    description: "A faster-acting neurotoxin that spreads naturally. Great for larger treatment areas.",
    duration: "15-20 min",
    results: "3-5 months",
    icon: "💉",
    areas: ["Forehead", "Crow's feet", "Glabella (frown lines)"],
    variants: [
      {
        name: "Dysport",
        pricePerUnit: 5,
        unitLabel: "unit",
        typicalUnits: "50-150 units",
        memberPrices: { core: 4.5, evolve: 4, transform: 3.5 },
      },
    ],
  },
  {
    id: "xeomin",
    name: "Xeomin",
    category: "Neurotoxins",
    description: "A 'naked' neurotoxin with no additives — ideal for patients resistant to other toxins.",
    duration: "15-20 min",
    results: "3-6 months",
    icon: "💉",
    areas: ["Forehead", "Glabella", "Crow's feet"],
    variants: [
      {
        name: "Xeomin",
        pricePerUnit: 12,
        unitLabel: "unit",
        typicalUnits: "20-60 units",
        memberPrices: { core: 10, evolve: 9, transform: 8 },
      },
    ],
  },
  {
    id: "jeuveau",
    name: "Jeuveau",
    category: "Neurotoxins",
    description: "The newest FDA-approved neurotoxin, formulated specifically for aesthetics.",
    duration: "15-20 min",
    results: "3-6 months",
    icon: "💉",
    areas: ["Forehead", "Glabella", "Crow's feet"],
    variants: [
      {
        name: "Jeuveau",
        pricePerUnit: 12,
        unitLabel: "unit",
        typicalUnits: "20-60 units",
        memberPrices: { core: 10, evolve: 9, transform: 8 },
      },
    ],
  },
  {
    id: "juvederm",
    name: "Juvederm Collection",
    category: "Fillers",
    description: "Premium hyaluronic acid fillers from Allergan for natural-looking volume and contour.",
    duration: "30-45 min",
    results: "12-18 months",
    icon: "✨",
    areas: ["Lips", "Cheeks", "Nasolabial folds", "Jawline", "Under-eye", "Temples"],
    variants: [
      {
        name: "Juvederm Ultra (lips)",
        flatPrice: 650,
        unitLabel: "syringe",
        memberPrices: { core: 585, evolve: 520, transform: 455 },
      },
      {
        name: "Juvederm Voluma (cheeks)",
        flatPrice: 900,
        unitLabel: "syringe",
        memberPrices: { core: 810, evolve: 720, transform: 630 },
      },
      {
        name: "Juvederm Vollure (folds)",
        flatPrice: 750,
        unitLabel: "syringe",
        memberPrices: { core: 675, evolve: 600, transform: 525 },
      },
      {
        name: "Juvederm Volbella (lips/fine lines)",
        flatPrice: 650,
        unitLabel: "syringe",
        memberPrices: { core: 585, evolve: 520, transform: 455 },
      },
    ],
  },
  {
    id: "restylane",
    name: "Restylane Collection",
    category: "Fillers",
    description: "Galderma's trusted HA filler line, ideal for precise contouring and delicate areas.",
    duration: "30-45 min",
    results: "12-18 months",
    icon: "✨",
    areas: ["Lips", "Under-eye", "Cheeks", "Nasolabial folds"],
    variants: [
      {
        name: "Restylane (general)",
        flatPrice: 650,
        unitLabel: "syringe",
        memberPrices: { core: 585, evolve: 520, transform: 455 },
      },
      {
        name: "Restylane Lyft (cheeks/hands)",
        flatPrice: 800,
        unitLabel: "syringe",
        memberPrices: { core: 720, evolve: 640, transform: 560 },
      },
      {
        name: "Restylane Kysse (lips)",
        flatPrice: 700,
        unitLabel: "syringe",
        memberPrices: { core: 630, evolve: 560, transform: 490 },
      },
    ],
  },
  {
    id: "microneedling",
    name: "Microneedling",
    category: "Devices",
    description: "Collagen induction therapy using fine needles to resurface skin and reduce scars, pores, and texture.",
    duration: "45-60 min",
    results: "4-6 weeks per session",
    icon: "🔬",
    benefits: ["Reduces acne scars", "Minimizes pores", "Improves skin texture", "Boosts collagen", "Evens skin tone"],
    variants: [
      {
        name: "Microneedling (face)",
        flatPrice: 450,
        unitLabel: "session",
        memberPrices: { core: 405, evolve: 360, transform: 315 },
      },
      {
        name: "Microneedling with PRP",
        flatPrice: 700,
        unitLabel: "session",
        memberPrices: { core: 630, evolve: 560, transform: 490 },
      },
    ],
  },
  {
    id: "laser-resurfacing",
    name: "Laser Resurfacing",
    category: "Laser",
    description: "Advanced laser technology to resurface skin, reduce wrinkles, age spots, and improve overall tone.",
    duration: "30-90 min",
    results: "Long-lasting with proper care",
    icon: "⚡",
    benefits: ["Wrinkle reduction", "Pigmentation correction", "Scar revision", "Skin tightening"],
    variants: [
      {
        name: "Fractional CO2 Laser",
        flatPrice: 800,
        unitLabel: "session",
        memberPrices: { core: 720, evolve: 640, transform: 560 },
      },
      {
        name: "IPL Photofacial",
        flatPrice: 350,
        unitLabel: "session",
        memberPrices: { core: 315, evolve: 280, transform: 245 },
      },
      {
        name: "BBL BroadBand Light",
        flatPrice: 500,
        unitLabel: "session",
        memberPrices: { core: 450, evolve: 400, transform: 350 },
      },
    ],
  },
  {
    id: "hydrafacial",
    name: "HydraFacial MD",
    category: "Devices",
    description: "The #1 non-invasive facial treatment: cleanses, exfoliates, extracts, and infuses serums in one session.",
    duration: "30-45 min",
    results: "Immediate glow",
    icon: "💧",
    benefits: ["Deep pore cleansing", "Hydration boost", "Antioxidant protection", "Brightening", "Anti-aging"],
    variants: [
      {
        name: "HydraFacial Classic",
        flatPrice: 175,
        unitLabel: "session",
        memberPrices: { core: 157, evolve: 140, transform: 122 },
      },
      {
        name: "HydraFacial Deluxe",
        flatPrice: 225,
        unitLabel: "session",
        memberPrices: { core: 202, evolve: 180, transform: 157 },
      },
      {
        name: "HydraFacial Platinum",
        flatPrice: 325,
        unitLabel: "session",
        memberPrices: { core: 292, evolve: 260, transform: 227 },
      },
    ],
  },
  {
    id: "chemical-peel",
    name: "Chemical Peels",
    category: "Skincare",
    description: "Medical-grade chemical exfoliation to reveal fresh, rejuvenated skin and address specific skin concerns.",
    duration: "30-45 min",
    results: "2-4 weeks visible improvement",
    icon: "🌿",
    benefits: ["Brightening", "Acne treatment", "Anti-aging", "Even skin tone", "Texture refinement"],
    variants: [
      {
        name: "Light Peel (Glycolic/Salicylic)",
        flatPrice: 125,
        unitLabel: "session",
        memberPrices: { core: 112, evolve: 100, transform: 87 },
      },
      {
        name: "VI Peel (Medium)",
        flatPrice: 225,
        unitLabel: "session",
        memberPrices: { core: 202, evolve: 180, transform: 157 },
      },
      {
        name: "TCA Peel (Deep)",
        flatPrice: 350,
        unitLabel: "session",
        memberPrices: { core: 315, evolve: 280, transform: 245 },
      },
    ],
  },
];

export const getTreatmentsByCategory = (category: string) =>
  treatments.filter((t) => t.category === category);

export const calculateSavings = (
  basePrice: number,
  memberPrice: number
): { amount: number; percent: number } => ({
  amount: basePrice - memberPrice,
  percent: Math.round(((basePrice - memberPrice) / basePrice) * 100),
});
