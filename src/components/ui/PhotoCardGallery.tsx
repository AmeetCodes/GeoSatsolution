"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OUR_WORK_ITEMS } from "@/data/our-work";

export type PhotoCardItem = {
  image: string;
  caption: string;
};

const TILTS = [
  "rotate-0 sm:-rotate-2",
  "rotate-0 sm:rotate-1",
  "rotate-0 sm:-rotate-1",
  "rotate-0 sm:rotate-2",
] as const;
const FALLBACK_GAP = 24;

function subscribeToScroll(element: HTMLDivElement | null, onChange: () => void) {
  if (!element) return () => {};
  element.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    element.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

type PhotoCardGalleryProps = {
  items?: PhotoCardItem[];
  className?: string;
};

export function PhotoCardGallery({ items = OUR_WORK_ITEMS, className }: PhotoCardGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  const subscribe = useCallback(
    (onChange: () => void) => subscribeToScroll(scrollRef.current, onChange),
    [],
  );

  const getSnapshot = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return "false|false";
    const canScrollPrev = element.scrollLeft > 4;
    const canScrollNext = element.scrollLeft + element.clientWidth < element.scrollWidth - 4;
    return `${canScrollPrev}|${canScrollNext}`;
  }, []);

  const canScroll = useSyncExternalStore(subscribe, getSnapshot, () => "false|false");
  const [canScrollPrev, canScrollNext] = canScroll.split("|").map((value) => value === "true");

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const element = scrollRef.current;
    if (!element) return;
    const card = element.querySelector<HTMLElement>("[data-photo-card]");
    const styles = getComputedStyle(element);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || FALLBACK_GAP;
    const step = card ? card.offsetWidth + gap : element.clientWidth * 0.8;
    element.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const element = scrollRef.current;
    if (!element) return;
    drag.current = { active: true, startX: event.clientX, startScroll: element.scrollLeft };
    element.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element || !drag.current.active) return;
    element.scrollLeft = drag.current.startScroll - (event.clientX - drag.current.startX);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    drag.current.active = false;
    if (element?.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data-photo-track
        className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible px-6 py-5 select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [mask-image:none] sm:gap-6 sm:px-0 sm:py-6 sm:[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] lg:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <figure
            key={`${item.caption}-${index}`}
            data-photo-card
            className={cn(
              "group relative flex h-[340px] w-[min(82vw,320px)] shrink-0 snap-center cursor-grab flex-col rounded-2xl border border-slate-200/90 bg-white p-3 shadow-md shadow-slate-900/5 transition-all duration-300 ease-out sm:h-[350px] sm:w-[225px] lg:h-[360px] lg:w-[240px]",
              TILTS[index % TILTS.length],
              "hover:z-20 hover:-translate-y-2 hover:rotate-0 hover:border-slate-400 hover:shadow-2xl hover:shadow-slate-900/15 active:cursor-grabbing",
            )}
          >
            <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 ring-1 ring-inset ring-white/40">
              <Image
                src={item.image}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 225px, 205px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:object-contain"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
            <figcaption className="mt-3 text-center font-heading text-sm font-medium text-slate-800">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollPrev}
          aria-label="Previous photos"
          className="inline-flex size-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollNext}
          aria-label="Next photos"
          className="inline-flex size-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default PhotoCardGallery;
