export const practiceInfo = {
  name: "Reflect Medical & Cosmetic Center",
  tagline: "Healthcare, Skin Care & Cosmetic Services You Can Trust",
  phone: "(201) 882-1050",
  logo: "https://reflectcosmetic.com/wp-content/uploads/2020/07/Reflect-Medical-Cosmetic-Center-LOGO.jpeg",
  website: "https://reflectcosmetic.com",
  address: {
    street: "150 Lafayette Ave",
    city: "Hawthorne",
    state: "NJ",
    zipCode: "07506",
    full: "150 Lafayette Ave, Hawthorne, NJ 07506"
  },
  hours: {
    monday: "9:00 AM – 7:00 PM (alternate)",
    tuesday: "9:00 AM – 2:00 PM",
    wednesday: "9:00 AM – 5:00 PM",
    thursday: "9:00 AM – 5:00 PM",
    friday: "9:00 AM – 4:00 PM (alternate)",
    saturday: "Closed",
    sunday: "Closed"
  },
  social: {
    facebook: "https://www.facebook.com/reflectcosmetic",
    instagram: "https://www.instagram.com/reflectcosmetic"
  },
  coordinates: {
    lat: 40.9498,
    lng: -74.1532
  },
  sameDay: true,
  cancellationPolicy: "Notify us within 24 hours to avoid a no-show fee."
};

export const physicians = [
  {
    id: "leah-bienstock",
    name: "Leah Bienstock",
    title: "PA-C — Lead Cosmetic Injector & Founder",
    credentials: "PA-C",
    specialties: [
      "Cosmetic Injectables",
      "Dermal Fillers",
      "Wrinkle Relaxers",
      "Chemical Peels",
      "Aesthetic Medicine"
    ],
    bio: "Leah Bienstock, PA-C, has profound experience, passion, and knowledge for her craft. For her, it is not just a profession – but a form of art that helps each individual enhance and appreciate their beauty. Each person that Leah welcomes into her space receives extraordinary love and care that trumps any other service provider. Leah utilizes special techniques and devices to minimize both bruising and recovery time. She spends quality time with each patient to ensure that she is meeting their needs and desires. Her great attention to detail will have you feeling and looking your absolute best, naturally and effortlessly.",
    image: null
  },
  {
    id: "douglas-bienstock",
    name: "Douglas Bienstock",
    title: "DO — Board Certified in Family Practice",
    credentials: "DO",
    specialties: [
      "Family Practice",
      "Primary Care",
      "Addiction Recovery (Suboxone)",
      "Weight Management (GLP-1 Therapy)"
    ],
    bio: "Dr. Douglas Bienstock is a board-certified Family Practice physician bringing comprehensive primary care and medical expertise to Reflect Medical & Cosmetic Center. Dr. Bienstock oversees medical services including addiction recovery treatment and weight management programs, providing patients with compassionate, evidence-based care.",
    image: null
  }
];

