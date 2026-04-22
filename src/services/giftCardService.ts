import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface GiftCard {
  id: string;
  code: string;
  type: "fixed";
  originalValue: number;
  purchasePrice: number;
  promoCodeUsed?: string;
  balance: number;
  status: "active" | "redeemed" | "expired" | "pending";
  purchaserEmail: string;
  purchaserName: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  purchasedAt: Timestamp;
  expiresAt?: Timestamp;
  redeemedAt?: Timestamp;
  redeemedBy?: string;
  deliveryMethod: "email" | "sms" | "both";
  phone?: string;
  sentAt?: Timestamp;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minPurchase?: number;
  maxUses?: number;
  usesCount: number;
  startsAt: Timestamp;
  expiresAt: Timestamp;
  active: boolean;
  createdBy: string;
  createdAt: Timestamp;
}

export function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "REFLECT-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function purchaseGiftCard(
  data: Omit<GiftCard, "id" | "code" | "purchasedAt" | "status" | "balance">
): Promise<GiftCard> {
  const code = generateGiftCardCode();
  const giftCardData = {
    ...data,
    code,
    balance: data.originalValue,
    status: "active" as const,
    purchasedAt: Timestamp.now(),
  };
  // TODO: Integrate Stripe payment processing before creating Firestore record
  const docRef = await addDoc(collection(db, "giftCards"), giftCardData);
  // TODO: Send certificate via Resend (email) or Twilio (SMS) based on deliveryMethod
  return { id: docRef.id, ...giftCardData };
}

export async function getGiftCardByCode(code: string): Promise<GiftCard | null> {
  const q = query(collection(db, "giftCards"), where("code", "==", code));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as GiftCard;
}

export async function redeemGiftCard(
  code: string,
  userId: string
): Promise<{ success: boolean; amount: number; error?: string }> {
  const card = await getGiftCardByCode(code);
  if (!card) return { success: false, amount: 0, error: "Gift card not found." };
  if (card.status !== "active") return { success: false, amount: 0, error: `Gift card is ${card.status}.` };
  if (card.balance <= 0) return { success: false, amount: 0, error: "Gift card has no remaining balance." };
  if (card.expiresAt && card.expiresAt.toMillis() < Date.now()) {
    return { success: false, amount: 0, error: "Gift card has expired." };
  }
  const q = query(collection(db, "giftCards"), where("code", "==", code));
  const snap = await getDocs(q);
  if (snap.empty) return { success: false, amount: 0, error: "Gift card not found." };
  const docRef = snap.docs[0].ref;
  await updateDoc(docRef, {
    status: "redeemed",
    balance: 0,
    redeemedAt: Timestamp.now(),
    redeemedBy: userId,
  });
  return { success: true, amount: card.balance };
}

export async function getAllGiftCards(): Promise<GiftCard[]> {
  const q = query(collection(db, "giftCards"), orderBy("purchasedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GiftCard));
}

export async function validatePromoCode(
  code: string,
  purchaseAmount: number
): Promise<{ valid: boolean; discount: number; error?: string; promo?: PromoCode }> {
  const q = query(collection(db, "promoCodes"), where("code", "==", code.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return { valid: false, discount: 0, error: "Promo code not found." };
  const promo = { id: snap.docs[0].id, ...snap.docs[0].data() } as PromoCode;
  if (!promo.active) return { valid: false, discount: 0, error: "Promo code is inactive." };
  const now = Date.now();
  if (promo.startsAt.toMillis() > now) return { valid: false, discount: 0, error: "Promo code is not yet active." };
  if (promo.expiresAt.toMillis() < now) return { valid: false, discount: 0, error: "Promo code has expired." };
  if (promo.maxUses != null && promo.usesCount >= promo.maxUses) {
    return { valid: false, discount: 0, error: "Promo code has reached its usage limit." };
  }
  if (promo.minPurchase && purchaseAmount < promo.minPurchase) {
    return { valid: false, discount: 0, error: `Minimum purchase of $${promo.minPurchase} required.` };
  }
  const discount =
    promo.discountType === "percent"
      ? Math.round((purchaseAmount * promo.discountValue) / 100 * 100) / 100
      : promo.discountValue;
  return { valid: true, discount, promo };
}

export async function createPromoCode(
  data: Omit<PromoCode, "id" | "usesCount" | "createdAt">
): Promise<PromoCode> {
  const promo = { ...data, usesCount: 0, createdAt: Timestamp.now(), code: data.code.toUpperCase() };
  const docRef = await addDoc(collection(db, "promoCodes"), promo);
  return { id: docRef.id, ...promo };
}

export async function getAllPromoCodes(): Promise<PromoCode[]> {
  const q = query(collection(db, "promoCodes"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PromoCode));
}

export async function togglePromoCode(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, "promoCodes", id), { active });
}

export async function deletePromoCode(id: string): Promise<void> {
  await deleteDoc(doc(db, "promoCodes", id));
}