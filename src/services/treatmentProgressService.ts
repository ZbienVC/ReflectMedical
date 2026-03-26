import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface TreatmentProgress {
  id: string;
  treatmentName: string;
  totalSessions: number;
  completedSessions: number;
  startDate: string;
  nextRecommendedDate?: string;
  notes?: string;
}

export async function saveTreatmentProgress(
  userId: string,
  progress: TreatmentProgress
): Promise<void> {
  const ref = doc(db, "users", userId, "treatmentProgress", progress.id);
  await setDoc(ref, { ...progress, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getTreatmentProgress(
  userId: string
): Promise<TreatmentProgress[]> {
  const snap = await getDocs(
    collection(db, "users", userId, "treatmentProgress")
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TreatmentProgress));
}

export async function updateSessionCount(
  userId: string,
  progressId: string,
  completed: number
): Promise<void> {
  const ref = doc(db, "users", userId, "treatmentProgress", progressId);
  await updateDoc(ref, { completedSessions: completed, updatedAt: serverTimestamp() });
}
