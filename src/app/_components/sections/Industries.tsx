"use client";

import { Activity, ArrowRight, ChevronDown, Compass, Layers, MapPin, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SECTION_HEADERS } from "@/lib/content";
import { getPublicNavigation } from "@/lib/public-navigation-client";
import { solutionSlug } from "@/lib/utils";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

type IndustryItem = { title: string; body?: string; intro?: string; description?: string; items: string[] };

const DEFAULT_INDUSTRIES: IndustryItem[] = [
  {
    title: "Infrastructure",
    body: "Corridors, structures and energy assets surveyed to the tolerance engineering sign-off demands.",
    items: ["Hydropower & Energy", "Roads, Highways & Bridges", "Transmission Lines", "Telecom Networks"],
  },
  {
    title: "Government & Urban",
    body: "National coverage, municipal base maps and digital twins that outlive any single project team.",
    items: ["Smart Cities & Digital Twins", "Municipalities", "National Mapping Agencies"],
  },
  {
    title: "Natural Resources",
    body: "Forestry, agriculture and mining measured in the units each discipline actually uses.",
    items: ["Forestry & Biomass", "Agriculture & Irrigation", "Mining & Quarrying"],
  },
  {
    title: "Safety & Research",
    body: "Hazard baselines, site control and the spatial rigor research programmes depend on.",
    items: ["Disaster & Flood Management", "Construction & Site Layout", "Universities & R&D"],
  },
];

const ICONS: LucideIcon[] = [Layers, MapPin, Compass, Activity];

function useDynamicIndustries(): IndustryItem[] | null {
  const [data, setData] = useState<IndustryItem[] | null>(null);

  useEffect(() => {
    let active = true;
    void getPublicNavigation().then((payload) => {
      if (active && Array.isArray(payload?.industries)) setData(payload.industries);
    });
    return () => {
      active = false;
    };
  }, []);

  return data;
}

export function Industries() {
  const dynIndustries = useDynamicIndustries();
  const industries: IndustryItem[] = dynIndustries ?? DEFAULT_INDUSTRIES;
  const [expanded, setExpanded] = useState<string | null>(industries[0]?.title ?? null);

  // Keep expansion in sync with industry list updates
  useEffect(() => {
    setExpanded((prev) => {
      if (prev && industries.some((i) => i.title === prev)) return prev;
      return industries[0]?.title ?? null;
    });
  }, [industries]);

  return (
    <Section id="industries">
      <Container>
        <Reveal>
          <SectionHeader
            index={SECTION_HEADERS.industries.index}
            label={SECTION_HEADERS.industries.label}
            title={SECTION_HEADERS.industries.title}
            lede={SECTION_HEADERS.industries.lede}
          />
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-2">
          {industries.map((industry, index) => {
            const Icon = ICONS[index % ICONS.length];
            const isExpanded = expanded === industry.title;
            const bodyText = industry.body ?? industry.intro ?? industry.description ?? "";

            return (
              <RevealItem key={industry.title}>
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : industry.title)}
                  className="group relative block h-full w-full overflow-hidden rounded-[var(--radius-panel)] border border-line bg-panel/30 p-8 text-left transition-[border-color,background-color,transform] duration-300 hover:border-line-strong hover:bg-panel/55 hover:-translate-y-0.5 sm:p-10"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(60,227,214,0.12),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-line bg-white/[0.03] text-aqua transition-colors duration-300 group-hover:border-aqua/30">
                        <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <h3 className="text-[clamp(1.25rem,2.1vw,1.5rem)] leading-snug">
                        {industry.title}
                      </h3>
                    </div>

                    <span className="mt-1 flex size-8 items-center justify-center rounded-full border border-line bg-white/[0.02] text-ink-3">
                      <ChevronDown
                        className={isExpanded ? "size-4 rotate-180 transition-transform duration-200" : "size-4 transition-transform duration-200"}
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-ink-2">{bodyText}</p>

                  {isExpanded ? (
                    <ul className="mt-7 space-y-3 border-t border-line pt-7">
                      {industry.items.map((item) => (
                        <li key={item}>
                          <a
                            href={`/industries/${solutionSlug(industry.title)}`}
                            onClick={(event) => event.stopPropagation()}
                            className="group/item inline-flex items-center gap-2.5 py-1 text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
                          >
                            <ArrowRight
                              className="size-3.5 -translate-x-1 text-aqua/0 opacity-0 transition-[transform,opacity] duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                              aria-hidden="true"
                            />
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </button>
              </RevealItem>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
