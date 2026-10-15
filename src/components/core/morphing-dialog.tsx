"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Transition, type Variants } from "framer-motion";
import { X } from "lucide-react";

type DialogContextValue = { open: boolean; setOpen: (open: boolean) => void };
const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const value = useContext(DialogContext);
  if (!value) throw new Error("Morphing dialog parts must be used inside MorphingDialog.");
  return value;
}

export function MorphingDialog({ children, transition }: { children: ReactNode; transition?: Transition }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <div className="h-full">{children}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={transition}
            onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
          >
            <motion.div
              role="dialog" aria-modal="true"
              initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={transition}
              className="relative my-auto w-full max-w-2xl"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

export function MorphingDialogTrigger({ children, className, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDialog();
  return <button type="button" {...props} style={style} className={className} onClick={() => setOpen(true)}>{children}</button>;
}

export function MorphingDialogContainer({ children }: { children: ReactNode }) {
  const { open } = useDialog();
  return open ? <>{children}</> : null;
}

export function MorphingDialogContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open } = useDialog();
  return open ? <div {...props} className={className}>{children}</div> : null;
}

export function MorphingDialogTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const { open } = useDialog();
  return open ? <h2 {...props} className={className}>{children}</h2> : <h3 {...props} className={className}>{children}</h3>;
}

export function MorphingDialogSubtitle({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={className}>{children}</p>;
}

type MorphingDialogDescriptionProps = Omit<HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> & { variants?: Variants; disableLayoutAnimation?: boolean };

export function MorphingDialogDescription({ children, className, variants, ...props }: MorphingDialogDescriptionProps) {
  const { open } = useDialog();
  return open ? <motion.div {...props} className={className} variants={variants} initial="initial" animate="animate" exit="exit">{children}</motion.div> : null;
}

export function MorphingDialogImage({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element -- passthrough wrapper for arbitrary caller-supplied images
  return <img alt="" {...props} className={className} />;
}

export function MorphingDialogClose({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDialog();
  return <button {...props} type="button" aria-label={props["aria-label"] || "Close dialog"} onClick={() => setOpen(false)} className={`absolute right-4 top-4 z-10 rounded-full bg-slate-950/60 p-2 text-white transition hover:bg-slate-950 ${className}`}><X className="size-4" aria-hidden="true" /></button>;
}
