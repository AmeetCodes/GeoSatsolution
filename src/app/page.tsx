import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { PhotoCardGallery } from "@/components/ui/PhotoCardGallery";
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

      <section
        aria-labelledby="field-gallery-heading"
        className="mx-auto my-16 max-w-7xl px-6 lg:px-12"
      >
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-8 shadow-sm md:p-12 lg:p-16">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-300/50 bg-slate-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
              Field Gallery
            </span>
            <h2
              id="field-gallery-heading"
              className="font-serif text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
            >
              Captured in the Field
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 md:text-base">
              Real-world imagery from our surveying, mapping, and monitoring missions across Nepal.
            </p>
          </div>

          <PhotoCardGallery />
        </div>
      </section>

      <Footer />
    </>
  );
}
