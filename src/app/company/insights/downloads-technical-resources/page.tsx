import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getDynamicResources } from "@/app/company/_lib/company-content";
import { ResourceMorphingGallery } from "@/components/ui/resource-morphing-gallery";

export const metadata: Metadata = {
  title: "Downloads & Technical Resources | GeoSAT Solutions",
  description:
    "Field-ready documents, technical specifications, and operational manuals for surveying, LiDAR, GIS and geodetic instrumentation.",
  alternates: {
    canonical: "https://geosatsoln.com/company/insights/downloads-technical-resources",
  },
  openGraph: {
    title: "Downloads & Technical Resources | GeoSAT Solutions",
    description:
      "Field-ready documents, technical specifications, and operational manuals for surveying, LiDAR, GIS and geodetic instrumentation.",
    url: "https://geosatsoln.com/company/insights/downloads-technical-resources",
    type: "website",
  },
};

export default async function DownloadsTechnicalResourcesPage() {
  const resources = await getDynamicResources();
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="max-w-3xl">
            <p className="label text-aqua">Insights</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
              Downloads &amp; Technical Resources
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-3">
              Field-ready documents, technical references and operational guides for teams working with survey, LiDAR, GIS and geospatial data workflows.
            </p>
          </header>

          <div className="mt-10">
            <ResourceMorphingGallery items={resources} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
