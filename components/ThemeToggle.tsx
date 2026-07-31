"use client";

import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      id="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center p-1 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
      style={{
        background: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.14)",
        backdropFilter: "blur(12px)",
        width: "72px",
        height: "36px",
        boxShadow: isDark ? "0 4px 15px rgba(0, 0, 0, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Active Indicator Sliding Pill */}
      <div
        className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out"
        style={{
          width: "28px",
          left: isDark ? "38px" : "4px",
          background: isDark
            ? "rgba(255, 255, 255, 0.18)"
            : "rgba(232, 33, 43, 0.3)",
          boxShadow: isDark
            ? "0 0 10px rgba(255, 255, 255, 0.25)"
            : "0 0 10px rgba(232, 33, 43, 0.5)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(232, 33, 43, 0.5)",
        }}
      />

      {/* Sun Icon (Light Mode option) */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <Sun
          size={15}
          strokeWidth={2}
          style={{
            color: !isDark ? "var(--red-accent)" : "rgba(255, 255, 255, 0.4)",
            transition: "color 0.3s",
          }}
        />
      </div>

      {/* Moon Icon (Dark Mode option) */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <Moon
          size={15}
          strokeWidth={2}
          style={{
            color: isDark ? "#ffffff" : "rgba(17, 17, 24, 0.4)",
            transition: "color 0.3s",
          }}
        />
      </div>
    </button>
  );
}

