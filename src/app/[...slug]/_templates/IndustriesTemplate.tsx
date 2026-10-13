import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConsultationDialog } from "@/components/ui/ConsultationDialog";

interface IndustriesTemplateProps {
  item: any;
  tab: any;
  column: any;
}

export function IndustriesTemplate({
  item,
  tab,
  column,
}: IndustriesTemplateProps) {
  return (
    <PageTransition className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Link
          href={`/${tab.slug}`}
          className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All {tab.label}
        </Link>

        <article className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
          <header className="max-w-xl py-2">
            <p className="label text-aqua">Sector focus · {column.title}</p>
            <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.8rem]">
              {item.title}
            </h1>
            {item.intro && (
              <p className="mt-6 font-display text-xl leading-relaxed text-ink-2 sm:text-2xl">
                {item.intro}
              </p>
            )}
            {item.description && (
              <p className="mt-5 max-w-lg text-base leading-7 text-ink-3">
                {item.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ConsultationDialog
                solutionTitle={item.title}
                solutionGroup={column.title}
              />
              <Link
                href={`/${tab.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-strong hover:bg-white/[0.04]"
              >
                View all industries
              </Link>
            </div>
          </header>

          {/* Use cases card */}
          <section className="rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 sm:p-8" aria-label="Use cases & applications">
            <p className="label text-aqua">Use cases &amp; applications</p>
            {item.outcomes && item.outcomes.length > 0 ? (
              <ul className="mt-6 grid gap-3">
                {item.outcomes.map((useCase: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-white/[0.02] p-4"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-2">{useCase}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-ink-3">
                Contact our sector team to explore tailored solutions for this industry.
              </p>
            )}
          </section>
        </article>
      </div>
    </PageTransition>
  );
}
