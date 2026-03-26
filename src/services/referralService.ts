import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Referral {
  id: string;
  referrerId: string;
  refereeEmail: string;
  refereeName?: string;
  status: "pending" | "joined" | "rewarded";
  creditsEarned: number;
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalCreditsEarned: number;
  totalEarned: number; // alias for totalCreditsEarned in Beauty Bank $
}

const FALLBACK_STATS: ReferralStats = {
  totalReferrals: 0,
  pendingReferrals: 0,
  completedReferrals: 0,
  totalCreditsEarned: 0,
  totalEarned: 0,
};

function generateCode(name: string): string {
  const safeName = (name || "USER").replace(/\s+/g, "").toUpperCase().slice(0, 8);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `REFLECT-${safeName}-${suffix}`;
}

/** Get or generate a referral code for the user. Stored at users/{uid}.referralCode */
export async function getUserReferralCode(userId: string): Promise<string> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data.referralCode) return data.referralCode as string;
      // Generate and save
      const displayName: string = data.name || data.displayName || "USER";
      const code = generateCode(displayName);
      await updateDoc(userRef, { referralCode: code });
      return code;
    }
    // User doc not found, generate generic code
    const code = generateCode("USER");
    await setDoc(userRef, { referralCode: code }, { merge: true });
    return code;
  } catch (err) {
    console.warn("getUserReferralCode error", err);
    return `REFLECT-USER-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }
}

/** Apply a referral code when a new user signs up */
export async function applyReferralCode(
  code: string,
  newUserId: string
): Promise<{ success: boolean; referrerId?: string }> {
  try {
    // Find user with this referral code
    const usersSnap = await getDocs(
      query(collection(db, "users"), where("referralCode", "==", code))
    );
    if (usersSnap.empty) return { success: false };
    const referrerDoc = usersSnap.docs[0];
    const referrerId = referrerDoc.id;
    if (referrerId === newUserId) return { success: false };

    // Create a referral record
    await addDoc(collection(db, "referrals"), {
      referrerId,
      refereeId: newUserId,
      code,
      status: "joined",
      creditsEarned: 0,
      createdAt: new Date().toISOString(),
    });

    return { success: true, referrerId };
  } catch (err) {
    console.warn("applyReferralCode error", err);
    return { success: false };
  }
}

export const getReferrals = async (userId: string): Promise<Referral[]> => {
  try {
    const q = query(
      collection(db, "referrals"),
      where("referrerId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Referral));
  } catch (err) {
    console.warn("getReferrals error", err);
    return [];
  }
};

export const createReferral = async (
  referrerId: string,
  refereeEmail: string,
  refereeName?: string
): Promise<Referral> => {
  const referral: Omit<Referral, "id"> = {
    referrerId,
    refereeEmail,
    refereeName,
    status: "pending",
    creditsEarned: 0,
    createdAt: new Date().toISOString(),
  };
  const ref = await addDoc(collection(db, "referrals"), referral);
  return { id: ref.id, ...referral };
};

/** Get referral stats for user */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  try {
    const referrals = await getReferrals(userId);
    const totalEarned = referrals.reduce((sum, r) => sum + r.creditsEarned, 0);
    return {
      totalReferrals: referrals.length,
      pendingReferrals: referrals.filter((r) => r.status === "pending").length,
      completedReferrals: referrals.filter((r) => r.status === "rewarded").length,
      totalCreditsEarned: totalEarned,
      totalEarned,
    };
  } catch (err) {
    console.warn("getReferralStats error", err);
    return FALLBACK_STATS;
  }
}

/** Reward referrer when referred user completes first appointment */
export async function processReferralReward(referrerId: string, amount: number): Promise<void> {
  try {
    // Find the most recent joined referral for this referrer
    const q = query(
      collection(db, "referrals"),
      where("referrerId", "==", referrerId),
      where("status", "==", "joined")
    );
    const snap = await getDocs(q);
    if (snap.empty) return;

    const referralDoc = snap.docs[0];
    await updateDoc(doc(db, "referrals", referralDoc.id), {
      status: "rewarded",
      creditsEarned: amount,
      rewardedAt: new Date().toISOString(),
    });

    // Add Beauty Bank credits to referrer
    const userRef = doc(db, "users", referrerId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const current = userSnap.data().beautyBucksBalance || 0;
      await updateDoc(userRef, { beautyBucksBalance: current + amount });
    }
  } catch (err) {
    console.warn("processReferralReward error", err);
  }
}
