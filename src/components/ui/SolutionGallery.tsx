"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { imageFocalPositionCss, type ImageFitMode, type ImageFocalPosition } from "@/lib/content-types";
import { cn } from "@/lib/utils";

export type SolutionImage = {
  src: string;
  alt: string;
  caption?: string;
  order?: number;
  fitMode?: ImageFitMode;
  focalPosition?: ImageFocalPosition;
};

export function SolutionGallery({
  images,
  className,
  frameClassName,
}: {
  images: SolutionImage[];
  className?: string;
  frameClassName?: string;
}) {
  const sortedImages = useMemo(
    () => [...(images || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const safeIndex = sortedImages.length > 0 ? Math.min(activeIndex, sortedImages.length - 1) : 0;
  const activeImage = sortedImages[safeIndex];
  const fitMode = activeImage?.fitMode ?? "contain";
  const focalCss = imageFocalPositionCss(activeImage?.focalPosition);

  function showImage(index: number) {
    if (sortedImages.length === 0) return;
    setActiveIndex((index + sortedImages.length) % sortedImages.length);
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + sortedImages.length) % sortedImages.length);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % sortedImages.length);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, sortedImages.length]);

  const frameClasses = cn(
    "relative w-full aspect-[4/3] lg:aspect-[16/11] xl:aspect-[4/3] min-h-[420px] lg:min-h-[480px] xl:min-h-[540px] rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-950 shadow-2xl group flex flex-col justify-between",
    frameClassName,
    className,
  );

  if (!activeImage) {
    return (
      <div className={cn(frameClasses, "flex items-center justify-center bg-slate-100 text-sm text-slate-500")}>
        <span role="img" aria-label="No images have been added for this page">
          No images available
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Solution image gallery"
        className={frameClasses}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          if (startX === null || endX === undefined) return;
          if (startX - endX > 40) showImage(safeIndex + 1);
          else if (endX - startX > 40) showImage(safeIndex - 1);
          touchStartX.current = null;
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- gallery images are content-provided URLs */}
        <img
          key={`ambient-${activeImage.src}`}
          src={activeImage.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-50 select-none pointer-events-none"
        />

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open ${activeImage.alt || "image"} in full screen`}
          className="absolute inset-0 z-10 block h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- gallery images are content-provided URLs */}
          <img
            key={`foreground-${activeImage.src}`}
            src={activeImage.src}
            alt={activeImage.alt}
            style={{ objectFit: fitMode || "contain", objectPosition: focalCss || "center" }}
            className="relative z-10 w-full h-full p-3 transition-transform duration-500 group-hover:scale-[1.02]"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
        </button>

        <button
          type="button"
          aria-label="Previous image"
          onClick={() => showImage(safeIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white text-slate-900 shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => showImage(safeIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white text-slate-900 shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>

        <div className="absolute bottom-5 left-6 right-6 z-20 flex items-center justify-between gap-4 text-white sm:bottom-6 sm:left-8 sm:right-8">
          <span className="min-w-0 flex-1 break-words text-base font-semibold leading-snug tracking-normal text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-lg">
            {activeImage.caption || activeImage.alt || "Project imagery"}
          </span>
          <div className="flex shrink-0 items-center gap-1.5" aria-label="Choose image">
            {sortedImages.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={safeIndex === index ? "true" : undefined}
                onClick={() => showImage(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  safeIndex === index ? "w-6 bg-teal-400" : "w-2 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
          <span className="shrink-0 text-sm font-medium tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {String(safeIndex + 1).padStart(2, "0")} / {String(sortedImages.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <button
            type="button"
            aria-label="Close image preview"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <div
            className="flex max-h-full w-full max-w-6xl flex-col items-center justify-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox images are content-provided URLs */}
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-h-[80vh] w-auto max-w-full object-contain drop-shadow-2xl"
            />
            {(activeImage.caption || activeImage.alt) && (
              <p className="max-w-2xl text-center text-sm font-medium text-white/80">
                {activeImage.caption || activeImage.alt}
              </p>
            )}
            {sortedImages.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => showImage(safeIndex - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <span className="text-xs tabular-nums text-white/60">
                  {String(safeIndex + 1).padStart(2, "0")} / {String(sortedImages.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => showImage(safeIndex + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
