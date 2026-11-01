import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { IndustryCards } from "./IndustryCards";
import { getDynamicIndustries } from "./_lib/industries";

export const metadata: Metadata = {
  title: "Industries | GeoSAT Solutions",
  description:
    "Specialized geospatial intelligence and surveying solutions tailored for infrastructure, energy, forestry, mining, and government sectors.",
  alternates: {
    canonical: "https://www.geosatsolutions.com.np/industries",
  },
  openGraph: {
    title: "Industries | GeoSAT Solutions",
    description:
      "Specialized geospatial intelligence and surveying solutions tailored for infrastructure, energy, forestry, mining, and government sectors.",
    url: "https://www.geosatsolutions.com.np/industries",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

export default async function IndustriesPage() {
  const industries = await getDynamicIndustries();

  return (
    <>
      <Navbar />
      <PageTransition className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] text-ink sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="mb-10 max-w-3xl sm:mb-14">
            <p className="label text-aqua">Industries</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-ink sm:text-5xl">
              Geospatial insight for every ground truth.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-3">
              Explore how GeoSAT supports infrastructure, government, natural resources and field teams with survey-grade mapping, spatial data and monitoring.
            </p>
          </header>

          {industries.length > 0 ? (
            <IndustryCards industries={industries} />
          ) : (
            <div className="rounded-2xl border border-line bg-surface px-6 py-10 text-sm leading-6 text-ink-2">
              Industry information is being prepared. Please check back soon.
            </div>
          )}
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
