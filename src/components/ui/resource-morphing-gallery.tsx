"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, CalendarDays, FileText, Folder, Plus, X } from "lucide-react";
import type { ResourceDocument } from "@/app/company/_lib/company-content";

export function ResourceMorphingGallery({ items }: { items: ResourceDocument[] }) {
  const [active, setActive] = useState<ResourceDocument | null>(null);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setActive(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [active]);

  return <>
    {items.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => <motion.button key={item.slug} type="button" layoutId={`resource-${item.slug}`} onClick={() => setActive(item)} whileHover={{ y: -3 }} transition={{ type: "spring", bounce: 0.05, duration: 0.25 }} className="group flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 text-left shadow-[0_12px_36px_-24px_rgba(0,0,0,.55)] outline-none transition-colors hover:border-aqua/50 focus-visible:ring-2 focus-visible:ring-aqua">
        {item.thumbnail?.src ? <motion.img layoutId={`resource-image-${item.slug}`} src={item.thumbnail.src} alt={item.thumbnail.alt || item.title} className="h-48 w-full object-cover" /> : <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,.22),transparent_55%),linear-gradient(135deg,#102327,#101820)]"><FileText className="size-16 text-aqua/50 transition-transform duration-300 group-hover:scale-105" strokeWidth={1.2} /><span className="absolute bottom-4 left-5 text-[10px] font-medium uppercase tracking-[.2em] text-aqua/80">Technical resource</span></div>}
        <div className="flex grow items-end justify-between gap-4 p-5"><div className="min-w-0"><span className="text-[10px] font-semibold uppercase tracking-[.16em] text-aqua">{item.category}</span><motion.h2 layoutId={`resource-title-${item.slug}`} className="mt-2 line-clamp-2 font-display text-xl leading-tight text-ink">{item.title}</motion.h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-3">{item.summary || "Open for file details and download."}</p></div><span aria-hidden="true" className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong text-ink-3 transition group-hover:border-aqua/60 group-hover:text-aqua"><Plus className="size-4" /></span></div>
      </motion.button>)}
    </div> : <div className="rounded-2xl border border-line bg-panel/30 px-6 py-12 text-center text-ink-3">Technical resources will appear here when published.</div>}

    <AnimatePresence>{active && <motion.div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#071014]/75 p-4 backdrop-blur-sm sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setActive(null); }}>
      <motion.article layoutId={`resource-${active.slug}`} role="dialog" aria-modal="true" aria-labelledby={`resource-title-dialog-${active.slug}`} className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-line-strong bg-[#f5f5ef] text-slate-900 shadow-2xl" transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}>
        {active.thumbnail?.src ? <motion.img layoutId={`resource-image-${active.slug}`} src={active.thumbnail.src} alt={active.thumbnail.alt || active.title} className="max-h-[42vh] min-h-48 w-full object-cover" /> : <div className="flex h-48 items-center justify-center bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,.3),transparent_55%),linear-gradient(135deg,#102327,#101820)]"><FileText className="size-16 text-aqua/65" strokeWidth={1.2} /></div>}
        <button type="button" onClick={() => setActive(null)} aria-label="Close resource details" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white backdrop-blur transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X className="size-5" /></button>
        <div className="p-6 sm:p-8"><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[.13em] text-teal-800"><span className="inline-flex items-center gap-1.5"><Folder className="size-3.5" />{active.category}</span><span className="inline-flex items-center gap-1.5 font-normal tracking-normal text-slate-500"><CalendarDays className="size-3.5" />Updated {active.updated}</span></div>
          <motion.h2 id={`resource-title-dialog-${active.slug}`} layoutId={`resource-title-${active.slug}`} className="mt-3 font-display text-3xl leading-tight text-slate-900 sm:text-4xl">{active.title}</motion.h2>
          <p className="mt-5 whitespace-pre-line text-base leading-7 text-slate-700">{active.summary || "Download this GeoSAT technical resource for details."}</p>
          {active.fileName && <p className="mt-4 truncate rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">File: {active.fileName}</p>}
          <div className="mt-7 flex justify-end border-t border-slate-200 pt-5">{active.fileUrl ? <a href={active.fileUrl} download={active.fileName || undefined} target={active.fileUrl.startsWith("http") ? "_blank" : undefined} rel={active.fileUrl.startsWith("http") ? "noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full bg-[#d5b35e] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#e3c575"><ArrowDownToLine className="size-4" />Download resource</a> : <span className="text-sm text-slate-500">No download file is attached yet.</span>}</div>
        </div>
      </motion.article>
    </motion.div>}</AnimatePresence>
  </>;
}
