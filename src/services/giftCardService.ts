import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { addCredits } from "./beautyBankService";

export interface GiftCardData {
  code: string;
  amount: number;
  senderName: string;
  recipientName: string;
  recipientContact: string;
  deliveryMethod: "email" | "sms";
  message?: string;
  scheduledDate?: string;
  status: "pending" | "active" | "redeemed" | "expired";
  redeemedBy?: string;
  createdAt?: unknown;
}

export function generateGiftCardCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `REFLECT-${rand(4)}-${rand(4)}`;
}

export async function createGiftCard(data: Omit<GiftCardData, "createdAt">): Promise<string> {
  const ref = doc(db, "giftCards", data.code);
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return data.code;
}

export async function getGiftCard(code: string): Promise<GiftCardData | null> {
  const snap = await getDoc(doc(db, "giftCards", code));
  if (!snap.exists()) return null;
  return { code: snap.id, ...snap.data() } as GiftCardData;
}

export async function redeemGiftCard(
  code: string,
  userId: string
): Promise<{ success: boolean; amount?: number; error?: string }> {
  const card = await getGiftCard(code.toUpperCase().trim());
  if (!card) return { success: false, error: "Invalid gift card code." };
  if (card.status === "redeemed") return { success: false, error: "This gift card has already been redeemed." };
  if (card.status === "expired") return { success: false, error: "This gift card has expired." };

  await updateDoc(doc(db, "giftCards", card.code), {
    status: "redeemed",
    redeemedBy: userId,
  });

  await addCredits(userId, card.amount, `Gift card redeemed (${card.code})`);

  return { success: true, amount: card.amount };
}
