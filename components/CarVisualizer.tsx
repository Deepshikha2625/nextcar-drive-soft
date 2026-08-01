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
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1366));

  // Track window width for clamping tooltip
  useEffect(() => {
    if (typeof window === "undefined") return;
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
      const initTimer = setTimeout(() => {
        setCurrentIdx(-1);
        setVisitedIds(new Set());
        setDotsVisible(true);
        setDeliveryState("trajectory");
      }, 0);
      return () => clearTimeout(initTimer);
    }

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

    const startTimer = setTimeout(() => {
      setDeliveryState("trajectory");
      setCurrentIdx(-1);
      setVisitedIds(new Set());
      setDotsVisible(true);
      advance();
    }, 0);

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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

      {/* ── MODE: Delivery Truck (Car + Truck, or Truck Only) ── */}
      {stageMode === "delivery" || deliveryState === "truck_with_car" || deliveryState === "truck_only" ? (
        <div className="delivery-stage-box z-10 scale-in">
          {/* Car circle (Porsche) — present in truck_with_car, disappears in truck_only (Screenshot 3) */}
          {deliveryState !== "truck_only" && (
            <div className="delivery-car-base transition-all duration-700">
              <div className="delivery-car-inner-box">
                <img
                  src={carImage || "/red_car.jpg"}
                  alt="Red Sports Car"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Truck + overlays */}
          <div className="delivery-truck-box">
            <img
              src="/white_truck.png"
              alt="NEXTCAR Delivery Truck"
              className="delivery-truck-image"
            />

            <div className="delivery-truck-overlay">
              <img
                src="/logo.png"
                alt="NEXTCAR"
                className="delivery-logo"
              />
              <div className="delivery-heading">
                VEHICLE DELIVERY
              </div>
            </div>
          </div>
        </div>

        /* ── Thank You View (Screenshot 4 & 5) ── */
      ) : deliveryState === "thank_you" ? (
        <div className="z-30 flex flex-col items-center justify-center gap-6 scale-in pointer-events-auto text-center">
          <h1 className="thankyou-heading-text">
            THANK YOU
          </h1>

          <button
            id="thankyou-home-btn"
            onClick={handleResetToStart}
            className="thankyou-home-btn hover:scale-105 pointer-events-auto relative z-30"
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
                  className={`absolute bottom-0 flex flex-col items-center -translate-x-1/2 transition-[left,opacity] duration-500 z-30 [left:var(--clamped-pct)] ${
                    dotsVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ "--clamped-pct": `${clampedPct}%` } as React.CSSProperties}
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
          <div className={`timeline-row relative w-full transition-opacity duration-500 ${dotsVisible ? "opacity-100" : "opacity-0"}`}>

            {/* Red dashed line connecting the 4 milestone nodes */}
            <div
              className="timeline-dashed-line absolute top-1/2 -translate-y-1/2 pointer-events-none [left:var(--left-pct)] [right:var(--right-pct)]"
              style={{
                "--left-pct": `${TIMELINE_STEPS[0].posPercent}%`,
                "--right-pct": `${100 - TIMELINE_STEPS[TIMELINE_STEPS.length - 1].posPercent}%`,
              } as React.CSSProperties}
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
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer flex items-center justify-center z-10 [left:var(--pos-pct)]"
                  style={{ "--pos-pct": `${step.posPercent}%` } as React.CSSProperties}
                >
                  <div className="node-future" />
                </button>
              );

              return (
                <button
                  key={step.id}
                  onClick={() => handleDotClick(idx)}
                  aria-label={step.label}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer flex items-center justify-center z-20 transition-[left] duration-500 ease-out [left:var(--pos-pct)]"
                  style={{ "--pos-pct": `${step.posPercent}%` } as React.CSSProperties}
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
                    <div className={`node-visited transition-opacity duration-300 ${dotsVisible ? "opacity-100" : "opacity-0"}`} />
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
