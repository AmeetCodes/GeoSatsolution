"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectPhotoGallery({
  images,
  title,
  className,
}: {
  images: string[];
  title: string;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const activeImage = isOpen ? images[openIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowLeft") {
        setOpenIndex((index) =>
          index === null ? index : (index - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setOpenIndex((index) =>
          index === null ? index : (index + 1) % images.length,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [images.length, isOpen]);

  return (
    <>
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open ${title} ${index === 0 ? "cover photo" : `photo ${index + 1}`} in full screen`}
            className="group relative aspect-[4/3] overflow-hidden border border-slate-200 bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            <Image
              src={src}
              alt={`${title} ${index === 0 ? "cover photo" : `photo ${index + 1}`}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-2 sm:p-3"
            />
          </button>
        ))}
      </div>

      {isOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 p-4 backdrop-blur-md sm:p-6"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 text-white">
            <span className="text-xs font-medium tabular-nums text-white/70">
              {String(openIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Close image preview"
              onClick={() => setOpenIndex(null)}
              className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center py-4"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox images are content-provided URLs */}
            <img
              src={activeImage}
              alt={`${title} ${openIndex === 0 ? "cover photo" : `photo ${openIndex + 1}`}`}
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    setOpenIndex(
                      (openIndex - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute left-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-900/70 text-white backdrop-blur-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() =>
                    setOpenIndex((openIndex + 1) % images.length)
                  }
                  className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-900/70 text-white backdrop-blur-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          <p className="shrink-0 text-center text-xs text-white/50">
            Use the arrow keys to browse · Press Esc to close
          </p>
        </div>
      )}
    </>
  );
}
