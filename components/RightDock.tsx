"use client";

interface RightDockProps {
  activeDockItem: string | null;
  onDockItemClick: (id: string) => void;
  isDark?: boolean;
}

// Custom SVG icons matching the screenshot design
const ChatIcon = ({ color = "#ffffff", fillColor = "#2a2b33" }: { color?: string; fillColor?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Back bubble */}
    <rect x="5" y="6" width="14" height="10" rx="3" stroke={color} strokeWidth="1.6" fill="none" />
    {/* Front bubble overlapping */}
    <rect x="2" y="9" width="14" height="10" rx="3" fill={fillColor} stroke={color} strokeWidth="1.6" />
    {/* Lines in front bubble */}
    <line x1="5.5" y1="13" x2="12.5" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="5.5" y1="15.5" x2="10" y2="15.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const DocsIcon = ({ color = "#ffffff" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Document outline */}
    <rect x="4" y="2" width="14" height="18" rx="2" stroke={color} strokeWidth="1.6" fill="none" />
    {/* Folded corner top-right */}
    <path d="M14 2 L18 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M14 2 L14 6 L18 6" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    {/* Text lines */}
    <line x1="7" y1="10" x2="15" y2="10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7" y1="16" x2="12" y2="16" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CertIcon = ({ color = "#ffffff", fillColor = "#2a2b33" }: { color?: string; fillColor?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Document outline */}
    <path d="M5 3 H15 L19 7 V17 H5 Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    {/* Folded corner */}
    <path d="M15 3 L15 7 L19 7" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    {/* Lines */}
    <line x1="8" y1="10" x2="15" y2="10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="8" y1="12.5" x2="13" y2="12.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    {/* Badge/seal circle at bottom */}
    <circle cx="9" cy="18" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
    <circle cx="9" cy="18" r="1.2" fill={color} />
    {/* Ribbon tails */}
    <line x1="7.5" y1="20.5" x2="6.5" y2="22.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="10.5" y1="20.5" x2="11.5" y2="22.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const dockItems = [
  { id: "chat", IconComponent: ChatIcon, label: "Chat Assistant", offsetClass: "dock-offset-near", pillWidth: 155 },
  { id: "docs", IconComponent: DocsIcon, label: "Explore timeline", offsetClass: "dock-offset-center", pillWidth: 165 },
  { id: "security", IconComponent: CertIcon, label: "Security Shield", offsetClass: "dock-offset-near", pillWidth: 160 },
];

export default function RightDock({ activeDockItem, onDockItemClick, isDark = true }: RightDockProps) {
  return (
    <aside
      id="right-dock"
      aria-label="Utility panel"
      className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center pointer-events-auto"
    >
      {/* Curved dashed arc to the right of dock buttons */}
      <svg
        className="absolute -right-6 top-1/2 -translate-y-1/2 pointer-events-none overflow-visible"
        width="50"
        height="220"
        viewBox="0 0 50 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 14 6 Q 62 110 14 214"
          stroke={isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.25)"}
          strokeWidth="1.25"
          strokeDasharray="4 5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Dock items aligned along arc */}
      <div className="relative flex flex-col gap-8 items-end">
        {dockItems.map(({ id, label, offsetClass, pillWidth }) => {
          const isActive = activeDockItem === id;
          const widthClass = id === "chat" ? "w-[155px]" : id === "docs" ? "w-[165px]" : "w-[160px]";
          return (
            <div
              key={id}
              className={`relative flex items-center justify-end group ${offsetClass}`}
            >
              {/* Label pill — always visible when active, hover-only when inactive */}
              <div
                className={`dock-label-pill absolute whitespace-nowrap pointer-events-none flex items-center transition-all duration-200 ${widthClass} ${
                  isActive
                    ? `opacity-100 scale-100 dock-label-pill-active`
                    : `opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 dock-label-pill-inactive`
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
                      id={`rightdock-pill-grad-${id}`}
                      x1="0%"
                      y1="50%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%"   stopColor={isActive ? "#BF0405" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} />
                      <stop offset="45%"  stopColor={isActive ? "#C40504" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.22)"} />
                      <stop offset="80%"  stopColor={isActive ? "#333333" : isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.14)"} />
                      <stop offset="100%" stopColor={isActive ? "#333333" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 21 0 L ${pillWidth - 16} 0 C ${pillWidth - 11} 0 ${pillWidth - 7} 4 ${pillWidth - 7} 9 C ${pillWidth - 7} 13 ${pillWidth} 16 ${pillWidth} 21 C ${pillWidth} 26 ${pillWidth - 7} 29 ${pillWidth - 7} 33 C ${pillWidth - 7} 38 ${pillWidth - 11} 42 ${pillWidth - 16} 42 L 21 42 A 21 21 0 0 1 21 0 Z`}
                    fill={isDark ? "#414141" : "#d0d0da"}
                    stroke={`url(#rightdock-pill-grad-${id})`}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className={`dock-pill-text ${isDark ? "text-white" : "text-[#111118]"}`}>{label}</span>
              </div>

              {/* Main dock button */}
              <button
                id={`dock-${id}`}
                onClick={() => onDockItemClick(id)}
                aria-label={label}
                title={label}
                className={`dock-btn relative flex items-center justify-center hover:scale-110 cursor-pointer ${
                  isActive ? "dock-btn-active" : "dock-btn-inactive"
                }`}
              >
                <span className={isActive ? "dock-icon-active" : "dock-icon-inactive"}>
                  {id === "chat" ? (
                    <ChatIcon
                      color={isActive ? "#ffffff" : isDark ? "#ffffff" : "#111118"}
                      fillColor={isDark ? "#2a2b33" : "#d0d0da"}
                    />
                  ) : id === "security" ? (
                    <CertIcon
                      color={isActive ? "#ffffff" : isDark ? "#ffffff" : "#111118"}
                      fillColor={isDark ? "#2a2b33" : "#d0d0da"}
                    />
                  ) : (
                    <DocsIcon color={isActive ? "#ffffff" : isDark ? "#ffffff" : "#111118"} />
                  )}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
