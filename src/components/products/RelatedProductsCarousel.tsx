"use client";

import { useCallback, useId, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { RelatedProduct } from "@/lib/db/services/product.service";
import { productSlug } from "@/app/products/_lib/product-types";

interface RelatedProductsCarouselProps {
  products: RelatedProduct[];
}

const SCROLL_TOLERANCE_PX = 2;

function getCards(element: HTMLDivElement): HTMLElement[] {
  return Array.from(element.children) as HTMLElement[];
}

function getCardStride(element: HTMLDivElement): number {
  const cards = getCards(element);
  if (cards.length === 0) return 0;
  if (cards.length === 1) return cards[0].getBoundingClientRect().width;

  const first = cards[0].getBoundingClientRect();
  const second = cards[1].getBoundingClientRect();
  return second.left - first.left;
}

function getVisibleCardCount(element: HTMLDivElement): number {
  const cards = getCards(element);
  if (cards.length === 0) return 1;

  const stride = getCardStride(element);
  if (stride <= 0) return 1;

  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = Math.max(0, stride - cardWidth);
  return Math.max(1, Math.round((element.clientWidth + gap) / stride));
}

function getScrollSnapshot(element: HTMLDivElement | null): string {
  if (!element) return "false|false|0";

  const maxScroll = element.scrollWidth - element.clientWidth;
  const canScrollPrev = element.scrollLeft > SCROLL_TOLERANCE_PX;
  const canScrollNext = element.scrollLeft < maxScroll - SCROLL_TOLERANCE_PX;
  const stride = getCardStride(element);
  const index = stride > 0 ? Math.max(0, Math.round(element.scrollLeft / stride)) : 0;

  return `${canScrollPrev}|${canScrollNext}|${index}`;
}

function subscribeToScroll(element: HTMLDivElement | null, onChange: () => void) {
  if (!element) return () => {};

  element.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);

  const observer = new ResizeObserver(onChange);
  observer.observe(element);

  return () => {
    element.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
    observer.disconnect();
  };
}

export function RelatedProductsCarousel({ products }: RelatedProductsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();

  const subscribe = useCallback(
    (onChange: () => void) => subscribeToScroll(trackRef.current, onChange),
    [],
  );

  const getSnapshot = useCallback(() => getScrollSnapshot(trackRef.current), []);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "false|false|0");
  const [canScrollPrevValue, canScrollNextValue, currentIndexValue] = snapshot.split("|");
  const canScrollPrev = canScrollPrevValue === "true";
  const canScrollNext = canScrollNextValue === "true";
  const currentIndex = Number(currentIndexValue) || 0;

  const scrollPage = useCallback(
    (direction: -1 | 1) => {
      const element = trackRef.current;
      if (!element) return;

      const stride = getCardStride(element);
      if (stride <= 0) return;

      const visibleCount = getVisibleCardCount(element);
      const maxIndex = Math.max(0, products.length - visibleCount);
      const activeIndex = Math.min(
        maxIndex,
        Math.max(0, Math.round(element.scrollLeft / stride)),
      );
      const nextIndex = Math.min(
        maxIndex,
        Math.max(0, activeIndex + direction * visibleCount),
      );

      element.scrollTo({ left: nextIndex * stride, behavior: "smooth" });
    },
    [products.length],
  );

  if (products.length === 0) return null;

  return (
    <section
      className="w-full border-t border-slate-200/60 bg-slate-50/50 py-16 lg:py-24"
      aria-labelledby="related-products-heading"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2
            id="related-products-heading"
            className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Related Products
          </h2>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollPage(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous related products"
              aria-controls={trackId}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-teal-500 hover:bg-slate-100 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollPage(1)}
              disabled={!canScrollNext}
              aria-label="Next related products"
              aria-controls={trackId}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-teal-500 hover:bg-slate-100 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          id={trackId}
          data-current-index={currentIndex}
          role="region"
          aria-roledescription="carousel"
          aria-label="Related products"
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, index) => {
            const subSlug = product.subcategory ? productSlug(product.subcategory) : "";
            const href = subSlug
              ? `/products/${subSlug}/${product.slug}`
              : `/products/${product.slug}`;

            return (
              <article
                key={product.id}
                className="group flex shrink-0 basis-full snap-start flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:shadow-md md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-4.5rem)/4)]"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${products.length}`}
              >
                <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-slate-50/80 p-4">
                  {product.thumbnailImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={product.thumbnailImage}
                        alt={product.images?.[0]?.alt || product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <ImageIcon className="size-8 opacity-50" aria-hidden="true" />
                      <span className="text-[11px] font-medium uppercase tracking-wider">
                        GeoSAT Equipment
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="mb-2 line-clamp-1 text-center font-heading text-lg font-bold text-slate-900 transition-colors group-hover:text-teal-600">
                  {product.name}
                </h3>

                <p className="mb-6 flex-1 line-clamp-2 text-center font-sans text-xs leading-relaxed text-slate-500">
                  {product.shortDescription || product.category}
                </p>

                <Link
                  href={href}
                  className="block w-full rounded-full bg-teal-600 py-2.5 text-center font-sans text-xs font-medium text-white transition-colors duration-200 hover:bg-teal-700"
                >
                  View Product
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RelatedProductsCarousel;
