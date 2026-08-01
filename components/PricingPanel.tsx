"use client";

import { Check } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic Custom Package",
    price: "₹4,999",
    suffix: "/ Starting From",
    ctaLabel: "Book Essential Package",
    ctaStyle: "outline" as const,
    popular: false,
    features: [
      "Exterior Detailing",
      "Premium Car Wash & Polish",
      "Alloy Wheel Cleaning",
      "Interior Vacuum & Sanitization",
      "Dashboard & Trim Dressing",
    ],
  },
  {
    id: "performance",
    name: "Performance Custom (Popular)",
    price: "₹19,999",
    suffix: "/ Starting From",
    ctaLabel: "Choose Performance",
    ctaStyle: "filled" as const,
    popular: true,
    features: [
      "Everything In Essential",
      "Ceramic Coating",
      "Window Tint Installation",
      "Custom LED Lighting",
      "Premium Seat Covers",
    ],
  },
  {
    id: "premium",
    name: "Premium Package",
    price: "₹49,999",
    suffix: "/ Starting From",
    ctaLabel: "Build My Dream Car",
    ctaStyle: "outline" as const,
    popular: false,
    features: [
      "Everything In Performance",
      "Full Body Wrap Or Protection Film",
      "Performance Exhaust Upgrade",
      "Custom Body Kit Installation",
      "Premium Audio System Upgrade",
    ],
  },
];

export default function PricingPanel() {
  return (
    <div className="pricing-grid w-full max-w-[1000px] px-4 flex items-start justify-center gap-5 z-20 fade-in-up pointer-events-auto mt-16 sm:mt-20">
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

function PricingCard({
  plan,
}: {
  plan: (typeof plans)[0];
}) {
  const isFilled = plan.ctaStyle === "filled";

  return (
    <div
      className={`pricing-card flex flex-col flex-1 max-w-[310px] rounded-2xl p-5 scale-in transition-all duration-300 backdrop-blur-2xl ${
        plan.popular
          ? "bg-[var(--pricing-card-popular-bg,rgba(16,14,16,0.95))] border-[1.5px] border-[#C40504] shadow-[0_0_35px_rgba(196,5,4,0.25),0_12px_35px_rgba(0,0,0,0.7)]"
          : "bg-[var(--pricing-card-bg,rgba(18,18,22,0.90))] border border-[var(--border-glass)] shadow-[0_8px_25px_rgba(0,0,0,0.2)]"
      }`}
    >
      {/* 1. Header & Price Block */}
      <div className="flex flex-col mb-3 card-plan-header">
        <h3 className="font-sans text-sm font-semibold mb-1.5 tracking-tight text-[var(--text-primary)]">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className="font-sans text-2xl font-bold leading-none text-[var(--text-primary)]">
            {plan.price}
          </span>
          <span className="font-sans text-[14px] font-normal leading-none text-[var(--text-secondary)]">
            {plan.suffix}
          </span>
        </div>
      </div>

      {/* 2. CTA Button Block */}
      <div className="w-full mb-5 cta-btn-block ">
        <button
          id={`pricing-cta-${plan.id}`}
          className={`w-full mb-5 h-9 flex items-center justify-center rounded-full text-[0.75rem] font-semibold font-sans tracking-wide transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            isFilled
              ? "bg-[#C40504] border-0 text-white shadow-[0_0_18px_rgba(196,5,4,0.5),0_4px_12px_rgba(0,0,0,0.4)]"
              : "bg-[var(--bg-card)] border border-[var(--border-glass)] shadow-[0_2px_6px_rgba(0,0,0,0.2)] text-[var(--text-secondary)]"
          }`}
        >
          {plan.ctaLabel}
        </button>
      </div>

      {/* 3. Features List Block */}
      <div className="ftr-card flex flex-col mt-5 gap-2.5">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-center flex-bulllets gap-2.5 ">
            {/* Solid Red Badge with White Check */}
            <span className="w-4 h-4 rounded-full bg-[#C40504] shadow-[0_0_6px_rgba(196,5,4,0.4)] flex items-center justify-center shrink-0">
              <Check size={9} strokeWidth={3} className="text-white" />
            </span>
            <span className="font-sans text-[14px] font-normal tracking-normal leading-tight text-[var(--text-secondary)]">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
