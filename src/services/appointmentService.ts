import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export interface AppointmentData {
  id?: string;
  service: string;
  date: string;       // "2026-03-28"
  time: string;       // "10:00 AM"
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  userId?: string;
}

export async function createAppointment(data: Omit<AppointmentData, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "appointments"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const q = query(
    collection(db, "appointments"),
    where("date", "==", date),
    where("status", "in", ["pending", "confirmed"])
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().time as string);
}

export async function getUserAppointments(userId: string): Promise<AppointmentData[]> {
  const q = query(
    collection(db, "appointments"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppointmentData));
}