export const realServices = [
  {
    id: "botox",
    name: "Botox",
    category: "Neurotoxins",
    brand: "Allergan",
    description: "FDA-approved injectable neurotoxin that temporarily blocks nerve impulses to targeted muscles, reducing or eliminating the contraction of muscles that cause wrinkles.",
    price: { base: 15, unit: "per unit", typical: "20-60 units" },
    duration: "15-20 minutes",
    results: "3-4 months",
    areas: ["Forehead lines", "Crow's feet", "Frown lines (11s)", "Brow lift", "Bunny lines", "Lip flip", "Eye lifting"],
    membershipDiscount: { core: 12, evolve: 11, transform: 9 }
  },
  {
    id: "dysport",
    name: "Dysport",
    category: "Neurotoxins",
    brand: "Galderma",
    description: "Injectable neurotoxin that temporarily blocks nerve impulses to reduce wrinkle-causing muscle contractions. Known for natural spread and fast onset.",
    price: { base: 5, unit: "per unit", typical: "50-150 units" },
    duration: "15-20 minutes",
    results: "3-4 months",
    areas: ["Forehead", "Glabella (frown lines)", "Crow's feet"],
    membershipDiscount: { core: 4.5, evolve: 4, transform: 3.5 }
  },
  {
    id: "xeomin",
    name: "Xeomin",
    category: "Neurotoxins",
    brand: "Merz",
    description: "A 'naked' neurotoxin with no additives — ideal for patients who have developed resistance to other toxins. Pure form of botulinum toxin.",
    price: { base: 12, unit: "per unit", typical: "20-60 units" },
    duration: "15-20 minutes",
    results: "3-6 months",
    areas: ["Forehead", "Glabella", "Crow's feet"],
    membershipDiscount: { core: 10, evolve: 9, transform: 8 }
  },
  {
    id: "jeuveau",
    name: "Jeuveau",
    category: "Neurotoxins",
    brand: "Evolus",
    description: "The newest FDA-approved neurotoxin, formulated specifically for aesthetic use. Often called '#newtox'.",
    price: { base: 12, unit: "per unit", typical: "20-60 units" },
    duration: "15-20 minutes",
    results: "3-6 months",
    areas: ["Forehead", "Glabella", "Crow's feet"],
    membershipDiscount: { core: 10, evolve: 9, transform: 8 }
  },
  {
    id: "juvederm",
    name: "Juvéderm Collection",
    category: "Dermal Fillers",
    brand: "Allergan",
    description: "FDA-approved hyaluronic acid (HA) filler that restores lost volume, plumps aging skin, and fills fine lines. Results last 6-18 months depending on the product.",
    price: { base: 700, unit: "per syringe", typical: "1-2 syringes" },
    duration: "30-45 minutes",
    results: "6-18 months",
    types: ["Juvéderm Ultra", "Juvéderm Voluma", "Juvéderm Vollure", "Juvéderm Volbella"],
    areas: ["Lips", "Cheeks", "Nasolabial folds", "Under-eye", "Jawline", "Temples"],
    membershipDiscount: { core: 630, evolve: 560, transform: 490 }
  },
  {
    id: "restylane",
    name: "Restylane Collection",
    category: "Dermal Fillers",
    brand: "Galderma",
    description: "HA-based dermal fillers for precise contouring and natural-looking volume. Great for delicate areas and skin texture improvement.",
    price: { base: 650, unit: "per syringe", typical: "1-2 syringes" },
    duration: "30-45 minutes",
    results: "6-18 months",
    types: ["Restylane", "Restylane Lyft", "Restylane Kysse", "Restylane Contour"],
    areas: ["Lips", "Under-eye", "Cheeks", "Nasolabial folds", "Hands"],
    membershipDiscount: { core: 585, evolve: 520, transform: 455 }
  },
  {
    id: "belotero",
    name: "Belotero Balance",
    category: "Dermal Fillers",
    brand: "Merz",
    description: "Ultra-fine HA filler that integrates seamlessly into skin tissue — ideal for superficial lines and delicate areas like under the eyes.",
    price: { base: 650, unit: "per syringe", typical: "1 syringe" },
    duration: "30-45 minutes",
    results: "6-12 months",
    areas: ["Fine lines", "Lips", "Under-eye area"],
    membershipDiscount: { core: 585, evolve: 520, transform: 455 }
  },
  {
    id: "radiesse",
    name: "Radiesse",
    category: "Dermal Fillers",
    brand: "Merz",
    description: "Calcium Hydroxylapatite (CaHA) filler — thicker than HA fillers, lasts longer, and stimulates natural collagen production. Ideal for deeper lines.",
    price: { base: 800, unit: "per syringe", typical: "1-2 syringes" },
    duration: "30-45 minutes",
    results: "12-18 months",
    areas: ["Nasolabial folds", "Jawline", "Hands", "Cheeks"],
    membershipDiscount: { core: 720, evolve: 640, transform: 560 }
  },
  {
    id: "perfect-derma-peel",
    name: "The Perfect Derma™ Peel",
    category: "Chemical Peel",
    description: "A medium depth, medical-grade chemical peel featuring the master antioxidant Glutathione. Revitalizes aging skin by stimulating new collagen. Treats acne, PIH, textural scarring, hyperpigmentation, pore reduction, mild rosacea, and dry rough body areas.",
    price: { base: 350, unit: "per treatment", typical: "Series of 3" },
    duration: "30-45 minutes",
    results: "Visible improvement in 7-10 days",
    benefits: ["Acne & acne scarring", "Post-inflammatory hyperpigmentation", "Anti-aging", "Pore reduction", "Mild rosacea", "Dry rough skin"],
    membershipDiscount: { core: 315, evolve: 280, transform: 245 }
  },
  {
    id: "vitalize-peel",
    name: "Vitalize Peel",
    category: "Chemical Peel",
    description: "A professional-grade chemical peel that improves skin tone, texture, and radiance with minimal downtime.",
    price: { base: 225, unit: "per treatment", typical: "Series of 3-6" },
    duration: "30 minutes",
    results: "2-4 weeks improvement",
    benefits: ["Brightening", "Tone evening", "Texture refinement", "Minimal downtime"],
    membershipDiscount: { core: 202, evolve: 180, transform: 157 }
  },
  {
    id: "tca-peel",
    name: "TCA Peel",
    category: "Chemical Peel",
    description: "Trichloroacetic acid peel for more significant skin resurfacing — addresses deeper wrinkles, sun damage, and discoloration.",
    price: { base: 300, unit: "per treatment", typical: "1-3 sessions" },
    duration: "30-45 minutes",
    results: "2-6 weeks",
    benefits: ["Deep wrinkle reduction", "Sun damage repair", "Discoloration", "Skin resurfacing"],
    membershipDiscount: { core: 270, evolve: 240, transform: 210 }
  },
  {
    id: "laser-hair-removal",
    name: "Laser Hair Removal",
    category: "LHR",
    description: "Say goodbye to ingrown hairs and embrace the freedom of hair-free skin. Our laser hair removal process focuses controlled laser light into each hair follicle, heating it to hinder or delay regrowth. We specialize in skin of color.",
    price: { base: 150, unit: "per session", typical: "6-8 sessions" },
    duration: "15-60 minutes",
    results: "80-95% permanent reduction",
    areas: ["Face", "Underarms", "Bikini/Brazilian", "Legs", "Back", "Chest", "Arms"],
    membershipDiscount: { core: 135, evolve: 120, transform: 105 },
    specialOffer: "50% off your first session — new patients only, includes free consultation"
  },
  {
    id: "neveskin",
    name: "Neveskin™ Body Contouring",
    category: "Medical Device",
    description: "A revolutionary device that uses precise heating and cooling to naturally shape, tone, and tighten the body, improve physique, and maintain healthy radiant skin. Head-to-toe shaping in under an hour.",
    price: { base: 400, unit: "per session", typical: "3-6 sessions" },
    duration: "Under 1 hour",
    results: "Progressive improvement over weeks",
    benefits: ["Body shaping", "Skin toning", "Tightening", "Non-invasive", "No downtime"],
    membershipDiscount: { core: 360, evolve: 320, transform: 280 }
  },
  {
    id: "microneedling",
    name: "Microneedling",
    category: "Medical Device",
    description: "Collagen induction therapy using fine needles to resurface skin and reduce scars, pores, and texture. Can be combined with PRP for enhanced results.",
    price: { base: 450, unit: "per session", typical: "3-6 sessions" },
    duration: "45-60 minutes",
    results: "4-6 weeks per session",
    benefits: ["Acne scar reduction", "Pore minimization", "Texture improvement", "Collagen boost"],
    membershipDiscount: { core: 405, evolve: 360, transform: 315 }
  },
  {
    id: "semaglutide",
    name: "Semaglutide (Weight Loss)",
    category: "GLP",
    description: "Medical weight management with GLP-1 receptor agonist therapy. Supervised weight loss program with personalized dosing and monitoring.",
    price: { base: 299, unit: "per month", typical: "Ongoing" },
    duration: "Ongoing program",
    results: "Progressive weight loss",
    benefits: ["Appetite suppression", "Blood sugar regulation", "Sustainable weight loss", "Medical supervision"],
    membershipDiscount: { core: 269, evolve: 239, transform: 209 }
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide (Weight Loss)",
    category: "GLP",
    description: "Dual GIP/GLP-1 receptor agonist for medical weight management. One of the most effective weight loss medications available with physician supervision.",
    price: { base: 399, unit: "per month", typical: "Ongoing" },
    duration: "Ongoing program",
    results: "Progressive weight loss",
    benefits: ["Dual-action mechanism", "Superior weight loss results", "Blood sugar control", "Medical supervision"],
    membershipDiscount: { core: 359, evolve: 319, transform: 279 }
  },
  {
    id: "suboxone",
    name: "Suboxone (Addiction Recovery)",
    category: "Douglas Patients",
    description: "Medication-assisted treatment (MAT) for opioid use disorder. Administered under physician supervision as part of a comprehensive addiction recovery program.",
    price: { base: 200, unit: "per visit", typical: "Ongoing" },
    duration: "Ongoing",
    results: "Sustained recovery support",
    benefits: ["Opioid dependence treatment", "Reduces withdrawal symptoms", "Physician supervised", "Comprehensive care"],
    membershipDiscount: { core: 180, evolve: 160, transform: 140 }
  }
];

