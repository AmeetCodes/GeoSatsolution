import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import CircularGallery from "@/components/ui/CircularGallery";
import { Container } from "@/components/ui/Section";
import { Hero } from "./_components/sections/Hero";
import { PartnersClients } from "./_components/sections/PartnersClients";
import { ServicesGrid } from "./_components/sections/ServicesGrid";
import { NepalProjectMap } from "@/components/ui/NepalProjectMap";

export const metadata: Metadata = {
  title: "GeoSAT — Geospatial Survey, LiDAR & Spatial Intelligence",
  description:
    "GeoSAT delivers survey-grade geospatial intelligence: UAV LiDAR, drone photogrammetry, engineering survey, GIS systems and continuous monitoring for infrastructure, government and natural resources.",
  alternates: {
    canonical: "https://geosatsoln.com",
  },
  openGraph: {
    title: "GeoSAT — Geospatial Survey, LiDAR & Spatial Intelligence",
    description:
      "Survey-grade geospatial intelligence for infrastructure, government and natural resources.",
    url: "https://geosatsoln.com",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GeoSAT Solutions",
  url: "https://geosatsoln.com",
  logo: "https://geosatsoln.com/icon.png",
  description:
    "Survey-grade geospatial intelligence, UAV LiDAR mapping, geodetic engineering, GIS solutions and spatial monitoring.",
  sameAs: [
    "https://linkedin.com/company/geosatsoln",
    "https://twitter.com/geosatsoln",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+977-1-5912345",
    contactType: "customer service",
    areaServed: ["NP", "SA"],
    availableLanguage: ["English", "Nepali"],
  },
};

export default function Home() {
  return (
    <>
      {/* Schema.org Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-aqua focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-abyss"
      >
        Skip to content
      </a>

      <Navbar />

      <PageTransition id="main" className="flex-1">
        <Hero />
      </PageTransition>

      <ServicesGrid />

      <PartnersClients />

      <NepalProjectMap />

      <Container className="py-8 sm:py-10">
        <div className="relative h-[600px] w-full">
          <CircularGallery
            bend={1}
            textColor="#111827"
            borderRadius={0.05}
            scrollEase={0.05}
            fontUrl=""
            font="bold 30px Orbitron"
            scrollSpeed={2}
          />
        </div>
      </Container>

      <Footer />
    </>
  );
}
