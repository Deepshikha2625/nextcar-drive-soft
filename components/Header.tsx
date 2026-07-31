"use client";

import { useState } from "react";
import { ArrowLeft, Download, Share2, Check } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onBack?: () => void;
}

export default function Header({ isDark, onToggleTheme, onBack }: HeaderProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDownload = () => {
    triggerToast("Downloading NextCar configuration PDF...");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText?.(window.location.href);
    }
    triggerToast("Configuration link copied to clipboard!");
  };

  const handleStatus = () => {
    triggerToast("System Status: All telemetry sensors 100% operational");
  };

  return (
    <>
      <header
        id="main-header"
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between pointer-events-none"
        style={{
          padding: "clamp(8px, 2vw, 16px) clamp(12px, 3vw, 28px)",
        }}
      >
        {/* Background Arch Dome Spotlight */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Vertical spotlight beam behind center title */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: "300px",
              height: "140px",
              background:
                "radial-gradient(ellipse at top, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 75%)",
              filter: "blur(10px)",
            }}
          />

          {/* Star dust / particles overlay */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-44 opacity-35"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.75) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage:
                "radial-gradient(ellipse 65% 85% at 50% 20%, black 0%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 85% at 50% 20%, black 0%, transparent 80%)",
            }}
          />
        </div>

        {/* Far Left: Standalone NEXTCAR Logo + Back Button (Matching Figma Screenshot 1) */}
        <div className="relative z-10 flex flex-col items-start gap-4 pointer-events-auto">
          {/* NEXTCAR Standalone Branding Logo */}
          <div className="flex flex-col items-start cursor-pointer hover:opacity-90 transition-opacity">
            <Image src="/logo.png" alt="NextCar" width={140} height={40} priority
              style={{ width: "clamp(90px, 12vw, 140px)", height: "auto" }}
            />
          </div>

          {/* Back Button */}
          <button
            id="back-btn"
            onClick={onBack}
            aria-label="Go back"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              background: isDark ? "rgba(30, 30, 38, 0.75)" : "rgba(240, 240, 248, 0.85)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.14)",
              backdropFilter: "blur(12px)",
              boxShadow: isDark ? "0 4px 15px rgba(0,0,0,0.5)" : "0 4px 15px rgba(0,0,0,0.12)",
            }}
          >
            <ArrowLeft size={17} strokeWidth={1.8} style={{ color: isDark ? "#ffffff" : "#111118" }} />
          </button>
        </div>

        {/* Hero Title — Absolutely Centered matching Figma Screenshot 1 */}
        <div className="absolute left-1/2 top-[48px] -translate-x-1/2 hidden sm:flex flex-col items-center text-center pointer-events-none z-10 w-full max-w-4xl px-4">
          <h1
            className="uppercase leading-none text-center"
            style={{
              fontFamily: "'Shrikhand', cursive",
              fontSize: "clamp(2.0rem, 3.4vw, 3.4rem)",
              letterSpacing: "0.02em",
              fontWeight: 400,
            }}
          >
            <span style={{ color: isDark ? "#ffffff" : "#111118", fontStyle: "italic" }}>
              ENGINEERED FOR{" "}
            </span>
            <span
              className="glow-text"
              style={{ color: "var(--red-accent)", fontStyle: "italic" }}
            >
              PASSION
            </span>
          </h1>
          <p
            className="text-center mt-2.5"
            style={{
              color: isDark ? "rgba(255,255,255,0.65)" : "rgba(17,17,24,0.6)",
              fontSize: "clamp(0.72rem, 0.82vw, 0.82rem)",
              letterSpacing: "0.12em",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              textTransform: "none",
            }}
          >
            Precision. Power. Performance
          </p>
          {/* Red accent bar centered under subtitle */}
          <div
            className="mt-2"
            style={{
              width: 28,
              height: 2,
              background: "var(--red-accent)",
              borderRadius: 2,
              boxShadow: "0 0 8px rgba(196,5,4,0.9), 0 0 16px rgba(196,5,4,0.4)",
            }}
          />
        </div>

        {/* Far Right Section: Theme Toggle Pill top right + Action Buttons */}
        <div className="relative z-10 flex flex-col items-end gap-3 pointer-events-auto">
          {/* Top Right: Theme Toggle Pill Container (Matching Figma Screenshot 1) */}
          <div>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>

          {/* Action Buttons Row */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              id="download-btn"
              onClick={handleDownload}
              aria-label="Download"
              title="Download PDF Spec"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                backdropFilter: "blur(12px)",
                boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Download
                size={15}
                strokeWidth={1.6}
                style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(17,17,24,0.75)" }}
              />
            </button>

            <button
              id="share-btn"
              onClick={handleShare}
              aria-label="Share"
              title="Share Configuration"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                backdropFilter: "blur(12px)",
                boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Share2
                size={15}
                strokeWidth={1.6}
                style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(17,17,24,0.75)" }}
              />
            </button>

            <button
              id="status-btn"
              onClick={handleStatus}
              aria-label="Status indicator"
              title="System Status"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer red-glow-btn"
              style={{
                background: "var(--red-accent)",
                border: "none",
                boxShadow: "0 0 15px rgba(232, 33, 43, 0.6)",
              }}
            >
              <Check size={16} strokeWidth={2.5} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {toastMessage && (
        <div
          className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl scale-in"
          style={{
            background: isDark ? "rgba(20,20,26,0.92)" : "rgba(255,255,255,0.95)",
            border: isDark ? "1px solid rgba(232,33,43,0.5)" : "1px solid rgba(196,16,32,0.35)",
            backdropFilter: "blur(16px)",
            boxShadow: isDark
              ? "0 0 25px rgba(232,33,43,0.3), 0 10px 30px rgba(0,0,0,0.6)"
              : "0 0 20px rgba(196,16,32,0.15), 0 10px 30px rgba(0,0,0,0.12)",
            color: isDark ? "#ffffff" : "#111118",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          <Check size={16} className="text-red-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

