"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CAPABILITIES } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { SECTION_HEADERS } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Capabilities() {
  const [open, setOpen] = useState<string>(CAPABILITIES[0].title);
  const reduced = useReducedMotion();

  return (
    <Section id="capabilities" compact>
      <Container>
        <Reveal>
          <SectionHeader
            index={SECTION_HEADERS.capabilities.index}
            label={SECTION_HEADERS.capabilities.label}
            title={SECTION_HEADERS.capabilities.title}
            lede={SECTION_HEADERS.capabilities.lede}
            compact
          />
        </Reveal>

        <div className="mt-9 border-t border-line sm:mt-10">
          {CAPABILITIES.map((capability) => {
            const isOpen = open === capability.title;

            return (
              <div key={capability.title} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`capability-${capability.index}`}
                    onClick={() => setOpen(isOpen ? "" : capability.title)}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-3 rounded-lg px-3 py-5 text-left transition-colors sm:gap-x-6 sm:px-4 sm:py-6"
                  >
                    <span
                      className={cn(
                        "mt-1.5 font-mono text-xs tabular transition-colors duration-300",
                        isOpen ? "text-aqua" : "text-ink-4",
                      )}
                    >
                      {capability.index}
                    </span>

                    <span className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
                      <span
                        className={cn(
                          "font-[family-name:var(--font-open-sans)] text-[22.4px] font-[100] leading-tight tracking-[-0.02em] transition-colors duration-300",
                          isOpen ? "text-ink" : "text-ink-2 group-hover:text-ink",
                        )}
                      >
                        {capability.title}
                      </span>
                      <span className="max-w-sm text-sm leading-relaxed text-ink-3">
                        {capability.summary}
                      </span>
                    </span>

                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,transform] duration-300",
                        isOpen
                          ? "rotate-45 border-aqua/40 bg-aqua/10 text-aqua"
                          : "border-line text-ink-3 group-hover:border-line-strong group-hover:text-ink",
                      )}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`capability-${capability.index}`}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-5 pb-7 sm:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] sm:gap-10 sm:pb-8">
                        <p className="text-[0.9375rem] leading-relaxed text-ink-2 sm:pl-[calc(2rem+2rem)]">
                          {capability.detail}
                        </p>

                        <ul className="flex flex-wrap content-start gap-2">
                          {capability.services.map((service) => (
                            <li
                              key={service}
                              className="rounded-full border border-line bg-white/[0.025] px-3.5 py-1.5 text-xs text-ink-2 transition-colors duration-200 hover:border-aqua/30 hover:text-ink"
                            >
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
