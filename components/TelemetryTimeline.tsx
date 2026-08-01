"use client";

import { useState, useEffect } from "react";

const laps = [
  { id: "01", label: "LAP 01", zone: "Speed Zone",        x: 12 },
  { id: "02", label: "LAP 02", zone: "Acceleration Zone", x: 30 },
  { id: "03", label: "LAP 03", zone: "Technical Section", x: 50 },
  { id: "04", label: "LAP 04", zone: "High Speed Zone",   x: 68 },
  { id: "05", label: "LAP 05", zone: "Final  Corner",     x: 86 },
];

// SVG coordinate space
const svgW = 1000;
const svgH = 100;

// Curve shape
const rawPoints = [
  { x: 0,    y: 92 },
  { x: 120,  y: 82 },
  { x: 300,  y: 70 },
  { x: 500,  y: 54 },
  { x: 680,  y: 44 },
  { x: 860,  y: 28 },
  { x: 1000, y: 16 },
];

function getYPctForX(xPct: number): number {
  const px = (xPct / 100) * svgW;
  for (let i = 0; i < rawPoints.length - 1; i++) {
    const p0 = rawPoints[i];
    const p1 = rawPoints[i + 1];
    if (px >= p0.x && px <= p1.x) {
      const t = (px - p0.x) / (p1.x - p0.x);
      return ((p0.y + t * (p1.y - p0.y)) / svgH) * 100;
    }
  }
  return (rawPoints[rawPoints.length - 1].y / svgH) * 100;
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C ${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

const curvePath = buildSmoothPath(rawPoints);
const fillPath  = `${curvePath} L ${svgW},${svgH} L 0,${svgH} Z`;

export default function TelemetryTimeline() {
  const [activeLap, setActiveLap] = useState("03");
  const [telemetryData, setTelemetryData] = useState<unknown>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/telemetry?lap=${activeLap}`)
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted && resData.success) {
          setTelemetryData(resData.data);
        }
      })
      .catch((err) => console.error("API /api/telemetry fetch error:", err));
    return () => {
      isMounted = false;
    };
  }, [activeLap]);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmall(window.innerWidth <= 480);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Responsive height constants
  const CURVE_H = isSmall ? 56 : isMobile ? 66 : 110;
  const LABEL_H = isSmall ? 28 : isMobile ? 30 : 44;
  const TOTAL_H = CURVE_H + LABEL_H;

  return (
    <div
      id="telemetry-timeline"
      data-telemetry-loaded={Boolean(telemetryData)}
      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto [height:var(--total-h)]"
      style={{ "--total-h": `${TOTAL_H}px` } as React.CSSProperties}
    >
      {/* SVG: terrain fill + dashed red curve line */}
      <div
        className="absolute left-0 right-0 top-0 w-full pointer-events-none overflow-hidden z-2 [height:var(--curve-h)]"
        style={{ "--curve-h": `${CURVE_H}px` } as React.CSSProperties}
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="terrainFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C40504" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillPath} fill="url(#terrainFill)" />
          <path
            d={curvePath}
            fill="none"
            stroke="#CC0000"
            strokeWidth="2.2"
            strokeDasharray="8 5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Lap dot markers + vertical connector lines */}
      <div
        className="absolute left-0 right-0 top-0 w-full z-10 [height:var(--curve-h)]"
        style={{ "--curve-h": `${CURVE_H}px` } as React.CSSProperties}
      >
        {laps.map((lap) => {
          const isActive = activeLap === lap.id;
          const yPct = getYPctForX(lap.x);
          const dotYpx = (yPct / 100) * CURVE_H;
          const dotRadius = isActive ? (isMobile ? 10 : 14) : (isMobile ? 8 : 12);
          const connectorH = Math.max(0, CURVE_H - dotYpx - dotRadius);

          return (
            <div key={lap.id}>
              <button
                id={`lap-dot-${lap.id}`}
                onClick={() => setActiveLap(lap.id)}
                aria-label={`${lap.label} – ${lap.zone}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none z-20 [left:var(--lap-x)] [top:var(--lap-y)]"
                style={{ "--lap-x": `${lap.x}%`, "--lap-y": `${yPct}%` } as React.CSSProperties}
              >
                <span
                  className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? (isMobile ? "w-5 h-5 shadow-[0_0_0_6px_rgba(200,0,14,0.18),0_0_24px_rgba(220,30,46,0.9),0_0_10px_rgba(220,30,46,0.7),inset_0_1px_4px_rgba(255,180,180,0.3)]" : "w-7 h-7 shadow-[0_0_0_10px_rgba(200,0,14,0.18),0_0_24px_rgba(220,30,46,0.9),0_0_10px_rgba(220,30,46,0.7),inset_0_1px_4px_rgba(255,180,180,0.3)]") +
                        " bg-[radial-gradient(circle_at_38%_32%,#FF5566_0%,#CC0010_55%,#880008_100%)]"
                      : (isMobile ? "w-4 h-4 shadow-[0_0_0_6px_rgba(255,255,255,0.10),0_2px_8px_rgba(0,0,0,0.6)]" : "w-[24px] h-[24px] shadow-[0_0_0_10.94px_rgba(255,255,255,0.10),0_2px_8px_rgba(0,0,0,0.6)]") +
                        " bg-[rgba(159,159,159,0.57)] backdrop-blur-2xl"
                  }`}
                />

                {/* Vertical dashed connector */}
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 -translate-x-px top-full w-px border-l-[1.5px] border-dashed block [height:var(--connector-h)] ${
                    isActive ? "border-l-[rgba(220,30,46,0.55)]" : "border-l-[var(--text-muted)]"
                  }`}
                  style={{ "--connector-h": `${connectorH}px` } as React.CSSProperties}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Lap text labels (bottom strip) */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full z-5 [height:var(--label-h)]"
        style={{ "--label-h": `${LABEL_H}px` } as React.CSSProperties}
      >
        {laps.map((lap) => {
          const isActive = activeLap === lap.id;
          return (
            <button
              key={lap.id}
              id={`lap-label-${lap.id}`}
              onClick={() => setActiveLap(lap.id)}
              aria-label={`Select ${lap.label}`}
              className="absolute -translate-x-1/2 text-center cursor-pointer focus:outline-none bg-transparent border-0 p-0 top-0 [left:var(--lap-x)]"
              style={{ "--lap-x": `${lap.x}%` } as React.CSSProperties}
            >
              <p
                className={`font-sans uppercase whitespace-nowrap transition-all duration-300 leading-tight mb-[1px] tracking-[0.07em] ${
                  isActive ? "text-[var(--text-primary)] font-bold" : "text-[var(--text-secondary)] font-medium"
                } ${
                  isSmall ? "text-[0.48rem]" : isMobile ? "text-[0.54rem]" : "text-[clamp(0.52rem,1vw,0.67rem)]"
                }`}
              >
                {lap.label}
              </p>
              {/* Hide zone label on very small screens */}
              {!isSmall && (
                <p
                  className={`font-sans whitespace-nowrap transition-all duration-300 leading-tight font-normal tracking-[0.02em] ${
                    isActive ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
                  } ${
                    isMobile ? "text-[0.42rem]" : "text-[clamp(0.44rem,0.8vw,0.58rem)]"
                  }`}
                >
                  {lap.zone}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
