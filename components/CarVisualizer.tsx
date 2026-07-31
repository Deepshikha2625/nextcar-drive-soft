"use client";

import { useState, useEffect, useRef } from "react";


export type HotspotKey = "customize" | "paintjob" | "bodywork" | "accessories" | null;
export type StageMode = "spotlight" | "trajectory" | "delivery";

interface CarVisualizerProps {
  activeHotspot: HotspotKey;
  onHotspotClick: (key: HotspotKey) => void;
  showHotspots?: boolean;
  stageMode?: StageMode;
  activeMilestone?: string | null;
  onMilestoneClick?: (id: string) => void;
  carImage?: string;
  showBeam?: boolean;
  onHomeClick?: () => void;
  isDark?: boolean;
}

// 4 timeline steps
const TIMELINE_STEPS = [
  { id: "registration", label: "Registration", desc: "Fill form for submission", posPercent: 10 },
  { id: "consultation", label: "Consultation", desc: "Planning and pricing", posPercent: 36 },
  { id: "artist_assign", label: "Artist assign", desc: "according to task", posPercent: 63 },
  { id: "pickup", label: "Vehicle Pickup", desc: "Payment & dropoff", posPercent: 90 },
];

const STEP_DURATION_MS = 3500; // auto-advance every 3.5 seconds (slower)
const CLEAR_DELAY_MS = 3000; // wait after last step before clearing dots

const HOTSPOT_POS_CLASSES: Record<string, string> = {
  customize: "hotspot-pos-customize",
  bodywork: "hotspot-pos-bodywork",
  paintjob: "hotspot-pos-paintjob",
  accessories: "hotspot-pos-accessories",
};

