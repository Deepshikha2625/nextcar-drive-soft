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
      className={`relative flex items-center p-1 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer w-[72px] h-[36px] backdrop-blur-md ${
        isDark
          ? "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
          : "bg-[rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.14)] shadow-[0_4px_15px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* Active Indicator Sliding Pill */}
      <div
        className={`absolute top-1 bottom-1 w-[28px] rounded-full transition-all duration-300 ease-out ${
          isDark
            ? "left-[38px] bg-[rgba(255,255,255,0.18)] shadow-[0_0_10px_rgba(255,255,255,0.25)] border border-[rgba(255,255,255,0.2)]"
            : "left-[4px] bg-[rgba(232,33,43,0.3)] shadow-[0_0_10px_rgba(232,33,43,0.5)] border border-[rgba(232,33,43,0.5)]"
        }`}
      />

      {/* Sun Icon (Light Mode option) */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <Sun
          size={15}
          strokeWidth={2}
          className={`transition-colors duration-300 ${
            !isDark ? "text-[var(--red-accent)]" : "text-[rgba(255,255,255,0.4)]"
          }`}
        />
      </div>

      {/* Moon Icon (Dark Mode option) */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <Moon
          size={15}
          strokeWidth={2}
          className={`transition-colors duration-300 ${
            isDark ? "text-white" : "text-[rgba(17,17,24,0.4)]"
          }`}
        />
      </div>
    </button>
  );
}