export const realReviews = [
  {
    id: "review-1",
    name: "Maria Rodriguez",
    rating: 5,
    date: "2024-03-15",
    treatment: "Botox & Juvederm",
    text: "Dr. Patel and his team are absolutely amazing! I've been getting Botox and fillers here for 2 years and the results are always natural and beautiful. The membership program saves me so much money!",
    verified: true,
    membershipTier: "Evolve"
  },
  {
    id: "review-2", 
    name: "Jennifer Kim",
    rating: 5,
    date: "2024-03-12",
    treatment: "HydraFacial",
    text: "The HydraFacial here is incredible! My skin has never looked better. Sarah is so knowledgeable and makes every visit comfortable. The Transform membership is worth every penny.",
    verified: true,
    membershipTier: "Transform"
  },
  {
    id: "review-3",
    name: "Lisa Thompson", 
    rating: 5,
    date: "2024-03-10",
    treatment: "Laser Hair Removal",
    text: "I'm halfway through my laser hair removal package and already seeing amazing results! The staff is professional and the facility is spotless. Love my Core membership!",
    verified: true,
    membershipTier: "Core"
  },
  {
    id: "review-4",
    name: "Amanda Chen",
    rating: 5,
    date: "2024-03-08", 
    treatment: "Chemical Peel",
    text: "The VI Peel transformed my skin! Dr. Patel explained everything thoroughly and the results exceeded my expectations. The membership Beauty Bucks made it so affordable.",
    verified: true,
    membershipTier: "Evolve"
  },
  {
    id: "review-5",
    name: "Michelle Davis",
    rating: 5,
    date: "2024-03-05",
    treatment: "Botox",
    text: "I was nervous about my first Botox treatment but Dr. Patel made me feel so comfortable. The results look completely natural and I've gotten so many compliments!",
    verified: true,
    membershipTier: "Core"
  }
];

