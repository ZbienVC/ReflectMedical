import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { BeautyBucksLedger } from "../types";

export interface BalanceResult {
  balance: number;
  source: "firebase" | "fallback";
}

export interface BeautyBankTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: Timestamp | string;
}

// Monthly credit amounts by tier
const TIER_CREDITS: Record<string, number> = {
  core: 99,
  silver: 99,
  evolve: 150,
  gold: 150,
  transform: 250,
  platinum: 250,
};

export const getBalance = async (userId: string): Promise<BalanceResult> => {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    if (snap.exists()) {
      const balance = (snap.data().beautyBucksBalance as number) ?? 0;
      return { balance, source: "firebase" };
    }
    return { balance: 0, source: "fallback" };
  } catch (err) {
    console.warn("getBalance error", err);
    return { balance: 0, source: "fallback" };
  }
};

export const onBalanceChange = (
  userId: string,
  callback: (balance: number) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, "users", userId),
    (snap) => {
      if (snap.exists()) {
        callback((snap.data().beautyBucksBalance as number) ?? 0);
      } else {
        callback(0);
      }
    },
    (err) => {
      console.warn("onBalanceChange error", err);
    }
  );
};

export const addCredits = async (
  userId: string,
  amount: number,
  description: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", userId), {
      beautyBucksBalance: increment(amount),
    });
    await addDoc(collection(db, `users/${userId}/ledger`), {
      userId,
      amount,
      type: "credit",
      description,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("addCredits error", err);
    throw err;
  }
};

export const deductCredits = async (
  userId: string,
  amount: number,
  description: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", userId), {
      beautyBucksBalance: increment(-amount),
    });
    await addDoc(collection(db, `users/${userId}/ledger`), {
      userId,
      amount,
      type: "debit",
      description,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("deductCredits error", err);
    throw err;
  }
};

export const getTransactionHistory = async (
  userId: string,
  limitCount = 20
): Promise<BeautyBucksLedger[]> => {
  try {
    const q = query(
      collection(db, `users/${userId}/ledger`),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BeautyBucksLedger));
  } catch (err) {
    console.warn("getTransactionHistory error", err);
    return [];
  }
};

// ── New Beauty Bank auto-credit functions ──

/**
 * Check if user has already received their monthly Beauty Bank credit this month.
 */
export async function hasReceivedMonthlyCredit(userId: string): Promise<boolean> {
  try {
    const ledgerRef = doc(db, `users/${userId}/beautyBank/ledger`);
    const snap = await getDoc(ledgerRef);
    if (!snap.exists()) return false;
    const lastCreditDate = snap.data().lastCreditDate as string | undefined;
    if (!lastCreditDate) return false;
    const last = new Date(lastCreditDate);
    const now = new Date();
    return last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth();
  } catch (err) {
    console.warn("hasReceivedMonthlyCredit error", err);
    return false;
  }
}

/**
 * Auto-credit monthly Beauty Bank value when membership is active.
 */
export async function creditMonthlyBeautyBank(userId: string, tierId: string): Promise<void> {
  const amount = TIER_CREDITS[tierId.toLowerCase()];
  if (!amount) {
    console.warn(`Unknown tierId for beauty bank credit: ${tierId}`);
    return;
  }

  const now = new Date();
  const ledgerRef = doc(db, `users/${userId}/beautyBank/ledger`);

  // Write/merge ledger doc
  await setDoc(
    ledgerRef,
    { balance: increment(amount), lastCreditDate: now.toISOString() },
    { merge: true }
  );

  // Write transaction record
  await addDoc(collection(db, `users/${userId}/beautyBank/transactions`), {
    type: "credit",
    amount,
    description: `Monthly Beauty Bank credit — ${now.toLocaleString("default", { month: "long", year: "numeric" })}`,
    date: Timestamp.fromDate(now),
  });

  // Also update top-level user balance (used by existing onBalanceChange)
  try {
    await updateDoc(doc(db, "users", userId), {
      beautyBucksBalance: increment(amount),
    });
  } catch {
    // User doc may not exist yet; ignore
  }

  // Also mirror into /ledger subcollection for getTransactionHistory
  await addDoc(collection(db, `users/${userId}/ledger`), {
    userId,
    amount,
    type: "credit",
    description: `Monthly Beauty Bank credit — ${now.toLocaleString("default", { month: "long", year: "numeric" })}`,
    createdAt: now.toISOString(),
  });
}

/**
 * Deduct from Beauty Bank when a treatment is applied.
 */
export async function deductFromBeautyBank(
  userId: string,
  amount: number,
  treatmentName: string
): Promise<void> {
  const now = new Date();

  await setDoc(
    doc(db, `users/${userId}/beautyBank/ledger`),
    { balance: increment(-amount) },
    { merge: true }
  );

  await addDoc(collection(db, `users/${userId}/beautyBank/transactions`), {
    type: "debit",
    amount,
    description: treatmentName,
    date: Timestamp.fromDate(now),
  });

  // Mirror to top-level user balance
  try {
    await updateDoc(doc(db, "users", userId), {
      beautyBucksBalance: increment(-amount),
    });
  } catch {
    // ignore
  }

  // Mirror into /ledger subcollection
  await addDoc(collection(db, `users/${userId}/ledger`), {
    userId,
    amount,
    type: "debit",
    description: treatmentName,
    createdAt: now.toISOString(),
  });
}

/**
 * Get full Beauty Bank transaction history with types.
 */
export async function getBeautyBankHistory(userId: string): Promise<BeautyBankTransaction[]> {
  try {
    const q = query(
      collection(db, `users/${userId}/beautyBank/transactions`),
      orderBy("date", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BeautyBankTransaction));
  } catch (err) {
    console.warn("getBeautyBankHistory error", err);
    return [];
  }
}
