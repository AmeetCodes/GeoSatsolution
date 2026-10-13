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
