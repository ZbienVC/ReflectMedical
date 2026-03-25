export const practiceInfo = {
  name: "Reflect Medical & Cosmetic Center",
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
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM", 
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 7:00 PM",
    friday: "9:00 AM - 5:00 PM",
    saturday: "9:00 AM - 3:00 PM",
    sunday: "Closed"
  },
  coordinates: {
    lat: 40.9498,
    lng: -74.1532
  }
};

export const physicians = [
  {
    id: "dr-patel",
    name: "Dr. Ravi Patel",
    title: "Medical Director & Board-Certified Physician",
    specialties: [
      "Aesthetic Medicine",
      "Dermatology", 
      "Anti-Aging Treatments",
      "Facial Rejuvenation"
    ],
    education: [
      "MD - Rutgers Robert Wood Johnson Medical School",
      "Residency - Internal Medicine",
      "Fellowship - Aesthetic Medicine"
    ],
    certifications: [
      "American Board of Internal Medicine",
      "American Academy of Aesthetic Medicine",
      "Advanced Injector Certification"
    ],
    experience: "15+ years",
    bio: "Dr. Patel is a board-certified physician with over 15 years of experience in aesthetic medicine. He specializes in non-surgical facial rejuvenation and has performed thousands of successful treatments.",
    image: "/images/dr-patel.jpg"
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson, RN",
    title: "Lead Aesthetic Nurse",
    specialties: [
      "Injectable Treatments",
      "Skincare Consultation",
      "Laser Therapy",
      "Patient Care"
    ],
    certifications: [
      "Registered Nurse (RN)",
      "Certified Aesthetic Nurse",
      "Advanced Injectable Training"
    ],
    experience: "8+ years",
    bio: "Sarah is our lead aesthetic nurse with specialized training in injectable treatments and skincare. She's passionate about helping patients achieve their aesthetic goals safely and naturally.",
    image: "/images/sarah-johnson.jpg"
  }
];

export const realServices = [
  {
    id: "botox",
    name: "Botox Cosmetic",
    category: "Neurotoxins",
    description: "FDA-approved treatment to smooth fine lines and wrinkles",
    price: {
      base: 15,
      unit: "per unit",
      typical: "20-60 units"
    },
    duration: "15-20 minutes",
    results: "3-6 months",
    areas: ["Forehead lines", "Crow's feet", "Frown lines", "Brow lift"],
    membershipDiscount: {
      core: 12,
      evolve: 10,
      transform: 8
    }
  },
  {
    id: "juvederm",
    name: "Juvederm Collection",
    category: "Dermal Fillers", 
    description: "Hyaluronic acid fillers for volume and hydration",
    price: {
      base: 650,
      unit: "per syringe",
      typical: "1-2 syringes"
    },
    duration: "30-45 minutes",
    results: "12-18 months",
    types: ["Juvederm Ultra", "Juvederm Voluma", "Juvederm Vollure", "Juvederm Volbella"],
    membershipDiscount: {
      core: 10,
      evolve: 15,
      transform: 20
    }
  },
  {
    id: "hydrafacial",
    name: "HydraFacial MD",
    category: "Medical Device",
    description: "Multi-step facial treatment that cleanses, extracts, and hydrates",
    price: {
      base: 175,
      unit: "per treatment",
      typical: "Single session"
    },
    duration: "30-45 minutes", 
    results: "Immediate glow",
    benefits: ["Deep cleansing", "Extraction", "Hydration", "Antioxidant protection"],
    membershipDiscount: {
      core: 10,
      evolve: 15,
      transform: 20
    }
  },
  {
    id: "laser-hair-removal",
    name: "Laser Hair Removal",
    category: "LHR",
    description: "Permanent hair reduction with advanced laser technology",
    price: {
      base: 150,
      unit: "per session",
      typical: "6-8 sessions"
    },
    duration: "15-60 minutes",
    results: "80-95% hair reduction",
    areas: ["Face", "Underarms", "Bikini", "Legs", "Back", "Chest"],
    membershipDiscount: {
      core: 10,
      evolve: 15,
      transform: 20
    }
  },
  {
    id: "chemical-peel",
    name: "Chemical Peels",
    category: "Dermal Procedure",
    description: "Professional chemical peels for skin rejuvenation",
    price: {
      base: 125,
      unit: "per treatment", 
      typical: "Series of 3-6"
    },
    duration: "30-45 minutes",
    results: "2-4 weeks improvement",
    types: ["Light peel", "Medium peel", "VI Peel"],
    membershipDiscount: {
      core: 10,
      evolve: 15, 
      transform: 20
    }
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
