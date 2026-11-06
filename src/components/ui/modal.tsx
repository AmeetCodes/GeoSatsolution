"use client";

import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
} as const;

const openModalClosers: Array<() => void> = [];

type ModalSize = keyof typeof sizeClasses;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  size?: ModalSize;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  ariaLabel?: string;
  closeLabel?: string;
  hideCloseButton?: boolean;
  zIndexClassName?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  eyebrow,
  children,
  footer,
  onSubmit,
  size = "2xl",
  className,
  bodyClassName,
  footerClassName,
  ariaLabel,
  closeLabel = "Close dialog",
  hideCloseButton = false,
  zIndexClassName = "z-[100]",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });

    const closeThisModal = () => onCloseRef.current();
    openModalClosers.push(closeThisModal);
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || openModalClosers.at(-1) !== closeThisModal) return;
      event.preventDefault();
      event.stopPropagation();
      closeThisModal();
    }

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown, true);
      const stackIndex = openModalClosers.lastIndexOf(closeThisModal);
      if (stackIndex !== -1) openModalClosers.splice(stackIndex, 1);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!mounted || !open) return null;

  const content = (
    <>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5",
          bodyClassName,
        )}
      >
        {children}
      </div>
      {footer ? (
        <div
          className={cn(
            "flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end",
            footerClassName,
          )}
        >
          {footer}
        </div>
      ) : null}
    </>
  );

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 cursor-pointer overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0 duration-200",
        zIndexClassName,
      )}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="pointer-events-none flex min-h-full items-center justify-center p-4 sm:p-6">
        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title ? undefined : ariaLabel}
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "pointer-events-auto relative my-auto flex max-h-[90dvh] w-full cursor-default flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl outline-none animate-in fade-in-0 zoom-in-95 duration-200",
            sizeClasses[size],
            className,
          )}
        >
          {title || eyebrow || !hideCloseButton ? (
            <header className="sticky top-0 z-20 flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    {eyebrow}
                  </p>
                ) : null}
                {title ? (
                  <h2
                    id={titleId}
                    className="text-lg font-semibold leading-tight text-slate-900"
                  >
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p
                    id={descriptionId}
                    className="mt-1 text-sm leading-relaxed text-slate-500"
                  >
                    {description}
                  </p>
                ) : null}
              </div>
              {!hideCloseButton ? (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="absolute right-4 top-4 z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </header>
          ) : null}

          {onSubmit ? (
            <form
              onSubmit={onSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              {content}
            </form>
          ) : (
            content
          )}
        </section>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
