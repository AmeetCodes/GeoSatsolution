import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { getDynamicServices, servicePathSlug } from "./_lib/services";

export const metadata: Metadata = {
  title: "Services | GeoSAT Solutions",
  description:
    "Comprehensive geospatial survey, enterprise GIS, displacement monitoring, and professional engineering services.",
  alternates: {
    canonical: "https://www.geosatsolutions.com.np/services",
  },
  openGraph: {
    title: "Services | GeoSAT Solutions",
    description:
      "Comprehensive geospatial survey, enterprise GIS, displacement monitoring, and professional engineering services.",
    url: "https://www.geosatsolutions.com.np/services",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

export default async function ServicesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [allServices, query] = await Promise.all([getDynamicServices(), searchParams]);
  const searchValue = query.search;
  const search = (Array.isArray(searchValue) ? searchValue[0] : searchValue)?.trim() || "";
  const normalizedSearch = search.toLocaleLowerCase();
  const services = normalizedSearch
    ? allServices.filter((service) => [service.title, service.group, service.intro, service.description, ...service.outcomes]
        .some((value) => value.toLocaleLowerCase().includes(normalizedSearch)))
    : allServices;

  // Group services by group
  const groupedServices = services.reduce((acc, service) => {
    const groupName = service.group || "General Services";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  const groups = Object.keys(groupedServices);

  return (
    <>
      <Navbar />
      <PageTransition className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
              <Layers className="size-3.5" />
              <span>GeoSAT Capabilities</span>
            </div>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink lg:text-5xl">
              Survey-grade accuracy and actionable spatial intelligence.
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-base font-normal leading-relaxed text-slate-600">
              Explore our turnkey survey services, enterprise GIS architectures, geotechnical monitoring systems, and specialized engineering advisory.
            </p>
            <form action="/services" role="search" className="mt-7 flex max-w-xl gap-3">
              <label htmlFor="service-search" className="sr-only">Search services</label>
              <input id="service-search" name="search" type="search" defaultValue={search} placeholder="Search services" className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-4 focus:border-aqua focus:outline-none" />
              <button type="submit" className="rounded-lg bg-aqua px-5 py-3 font-sans text-sm font-medium tracking-normal text-abyss">Search</button>
            </form>
            {search ? <p className="mt-4 font-sans text-sm text-slate-600">{services.length} {services.length === 1 ? "result" : "results"} for “{search}”.</p> : null}
          </div>

          {/* Grouped Services List */}
          <div className="mt-16 space-y-16">
            {groups.length === 0 ? <p className="rounded-xl border border-line p-6 text-sm text-ink-3">No services match your search.</p> : null}
            {groups.map((group) => {
              const items = groupedServices[group];
              return (
                <div key={group} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-line pb-4">
                    <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {group}
                    </h2>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-sans text-xs text-ink-3">
                      {items.length} {items.length === 1 ? "service" : "services"}
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((service) => (
                      <div
                        key={service.title}
                        className="group flex flex-col justify-between rounded-xl border border-line bg-surface/50 p-6 transition-all hover:border-aqua/40 hover:bg-surface"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
                              {service.group}
                            </span>
                            <Link
                              href={`/services/${servicePathSlug(service)}`}
                              className="text-ink-3 transition-colors hover:text-aqua"
                              aria-label={`View details for ${service.title}`}
                            >
                              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                          </div>

                          <h3 className="mt-3 font-heading text-xl font-medium tracking-tight text-ink">
                            <Link
                              href={`/services/${servicePathSlug(service)}`}
                              className="hover:underline"
                            >
                              {service.title}
                            </Link>
                          </h3>

                          <p className="mt-2 font-sans text-sm font-normal leading-relaxed text-slate-600">
                            {service.intro}
                          </p>

                          {service.outcomes && service.outcomes.length > 0 && (
                            <div className="mt-4 border-t border-line/50 pt-3">
                              <p className="font-heading text-xs font-medium uppercase tracking-wider text-slate-500">Key Deliverables:</p>
                              <ul className="mt-2 space-y-1.5">
                                {service.outcomes.slice(0, 2).map((outcome) => (
                                  <li
                                    key={outcome}
                                    className="flex items-start gap-2 font-sans text-xs text-ink-2"
                                  >
                                    <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-aqua" />
                                    <span>{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4">
                          <Link
                            href={`/services/${servicePathSlug(service)}`}
                            className="inline-flex w-full items-center justify-center rounded-lg border border-line bg-surface px-4 py-2 font-sans text-sm font-medium tracking-normal text-ink transition-colors hover:border-aqua/50 hover:bg-aqua/10 hover:text-aqua"
                          >
                            Explore Service
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
