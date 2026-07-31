"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import RightDock from "@/components/RightDock";
import CarVisualizer from "@/components/CarVisualizer";
import TelemetryTimeline from "@/components/TelemetryTimeline";
import BackButton from "@/components/BackButton";
import StatsPanel from "@/components/StatsPanel";
import PricingPanel from "@/components/PricingPanel";
import ChatModal from "@/components/ChatModal";
import { type HotspotKey } from "@/components/CarVisualizer";
import { Home, Gauge, IndianRupee, MessageSquare, FileText } from "lucide-react";

type AppState = "main" | "thankyou";
type NavId = "dashboard" | "home" | "pricing";

export default function NextCarPage() {
  const [isDark, setIsDark] = useState(true);
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [activeHotspot, setActiveHotspot] = useState<HotspotKey>(null);
  const [activeDockItem, setActiveDockItem] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>("main");
  const [mounted, setMounted] = useState(false);
  // Incrementing key re-mounts home view → replays entrance animations
  const [homeKey, setHomeKey] = useState(0);

  useEffect(() => {
    const savedNav = localStorage.getItem("nextcar_active_nav");
    if (savedNav === "dashboard" || savedNav === "home" || savedNav === "pricing") {
      setActiveNav(savedNav as NavId);
    }
    const savedDock = localStorage.getItem("nextcar_active_dock");
    if (savedDock === "chat" || savedDock === "docs" || savedDock === "security") {
      setActiveDockItem(savedDock);
    }
    const savedTheme = localStorage.getItem("nextcar_theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light");
    }
    setMounted(true);
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("nextcar_theme", next ? "dark" : "light");
      if (next) {
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
      }
      return next;
    });
  };

  const handleHotspotClick = (key: HotspotKey) => {
    setActiveHotspot(key);
  };

  const handleAddToBuild = () => {
    setActiveHotspot(null);
    setAppState("thankyou");
  };

  const handleHomeClick = () => {
    setAppState("main");
    handleNavClick("home");
  };

  const handleNavClick = (item: string) => {
    const nav = item as NavId;
    if (nav === "home") setHomeKey((k) => k + 1); // replay home entrance animation
    setActiveNav(nav);
    localStorage.setItem("nextcar_active_nav", nav);
    setActiveHotspot(null);
    setActiveDockItem(null);
    localStorage.removeItem("nextcar_active_dock");
  };

  const handleDockClick = (id: string) => {
    setActiveDockItem((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        localStorage.setItem("nextcar_active_dock", next);
        setActiveNav("dashboard");
        localStorage.setItem("nextcar_active_nav", "dashboard");
      } else {
        localStorage.removeItem("nextcar_active_dock");
      }
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <main
      id="nextcar-app"
      className={`page-root ${isDark ? "" : "light"}`}
    >
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Dot Matrix Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-dot-matrix" />

        {/* Center Vertical Light Beam */}
        <div className="bg-light-beam absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Concentric Background Circles */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className="ring-outer absolute rounded-full" />
          <div className="ring-mid-outer absolute rounded-full" />
          <div className="ring-mid-inner absolute rounded-full" />
          <div className="ring-core absolute rounded-full" />
        </div>

        {/* Center subtle red glow */}
        <div className="bg-center-red-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" />

        {/* Bottom red glow */}
        <div className="bg-bottom-red absolute bottom-0 left-0 right-0 pointer-events-none" />
      </div>

      {appState === "main" ? (
        <>
          <Header isDark={isDark} onToggleTheme={handleToggleTheme} />
          <SideNav activeItem={activeDockItem ? "" : activeNav} onItemClick={handleNavClick} isDark={isDark} />
          <RightDock activeDockItem={activeDockItem} onDockItemClick={handleDockClick} isDark={isDark} />

          {/* Main stage */}
          <div
            id="car-stage"
            className="car-stage absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {activeDockItem === "chat" ? (
              <ChatModal onClose={() => setActiveDockItem(null)} />
            ) : activeDockItem === "security" ? (
              <CarVisualizer
                activeHotspot={null}
                onHotspotClick={() => { }}
                showHotspots={false}
                stageMode="delivery"
                onHomeClick={handleHomeClick}
                isDark={isDark}
              />
            ) : activeNav === "dashboard" ? (
              <CarVisualizer
                activeHotspot={activeHotspot}
                onHotspotClick={handleHotspotClick}
                showHotspots={true}
                stageMode={activeDockItem === "docs" ? "trajectory" : "spotlight"}
                onHomeClick={handleHomeClick}
                isDark={isDark}
              />
            ) : activeNav === "home" ? (
              <div key={homeKey} className="relative w-full h-full">
                {/* Spotlight + Car */}
                <div className="home-car-launch absolute inset-0 flex items-center justify-center z-10">
                  <CarVisualizer
                    activeHotspot={null}
                    onHotspotClick={() => { }}
                    showHotspots={false}
                    stageMode="spotlight"
                    carImage="/blue_car.jpg"
                    onHomeClick={handleHomeClick}
                    isDark={isDark}
                  />
                </div>

                {/* Stats */}
                <div className="home-stats-right absolute inset-0 pointer-events-none z-20">
                  <StatsPanel />
                </div>
              </div>
            ) : (
              <PricingPanel />
            )}
          </div>

          {/* Telemetry bottom bar */}
          <div
            id="telemetry-section"
            className="telemetry-bar absolute bottom-0 left-0 right-0"
          >
            <TelemetryTimeline />
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav
            activeNav={activeDockItem ? "" : activeNav}
            activeDockItem={activeDockItem}
            isDark={isDark}
            onNavClick={handleNavClick}
            onDockClick={handleDockClick}
          />
        </>
      ) : (
        /* Thank You Screen */
        <div
          id="thankyou-screen"
          className="absolute inset-0 flex flex-col items-center justify-center fade-in-up"
        >
          <BackButton onClick={() => setAppState("main")} />
          <Header isDark={isDark} onToggleTheme={handleToggleTheme} />
          <SideNav activeItem={activeNav} onItemClick={handleNavClick} isDark={isDark} />
          <RightDock activeDockItem={activeDockItem} onDockItemClick={handleDockClick} isDark={isDark} />

          <div className="thankyou-content flex flex-col items-center justify-center text-center scale-in">
            <h2 className="thankyou-heading font-black uppercase">
              THANK YOU
            </h2>
            <p className="thankyou-subtext mt-3">
              Your configuration has been saved
            </p>

            <button
              id="back-to-home-btn"
              onClick={handleHomeClick}
              className="thankyou-back-btn mt-8 flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Home size={16} strokeWidth={1.5} />
              Home
            </button>
          </div>

          {/* Telemetry bottom bar */}
          <div className="telemetry-bar absolute bottom-0 left-0 right-0">
            <TelemetryTimeline />
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav
            activeNav={activeNav}
            activeDockItem={activeDockItem}
            isDark={isDark}
            onNavClick={handleNavClick}
            onDockClick={handleDockClick}
          />
        </div>
      )}
    </main>
  );
}

