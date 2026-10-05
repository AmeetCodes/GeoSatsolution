import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getDynamicCareerRoles } from "@/app/company/_lib/company-content";

export const metadata: Metadata = {
  title: "Careers | GeoSAT Solutions",
  description:
    "Join the GeoSAT team. Explore career opportunities across geospatial surveying, GIS engineering, LiDAR processing, and spatial software.",
  alternates: {
    canonical: "https://geosatsoln.com/company/careers",
  },
  openGraph: {
    title: "Careers | GeoSAT Solutions",
    description:
      "Join the GeoSAT team. Explore career opportunities across geospatial surveying, GIS engineering, LiDAR processing, and spatial software.",
    url: "https://geosatsoln.com/company/careers",
    type: "website",
  },
};

export default async function CareersPage() {
  const roles = await getDynamicCareerRoles();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="max-w-3xl">
            <p className="label text-aqua">Careers</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
              Build the systems that make the ground measurable.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-3">
              We look for people who can move comfortably across field operations, spatial data quality and practical engineering decisions.
            </p>
          </header>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {roles.map((role) => (
              <Link
                key={role.slug}
                href={`/company/careers/${role.slug}`}
                className="group relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-panel/55"
              >
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-ink-3">
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
                    {role.category}
                  </span>
                  <ArrowUpRight className="size-4 text-aqua transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>

                <h2 className="mt-5 font-display text-2xl leading-tight text-ink">{role.title}</h2>
                <div className="mt-4 flex items-center gap-2 text-sm text-ink-3">
                  <MapPin className="size-4 text-aqua/80" aria-hidden="true" />
                  {role.location}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">{role.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
