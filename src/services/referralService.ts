import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
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
}

const FALLBACK_STATS: ReferralStats = {
  totalReferrals: 0,
  pendingReferrals: 0,
  completedReferrals: 0,
  totalCreditsEarned: 0,
};

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

export const getReferralStats = async (userId: string): Promise<ReferralStats> => {
  try {
    const referrals = await getReferrals(userId);
    return {
      totalReferrals: referrals.length,
      pendingReferrals: referrals.filter((r) => r.status === "pending").length,
      completedReferrals: referrals.filter((r) => r.status === "rewarded").length,
      totalCreditsEarned: referrals.reduce((sum, r) => sum + r.creditsEarned, 0),
    };
  } catch (err) {
    console.warn("getReferralStats error", err);
    return FALLBACK_STATS;
  }
};
