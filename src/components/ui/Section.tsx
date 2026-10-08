import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[84rem] px-6 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Full-bleed hairline above the section content. */
  rule?: boolean;
  /** Tighter spacing for dense landing page sections. */
  compact?: boolean;
};

export function Section({ id, className, children, rule = true, compact = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20",
        compact ? "py-14 sm:py-16 lg:py-20" : "py-24 sm:py-28 lg:py-32",
        className,
      )}
    >
      {rule ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" aria-hidden="true" />
      ) : null}
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  /** Two-digit instrument index, e.g. "01". */
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  compact?: boolean;
};

export function SectionHeader({
  index,
  label,
  title,
  lede,
  className,
  compact = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <div className="flex items-center gap-3">
        <span className="label text-aqua/70">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span className="label">{label}</span>
      </div>
      <h2 className={cn(compact ? "mt-4" : "mt-6", "text-[clamp(2rem,4.2vw,3.375rem)] text-balance")}>{title}</h2>
      {lede ? (
        <p className={cn(compact ? "mt-4" : "mt-6", "max-w-2xl text-[1.0625rem] leading-relaxed text-ink-2 sm:text-lg")}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
