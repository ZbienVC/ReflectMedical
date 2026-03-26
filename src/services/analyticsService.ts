declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number>): void {
  if (typeof window !== "undefined") {
    window.gtag?.("event", eventName, params);
    window.fbq?.("track", eventName, params);
  }
}

export function trackViewMembership(tier?: string): void {
  trackEvent("view_membership", tier ? { tier } : undefined);
}

export function trackBeginCheckout(tier: string, price: number): void {
  trackEvent("begin_checkout", { tier, price });
}

export function trackSignUp(method: string): void {
  trackEvent("sign_up", { method });
}

export function trackBookAppointment(service: string): void {
  trackEvent("book_appointment", { service });
}

export function trackGiftCardPurchase(amount: number): void {
  trackEvent("gift_card_purchase", { amount });
}

export function trackReferralShare(method: string): void {
  trackEvent("referral_share", { method });
}
