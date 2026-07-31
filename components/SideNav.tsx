"use client";

import { Gauge, Home, IndianRupee } from "lucide-react";

interface SideNavProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isDark?: boolean;
}

const navItems = [
  { id: "dashboard", icon: Gauge, label: "Dashboard", offsetX: 16 },
  { id: "home", icon: Home, label: "Home", offsetX: 0 },
  { id: "pricing", icon: IndianRupee, label: "Pricing", offsetX: 16 },
];

export default function SideNav({ activeItem, onItemClick, isDark = true }: SideNavProps) {
  return (
    <nav
      id="side-nav"
      aria-label="Main navigation"
      className="absolute left-6 top-[56%] -translate-y-1/2 z-40 flex flex-col items-center pointer-events-auto"
    >
      {/* Curved dashed arc behind/alongside left nav — matching Figma design */}
      <svg
        className="absolute -left-6 top-1/2 -translate-y-1/2 pointer-events-none overflow-visible"
        width="50"
        height="220"
        viewBox="0 0 50 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 36 6 Q -12 110 36 214"
          stroke={isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.25)"}
          strokeWidth="1.25"
          strokeDasharray="4 5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Nav items aligned along arc */}
      <div className="relative flex flex-col gap-8 items-start">
        {navItems.map(({ id, icon: Icon, label, offsetX }) => {
          const isActive = activeItem === id;
          const btnSize = 44;
          return (
            <div
              key={id}
              className="relative flex items-center group"
              style={{
                transform: `translateX(${offsetX}px)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <button
                id={`nav-${id}`}
                onClick={() => onItemClick(id)}
                aria-label={label}
                title={label}
                className="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{
                  width: `${btnSize}px`,
                  height: `${btnSize}px`,
                  zIndex: 10,
                  background: isActive
                    ? "radial-gradient(circle at 35% 30%, #EE242E 0%, #9E0C15 65%, #480006 100%)"
                    : isDark
                    ? "radial-gradient(circle at 35% 30%, #3A3D47 0%, #1A1B22 65%, #0E0F14 100%)"
                    : "radial-gradient(circle at 35% 30%, #c8c8d4 0%, #b0b0be 65%, #a0a0b0 100%)",
                  border: isActive
                    ? "1.5px solid rgba(255, 120, 120, 0.7)"
                    : isDark
                    ? "1px solid rgba(255, 255, 255, 0.15)"
                    : "1px solid rgba(0, 0, 0, 0.14)",
                  boxShadow: isActive
                    ? "0 0 22px rgba(232,33,43,0.6), 0 4px 14px rgba(0,0,0,0.6)"
                    : isDark
                    ? "0 4px 12px rgba(0,0,0,0.4)"
                    : "0 4px 12px rgba(0,0,0,0.12)",
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  style={{
                    color: isActive ? "#ffffff" : isDark ? "#ffffff" : "#111118",
                    filter: isActive ? "drop-shadow(0 0 4px rgba(255,255,255,0.5))" : "none",
                    transition: "all 0.3s",
                  }}
                />
              </button>

              {/* Active: always-visible label pill. Inactive: hover-only tooltip */}
              {(() => {
                const pillWidths: Record<string, number> = {
                  dashboard: 142,
                  home: 112,
                  pricing: 126,
                };
                const width = pillWidths[id] || 140;
                return (
                  <div
                    className={`absolute whitespace-nowrap transition-all duration-200 pointer-events-none flex items-center ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                    style={{
                      left: "52px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: `${width}px`,
                      height: "42px",
                      zIndex: 2,
                      filter: isActive
                        ? "drop-shadow(0px 2px 10px rgba(196, 5, 4, 0.45))"
                        : "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.5))",
                    }}
                  >
                    <svg
                      width={width}
                      height="42"
                      viewBox={`0 0 ${width} 42`}
                      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    >
                      <defs>
                        <linearGradient
                          id={`sidenav-pill-grad-${id}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="50%"
                        >
                          <stop offset="0%" stopColor={isActive ? "#333333" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} />
                          <stop offset="20%" stopColor={isActive ? "#333333" : isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.14)"} />
                          <stop offset="55%" stopColor={isActive ? "#C40504" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.22)"} />
                          <stop offset="100%" stopColor={isActive ? "#BF0405" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M 16 0 L ${width - 21} 0 A 21 21 0 0 1 ${width - 21} 42 L 16 42 C 11 42 7 38 7 33 C 7 29 0 26 0 21 C 0 16 7 13 7 9 C 7 4 11 0 16 0 Z`}
                        fill={isDark ? "#414141" : "#d0d0da"}
                        stroke={`url(#sidenav-pill-grad-${id})`}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span
                      style={{
                        position: "relative",
                        zIndex: 2,
                        paddingLeft: "24px",
                        paddingRight: "16px",
                        width: "100%",
                        textAlign: "center",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.86rem",
                        fontWeight: 500,
                        color: isDark ? "#ffffff" : "#111118",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </nav>
  );
}


