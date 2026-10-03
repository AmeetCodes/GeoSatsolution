import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { INDUSTRIES, industrySlug, getDynamicIndustries } from "./_lib/industries";

export const metadata: Metadata = {
  title: "Industries | GeoSAT Solutions",
  description:
    "Specialized geospatial intelligence and surveying solutions tailored for infrastructure, energy, forestry, mining, and government sectors.",
  alternates: {
    canonical: "https://geosatsoln.com/industries",
  },
  openGraph: {
    title: "Industries | GeoSAT Solutions",
    description:
      "Specialized geospatial intelligence and surveying solutions tailored for infrastructure, energy, forestry, mining, and government sectors.",
    url: "https://geosatsoln.com/industries",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

export default function IndustriesPage() {
  const industries = getDynamicIndustries();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="max-w-3xl">
            <p className="label text-aqua">Industries</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
              Sector intelligence for the work that cannot afford a weak baseline.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-3">
              We map geospatial data to the realities of each sector, so the outputs match the decisions teams actually need to make.
            </p>
          </header>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {industries.map((industry, index) => (
              <Link
                key={industry.title}
                href={`/industries/${industrySlug(industry.title)}`}
                className="group relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-panel/55"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-[radial-gradient(circle,rgba(60,227,214,0.12),transparent_72%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-white/[0.03] text-xs font-medium tracking-[0.18em] text-aqua">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="size-4 text-aqua transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </div>

                  <h2 className="mt-6 font-display text-2xl leading-tight text-ink">{industry.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-ink-2">{industry.intro}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {industry.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.08em] text-ink-3"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
