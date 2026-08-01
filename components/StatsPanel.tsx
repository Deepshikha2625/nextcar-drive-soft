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
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Left stats — adjacent to car's left edge on desktop, left margin on mobile */}
      <div className="stats-left flex flex-col gap-3.5 sm:gap-5">
        {leftStats.map((stat, i) => (
          <StatCard key={i} stat={stat} side="left" delay={i * 80} />
        ))}
      </div>

      {/* Right stats — adjacent to car's right edge on desktop, right margin on mobile */}
      <div className="stats-right flex flex-col gap-3.5 sm:gap-5">
        {rightStats.map((stat, i) => (
          <StatCard key={i} stat={stat} side="right" delay={i * 80} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  stat,
  side,
  delay,
}: {
  stat: { label: string; value: string; unit: string };
  side: "left" | "right";
  delay: number;
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`fade-in-up [animation-delay:var(--delay)] ${
        isLeft ? "text-left sm:text-right" : "text-right sm:text-left"
      }`}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {/* Value + unit inline */}
      <div
        className={`flex items-baseline gap-1 ${
          isLeft ? "justify-start sm:justify-end" : "justify-end sm:justify-start"
        }`}
      >
        <span className="font-sans font-bold leading-none text-[clamp(1.15rem,2.6vw,2.8rem)] -tracking-[0.02em] text-[var(--text-primary)]">
          {stat.value}
        </span>
        {stat.unit && (
          <span className="font-sans font-semibold leading-none text-[clamp(0.6rem,1.1vw,1rem)] mb-[2px] text-[var(--text-primary)]">
            {stat.unit}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="font-sans font-medium normal-case mt-0.5 text-[clamp(0.55rem,0.85vw,0.8rem)] text-[var(--text-muted)]">
        {stat.label}
      </p>
    </div>
  );
}
