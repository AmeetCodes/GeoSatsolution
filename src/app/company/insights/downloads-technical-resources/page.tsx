import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download, Folder } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RESOURCE_DOCUMENTS } from "@/app/company/_lib/company-content";

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

export default function DownloadsTechnicalResourcesPage() {
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

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {RESOURCE_DOCUMENTS.map((document) => (
              <div
                key={document.slug}
                className="rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 transition-colors duration-300 hover:border-line-strong hover:bg-panel/55"
              >
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-ink-3">
                  <span className="inline-flex items-center gap-2">
                    <Folder className="size-3.5" aria-hidden="true" />
                    {document.category}
                  </span>
                  <span className="text-ink-3">Updated {document.updated}</span>
                </div>

                <h2 className="mt-5 font-display text-2xl leading-tight text-ink">{document.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">{document.summary}</p>

                <Link
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-aqua transition-colors hover:text-aqua-bright"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download resource
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
