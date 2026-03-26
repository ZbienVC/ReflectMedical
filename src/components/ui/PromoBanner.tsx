import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Admin: Go to Firebase Console → Firestore → promotions → Add document:
 * {
 *   text: "🌸 Spring Special: 20% off all chemical peels through April 30",
 *   ctaText: "Book Now",
 *   ctaUrl: "/appointments",
 *   active: true,
 *   expiresAt: "2026-04-30T23:59:59Z"
 * }
 */

interface Promo {
  id: string;
  text: string;
  ctaText?: string;
  ctaUrl?: string;
  expiresAt?: string;
  backgroundColor?: string;
  active?: boolean;
}

const DISMISSED_KEY = "reflect_dismissed_promos";

function getDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function setDismissed(ids: string[]) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
}

export default function PromoBanner() {
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "promotions"));
        const now = new Date();
        const dismissed = getDismissed();
        const active = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Promo))
          .filter((p) => {
            if (!p.active) return false;
            if (dismissed.includes(p.id)) return false;
            if (p.expiresAt && new Date(p.expiresAt) < now) return false;
            return true;
          });
        setPromos(active);
      } catch {
        // silently ignore if collection doesn't exist
      }
    };
    load();
  }, []);

  const dismiss = (id: string) => {
    const updated = [...getDismissed(), id];
    setDismissed(updated);
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  if (promos.length === 0) return null;

  // Show only the first active promo
  const promo = promos[0];
  const bg = promo.backgroundColor ?? "bg-violet-600";

  return (
    <div className={`${bg} text-white px-4 py-2.5 flex items-center justify-between gap-3`}>
      <div className="flex-1 flex items-center justify-center gap-3 text-sm font-medium flex-wrap">
        <span>{promo.text}</span>
        {promo.ctaText && promo.ctaUrl && (
          <Link
            to={promo.ctaUrl}
            className="bg-white text-violet-700 font-bold text-xs px-3 py-1 rounded-full hover:bg-violet-50 transition-colors whitespace-nowrap"
          >
            {promo.ctaText}
          </Link>
        )}
      </div>
      <button
        onClick={() => dismiss(promo.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
