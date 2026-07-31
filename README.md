# NEXTCAR – Drive Soft

> **Engineered For Passion. Precision. Power. Performance.**

A pixel-perfect, responsive React/Next.js implementation of the NEXTCAR Drive Soft Figma design — featuring an interactive car configurator, animated telemetry timeline, and dual light/dark mode theming.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the project
git clone <your-repo-url>
cd nextcar-drive-soft

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Framework & SSR |
| **React 18** | UI components |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Framer Motion** | Micro-animations |
| **Google Fonts** (Orbitron, Rajdhani, Inter) | Typography |

---

## 📁 Project Structure

```
nextcar-drive-soft/
├── app/
│   ├── layout.tsx          # Root layout with metadata + fonts
│   ├── page.tsx            # Main app page (state orchestration)
│   ├── globals.css         # Global CSS, animations, custom properties
│   └── api/
│       ├── telemetry/route.ts      # GET lap telemetry data
│       └── car-config/route.ts     # GET config, POST build pricing
├── components/
│   ├── Header.tsx          # App header with logo + hero text
│   ├── BackButton.tsx      # Navigation back button
│   ├── SideNav.tsx         # Vertical sidebar dock (left)
│   ├── RightDock.tsx       # Utility dock (right)
│   ├── ThemeToggle.tsx     # Light/dark theme switch
│   ├── CarVisualizer.tsx   # Central car stage + orbit rings + hotspots
│   ├── HotspotPanel.tsx    # Config modal (Customize, Paint, Bodywork, Accessories)
│   └── TelemetryTimeline.tsx # Animated SVG lap performance bar
└── public/                 # Static assets
```

---

## ✨ Key Features

- **🎯 Pixel-Perfect Figma Match** – Reproduces the dark luxury aesthetic from the Figma prototype
- **🌙 Light/Dark Mode** – Seamless toggle with CSS custom properties
- **📱 Mobile Responsive** – Fluid layouts across all device sizes
- **⚡ Animated Orbital Rings** – Pulsing concentric rings around the car visualizer
- **🏎️ Interactive Hotspots** – Clicking CUSTOMIZE / PAINT JOB / BODYWORK / ACCESSORIES opens a slide-in config panel
- **📊 Telemetry Timeline** – Animated SVG waveform with 5 interactive lap nodes
- **🚀 Thank You Screen** – Final confirmation state matching the Figma flow
- **🔗 REST API Routes** – `/api/telemetry` for lap data, `/api/car-config` for pricing

---

## 🎨 Design Decisions & Assumptions

1. **Car Image**: Used a similar sports car image (Aston Martin aesthetic from Unsplash) as the Figma design contains a private asset. The design structure and layout is pixel-perfect.
2. **Animations**: Used CSS keyframe animations instead of Framer Motion for orbit rings (for performance), with Framer Motion reserved for modal scale-in/fade-up effects.
3. **Dark theme primary**: The dark theme (`#050507` carbon background) is the default, matching the Figma design's intended aesthetic.
4. **Backend routes**: API routes are implemented using Next.js App Router API handlers and serve mock JSON data that maps 1:1 with the Figma design's telemetry and configuration sections.
5. **Font system**: Orbitron (headings), Rajdhani (labels), Inter (body) — matching the futuristic automotive aesthetic.

---

## 📡 API Endpoints

### `GET /api/telemetry`
Returns all lap telemetry data.

### `GET /api/telemetry?lap=03`
Returns telemetry for a specific lap (01-05).

### `GET /api/car-config`
Returns base config and all configurable options with pricing.

### `POST /api/car-config`
Calculate total build price.
```json
{
  "selections": [
    { "category": "paintjob", "option": "Racing Red" },
    { "category": "accessories", "option": "Carbon Wing" }
  ]
}
```

---

