"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The single motion vocabulary for the page: content rises 24px and fades in
 * once, on entry, then never moves again. Nothing loops, nothing bounces.
 */
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const container: Variants = {
  hidden: {},
  visible: {},
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Reveal on entry; pass `stagger` when the children are a list. */
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "header" | "footer" | "ol" | "ul" | "dl";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Static = Tag;
    return <Static className={className}>{children}</Static>;
  }

  const Component = motion[Tag];

  return (
    <Component
      className={className}
      variants={stagger ? container : rise}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={
        stagger
          ? { staggerChildren: 0.075, delayChildren: 0.04 + delay }
          : { duration: 0.7, delay, ease: EASE }
      }
    >
      {children}
    </Component>
  );
}

/** Child of a `stagger` Reveal — inherits the parent's visible state. */
export function RevealItem({
  children,
  className,
  delay,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Overrides the inherited stagger position. */
  delay?: number;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Static = Tag;
    return <Static className={className}>{children}</Static>;
  }

  const Component = motion[Tag];

  return (
    <Component
      className={cn(className)}
      variants={rise}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}
