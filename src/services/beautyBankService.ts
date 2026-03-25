import {
  doc,
  getDoc,
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
} from "firebase/firestore";
import { db } from "../firebase";
import { BeautyBucksLedger } from "../types";

export interface BalanceResult {
  balance: number;
  source: "firebase" | "fallback";
}

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
