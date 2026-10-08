"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Industry } from "./_lib/industries";

function industryPathSlug(industry: Industry) {
  return industry.slug || industry.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CARD_ART = [
  {
    background: "radial-gradient(circle at 82% 24%, #ff9c48 0 10%, transparent 10.5%), linear-gradient(145deg, #ff1768 0%, #dd0755 56%, #380d39 100%)",
    shape: "left-[7%] top-[34%] h-[54%] w-[82%] -rotate-[13deg] rounded-[2.5rem] bg-gradient-to-br from-[#ff3a73] via-[#e80c5a] to-[#640c48] shadow-[0_28px_45px_rgba(55,0,35,0.45)]",
  },
  {
    background: "linear-gradient(135deg, #87006e 0%, #5c075e 55%, #260d43 100%)",
    shape: "-left-[4%] -top-[58%] h-[150%] w-[84%] rotate-[24deg] rounded-[5rem] border-[3.2rem] border-b-[#ffd328] border-l-[#ff6a16] border-r-[#ff9f12] border-t-[#fb3c16]",
  },
  {
    background: "linear-gradient(145deg, #6000a8 0%, #48007d 60%, #20043a 100%)",
    shape: "-left-[12%] top-[26%] h-[44%] w-[125%] -rotate-[8deg] rounded-[50%] border-[2.5rem] border-[#fa177b] shadow-[0_20px_38px_rgba(28,0,42,0.4)]",
  },
  {
    background: "linear-gradient(145deg, #076b73 0%, #064454 58%, #092139 100%)",
    shape: "left-[18%] top-[4%] h-[85%] w-[64%] rotate-[35deg] rounded-[2rem] bg-gradient-to-br from-[#3de0c1] to-[#087c95] shadow-[0_25px_45px_rgba(0,20,35,0.5)]",
  },
] as const;

export function IndustryCards({ industries }: { industries: Industry[] }) {
  const [activeIndustry, setActiveIndustry] = useState<Industry | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!activeIndustry) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndustry(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [activeIndustry]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {industries.map((industry, index) => {
          const art = CARD_ART[index % CARD_ART.length];
          const coverImage = industry.images?.[0];
          return (
            <motion.button
              key={industry.slug || industry.title}
              type="button"
              onClick={() => setActiveIndustry(industry)}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              className="group relative flex min-h-[270px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-6 text-left shadow-[0_24px_70px_-38px_rgba(0,0,0,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5290] sm:min-h-[290px]"
              style={{ background: art.background }}
              aria-label={`View ${industry.title} industry details`}
            >
              {coverImage?.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage.src} alt={coverImage.alt || industry.title} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : null}
              {!coverImage?.src ? <span aria-hidden="true" className={`pointer-events-none absolute ${art.shape}`} /> : null}
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="relative z-10 flex items-end justify-between gap-4">
                <span className="max-w-[80%] text-xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-2xl">
                  {industry.title}
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors group-hover:bg-white/35">
                  <Plus className="size-5" aria-hidden="true" />
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeIndustry ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => setActiveIndustry(null)}
              className="absolute inset-0 size-full cursor-default"
              aria-label="Close industry details"
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="industry-dialog-title"
              className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-abyss shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
            >
              <div className="relative min-h-[230px] overflow-hidden p-6 sm:min-h-[320px] sm:p-8" style={{ background: CARD_ART[industries.indexOf(activeIndustry) % CARD_ART.length].background }}>
                {activeIndustry.images?.[0]?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeIndustry.images[0].src} alt={activeIndustry.images[0].alt || activeIndustry.title} className="absolute inset-0 size-full object-cover" />
                ) : (
                  <span aria-hidden="true" className={`pointer-events-none absolute ${CARD_ART[industries.indexOf(activeIndustry) % CARD_ART.length].shape}`} />
                )}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <button
                  type="button"
                  onClick={() => setActiveIndustry(null)}
                  className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35"
                  aria-label="Close industry details"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
                <div className="absolute inset-x-6 bottom-6 z-10 sm:inset-x-8 sm:bottom-8">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">GeoSAT · Industry focus</p>
                  <h2 id="industry-dialog-title" className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                    {activeIndustry.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-base leading-7 text-ink-2">{activeIndustry.intro || activeIndustry.description}</p>
                {activeIndustry.description && activeIndustry.description !== activeIndustry.intro ? (
                  <p className="mt-4 text-sm leading-7 text-ink-3">{activeIndustry.description}</p>
                ) : null}
                {activeIndustry.items.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {activeIndustry.items.map((item) => (
                      <li key={item} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-2">{item}</li>
                    ))}
                  </ul>
                ) : null}
                {activeIndustry.images && activeIndustry.images.length > 1 ? (
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {activeIndustry.images.slice(1).map((image, index) => (
                      <figure key={`${image.src}-${index}`} className="overflow-hidden rounded-xl border border-line bg-surface">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.src} alt={image.alt || activeIndustry.title} className="h-36 w-full object-cover" />
                        {image.caption ? <figcaption className="px-3 py-2 text-xs text-ink-3">{image.caption}</figcaption> : null}
                      </figure>
                    ))}
                  </div>
                ) : null}
                <Link
                  href={`/industries/${industryPathSlug(activeIndustry)}`}
                  onClick={() => setActiveIndustry(null)}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#00a884] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#009574]"
                >
                  Explore this industry <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
