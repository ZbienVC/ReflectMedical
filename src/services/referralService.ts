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
  onSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReferralStats {
  totalPoints: number;
  successfulReferrals: number;
  pendingReferrals: number;
  streak: number; // consecutive months with at least 1 referral
  conversionRate: number; // percentage
  lifetimeValue: number; // total Beauty Bank earned from referrals
}

export interface Referral {
  id: string;
  referredName: string;
  referredEmail: string;
  status: "pending" | "signed_up" | "first_treatment" | "completed" | "expired";
  pointsEarned: number;
  bonusPoints: number;
  membershipTier?: string;
  createdAt: Date;
  completedAt?: Date;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateCode(name?: string): string {
  const safeName = (name || "USER")
    .replace(/\s+/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `REFLECT-${safeName || "USER"}-${suffix}`;
}

// Points constants
export const POINTS_SIGNUP = 100;
export const POINTS_FIRST_TREATMENT = 50;
export const POINTS_MEMBERSHIP = 50;

// ─── Functions ───────────────────────────────────────────────────────────────

/** Get or create a referral code for the user. Stored at users/{uid}.referralCode */
export async function getUserReferralCode(userId: string, displayName?: string): Promise<string> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data.referralCode) return data.referralCode as string;
      const name: string = displayName || data.name || data.displayName || "USER";
      const code = generateCode(name);
      await updateDoc(userRef, { referralCode: code });
      return code;
    }
    const code = generateCode(displayName || "USER");
    await setDoc(userRef, { referralCode: code }, { merge: true });
    return code;
  } catch (err) {
    console.warn("getUserReferralCode error", err);
    return generateCode(displayName);
  }
}

/** Get referral stats computed from the referrals collection */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  try {
    const q = query(collection(db, "referrals"), where("referrerId", "==", userId));
    const snap = await getDocs(q);

    let totalPoints = 0;
    let successfulReferrals = 0;
    let pendingReferrals = 0;
    const monthSet = new Set<string>();

    snap.docs.forEach((d) => {
      const data = d.data();
      totalPoints += (data.pointsEarned || 0) + (data.bonusPoints || 0);
      if (data.status === "completed") {
        successfulReferrals++;
        if (data.completedAt) {
          const date = data.completedAt.toDate ? data.completedAt.toDate() : new Date(data.completedAt);
          monthSet.add(`${date.getFullYear()}-${date.getMonth()}`);
        }
      } else if (data.status === "pending" || data.status === "signed_up" || data.status === "first_treatment") {
        pendingReferrals++;
      }
    });

    const total = snap.size;
    const conversionRate = total > 0 ? Math.round((successfulReferrals / total) * 100) : 0;
    // streak = consecutive months (simplified: size of month set if contiguous — use count for now)
    const streak = monthSet.size;
    const lifetimeValue = totalPoints; // 1 pt = $1 Beauty Bank

    return { totalPoints, successfulReferrals, pendingReferrals, streak, conversionRate, lifetimeValue };
  } catch (err) {
    console.warn("getReferralStats error", err);
    return { totalPoints: 0, successfulReferrals: 0, pendingReferrals: 0, streak: 0, conversionRate: 0, lifetimeValue: 0 };
  }
}

/** Subscribe to real-time referrals list for this user */
export function subscribeToReferrals(
  userId: string,
  callback: (referrals: Referral[]) => void
): () => void {
  const q = query(
    collection(db, "referrals"),
    where("referrerId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const referrals: Referral[] = snap.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now());
        const completedAt = data.completedAt
          ? data.completedAt.toDate ? data.completedAt.toDate() : new Date(data.completedAt)
          : undefined;
        return {
          id: d.id,
          referredName: data.referredName || "",
          referredEmail: data.referredEmail || "",
          status: data.status || "pending",
          pointsEarned: data.pointsEarned || 0,
          bonusPoints: data.bonusPoints || 0,
          membershipTier: data.membershipTier,
          createdAt,
          completedAt,
        };
      });
      callback(referrals);
    },
    (err) => {
      console.warn("subscribeToReferrals error", err);
      callback([]);
    }
  );
}

