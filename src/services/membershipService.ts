import { db } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { MembershipTier, Service, UserProfile, Transaction, BeautyBucksLedger } from "../types";

export const calculateDiscountedPrice = (
  service: Service, 
  tier: MembershipTier | null, 
  units: number = 1
): { discountedPrice: number; savings: number } => {
  if (!tier) return { discountedPrice: service.basePrice * units, savings: 0 };

  let discountedPrice = service.basePrice * units;
  
  if (service.category === "injectable") {
    if (service.name.toLowerCase().includes("botox")) {
      discountedPrice = tier.toxinDiscountBotox * units;
    } else if (service.name.toLowerCase().includes("dysport")) {
      discountedPrice = tier.toxinDiscountDysport * units;
    }
  } else if (service.category === "filler") {
    discountedPrice = (service.basePrice * units) * (1 - tier.fillerDiscountPercent / 100);
  } else if (service.category === "device") {
    discountedPrice = (service.basePrice * units) * (1 - tier.deviceDiscountPercent / 100);
  } else if (service.category === "retail") {
    discountedPrice = (service.basePrice * units) * (1 - tier.retailDiscountPercent / 100);
  } else if (service.category === "wellness") {
    // Default 5% for wellness if not specified, or just base price
    discountedPrice = service.basePrice * units;
  }

  return {
    discountedPrice,
    savings: (service.basePrice * units) - discountedPrice
  };
};

export const processTransaction = async (
  userId: string,
  service: Service,
  tier: MembershipTier | null,
  beautyBucksToUse: number,
  units: number = 1
) => {
  const { discountedPrice, savings } = calculateDiscountedPrice(service, tier, units);
  const finalPrice = Math.max(0, discountedPrice - beautyBucksToUse);
  const actualBucksUsed = Math.min(beautyBucksToUse, discountedPrice);

  const transaction: Omit<Transaction, "id"> = {
    userId,
    serviceId: service.id,
    serviceName: service.name,
    basePrice: service.basePrice * units,
    discountedPrice,
    beautyBucksUsed: actualBucksUsed,
    finalPrice,
    savings,
    createdAt: new Date().toISOString()
  };

  // 1. Create transaction record
  const txRef = await addDoc(collection(db, `users/${userId}/transactions`), transaction);

  // 2. Deduct Beauty Bucks if used
  if (actualBucksUsed > 0) {
    await updateDoc(doc(db, "users", userId), {
      beautyBucksBalance: increment(-actualBucksUsed)
    });

    await addDoc(collection(db, `users/${userId}/ledger`), {
      userId,
      amount: actualBucksUsed,
      type: "debit",
      description: `Used for ${service.name}`,
      createdAt: new Date().toISOString()
    });
  }

  return { id: txRef.id, ...transaction };
};

export const addMonthlyCredits = async (userId: string, tier: MembershipTier) => {
  await updateDoc(doc(db, "users", userId), {
    beautyBucksBalance: increment(tier.monthlyCredits)
  });

  await addDoc(collection(db, `users/${userId}/ledger`), {
    userId,
    amount: tier.monthlyCredits,
    type: "credit",
    description: `Monthly ${tier.name} credits`,
    expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
    createdAt: new Date().toISOString()
  });
};
