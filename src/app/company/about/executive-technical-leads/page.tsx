import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { getDynamicLeaders } from "@/app/company/_lib/company-content";
import { TeamLeadCard } from "./_components/TeamLeadCard";

export const metadata: Metadata = {
  title: "Executive & Technical Leads | GeoSAT Solutions",
  description: "Meet the executive and engineering leadership team guiding GeoSAT geospatial intelligence.",
  alternates: {
    canonical: "https://www.geosatsolutions.com.np/company/about/executive-technical-leads",
  },
  openGraph: {
    title: "Executive & Technical Leads | GeoSAT Solutions",
    description: "Meet the executive and engineering leadership team guiding GeoSAT geospatial intelligence.",
    url: "https://www.geosatsolutions.com.np/company/about/executive-technical-leads",
    type: "website",
  },
};

export default async function ExecutiveTechnicalLeadsPage() {
  const leaders = await getDynamicLeaders();

  return (
    <>
      <Navbar />

      <PageTransition className="flex-1">
        <section className="relative isolate flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-[#0B1120] py-20 lg:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <header className="flex flex-col justify-center lg:col-span-5">
              <p className="mb-3 block text-xs font-bold uppercase tracking-widest text-teal-400">
                GeoSAT · Leadership
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Executive &amp; Technical Leads
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">
                Meet the people guiding our surveying, geospatial engineering, and spatial intelligence work.
                Our leadership team brings together deep local knowledge and technical experience to deliver
                reliable information for complex decisions.
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                From field operations and remote sensing to enterprise GIS, these leaders help teams turn
                accurate data into lasting value for communities, partners, and clients.
              </p>
              <Link
                href="/leadership"
                className="group mt-8 inline-flex items-center gap-2.5 self-start rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/50 transition-all duration-200 hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
              >
                View All Team Members <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </header>

            {leaders.length > 0 ? (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3" aria-label="Leadership team">
                {leaders.map((leader, index) => (
                  <TeamLeadCard key={leader.id || `${leader.name}-${index}`} leader={leader} />
                ))}
              </ul>
            ) : (
              <div className="flex min-h-72 items-center rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-10 text-slate-400 lg:col-span-7">
                Leadership profiles will appear here once they have been added in the admin panel.
              </div>
            )}
          </div>
        </section>
      </PageTransition>

      <Footer />
    </>
  );
}
