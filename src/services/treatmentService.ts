import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Appointment } from "../types";

export interface Booking {
  id: string;
  userId: string;
  serviceName: string;
  serviceId?: string;
  date: string;
  status: "scheduled" | "completed" | "canceled";
  notes?: string;
  createdAt: string;
}

export const getBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const q = query(
      collection(db, `users/${userId}/appointments`),
      orderBy("date", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  } catch (err) {
    console.warn("getBookings error", err);
    return [];
  }
};

export const createBooking = async (
  userId: string,
  booking: Omit<Booking, "id" | "createdAt">
): Promise<Booking> => {
  try {
    const newBooking = { ...booking, createdAt: new Date().toISOString() };
    const ref = await addDoc(collection(db, `users/${userId}/appointments`), newBooking);
    return { id: ref.id, ...newBooking };
  } catch (err) {
    console.warn("createBooking error", err);
    throw err;
  }
};

export const getUserTreatmentHistory = async (
  userId: string,
  limitCount = 20
): Promise<Booking[]> => {
  try {
    const q = query(
      collection(db, `users/${userId}/appointments`),
      where("status", "==", "completed"),
      orderBy("date", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  } catch (err) {
    console.warn("getUserTreatmentHistory error", err);
    return [];
  }
};

export const updateBookingStatus = async (
  userId: string,
  bookingId: string,
  status: Booking["status"]
): Promise<void> => {
  try {
    await updateDoc(doc(db, `users/${userId}/appointments`, bookingId), { status });
  } catch (err) {
    console.warn("updateBookingStatus error", err);
    throw err;
  }
};
