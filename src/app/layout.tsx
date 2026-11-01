import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://www.geosatsolutions.com.np"
).replace(/\/+$/, "");

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const ibmPlexSans = localFont({
  src: [{ path: "./fonts/ibm-plex-sans-var-100-700-latin.woff2", weight: "100 700", style: "normal" }],
  variable: "--font-ibm-plex-sans",
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
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    siteName: "GeoSAT Solutions",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "GeoSAT Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GeoSAT — Geospatial Survey, LiDAR & Spatial Intelligence",
    description: "Survey-grade geospatial intelligence for infrastructure, government and natural resources.",
    images: ["/icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#04070d",
  colorScheme: "dark",
};


const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "GeoSAT Solutions",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: "Survey-grade geospatial intelligence, UAV LiDAR mapping, geodetic engineering, GIS solutions and spatial monitoring.",
  sameAs: [
    "https://linkedin.com/company/geosatsoln",
    "https://twitter.com/geosatsoln",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English", "Nepali"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Phulbari Nagar Marg, Koteshwor-32",
    addressLocality: "Kathmandu",
    postalCode: "44600",
    addressCountry: "NP",
  },
  telephone: "+977 9842496370",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GeoSAT Solutions",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/solutions?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        outfit.variable,
        dmSans.variable,
        ibmPlexSans.variable,
        jetbrainsMono.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col bg-abyss text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
