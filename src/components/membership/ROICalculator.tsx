import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

// Pricing reference (per treatment, non-member rates)
const PRICES = {
  botoxUnit: 15,         // per unit, member prices lower; calc savings vs full price
  botoxUnitsPerTx: 40,  // typical units per treatment
  fillerSyringe: 800,   // per syringe non-member
  facial: 175,          // chemical peel/facial average
  laserSession: 250,    // laser hair removal session average
};

const MEMBERSHIP_ANNUAL = {
  core: 948,    // $79/mo × 12
  evolve: 1188, // $99/mo × 12
  transform: 1788, // $149/mo × 12
};

// Member savings per treatment unit (discount vs full price)
const MEMBER_SAVINGS = {
  core:      { botoxUnit: 3, fillerSyringe: 50,  facial: 17.5, laserSession: 40 },
  evolve:    { botoxUnit: 5, fillerSyringe: 75,  facial: 40,   laserSession: 65 },
  transform: { botoxUnit: 6, fillerSyringe: 150, facial: 90,   laserSession: 100 },
};

function calcSavings(
  botox: number,
  filler: number,
  facials: number,
  laser: number,
  tier: keyof typeof MEMBER_SAVINGS
) {
  const s = MEMBER_SAVINGS[tier];
  return (
    botox * PRICES.botoxUnitsPerTx * s.botoxUnit +
    filler * s.fillerSyringe +
    facials * s.facial +
    laser * s.laserSession
  );
}

function fullPrice(botox: number, filler: number, facials: number, laser: number) {
  return (
    botox * PRICES.botoxUnitsPerTx * PRICES.botoxUnit +
    filler * PRICES.fillerSyringe +
    facials * PRICES.facial +
    laser * PRICES.laserSession
  );
}

export default function ROICalculator() {
  const [botox, setBotox] = useState(2);
  const [filler, setFiller] = useState(1);
  const [facials, setFacials] = useState(3);
  const [laser, setLaser] = useState(0);

  const full = fullPrice(botox, filler, facials, laser);

  const savings = {
    core: calcSavings(botox, filler, facials, laser, "core"),
    evolve: calcSavings(botox, filler, facials, laser, "evolve"),
    transform: calcSavings(botox, filler, facials, laser, "transform"),
  };

  const netSavings = {
    core: savings.core - MEMBERSHIP_ANNUAL.core,
    evolve: savings.evolve - MEMBERSHIP_ANNUAL.evolve,
    transform: savings.transform - MEMBERSHIP_ANNUAL.transform,
  };

  const best = (Object.entries(netSavings) as [keyof typeof netSavings, number][]).reduce(
    (a, b) => (b[1] > a[1] ? b : a)
  )[0];

  const tierLabels: Record<string, string> = { core: "Core", evolve: "Evolve", transform: "Transform" };

  const SliderInput = ({
    label,
    value,
    min,
    max,
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="font-bold text-violet-600">{value}x/year</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-600"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">See Your Savings</h2>
        </div>
        <p className="text-gray-500">See exactly how much you save as a member vs. paying full price</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-6">
          <SliderInput label="Botox treatments per year" value={botox} min={0} max={4} onChange={setBotox} />
          <SliderInput label="Filler syringes per year" value={filler} min={0} max={4} onChange={setFiller} />
          <SliderInput label="Facials / Peels per year" value={facials} min={0} max={6} onChange={setFacials} />
          <SliderInput label="Laser sessions per year" value={laser} min={0} max={8} onChange={setLaser} />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Full price total</p>
            <p className="text-2xl font-bold text-gray-900">${full.toLocaleString()}<span className="text-base text-gray-400 font-normal">/year</span></p>
          </div>

          {(["core", "evolve", "transform"] as const).map((tier) => {
            const isBest = tier === best;
            const net = netSavings[tier];
            return (
              <div
                key={tier}
                className={`rounded-xl p-4 border transition-all ${
                  isBest
                    ? "bg-violet-50 border-violet-300 shadow-sm"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-sm ${isBest ? "text-violet-700" : "text-gray-700"}`}>
                    {tierLabels[tier]} Membership
                  </span>
                  {isBest && (
                    <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-bold">⭐ BEST VALUE</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">${MEMBERSHIP_ANNUAL[tier].toLocaleString()}/year membership</p>
                <p className={`text-lg font-bold ${net > 0 ? (isBest ? "text-violet-700" : "text-green-600") : "text-gray-500"}`}>
                  {net > 0 ? `Saves $${net.toLocaleString()}/year net` : `No net savings at this usage`}
                </p>
                <p className="text-xs text-gray-400">
                  ${savings[tier].toLocaleString()} discount − ${MEMBERSHIP_ANNUAL[tier].toLocaleString()} membership fee
                </p>
              </div>
            );
          })}

          <Link
            to="/signup"
            className="block w-full text-center py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
          >
            Start with {tierLabels[best]}
          </Link>
        </div>
      </div>
    </div>
  );
}
