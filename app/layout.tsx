import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextCar | Drive Soft – Engineered For Passion",
  description:
    "NextCar Drive Soft – premium interactive car configuration experience. Precision. Power. Performance.",
  keywords: "car configurator, NextCar, luxury car, automotive, customization",
  openGraph: {
    title: "NextCar | Drive Soft",
    description: "Engineered For Passion. Precision. Power. Performance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Shrikhand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
