"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Plus, X } from "lucide-react";
import type { NewsItem } from "@/app/company/_lib/company-content";

export function NewsMorphingGallery({ items }: { items: NewsItem[] }) {
  const [activeItem, setActiveItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (!activeItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeItem]);

  return (
    <>
      {items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <motion.button
              key={item.slug}
              type="button"
              layoutId={`news-card-${item.slug}`}
              onClick={() => setActiveItem(item)}
              className="group flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 text-left shadow-[0_12px_36px_-24px_rgba(0,0,0,.55)] outline-none transition-colors hover:border-aqua/50 focus-visible:ring-2 focus-visible:ring-aqua"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
            >
              {item.image?.src ? (
                <motion.img
                  layoutId={`news-image-${item.slug}`}
                  src={item.image.src}
                  alt={item.image.alt || item.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-end bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,.22),transparent_55%),linear-gradient(135deg,#102327,#101820)] p-5">
                  <span className="text-xs font-medium uppercase tracking-[.2em] text-aqua/80">GeoSAT field notes</span>
                </div>
              )}
              <div className="flex grow items-end justify-between gap-4 p-5">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-aqua">{item.category}</span>
                  <motion.h2 layoutId={`news-title-${item.slug}`} className="mt-2 line-clamp-2 font-display text-xl leading-tight text-ink">
                    {item.title}
                  </motion.h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-3">{item.excerpt}</p>
                </div>
                <span aria-hidden="true" className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong text-ink-3 transition group-hover:border-aqua/60 group-hover:text-aqua">
                  <Plus className="size-4" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-panel/30 px-6 py-12 text-center text-ink-3">
          News and field notes will appear here when published.
        </div>
      )}

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#071014]/75 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveItem(null); }}
          >
            <motion.article
              layoutId={`news-card-${activeItem.slug}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`news-dialog-title-${activeItem.slug}`}
              className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-line-strong bg-[#f5f5ef] text-slate-900 shadow-2xl"
              transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
            >
              {activeItem.image?.src ? (
                <motion.img layoutId={`news-image-${activeItem.slug}`} src={activeItem.image.src} alt={activeItem.image.alt || activeItem.title} className="max-h-[48vh] min-h-52 w-full object-cover" />
              ) : (
                <div className="h-56 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,.3),transparent_55%),linear-gradient(135deg,#102327,#101820)]" />
              )}
              <button type="button" onClick={() => setActiveItem(null)} aria-label="Close article" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white backdrop-blur transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X className="size-5" />
              </button>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[.13em] text-teal-800">
                  <span>{activeItem.category}</span>
                  <span className="inline-flex items-center gap-1.5 font-normal tracking-normal text-slate-500"><CalendarDays className="size-3.5" />{activeItem.date}</span>
                </div>
                <motion.h2 id={`news-dialog-title-${activeItem.slug}`} layoutId={`news-title-${activeItem.slug}`} className="mt-3 font-display text-3xl leading-tight text-slate-900 sm:text-4xl">
                  {activeItem.title}
                </motion.h2>
                {activeItem.author && <p className="mt-2 text-sm text-slate-500">By {activeItem.author}</p>}
                <p className="mt-5 text-base leading-7 text-slate-700">{activeItem.excerpt}</p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {activeItem.body.map((paragraph, index) => <p key={`${activeItem.slug}-${index}`}>{paragraph}</p>)}
                </div>
                <div className="mt-7 flex justify-end border-t border-slate-200 pt-5">
                  <Link href={`/company/insights/news/${activeItem.slug}`} onClick={() => setActiveItem(null)} className="inline-flex items-center gap-2 rounded-full bg-[#d5b35e] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#e3c575]">
                    Read full article <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