/* ── Mobile Bottom Navigation ────────────────────────────────────────────── */
function MobileBottomNav({
  activeNav,
  activeDockItem,
  isDark,
  onNavClick,
  onDockClick,
}: {
  activeNav: string;
  activeDockItem: string | null;
  isDark: boolean;
  onNavClick: (id: string) => void;
  onDockClick: (id: string) => void;
}) {
  const navItems = [
    { id: "dashboard", icon: Gauge,         label: "Dashboard", type: "nav" as const },
    { id: "home",      icon: Home,          label: "Home",      type: "nav" as const },
    { id: "pricing",  icon: IndianRupee,   label: "Pricing",   type: "nav" as const },
    { id: "chat",     icon: MessageSquare, label: "Chat",      type: "dock" as const },
    { id: "docs",     icon: FileText,      label: "Explore",   type: "dock" as const },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map(({ id, icon: Icon, label, type }) => {
        const isActive =
          type === "nav" ? activeNav === id && !activeDockItem : activeDockItem === id;
        return (
          <button
            key={id}
            id={`mobile-nav-${id}`}
            aria-label={label}
            className="mobile-nav-item"
            onClick={() => type === "nav" ? onNavClick(id) : onDockClick(id)}
          >
            <span className={`mobile-nav-icon ${
              isActive ? "mobile-nav-icon-active" : "mobile-nav-icon-inactive"
            }`}>
              <Icon
                size={18}
                strokeWidth={1.8}
                style={{
                  color: isActive ? "#ffffff" : isDark ? "rgba(255,255,255,0.5)" : "rgba(17,17,24,0.5)",
                }}
              />
            </span>
            <span className={`mobile-nav-label ${
              isActive ? "mobile-nav-label-active" : ""
            }`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