export default function CarVisualizer({
  activeHotspot,
  onHotspotClick,
  showHotspots = true,
  stageMode = "spotlight",
  activeMilestone = null,
  onMilestoneClick,
  carImage,
  showBeam = true,
  onHomeClick,
  isDark = true,
}: CarVisualizerProps) {
  const [hovered, setHovered] = useState<HotspotKey>(null);
  const [windowWidth, setWindowWidth] = useState(1366);

  // Track window width for clamping tooltip
  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);
    const handle = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // ─── Trajectory / Explore Timeline state ───────────────────────────────────
  type DeliveryState = "trajectory" | "truck_with_car" | "truck_only" | "thank_you";

  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [dotsVisible, setDotsVisible] = useState(true);
  const [deliveryState, setDeliveryState] = useState<DeliveryState>("trajectory");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset and start auto-play sequence whenever trajectory mode becomes active
  useEffect(() => {
    if (stageMode !== "trajectory") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCurrentIdx(-1);
      setVisitedIds(new Set());
      setDotsVisible(true);
      setDeliveryState("trajectory");
      return;
    }

    setDeliveryState("trajectory");
    setCurrentIdx(-1);
    setVisitedIds(new Set());
    setDotsVisible(true);

    let stepIdx = 0;

    const advance = () => {
      setCurrentIdx(stepIdx);

      if (stepIdx < TIMELINE_STEPS.length - 1) {
        timerRef.current = setTimeout(() => {
          setVisitedIds((prev) => new Set(prev).add(TIMELINE_STEPS[stepIdx].id));
          stepIdx++;
          advance();
        }, STEP_DURATION_MS);
      } else {
        // Step 4 (last step) reached
        timerRef.current = setTimeout(() => {
          // 1) Fade out dots and line
          setDotsVisible(false);

          // 2) Show Truck + Car Circle (Screenshot 2)
          timerRef.current = setTimeout(() => {
            setDeliveryState("truck_with_car");

            // 3) After 2.5 seconds, hide Car Circle (Truck Only - Screenshot 3)
            timerRef.current = setTimeout(() => {
              setDeliveryState("truck_only");

              // 4) After 2.5 seconds, show Thank You screen (Screenshot 4 & 5)
              timerRef.current = setTimeout(() => {
                setDeliveryState("thank_you");
              }, 2500);
            }, 2500);
          }, 600);
        }, CLEAR_DELAY_MS);
      }
    };

    timerRef.current = setTimeout(advance, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageMode]);

  const handleDotClick = (idx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDeliveryState("trajectory");
    setCurrentIdx(idx);
    setDotsVisible(true);
    const v = new Set<string>();
    for (let i = 0; i < idx; i++) v.add(TIMELINE_STEPS[i].id);
    setVisitedIds(v);
  };

  const handleResetToStart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDeliveryState("trajectory");
    setCurrentIdx(0);
    setVisitedIds(new Set());
    setDotsVisible(true);
    if (onHomeClick) {
      onHomeClick();
    }
  };

  // ─── Hotspots ──────────────────────────────────────────────────────────────
  const hotspots = [
    { key: "customize" as HotspotKey, label: "CUSTOMIZE" },
    { key: "bodywork" as HotspotKey, label: "BODYWORK" },
    { key: "paintjob" as HotspotKey, label: "PAINT JOB" },
    { key: "accessories" as HotspotKey, label: "ACCESSORIES" },
  ];

  // ─── Derived values ────────────────────────────────────────────────────────
  const activeStep = currentIdx >= 0 ? TIMELINE_STEPS[currentIdx] : null;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Background centre spotlight beam */}
      <div
        className={`spotlight-beam-core absolute left-1/2 -translate-x-1/2 pointer-events-none z-0`}
        style={{ opacity: stageMode === "spotlight" && showBeam ? 1 : 0 }}
      />
      <div
        className={`spotlight-beam-glow absolute left-1/2 -translate-x-1/2 pointer-events-none z-0`}
        style={{ opacity: stageMode === "spotlight" && showBeam ? 1 : 0 }}
      />

      {/* ── MODE: Delivery Truck (Car + Truck, or Truck Only) ── */}
      {stageMode === "delivery" || deliveryState === "truck_with_car" || deliveryState === "truck_only" ? (
        <div className="z-10 scale-in" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(10px, 2.2vw, 32px)",
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 12px",
          flexWrap: "wrap",
        }}>
          {/* Car circle (Porsche) — present in truck_with_car, disappears in truck_only (Screenshot 3) */}
          {deliveryState !== "truck_only" && (
            <div className="transition-all duration-700" style={{
              width: "clamp(80px, 10vw, 145px)",
              height: "clamp(80px, 10vw, 145px)",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #E2E2E2 0%, #999999 50%, #111111 100%)",
              padding: 3,
              boxShadow: "0 10px 32px rgba(0,0,0,0.85)",
              zIndex: 10,
              flexShrink: 0,
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                background: isDark ? "#0a0a0e" : "#e4e4ee",
              }}>
                <img
                  src={carImage || "/red_car.jpg"}
                  alt="Red Sports Car"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {/* Truck + overlays */}
          <div style={{
            position: "relative",
            display: "inline-block",
            lineHeight: 0,
            transform: "scaleX(-1)",
            flexShrink: 0,
            transition: "all 0.7s ease",
          }}>
            <img
              src="/white_truck.png"
              alt="NEXTCAR Delivery Truck"
              style={{
                width: "min(580px, clamp(220px, 44vw, 580px))",
                height: "auto",
                display: "block",
                userSelect: "none",
              }}
            />

            <div style={{
              position: "absolute",
              top:    "36.8%",
              left:   "23%",
              width:  "64%",
              height: "23%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              pointerEvents: "none",
              transform: "scaleX(-1)",
            }}>
              <img
                src="/logo.png"
                alt="NEXTCAR"
                style={{
                  height: "clamp(28px, 3.8vw, 54px)",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <div style={{
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
                fontWeight: 900,
                fontStretch: "expanded",
                fontSize: "clamp(16px, 2.6vw, 40px)",
                lineHeight: "39px",
                letterSpacing: "0.01em",
                color: "rgba(0, 0, 0, 0.80)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}>
                VEICHLE DELIVERY
              </div>
            </div>
          </div>
        </div>

        /* ── Thank You View (Screenshot 4 & 5) ── */
      ) : deliveryState === "thank_you" ? (
        <div className="z-20 flex flex-col items-center justify-center gap-6 scale-in" style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Shrikhand', 'Inter', serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(36px, 6vw, 60px)",
            lineHeight: "39px",
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: isDark ? "#F4F4F4" : "#111118",
            textAlign: "center",
            margin: 0,
            filter: isDark ? "drop-shadow(0 4px 16px rgba(0,0,0,0.8))" : "drop-shadow(0 4px 16px rgba(0,0,0,0.2))",
          }}>
            THANK YOU
          </h1>

          <button
            id="thankyou-home-btn"
            onClick={handleResetToStart}
            className="cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              padding: "10px 36px",
              borderRadius: 9999,
              background: isDark ? "rgba(80, 80, 80, 0.6)" : "rgba(220, 220, 228, 0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.14)",
              color: isDark ? "#ffffff" : "#111118",
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: "0.95rem",
              fontWeight: 500,
              boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            Home
          </button>
        </div>

        /* ── MODE: Trajectory / Explore Timeline auto-play ── */
      ) : stageMode === "trajectory" ? (
        <div className="trajectory-wrapper relative w-full h-full flex flex-col justify-center z-10">

          {/* Tooltip card (appears above active step, parallelogram style) */}
          <div className="timeline-tooltip-area relative w-full">
            {activeStep && dotsVisible && (() => {
              // Clamp tooltip so card stays within viewport horizontally
              const tooltipHalfW = windowWidth < 480 ? 90 : windowWidth < 768 ? 105 : 130;
              const containerW  = windowWidth;
              const rawPx       = (activeStep.posPercent / 100) * containerW;
              const clampedPx   = Math.min(Math.max(rawPx, tooltipHalfW), containerW - tooltipHalfW);
              const clampedPct  = (clampedPx / containerW) * 100;
              return (
                <div
                  className="absolute bottom-0 flex flex-col items-center"
                  style={{
                    left: `${clampedPct}%`,
                    transform: "translateX(-50%)",
                    transition: "left 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease",
                    opacity: dotsVisible ? 1 : 0,
                    zIndex: 30,
                  }}
                >
                  <div className="timeline-tooltip-card">
                    <div className="timeline-tooltip-unskew">
                      <div className="timeline-tooltip-label">{activeStep.label}</div>
                      <div className="timeline-tooltip-desc">{activeStep.desc}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ── Timeline row ── */}
          <div
            className="timeline-row relative w-full transition-opacity duration-500"
            style={{ opacity: dotsVisible ? 1 : 0 }}
          >

            {/* Red dashed line connecting the 4 milestone nodes */}
            <div
              className="timeline-dashed-line absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${TIMELINE_STEPS[0].posPercent}%`,
                right: `${100 - TIMELINE_STEPS[TIMELINE_STEPS.length - 1].posPercent}%`,
              }}
            />

            {/* Milestone nodes */}
            {TIMELINE_STEPS.map((step, idx) => {
              const isActive = currentIdx === idx;
              const isVisited = visitedIds.has(step.id) && dotsVisible;
              const isFuture = idx > currentIdx;

              if (isFuture && currentIdx >= 0) return (
                <button
                  key={step.id}
                  onClick={() => handleDotClick(idx)}
                  aria-label={step.label}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer flex items-center justify-center z-10"
                  style={{ left: `${step.posPercent}%` }}
                >
                  <div className="node-future" />
                </button>
              );

              return (
                <button
                  key={step.id}
                  onClick={() => handleDotClick(idx)}
                  aria-label={step.label}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer flex items-center justify-center z-20"
                  style={{
                    left: `${step.posPercent}%`,
                    transition: "left 0.5s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {isActive ? (
                    <div className="node-active-border">
                      <div className="node-active-inner">
                        <img
                          src={carImage || "/red_car.jpg"}
                          alt="Red Sports Car"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : isVisited ? (
                    <div
                      className="node-visited"
                      style={{ opacity: dotsVisible ? 1 : 0 }}
                    />
                  ) : (
                    <div className="node-unvisited" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      ) : (
        <>
          <div className="car-float car-circle-outer car-float relative rounded-full flex items-center justify-center z-10">
            <div className="car-circle-inner">
              <img
                src={carImage || "/black_car.png"}
                alt="NEXTCAR luxury sports car"
                className="car-circle-img w-full h-full object-cover"
              />
              {/* Inner Shadow & Blur Overlay */}
              <div className="car-circle-overlay absolute inset-0 pointer-events-none rounded-full" />
            </div>
          </div>

          {/* Hotspot buttons */}
          {showHotspots &&
            hotspots.map(({ key, label }) => {
              const isActive = activeHotspot === key;
              const isHovered = hovered === key;
              const posClass = HOTSPOT_POS_CLASSES[key as string] ?? "";
              return (
                <button
                  key={key}
                  id={`hotspot-${key}`}
                  aria-label={`Configure ${label}`}
                  onClick={() => onHotspotClick(isActive ? null : key)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  className={`hotspot-btn hotspot-size absolute flex items-center justify-center transition-all duration-300 cursor-pointer z-20 ${posClass} ${isActive ? "hotspot-active" : "hotspot-inactive"}`}
                >
                  <div
                    className={`hotspot-label-base w-full h-full flex items-center justify-center ${
                      isActive
                        ? "hotspot-label-active"
                        : isHovered
                        ? "hotspot-label-hovered"
                        : "hotspot-label-default"
                    }`}
                  >
                    {label}
                  </div>
                </button>
              );
            })}
        </>
      )}
    </div>
  );
}