/** Apply referral code when a new user signs up */
export async function applyReferralCode(
  code: string,
  newUserId: string,
  newUserEmail: string,
  newUserName: string
): Promise<{ success: boolean; referrerId?: string; error?: string }> {
  try {
    if (!code) return { success: false, error: "No code provided" };

    const usersSnap = await getDocs(
      query(collection(db, "users"), where("referralCode", "==", code))
    );
    if (usersSnap.empty) return { success: false, error: "Invalid referral code" };

    const referrerDoc = usersSnap.docs[0];
    const referrerId = referrerDoc.id;
    if (referrerId === newUserId) return { success: false, error: "Cannot refer yourself" };

    // Check if this user was already referred
    const existingSnap = await getDocs(
      query(collection(db, "referrals"), where("referredUserId", "==", newUserId))
    );
    if (!existingSnap.empty) return { success: false, error: "User already referred" };

    await addDoc(collection(db, "referrals"), {
      referrerId,
      referrerCode: code,
      referredUserId: newUserId,
      referredName: newUserName,
      referredEmail: newUserEmail,
      status: "signed_up",
      pointsEarned: POINTS_SIGNUP,
      bonusPoints: 0,
      createdAt: new Date(),
    });

    // Award signup points to referrer
    await rewardReferrer(referrerId, POINTS_SIGNUP, `${newUserName} signed up with your code`);

    return { success: true, referrerId };
  } catch (err) {
    console.warn("applyReferralCode error", err);
    return { success: false, error: "Failed to apply referral code" };
  }
}

/** Update referral status when referred user completes first appointment */
export async function markReferralFirstTreatment(referredUserId: string): Promise<void> {
  try {
    const snap = await getDocs(
      query(collection(db, "referrals"), where("referredUserId", "==", referredUserId))
    );
    if (snap.empty) return;

    const referralDoc = snap.docs[0];
    const data = referralDoc.data();
    if (data.status !== "signed_up") return;

    await updateDoc(doc(db, "referrals", referralDoc.id), {
      status: "first_treatment",
      bonusPoints: increment(POINTS_FIRST_TREATMENT),
    });

    await rewardReferrer(data.referrerId, POINTS_FIRST_TREATMENT, `${data.referredName || "Friend"} completed first treatment`);
  } catch (err) {
    console.warn("markReferralFirstTreatment error", err);
  }
}

/** Update referral to completed when referred user activates membership */
export async function markReferralCompleted(referredUserId: string, membershipTier: string): Promise<void> {
  try {
    const snap = await getDocs(
      query(collection(db, "referrals"), where("referredUserId", "==", referredUserId))
    );
    if (snap.empty) return;

    const referralDoc = snap.docs[0];
    const data = referralDoc.data();
    if (data.status === "completed" || data.status === "expired") return;

    await updateDoc(doc(db, "referrals", referralDoc.id), {
      status: "completed",
      membershipTier,
      bonusPoints: increment(POINTS_MEMBERSHIP),
      completedAt: new Date(),
    });

    await rewardReferrer(data.referrerId, POINTS_MEMBERSHIP, `${data.referredName || "Friend"} became a ${membershipTier} member`);
  } catch (err) {
    console.warn("markReferralCompleted error", err);
  }
}

/** Reward referrer Beauty Bank credits (1 pt = $1) */
export async function rewardReferrer(referrerId: string, points: number, reason: string): Promise<void> {
  try {
    const userRef = doc(db, "users", referrerId);
    await updateDoc(userRef, {
      beautyBankBalance: increment(points),
      referralPointsTotal: increment(points),
    });
    // Log the reward
    await addDoc(collection(db, "users", referrerId, "rewardHistory"), {
      points,
      reason,
      type: "referral",
      createdAt: new Date(),
    });
  } catch (err) {
    console.warn("rewardReferrer error", err);
  }
}

/** Get referral leaderboard — top referrers */
export async function getReferralLeaderboard(): Promise<
  { userId: string; name: string; totalReferrals: number; totalPoints: number }[]
> {
  try {
    const snap = await getDocs(collection(db, "referrals"));
    const map = new Map<string, { totalReferrals: number; totalPoints: number }>();

    snap.docs.forEach((d) => {
      const data = d.data();
      const existing = map.get(data.referrerId) || { totalReferrals: 0, totalPoints: 0 };
      map.set(data.referrerId, {
        totalReferrals: existing.totalReferrals + 1,
        totalPoints: existing.totalPoints + (data.pointsEarned || 0) + (data.bonusPoints || 0),
      });
    });

    const entries = Array.from(map.entries())
      .sort((a, b) => b[1].totalPoints - a[1].totalPoints)
      .slice(0, 10);

    const results = await Promise.all(
      entries.map(async ([userId, stats]) => {
        const userSnap = await getDoc(doc(db, "users", userId));
        const name = userSnap.exists() ? userSnap.data().name || userSnap.data().displayName || "Unknown" : "Unknown";
        return { userId, name, ...stats };
      })
    );

    return results;
  } catch (err) {
    console.warn("getReferralLeaderboard error", err);
    return [];
  }
}
