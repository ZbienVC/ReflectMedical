import React from "react";
import { motion } from "framer-motion";
import { Badge, Card, Button } from "./ui";

interface TierColumn {
  name: string;
  price: number;
  credits: number;
  botoxPerUnit: number;
  fillerOff: number;
  deviceOff: number;
  retailOff: number;
  popular?: boolean;
}

const TIERS: TierColumn[] = [
  { name: "Core", price: 84, credits: 99, botoxPerUnit: 12, fillerOff: 5, deviceOff: 5, retailOff: 10 },
  { name: "Evolve", price: 124, credits: 150, botoxPerUnit: 11, fillerOff: 10, deviceOff: 10, retailOff: 15, popular: true },
  { name: "Transform", price: 200, credits: 250, botoxPerUnit: 10, fillerOff: 15, deviceOff: 15, retailOff: 20 },
];

const STANDARD_BOTOX = 14;

interface MembershipCompareTableProps {
  currentTierName?: string;
  onSelect?: (tierName: string) => void;
}

export const MembershipCompareTable: React.FC<MembershipCompareTableProps> = ({ currentTierName, onSelect }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f8f7fb]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="outline" size="md" className="text-[#7C3AED] border-[#C4B5FD]">ROI Calculator</Badge>
          <h2 className="text-3xl font-serif font-bold">Membership vs. Paying Retail</h2>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Every plan includes Beauty Bucks that can be banked for injectables, plus automatic discounts across toxins, fillers, devices, and retail products.
          </p>
        </div>

        <div className="hidden md:block overflow-x-auto rounded-3xl border border-border bg-card shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.3em] text-text-secondary">
                <th className="p-5">Benefit</th>
                {TIERS.map((tier) => (
                  <th key={tier.name} className="p-5 text-center">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-text-primary">{tier.name}</div>
                      <div className="text-2xl font-serif font-bold text-text-primary">
                        ${tier.price}
                        <span className="text-xs text-text-secondary font-medium">/mo</span>
                      </div>
                      {tier.popular && (
                        <Badge variant="success" size="sm" className="bg-[#7C3AED]/10 text-[#7C3AED]">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[ 
                {
                  label: "Beauty Bucks Added Monthly",
                  render: (tier: TierColumn) => (
                    <span className="text-lg font-bold text-primary">${tier.credits}</span>
                  )
                },
                {
                  label: "Botox Price",
                  sub: `Standard: $${STANDARD_BOTOX}/unit`,
                  render: (tier) => (
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-text-primary">${tier.botoxPerUnit}/unit</span>
                      <span className="text-[11px] text-emerald-500 font-semibold">Save ${STANDARD_BOTOX - tier.botoxPerUnit}/unit</span>
                    </div>
                  )
                },
                {
                  label: "Filler Savings",
                  render: (tier) => <span className="font-bold text-text-primary">{tier.fillerOff}% off</span>
                },
                {
                  label: "Device Treatments",
                  sub: "Laser, RF, Microneedling",
                  render: (tier) => <span className="font-bold text-text-primary">{tier.deviceOff}% off</span>
                },
                {
                  label: "Retail Savings",
                  render: (tier) => <span className="font-bold text-text-primary">{tier.retailOff}% off</span>
                },
                {
                  label: "Credits Expire?",
                  render: () => <span className="font-semibold text-emerald-500">Never while active</span>
                }
              ].map((row) => (
                <tr key={row.label} className="border-t border-border/60">
                  <td className="p-5 w-64 align-top">
                    <div className="text-sm font-semibold text-text-primary">{row.label}</div>
                    {row.sub && <div className="text-xs text-text-secondary mt-1">{row.sub}</div>}
                  </td>
                  {TIERS.map((tier) => (
                    <td key={tier.name} className="p-5 text-center text-sm">
                      {row.render(tier)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border/60">
                <td className="p-5" />
                {TIERS.map((tier) => {
                  const isCurrent = currentTierName === tier.name;
                  return (
                    <td key={tier.name} className="p-5 text-center">
                      <Button
                        variant={tier.popular ? "primary" : "ghost"}
                        onClick={() => onSelect?.(tier.name)}
                        disabled={isCurrent}
                        className="w-full"
                      >
                        {isCurrent ? "Current Plan" : `Join ${tier.name}`}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {TIERS.map((tier) => {
            const isCurrent = currentTierName === tier.name;
            return (
              <Card key={tier.name} variant="elevated" padding="lg" className="rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xl font-serif font-bold">{tier.name}</p>
                    <p className="text-sm text-text-secondary">${tier.price}/mo</p>
                  </div>
                  {tier.popular && (
                    <Badge variant="success" size="sm" className="bg-[#7C3AED]/10 text-[#7C3AED]">
                      Most Popular
                    </Badge>
                  )}
                </div>
                <ul className="text-sm text-text-secondary space-y-1 mb-4">
                  <li><strong>${tier.credits}</strong> Beauty Bucks</li>
                  <li>Botox at ${tier.botoxPerUnit}/unit (save ${STANDARD_BOTOX - tier.botoxPerUnit})</li>
                  <li>{tier.fillerOff}% off fillers</li>
                  <li>{tier.deviceOff}% off devices</li>
                  <li>{tier.retailOff}% off retail</li>
                </ul>
                <Button variant={tier.popular ? "primary" : "ghost"} onClick={() => onSelect?.(tier.name)} disabled={isCurrent} className="w-full">
                  {isCurrent ? "Current Plan" : `Join ${tier.name}`}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