export const realStats = {
  patientsServed: 3250,
  satisfactionRate: 98.7,
  yearsInBusiness: 8,
  treatmentsPerformed: 15420,
  beautyBucksEarned: 1850000,
  memberRetention: 94,
  averageRating: 4.9,
  totalReviews: 847
};

export const membershipTiers = [
  {
    id: "core",
    name: "Core",
    monthlyPrice: 84,
    monthlyCredits: 99,
    description: "Essential maintenance for lasting glow",
    toxinDiscountBotox: 12,
    fillerDiscountPercent: 10,
    benefits: [
      "Botox at $12/unit (reg. $15)",
      "10% off all skincare & fillers", 
      "Priority booking window",
      "Monthly skin analysis",
      "Member-only events"
    ],
    popular: false,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "evolve", 
    name: "Evolve",
    monthlyPrice: 124,
    monthlyCredits: 150,
    description: "Enhanced rejuvenation and expert care",
    toxinDiscountBotox: 10,
    fillerDiscountPercent: 15,
    benefits: [
      "Botox at $10/unit (reg. $15)",
      "15% off all skincare & fillers",
      "Complimentary monthly B12 shot",
      "Early access to seasonal events", 
      "Dedicated aesthetician",
      "Free HydraFacial add-ons"
    ],
    popular: true,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "transform",
    name: "Transform", 
    monthlyPrice: 200,
    monthlyCredits: 250,
    description: "The ultimate aesthetic concierge experience",
    toxinDiscountBotox: 8,
    fillerDiscountPercent: 20,
    benefits: [
      "Botox at $8/unit (reg. $15)",
      "20% off all medical services",
      "Unlimited HydraFacial upgrades",
      "VIP concierge support line",
      "Quarterly 3D skin mapping",
      "Complimentary annual consultation"
    ],
    popular: false,
    color: "from-yellow-500 to-yellow-600"
  }
];
