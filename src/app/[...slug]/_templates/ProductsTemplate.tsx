import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { DownloadResourcesButton } from "@/components/ui/DownloadResourcesButton";
import { ProductBuyDialog } from "@/components/ui/ProductBuyDialog";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import type { NavTreeColumn, NavTreeTab, PageGalleryImage, PageItem } from "./types";

interface ProductsTemplateProps {
  item: PageItem;
  tab: NavTreeTab;
  column: NavTreeColumn;
  galleryImages: PageGalleryImage[];
}

export function ProductsTemplate({
  item,
  tab,
  column,
  galleryImages,
}: ProductsTemplateProps) {
  return (
    <PageTransition className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Back link */}
        <Link
          href={`/${tab.slug}`}
          className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All {tab.label}
        </Link>

        {/* Hero grid */}
        <article className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <header className="max-w-xl py-2">
            <p className="label text-aqua">
              {column.title} · GeoSAT Product
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.75rem]">
              {item.title}
            </h1>
            {item.intro && (
              <p className="mt-6 font-display text-xl leading-relaxed text-ink-2 sm:text-2xl">
                {item.intro}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <ProductBuyDialog productTitle={item.title} productGroup={column.title} />
              <p className="max-w-60 text-xs leading-relaxed text-ink-3">
                Request configuration and pricing for this product.
              </p>
            </div>

            {item.resources && item.resources.length > 0 && (
              <div className="mt-5">
                <DownloadResourcesButton productTitle={item.title} resources={item.resources} />
              </div>
            )}

            {item.brandUrl && (
              <div className="mt-4">
                <a
                  href={item.brandUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel/40 px-3 py-1.5 text-xs font-semibold text-aqua transition-colors hover:bg-aqua/10"
                >
                  <span>Official {item.brand || "Manufacturer"} Website</span>
                </a>
              </div>
            )}

            {item.description && (
              <p className="mt-5 max-w-lg text-base leading-7 text-ink-3">
                {item.description}
              </p>
            )}
          </header>

          <SolutionGallery images={galleryImages} />
        </article>

        {/* Specs / Deliverables */}
        {item.outcomes && item.outcomes.length > 0 && (
          <section
            className="mt-16 border-t border-line pt-9 sm:mt-20 sm:pt-12"
            aria-labelledby="product-specs-heading"
          >
            <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
              <div>
                <p className="label text-aqua">What you get</p>
                <h2
                  id="product-specs-heading"
                  className="mt-4 max-w-sm font-display text-3xl leading-tight text-ink"
                >
                  Key features &amp; practical value.
                </h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {item.outcomes.map((outcome: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex min-h-16 items-start gap-3 border-b border-line py-4 text-sm leading-relaxed text-ink-2"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
