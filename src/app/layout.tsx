import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = localFont({
  src: [{ path: "./fonts/geist-var-100-900-latin.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexSans = localFont({
  src: [{ path: "./fonts/ibm-plex-sans-var-100-700-latin.woff2", weight: "100 700", style: "normal" }],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const openSans = localFont({
  src: [{ path: "./fonts/open-sans-var-300-800-latin.woff2", weight: "300 800", style: "normal" }],
  variable: "--font-open-sans",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-grotesk-500-latin.woff2", weight: "500", style: "normal" },
    { path: "./fonts/space-grotesk-600-latin.woff2", weight: "600", style: "normal" },
    { path: "./fonts/space-grotesk-700-latin.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = localFont({
  src: [{ path: "./fonts/inter-var-100-900-latin.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500-latin.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GeoSAT — Geospatial Survey, LiDAR & Spatial Intelligence",
    template: "%s · GeoSAT",
  },
  description:
    "GeoSAT delivers survey-grade geospatial intelligence: UAV LiDAR, drone photogrammetry, engineering survey, GIS systems and continuous monitoring for infrastructure, government and natural resources.",
  keywords: [
    "LiDAR survey",
    "UAV photogrammetry",
    "engineering survey",
    "GNSS total station",
    "GIS solutions",
    "remote sensing",
    "geotechnical monitoring",
    "digital twin",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "GeoSAT — Geospatial Survey, LiDAR & Spatial Intelligence",
    description:
      "Survey-grade geospatial intelligence for infrastructure, government and natural resources.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04070d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", spaceGrotesk.variable, inter.variable, jetbrainsMono.variable, "font-sans", geist.variable, ibmPlexSans.variable, openSans.variable)}
    >
      <body className="min-h-full flex flex-col bg-abyss text-ink">{children}</body>
    </html>
  );
}
