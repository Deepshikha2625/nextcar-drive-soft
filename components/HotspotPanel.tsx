"use client";

import { useState, useEffect } from "react";
import { HotspotKey } from "./CarVisualizer";
import { X, Palette, Wrench, Package, Sliders, Check } from "lucide-react";

interface HotspotPanelProps {
  activeHotspot: HotspotKey;
  onClose: () => void;
  onAddToBuild?: () => void;
}

const panelContent: Record<
  NonNullable<HotspotKey>,
  {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    options: { label: string; price: string; color?: string }[];
  }
> = {
  customize: {
    icon: Sliders,
    title: "CUSTOMIZE",
    subtitle: "Tailor every detail of your ride",
    options: [
      { label: "Sport Package", price: "₹4,20,000" },
      { label: "Track Edition", price: "₹6,80,000" },
      { label: "Luxury Trim", price: "₹5,50,000" },
    ],
  },
  paintjob: {
    icon: Palette,
    title: "PAINT JOB",
    subtitle: "Signature finishes that make a statement",
    options: [
      { label: "Onyx Black", price: "₹85,000", color: "#111" },
      { label: "Racing Red", price: "₹95,000", color: "#e8212b" },
      { label: "Glacier White", price: "₹80,000", color: "#f0f0f0" },
      { label: "Midnight Blue", price: "₹90,000", color: "#1a2a6c" },
    ],
  },
  bodywork: {
    icon: Wrench,
    title: "BODYWORK",
    subtitle: "Aerodynamic upgrades for peak performance",
    options: [
      { label: "Carbon Fiber Hood", price: "₹1,20,000" },
      { label: "Wide Body Kit", price: "₹2,50,000" },
      { label: "Rear Diffuser", price: "₹75,000" },
    ],
  },
  accessories: {
    icon: Package,
    title: "ACCESSORIES",
    subtitle: "Premium add-ons for the complete experience",
    options: [
      { label: "Forged Alloy Wheels", price: "₹1,80,000" },
      { label: "Sport Exhaust", price: "₹90,000" },
      { label: "Carbon Wing", price: "₹1,40,000" },
    ],
  },
};

export default function HotspotPanel({ activeHotspot, onClose, onAddToBuild }: HotspotPanelProps) {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/car-config")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setConfigLoaded(true);
        }
      })
      .catch((err) => console.error("API /api/car-config error:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectOption = async (optionLabel: string) => {
    setSelectedOpt(optionLabel);
    if (!activeHotspot) return;

    try {
      await fetch("/api/car-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selections: [{ category: activeHotspot, option: optionLabel }],
        }),
      });
    } catch (err) {
      console.error("API POST /api/car-config error:", err);
    }
  };

  if (!activeHotspot) return null;
  const content = panelContent[activeHotspot];
  const IconComp = content.icon;

  return (
    <div
      id="hotspot-panel"
      data-config-loaded={configLoaded}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 scale-in"
      style={{ width: "clamp(280px, 90vw, 340px)" }}
    >
      <div
        className="rounded-2xl p-5 relative"
        style={{
          background: "rgba(10,10,15,0.92)",
          border: "1px solid rgba(232,33,43,0.3)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 0 60px rgba(232,33,43,0.15), 0 30px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* Close button */}
        <button
          id="hotspot-panel-close"
          onClick={onClose}
          aria-label="Close panel"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <X size={14} strokeWidth={2} style={{ color: "var(--text-secondary)" }} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(232,33,43,0.15)",
              border: "1px solid rgba(232,33,43,0.3)",
            }}
          >
            <IconComp size={18} strokeWidth={1.5} style={{ color: "var(--red-accent)" }} />
          </div>
          <div>
            <h3
              className="font-bold tracking-widest text-sm"
              style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.2em", color: "#fff" }}
            >
              {content.title}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{content.subtitle}</p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-4"
          style={{ background: "linear-gradient(90deg, rgba(232,33,43,0.4), transparent)" }}
        />

        {/* Options list */}
        <div className="flex flex-col gap-2">
          {content.options.map((opt, idx) => {
            const isSelected = selectedOpt === opt.label;
            return (
              <button
                key={idx}
                id={`panel-option-${idx}`}
                onClick={() => handleSelectOption(opt.label)}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group hover:scale-[1.02] cursor-pointer"
                style={{
                  background: isSelected
                    ? "rgba(232,33,43,0.18)"
                    : "rgba(255,255,255,0.04)",
                  border: isSelected
                    ? "1px solid rgba(232,33,43,0.6)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-3">
                  {opt.color && (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: opt.color,
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    />
                  )}
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isSelected ? "#fff" : "var(--text-secondary)",
                      transition: "color 0.2s",
                    }}
                  >
                    {opt.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--red-accent)", fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {opt.price}
                  </span>
                  {isSelected && <Check size={14} className="text-red-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Add to build button */}
        <button
          id="add-to-build-btn"
          onClick={onAddToBuild}
          className="mt-4 w-full py-3 rounded-xl text-sm font-bold tracking-widest transition-all duration-300 hover:scale-[1.02] hover:shadow-lg red-glow-btn cursor-pointer"
          style={{
            background: "var(--red-accent)",
            color: "#fff",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.18em",
            boxShadow: "0 0 20px rgba(232,33,43,0.4)",
          }}
        >
          ADD TO BUILD
        </button>
      </div>
    </div>
  );
}
