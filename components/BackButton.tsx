"use client";

import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      id="back-btn"
      onClick={onClick}
      aria-label="Go back"
      className="absolute top-4 left-4 z-30 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110"
      style={{
        background: "var(--bg-glass)",
        border: "1px solid var(--border-glass)",
        backdropFilter: "blur(12px)",
      }}
    >
      <ArrowLeft size={16} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
    </button>
  );
}
