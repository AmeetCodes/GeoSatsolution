"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Wraps the changeable region of a page (the `<main>` element) so every
 * client-side route change fades the incoming content in. The animation is
 * opacity-only and keyed on the pathname, which keeps the fixed Navbar/Footer
 * untouched while still replaying on navigation between dynamic routes that
 * reuse the same page component.
 */
export function PageTransition({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <main id={id} className={className}>
        {children}
      </main>
    );
  }

  return (
    <main key={pathname} id={id} className={cn("page-enter", className)}>
      {children}
    </main>
  );
}

export default PageTransition;