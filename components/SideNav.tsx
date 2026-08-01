"use client";

import { Gauge, Home, IndianRupee } from "lucide-react";

interface SideNavProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isDark?: boolean;
}

const navItems = [
  { id: "dashboard", icon: Gauge, label: "Dashboard", offsetX: 16 },
  { id: "home", icon: Home, label: "Click for Home", offsetX: 0 },
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
          const pillWidthClasses: Record<string, string> = {
            dashboard: "w-[142px]",
            home: "w-[155px]",
            pricing: "w-[126px]",
          };
          const pillWidth = id === "dashboard" ? 142 : id === "home" ? 155 : 126;
          const widthClass = pillWidthClasses[id] || "w-[140px]";

          return (
            <div
              key={id}
              className={`relative flex items-center group transition-transform duration-300 ease-out ${
                offsetX > 0 ? "translate-x-4" : "translate-x-0"
              }`}
            >
              <button
                id={`nav-${id}`}
                onClick={() => onItemClick(id)}
                aria-label={label}
                title={label}
                className={`relative flex items-center justify-center w-[44px] h-[44px] z-10 shrink-0 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${
                  isActive
                    ? "bg-[radial-gradient(circle_at_35%_30%,#EE242E_0%,#9E0C15_65%,#480006_100%)] border-[1.5px] border-[rgba(255,120,120,0.7)] shadow-[0_0_22px_rgba(232,33,43,0.6),0_4px_14px_rgba(0,0,0,0.6)]"
                    : isDark
                    ? "bg-[radial-gradient(circle_at_35%_30%,#3A3D47_0%,#1A1B22_65%,#0E0F14_100%)] border border-[rgba(255,255,255,0.15)] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    : "bg-[radial-gradient(circle_at_35%_30%,#c8c8d4_0%,#b0b0be_65%,#a0a0b0_100%)] border border-[rgba(0,0,0,0.14)] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-white [filter:drop-shadow(0_0_4px_rgba(255,255,255,0.5))]"
                      : isDark
                      ? "text-white"
                      : "text-[#111118]"
                  }`}
                />
              </button>

              {/* Active: always-visible label pill. Inactive: hover-only tooltip */}
              <div
                className={`absolute left-[52px] top-1/2 -translate-y-1/2 h-[42px] z-10 whitespace-nowrap transition-all duration-200 pointer-events-none flex items-center ${widthClass} ${
                  isActive
                    ? "opacity-100 scale-100 [filter:drop-shadow(0px_2px_10px_rgba(196,5,4,0.45))]"
                    : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 [filter:drop-shadow(0px_2px_8px_rgba(0,0,0,0.5))]"
                }`}
              >
                <svg
                  width={pillWidth}
                  height="42"
                  viewBox={`0 0 ${pillWidth} 42`}
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
                    d={`M 16 0 L ${pillWidth - 21} 0 A 21 21 0 0 1 ${pillWidth - 21} 42 L 16 42 C 11 42 7 38 7 33 C 7 29 0 26 0 21 C 0 16 7 13 7 9 C 7 4 11 0 16 0 Z`}
                    fill={isDark ? "#414141" : "#d0d0da"}
                    stroke={`url(#sidenav-pill-grad-${id})`}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>

                <span
                  className={`relative z-10 pl-6 pr-4 w-full text-center font-sans text-[0.86rem] font-medium tracking-[0.02em] ${
                    isDark ? "text-white" : "text-[#111118]"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}


