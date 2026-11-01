import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConsultationDialog } from "@/components/ui/ConsultationDialog";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import { SectionBadge } from "./SectionBadge";
import type { NavTreeColumn, NavTreeTab, PageGalleryImage, PageItem } from "./types";

interface SolutionsTemplateProps {
  item: PageItem;
  tab: NavTreeTab;
  column: NavTreeColumn;
  galleryImages: PageGalleryImage[];
}

export function SolutionsTemplate({
  item,
  tab,
  column,
  galleryImages,
}: SolutionsTemplateProps) {
  return (
    <PageTransition className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-sans text-sm text-ink-3">
          <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-aqua">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Home</span>
          </Link>
          <ChevronRight className="size-3 text-ink-4" />
          <span className="text-ink-3">{tab.label}</span>
          <ChevronRight className="size-3 text-ink-4" />
          <span className="font-medium text-aqua">{column.title}</span>
        </div>

        {/* Hero grid */}
        <article className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <header className="max-w-2xl py-2">
            <SectionBadge tabId={tab.id} label={`${tab.label} · ${column.title}`} />

            <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink lg:text-5xl">
              {item.title}
            </h1>

            {item.intro && (
              <p className="mt-6 font-sans text-base font-normal leading-relaxed text-slate-600 lg:text-lg">
                {item.intro}
              </p>
            )}

            {item.description && (
              <p className="mt-4 font-sans text-base leading-relaxed text-slate-600">
                {item.description}
              </p>
            )}

            {/* Outcomes / Key Deliverables */}
            {item.outcomes && item.outcomes.length > 0 && (
              <section className="mt-8 rounded-2xl border border-line bg-panel/30 p-6" aria-label="Key Capabilities">
                <h2 className="mb-4 font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
                  Key Capabilities &amp; Deliverables
                </h2>
                <ul className="space-y-3">
                  {item.outcomes.map((outcome: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-ink-2">
                      <CheckCircle2 className="size-4 text-aqua shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ConsultationDialog
                solutionTitle={item.title}
                solutionGroup={column.title}
              />
              <Link
                href="/request-assessment"
                className="rounded-full border border-line px-6 py-3 font-sans text-sm font-medium tracking-normal text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              >
                Contact engineering team
              </Link>
            </div>
          </header>

          {/* Gallery */}
          <div className="relative">
            <SolutionGallery images={galleryImages} />
          </div>
        </article>
      </div>
    </PageTransition>
  );
}
