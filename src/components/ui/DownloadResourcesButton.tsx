"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowDownToLine, FileText, X } from "lucide-react";
import type { ProductDownloadItem } from "@/lib/data-store";
import { PopButton } from "@/components/ui/pop-button";
import { cn } from "@/lib/utils";

type DownloadResourcesButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  resources?: ProductDownloadItem[];
  productTitle?: string;
  label?: string;
};

export function DownloadResourcesButton({
  resources = [],
  productTitle = "Product",
  label = "Download Resources",
  className,
  type = "button",
  ...buttonProps
}: DownloadResourcesButtonProps) {
  const [open, setOpen] = useState(false);
  const triggerElement = useRef<HTMLElement | null>(null);
  const savedScrollY = useRef(0);
  const savedBodyStyles = useRef<{ position: string; top: string; left: string; right: string; width: string; overflow: string; htmlOverflow: string } | null>(null);
  const availableResources = resources.filter((resource) => resource.fileUrl);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const openDialog = () => {
    triggerElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    savedScrollY.current = window.scrollY;
    savedBodyStyles.current = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
    };
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    const previous = savedBodyStyles.current;
    if (previous) {
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.left = previous.left;
      document.body.style.right = previous.right;
      document.body.style.width = previous.width;
      document.body.style.overflow = previous.overflow;
      document.documentElement.style.overflow = previous.htmlOverflow;
      window.scrollTo({ top: savedScrollY.current, behavior: "instant" });
      savedBodyStyles.current = null;
    }
    requestAnimationFrame(() => triggerElement.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <>
    <PopButton
      {...buttonProps}
      type={type}
      aria-haspopup="dialog"
      aria-label={`${label} for ${productTitle}`}
      className={cn("px-6 py-3 text-xs sm:px-7 sm:py-3.5 sm:text-sm", className)}
      onClick={openDialog}
    >
      {label}
    </PopButton>
    {mounted && open && createPortal(
      <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-md sm:p-8" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="product-downloads-title" className="relative my-auto max-h-[min(85vh,760px)] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-[#f7f7f2] text-slate-900 shadow-[0_30px_100px_-30px_rgba(0,0,0,.65)] animate-in fade-in-0 zoom-in-95 duration-200">
          <header className="border-b border-slate-200 px-6 py-6 pr-16 sm:px-8 sm:py-7">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-teal-700">Product downloads</p>
            <h2 id="product-downloads-title" className="mt-2 font-display text-2xl leading-tight text-slate-900 sm:text-3xl">{productTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Download product brochures, specifications, manuals, and other files provided by our team.</p>
          </header>
          <button type="button" onClick={closeDialog} aria-label="Close downloads" autoFocus className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><X className="size-4" /></button>
          <div className="space-y-2 p-6 sm:p-7">
            {availableResources.length ? availableResources.map((resource, index) => <a key={`${resource.fileMediaId || resource.fileUrl}-${index}`} href={resource.fileUrl} download={resource.fileName || undefined} target={resource.fileUrl.startsWith("http") ? "_blank" : undefined} rel={resource.fileUrl.startsWith("http") ? "noreferrer" : undefined} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-500/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><FileText className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{resource.title}</span><span className="mt-1 block truncate text-xs text-slate-500">{resource.fileName || "Open or download file"}</span></span>
              <ArrowDownToLine className="size-4 shrink-0 text-slate-400 transition group-hover:text-teal-700" />
            </a>) : <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-5 py-8 text-center"><FileText className="mx-auto size-8 text-slate-400" /><p className="mt-3 text-sm font-medium text-slate-700">Product files are being prepared.</p><p className="mt-1 text-xs leading-5 text-slate-500">Contact our equipment team if you need specifications or a brochure.</p></div>}
          </div>
        </section>
      </div>,
      document.body,
    )}
  </>;
}
