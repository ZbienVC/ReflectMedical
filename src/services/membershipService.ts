import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  increment,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import { MembershipTier, UserProfile } from "../types";

// ── Fallback Tiers ────────────────────────────────────────────────────────────
export const FALLBACK_TIERS: MembershipTier[] = [
  {
    id: "glow",
    name: "Glow",
    monthlyPrice: 49,
    monthlyCredits: 50,
    toxinDiscountBotox: 12,
    toxinDiscountDysport: 3.5,
    fillerDiscountPercent: 10,
    deviceDiscountPercent: 10,
    retailDiscountPercent: 10,
  },
  {
    id: "radiance",
    name: "Radiance",
    monthlyPrice: 99,
    monthlyCredits: 110,
    toxinDiscountBotox: 11,
    toxinDiscountDysport: 3.2,
    fillerDiscountPercent: 15,
    deviceDiscountPercent: 15,
    retailDiscountPercent: 15,
  },
  {
    id: "evolve",
    name: "Evolve",
    monthlyPrice: 179,
    monthlyCredits: 200,
    toxinDiscountBotox: 10,
    toxinDiscountDysport: 3.0,
    fillerDiscountPercent: 20,
    deviceDiscountPercent: 20,
    retailDiscountPercent: 20,
  },
];

export const getMembershipTiers = async (): Promise<MembershipTier[]> => {
  try {
    const snap = await getDocs(collection(db, "membershipTiers"));
    if (snap.empty) return FALLBACK_TIERS;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MembershipTier));
  } catch (err) {
    console.warn("getMembershipTiers: falling back to static data", err);
    return FALLBACK_TIERS;
  }
};

export const getUserMembership = async (userId: string): Promise<string | null> => {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    if (snap.exists()) {
      return (snap.data() as UserProfile).membershipTierId ?? null;
    }
    return null;
  } catch (err) {
    console.warn("getUserMembership error", err);
    return null;
  }
};

export const updateMembership = async (userId: string, tierId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", userId), { membershipTierId: tierId });
  } catch (err) {
    console.warn("updateMembership error", err);
    throw err;
  }
};

export const onMembershipChange = (
  userId: string,
  callback: (tierId: string | null) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, "users", userId),
    (snap) => {
      if (snap.exists()) {
        callback((snap.data() as UserProfile).membershipTierId ?? null);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn("onMembershipChange error", err);
      callback(null);
    }
  );
};

export const addMonthlyCredits = async (userId: string, tier: MembershipTier): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", userId), {
      beautyBucksBalance: increment(tier.monthlyCredits),
    });
    await addDoc(collection(db, `users/${userId}/ledger`), {
      userId,
      amount: tier.monthlyCredits,
      type: "credit",
      description: `Monthly ${tier.name} credits`,
      expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("addMonthlyCredits error", err);
    throw err;
  }
};

export const calculateDiscountedPrice = (
  service: { basePrice: number; name: string; category: string },
  tier: MembershipTier | null,
  units = 1
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
    discountedPrice = service.basePrice * units * (1 - tier.fillerDiscountPercent / 100);
  } else if (service.category === "device") {
    discountedPrice = service.basePrice * units * (1 - tier.deviceDiscountPercent / 100);
  } else if (service.category === "retail") {
    discountedPrice = service.basePrice * units * (1 - tier.retailDiscountPercent / 100);
  }

  return {
    discountedPrice,
    savings: service.basePrice * units - discountedPrice,
  };
};

export const processTransaction = async (
  userId: string,
  service: { id: string; name: string; category: string; basePrice: number },
  tier: MembershipTier | null,
  beautyBucksToUse: number,
  units = 1
) => {
  const { discountedPrice, savings } = calculateDiscountedPrice(service, tier, units);
  const actualBucksUsed = Math.min(beautyBucksToUse, discountedPrice);
  const finalPrice = Math.max(0, discountedPrice - actualBucksUsed);

  const transaction = {
    userId,
    serviceId: service.id,
    serviceName: service.name,
    basePrice: service.basePrice * units,
    discountedPrice,
    beautyBucksUsed: actualBucksUsed,
    finalPrice,
    savings,
    createdAt: new Date().toISOString(),
  };

  const txRef = await addDoc(collection(db, `users/${userId}/transactions`), transaction);

  if (actualBucksUsed > 0) {
    await updateDoc(doc(db, "users", userId), {
      beautyBucksBalance: increment(-actualBucksUsed),
    });
    await addDoc(collection(db, `users/${userId}/ledger`), {
      userId,
      amount: actualBucksUsed,
      type: "debit",
      description: `Used for ${service.name}`,
      createdAt: new Date().toISOString(),
    });
  }

  return { id: txRef.id, ...transaction };
};

// ── Membership Pause / Resume ──────────────────────────────────────────────

/** Pause membership for 1, 2, or 3 months */
export async function pauseMembership(userId: string, months: number): Promise<void> {
  const pauseUntil = new Date();
  pauseUntil.setMonth(pauseUntil.getMonth() + months);
  await updateDoc(doc(db, "users", userId), {
    membershipStatus: "paused",
    pauseUntil: pauseUntil.toISOString(),
  });
}

/** Resume membership early */
export async function resumeMembership(userId: string): Promise<void> {
  await updateDoc(doc(db, "users", userId), {
    membershipStatus: "active",
    pauseUntil: null,
  });
}

/** Get membership status */
export async function getMembershipStatus(userId: string): Promise<"active" | "paused" | "inactive"> {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    if (!snap.exists()) return "inactive";
    const data = snap.data() as UserProfile & { membershipStatus?: string; pauseUntil?: string };
    if (!data.membershipTierId) return "inactive";
    if (data.membershipStatus === "paused") return "paused";
    return "active";
  } catch {
    return "inactive";
  }
}
