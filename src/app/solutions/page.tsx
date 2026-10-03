import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getDynamicSolutions, solutionSlug } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Solutions | GeoSAT Solutions",
  description:
    "Comprehensive geospatial survey, enterprise GIS, displacement monitoring, and professional engineering services.",
};

export default function SolutionsPage() {
  const solutions = getDynamicSolutions();

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
      <main className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aqua">
              <Layers className="size-3.5" />
              <span>GeoSAT Capabilities</span>
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-6xl">
              Survey-grade accuracy and actionable spatial intelligence.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-3">
              Explore our turnkey survey solutions, enterprise GIS architectures, geotechnical monitoring systems, and specialized engineering advisory.
            </p>
          </div>

          {/* Grouped Solutions List */}
          <div className="mt-16 space-y-16">
            {groups.map((group) => {
              const items = groupedSolutions[group];
              return (
                <div key={group} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-line pb-4">
                    <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                      {group}
                    </h2>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-ink-3">
                      {items.length} {items.length === 1 ? "solution" : "solutions"}
                    </span>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((solution) => (
                      <Link
                        key={solution.title}
                        href={`/solutions/${solutionSlug(solution.title)}`}
                        className="group flex flex-col justify-between rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-panel/60"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-aqua">
                              {solution.group}
                            </span>
                            <ArrowUpRight
                              className="size-4 text-aqua transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </div>

                          <h3 className="mt-4 font-display text-2xl leading-snug text-ink group-hover:text-aqua transition-colors">
                            {solution.title}
                          </h3>

                          <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            {solution.intro || solution.description}
                          </p>
                        </div>

                        {solution.outcomes && solution.outcomes.length > 0 && (
                          <div className="mt-6 border-t border-line/60 pt-4">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-3 mb-2">
                              Key Deliverables:
                            </p>
                            <ul className="space-y-1.5">
                              {solution.outcomes.slice(0, 2).map((outcome, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-xs text-ink-2"
                                >
                                  <CheckCircle2 className="size-3 text-aqua shrink-0" />
                                  <span className="line-clamp-1">{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}