import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConsultationDialog } from "@/components/ui/ConsultationDialog";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import { SectionBadge } from "./SectionBadge";
import type { NavTreeColumn, NavTreeTab, PageGalleryImage, PageItem } from "./types";

interface FallbackTemplateProps {
  item: PageItem;
  tab?: NavTreeTab;
  column?: NavTreeColumn;
  galleryImages: PageGalleryImage[];
}

export function FallbackTemplate({
  item,
  tab,
  column,
  galleryImages,
}: FallbackTemplateProps) {
  return (
    <PageTransition className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 text-sm text-ink-3">
          <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-aqua">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Home</span>
          </Link>
          {tab && (
            <>
              <ChevronRight className="size-3 text-ink-4" />
              <span className="text-ink-3">{tab.label}</span>
            </>
          )}
          {column && (
            <>
              <ChevronRight className="size-3 text-ink-4" />
              <span className="text-aqua font-medium">{column.title}</span>
            </>
          )}
        </div>

        <article className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <header className="max-w-2xl py-2">
            {tab && (
              <SectionBadge
                tabId={tab.id}
                label={tab.label + (column ? ` · ${column.title}` : "")}
              />
            )}

            <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.5rem]">
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

            {item.outcomes && item.outcomes.length > 0 && (
              <section className="mt-8 rounded-2xl border border-line bg-panel/30 p-6" aria-label="Key Points">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-aqua mb-4">
                  Key Points
                </h2>
                <ul className="space-y-3">
                  {item.outcomes.map((o: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink-2">
                      <CheckCircle2 className="size-4 text-aqua shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ConsultationDialog
                solutionTitle={item.title}
                solutionGroup={column?.title || tab?.label || "General"}
              />
            </div>
          </header>

          <div className="relative">
            <SolutionGallery images={galleryImages} />
          </div>
        </article>
      </div>
    </PageTransition>
  );
}
