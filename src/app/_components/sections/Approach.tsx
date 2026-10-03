"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {  SECTION_HEADERS } from "@/lib/content";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Approach() {
  const trackRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 65%"],
  });

  // The rail fills as the reader moves through the sequence.
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="approach" className="bg-abyss-2/30">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            
          </div>

          <ol ref={trackRef} className="relative pl-10 sm:pl-14">
            {/* Track and the scroll-driven fill. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-2 left-[1.0625rem] w-px bg-line sm:left-[1.5625rem]"
            />
            <motion.span
              aria-hidden="true"
              style={reduced ? { scaleY: 1 } : { scaleY: fill }}
              className="absolute inset-y-2 left-[1.0625rem] w-px origin-top bg-gradient-to-b from-aqua via-aqua to-aqua-deep sm:left-[1.5625rem]"
            />
          </ol>
        </div>
      </Container>
    </Section>
  );
}
