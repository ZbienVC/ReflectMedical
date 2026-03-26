// Stripe Payment Links integration
// Create payment links in Stripe Dashboard > Payment Links
// Each link should redirect back to: https://reflect-medical.web.app/dashboard?membership=activated

export const STRIPE_PRICE_IDS = {
  core_monthly: "STRIPE_PRICE_CORE_MONTHLY",
  core_annual: "STRIPE_PRICE_CORE_ANNUAL",
  evolve_monthly: "STRIPE_PRICE_EVOLVE_MONTHLY",
  evolve_annual: "STRIPE_PRICE_EVOLVE_ANNUAL",
  transform_monthly: "STRIPE_PRICE_TRANSFORM_MONTHLY",
  transform_annual: "STRIPE_PRICE_TRANSFORM_ANNUAL",
};

export const STRIPE_PAYMENT_LINKS = {
  core_monthly: import.meta.env.VITE_STRIPE_LINK_CORE_MONTHLY || "#",
  core_annual: import.meta.env.VITE_STRIPE_LINK_CORE_ANNUAL || "#",
  evolve_monthly: import.meta.env.VITE_STRIPE_LINK_EVOLVE_MONTHLY || "#",
  evolve_annual: import.meta.env.VITE_STRIPE_LINK_EVOLVE_ANNUAL || "#",
  transform_monthly: import.meta.env.VITE_STRIPE_LINK_TRANSFORM_MONTHLY || "#",
  transform_annual: import.meta.env.VITE_STRIPE_LINK_TRANSFORM_ANNUAL || "#",
};

export function getPaymentLink(tier: string, billing: "monthly" | "annual"): string {
  const key = `${tier}_${billing}` as keyof typeof STRIPE_PAYMENT_LINKS;
  return STRIPE_PAYMENT_LINKS[key] || "#";
}
