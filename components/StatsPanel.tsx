"use client";

const leftStats = [
  { label: "Top Speed", value: "352", unit: "" },
  { label: "Power (HP)", value: "620", unit: "" },
  { label: "Torque", value: "780", unit: "" },
];

const rightStats = [
  { label: "0-100 KM/H", value: "3.2", unit: "Sec" },
  { label: "Oil Change", value: "2,450", unit: "KM" },
  { label: "Range", value: "520", unit: "KM" },
];

export default function StatsPanel() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Left stats — right-aligned, positioned adjacent to car's left edge */}
      <div className="stats-left absolute top-1/2 -translate-y-1/2 flex flex-col gap-5 text-right"
        style={{ right: "calc(50% + 215px)", width: "170px" }}>
        {leftStats.map((stat, i) => (
          <StatCard key={i} stat={stat} align="right" delay={i * 80} />
        ))}
      </div>

      {/* Right stats — left-aligned, positioned adjacent to car's right edge */}
      <div className="stats-right absolute top-1/2 -translate-y-1/2 flex flex-col gap-5 text-left"
        style={{ left: "calc(50% + 215px)", width: "170px" }}>
        {rightStats.map((stat, i) => (
          <StatCard key={i} stat={stat} align="left" delay={i * 80} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  stat,
  align,
  delay,
}: {
  stat: { label: string; value: string; unit: string };
  align: "left" | "right";
  delay: number;
}) {
  return (
    <div
      className={`fade-in-up ${align === "right" ? "text-right" : "text-left"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Value + unit inline */}
      <div
        className={`flex items-baseline gap-1.5 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <span
          className="font-sans font-bold leading-none"
          style={{ fontSize: "clamp(1.6rem, 3vw, 3rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}
        >
          {stat.value}
        </span>
        {stat.unit && (
          <span
            className="font-sans font-semibold leading-none"
            style={{ fontSize: "clamp(0.7rem, 1.2vw, 1.1rem)", marginBottom: "2px", color: "var(--text-primary)" }}
          >
            {stat.unit}
          </span>
        )}
      </div>

      {/* Label */}
      <p
        className="font-sans font-normal normal-case mt-0.5"
        style={{ fontSize: "clamp(0.6rem, 0.9vw, 0.85rem)", color: "var(--text-muted)" }}
      >
        {stat.label}
      </p>
    </div>
  );
}
