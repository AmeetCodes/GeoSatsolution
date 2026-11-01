import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { getDynamicSolutions, solutionPathSlug } from "./_lib/solutions";

export const metadata: Metadata = {
  title: "Solutions | GeoSAT Solutions",
  description:
    "Comprehensive geospatial survey, enterprise GIS, displacement monitoring, and professional engineering services.",
  alternates: {
    canonical: "https://www.geosatsolutions.com.np/solutions",
  },
  openGraph: {
    title: "Solutions | GeoSAT Solutions",
    description:
      "Comprehensive geospatial survey, enterprise GIS, displacement monitoring, and professional engineering services.",
    url: "https://www.geosatsolutions.com.np/solutions",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

export default async function SolutionsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [allSolutions, query] = await Promise.all([getDynamicSolutions(), searchParams]);
  const searchValue = query.search;
  const search = (Array.isArray(searchValue) ? searchValue[0] : searchValue)?.trim() || "";
  const normalizedSearch = search.toLocaleLowerCase();
  const solutions = normalizedSearch
    ? allSolutions.filter((solution) => [solution.title, solution.group, solution.intro, solution.description, ...solution.outcomes]
        .some((value) => value.toLocaleLowerCase().includes(normalizedSearch)))
    : allSolutions;

  // Group solutions by group
  const groupedSolutions = solutions.reduce((acc, solution) => {
    const groupName = solution.group || "General Solutions";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(solution);
    return acc;
  }, {} as Record<string, typeof solutions>);

  const groups = Object.keys(groupedSolutions);

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
              Explore our turnkey survey solutions, enterprise GIS architectures, geotechnical monitoring systems, and specialized engineering advisory.
            </p>
            <form action="/solutions" role="search" className="mt-7 flex max-w-xl gap-3">
              <label htmlFor="solution-search" className="sr-only">Search solutions</label>
              <input id="solution-search" name="search" type="search" defaultValue={search} placeholder="Search solutions" className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-4 focus:border-aqua focus:outline-none" />
              <button type="submit" className="rounded-lg bg-aqua px-5 py-3 font-sans text-sm font-medium tracking-normal text-abyss">Search</button>
            </form>
            {search ? <p className="mt-4 font-sans text-sm text-slate-600">{solutions.length} {solutions.length === 1 ? "result" : "results"} for “{search}”.</p> : null}
          </div>

          {/* Grouped Solutions List */}
          <div className="mt-16 space-y-16">
            {groups.length === 0 ? <p className="rounded-xl border border-line p-6 text-sm text-ink-3">No solutions match your search.</p> : null}
            {groups.map((group) => {
              const items = groupedSolutions[group];
              return (
                <div key={group} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-line pb-4">
                    <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {group}
                    </h2>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-sans text-xs text-ink-3">
                      {items.length} {items.length === 1 ? "solution" : "solutions"}
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((solution) => (
                      <div
                        key={solution.title}
                        className="group flex flex-col justify-between rounded-xl border border-line bg-surface/50 p-6 transition-all hover:border-aqua/40 hover:bg-surface"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
                              {solution.group}
                            </span>
                            <Link
                              href={`/solutions/${solutionPathSlug(solution)}`}
                              className="text-ink-3 transition-colors hover:text-aqua"
                              aria-label={`View details for ${solution.title}`}
                            >
                              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                          </div>

                          <h3 className="mt-3 font-heading text-xl font-medium tracking-tight text-ink">
                            <Link
                              href={`/solutions/${solutionPathSlug(solution)}`}
                              className="hover:underline"
                            >
                              {solution.title}
                            </Link>
                          </h3>

                          <p className="mt-2 font-sans text-sm font-normal leading-relaxed text-slate-600">
                            {solution.intro}
                          </p>

                          {solution.outcomes && solution.outcomes.length > 0 && (
                            <div className="mt-4 border-t border-line/50 pt-3">
                              <p className="font-heading text-xs font-medium uppercase tracking-wider text-slate-500">Key Deliverables:</p>
                              <ul className="mt-2 space-y-1.5">
                                {solution.outcomes.slice(0, 2).map((outcome) => (
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
                            href={`/solutions/${solutionPathSlug(solution)}`}
                            className="inline-flex w-full items-center justify-center rounded-lg border border-line bg-surface px-4 py-2 font-sans text-sm font-medium tracking-normal text-ink transition-colors hover:border-aqua/50 hover:bg-aqua/10 hover:text-aqua"
                          >
                            Explore Solution
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
