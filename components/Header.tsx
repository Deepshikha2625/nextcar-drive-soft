"use client";

import { useState } from "react";
import { ArrowLeft, Download, Share2, Check } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onBack?: () => void;
  showTitle?: boolean; // controls visibility of "ENGINEERED FOR PASSION"
}

export default function Header({ isDark, onToggleTheme, onBack, showTitle = true }: HeaderProps) {
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
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between pointer-events-none px-[clamp(12px,3vw,28px)] py-[clamp(8px,2vw,16px)]"
      >
        {/* Background Star Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Star dust / particles overlay using star.png */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-full max-w-3xl h-36 opacity-95 pointer-events-none z-0 bg-[url('/star.png')] bg-top bg-no-repeat bg-contain"
          />
        </div>

        {/* Far Left: Standalone NEXTCAR Logo + Back Button (Matching Figma Screenshot 1) */}
        <div className="relative z-10 flex flex-col items-start gap-4 pointer-events-auto">
          {/* NEXTCAR Standalone Branding Logo */}
          <div className="flex flex-col items-start cursor-pointer hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="NextCar"
              width={140}
              height={40}
              priority
              className="w-[clamp(90px,12vw,140px)] h-auto"
            />
          </div>

          {/* Back Button */}
          <button
            id="back-btn"
            onClick={onBack}
            aria-label="Go back"
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-md ${
              isDark
                ? "bg-[rgba(30,30,38,0.75)] border border-[rgba(255,255,255,0.15)] shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                : "bg-[rgba(240,240,248,0.85)] border border-[rgba(0,0,0,0.14)] shadow-[0_4px_15px_rgba(0,0,0,0.12)]"
            }`}
          >
            <ArrowLeft size={17} strokeWidth={1.8} className={isDark ? "text-white" : "text-[#111118]"} />
          </button>
        </div>

        {/* Hero Title — only on home/dashboard pages */}
        {showTitle && (
          <div className="absolute left-1/2 top-[70px] sm:top-[62px] -translate-x-1/2 flex flex-col items-center text-center pointer-events-none z-10 w-full max-w-4xl px-3">
            <h1 className="uppercase leading-none text-center whitespace-nowrap font-shrikhand text-[clamp(0.85rem,3.8vw,3.4rem)] tracking-[0.02em] font-normal">
              <span className={`italic ${isDark ? "text-white" : "text-[#111118]"}`}>
                ENGINEERED FOR{" "}
              </span>
              <span className="glow-text italic text-[var(--red-accent)]">
                PASSION
              </span>
            </h1>
            <p
              className={`text-center mt-1 sm:mt-2 whitespace-nowrap text-[clamp(0.55rem,1.8vw,0.82rem)] tracking-[0.10em] font-sans font-normal normal-case ${
                isDark ? "text-[rgba(255,255,255,0.65)]" : "text-[rgba(17,17,24,0.6)]"
              }`}
            >
              Precision. Power. Performance
            </p>
            {/* Red accent bar */}
            <div className="mt-1 sm:mt-1.5 w-6 h-[2px] bg-[var(--red-accent)] rounded-[2px] shadow-[0_0_8px_rgba(196,5,4,0.9),0_0_16px_rgba(196,5,4,0.4)]" />
          </div>
        )}

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
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-md ${
                isDark
                  ? "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  : "bg-[rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.12)] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              }`}
            >
              <Download
                size={15}
                strokeWidth={1.6}
                className={isDark ? "text-[rgba(255,255,255,0.8)]" : "text-[rgba(17,17,24,0.75)]"}
              />
            </button>

            <button
              id="share-btn"
              onClick={handleShare}
              aria-label="Share"
              title="Share Configuration"
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-md ${
                isDark
                  ? "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  : "bg-[rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.12)] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              }`}
            >
              <Share2
                size={15}
                strokeWidth={1.6}
                className={isDark ? "text-[rgba(255,255,255,0.8)]" : "text-[rgba(17,17,24,0.75)]"}
              />
            </button>

            <button
              id="status-btn"
              onClick={handleStatus}
              aria-label="Status indicator"
              title="System Status"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer red-glow-btn bg-[var(--red-accent)] border-none shadow-[0_0_15px_rgba(232,33,43,0.6)]"
            >
              <Check size={16} strokeWidth={2.5} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl scale-in backdrop-blur-xl font-rajdhani text-[0.8rem] font-semibold tracking-[0.05em] ${
            isDark
              ? "bg-[rgba(20,20,26,0.92)] border border-[rgba(232,33,43,0.5)] shadow-[0_0_25px_rgba(232,33,43,0.3),0_10px_30px_rgba(0,0,0,0.6)] text-white"
              : "bg-[rgba(255,255,255,0.95)] border border-[rgba(196,16,32,0.35)] shadow-[0_0_20px_rgba(196,16,32,0.15),0_10px_30px_rgba(0,0,0,0.12)] text-[#111118]"
          }`}
        >
          <Check size={16} className="text-red-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

