import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConsultationDialog } from "@/components/ui/ConsultationDialog";
import type { NavTreeColumn, NavTreeTab, PageItem } from "./types";

interface CompanyTemplateProps {
  item: PageItem;
  tab: NavTreeTab;
  column: NavTreeColumn;
}

export function CompanyTemplate({
  item,
  tab,
  column,
}: CompanyTemplateProps) {
  const Icon =
    column.slug === "insights"
      ? BookOpen
      : FileText;

  return (
    <PageTransition className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-ink-3">
          <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-aqua">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Home</span>
          </Link>
          <ChevronRight className="size-3 text-ink-4" />
          <span className="text-ink-3">{tab.label}</span>
          <ChevronRight className="size-3 text-ink-4" />
          <span className="text-aqua font-medium">{column.title}</span>
        </div>

        <article className="mt-10 max-w-3xl">
          <header>
            <div className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aqua">
              <Icon className="size-3.5" />
              <span>{column.title}</span>
            </div>

            <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.25rem]">
              {item.title}
            </h1>

            {item.intro && (
              <p className="mt-6 text-lg leading-relaxed text-ink-2 font-medium">
                {item.intro}
              </p>
            )}

            {item.description && (
              <p className="mt-4 text-base leading-relaxed text-ink-3">
                {item.description}
              </p>
            )}
          </header>

          {/* Key points grid */}
          {item.outcomes && item.outcomes.length > 0 && (
            <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Key points">
              {item.outcomes.map((point: string, idx: number) => (
                <div
                  key={idx}
                  className="rounded-[var(--radius-panel)] border border-line bg-panel/30 p-5 transition-[border-color,background-color] duration-300 hover:border-line-strong hover:bg-panel/55"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-2">{point}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* CTA row */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <ConsultationDialog
              solutionTitle={item.title}
              solutionGroup={column.title}
            />
            <Link
              href="/"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-2 hover:border-line-strong hover:text-ink transition-colors"
            >
              Back to home
            </Link>
          </div>
        </article>
      </div>
    </PageTransition>
  );
}
