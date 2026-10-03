"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SolutionImage } from "@/lib/solutions";

export function SolutionGallery({ images }: { images: SolutionImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeImage = images[activeIndex];

  function showImage(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.45)]">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Solution image gallery"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          if (startX === null || endX === undefined) return;
          if (startX - endX > 40) showImage(activeIndex + 1);
          else if (endX - startX > 40) showImage(activeIndex - 1);
          touchStartX.current = null;
        }}
      >
        <div
          role="img"
          aria-label={activeImage.alt}
          className="relative aspect-4/3 overflow-hidden bg-slate-200 bg-cover bg-center transition-[background-image] duration-300 sm:aspect-[1.18/1]"
          style={{ backgroundImage: `url("${activeImage.src}")` }}
        >
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent px-6 pb-6 pt-16 sm:px-8 sm:pb-8">
            <p className="max-w-md font-display text-lg leading-snug text-white sm:text-xl">
              {activeImage.caption}
            </p>
          </div>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => showImage(activeIndex - 1)}
            className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-ink shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => showImage(activeIndex + 1)}
            className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-ink shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-7">
        <span className="text-xs text-ink-3">Project imagery</span>
        <div className="flex items-center gap-2" aria-label="Choose image">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => showImage(index)}
              className={`size-2 rounded-full transition-colors ${activeIndex === index ? "bg-aqua" : "bg-ink-4/50 hover:bg-aqua/60"}`}
            />
          ))}
        </div>
        <span className="text-xs tabular text-ink-3">
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}