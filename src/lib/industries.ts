export type Industry = {
  title: string;
  intro: string;
  description: string;
  items: string[];
};

export function industrySlug(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const INDUSTRIES: Industry[] = [
  {
    title: "Infrastructure",
    intro: "Accurate spatial intelligence for energy, transport and network-critical assets.",
    description:
      "From hydropower corridors to telecom networks, we help infrastructure owners measure, validate and manage assets with the geospatial precision those decisions require.",
    items: [
      "Hydropower & Energy",
      "Roads, Highways & Bridges",
      "Transmission Lines",
      "Telecom Networks",
    ],
  },
  {
    title: "Government & Urban",
    intro: "National and municipal datasets built to support planning, public service and accountability.",
    description:
      "Government teams need a trusted baseline for planning, asset visibility and public reporting. Our data capture and GIS delivery supports digital twins, municipal operations and national mapping programmes.",
    items: [
      "Smart Cities & Digital Twins",
      "Municipalities",
      "National Mapping Agencies",
    ],
  },
  {
    title: "Natural Resources",
    intro: "Operational insight across forestry, agriculture and extractive landscapes.",
    description:
      "Resource managers work across large, complex terrain. We turn field reality into interpretable spatial data so teams can estimate inventory, monitor change and plan with more certainty.",
    items: [
      "Forestry & Biomass",
      "Agriculture & Irrigation",
      "Mining & Quarrying",
    ],
  },
  {
    title: "Safety & Research",
    intro: "High-trust geospatial information for risk management, field research and site safety.",
    description:
      "Whether it is flood resilience, construction layout or university-led research, dependable spatial data reduces uncertainty and makes field decisions more defensible.",
    items: [
      "Disaster & Flood Management",
      "Construction & Site Layout",
      "Universities & R&D",
    ],
  },
];

export const INDUSTRIES_BY_SLUG = new Map(
  INDUSTRIES.map((industry) => [industrySlug(industry.title), industry]),
);

export function getDynamicIndustries(): Industry[] {
  if (typeof window === "undefined") {
    try {
      const { getSiteContent } = require("@/lib/data-store");
      const content = getSiteContent();
      if (content?.Industries?.length > 0) {
        return content.Industries;
      }
    } catch {}
  }
  return INDUSTRIES;
}

export function getDynamicIndustryBySlug(slug: string): Industry | undefined {
  const dynamic = getDynamicIndustries();
  return dynamic.find((ind) => industrySlug(ind.title) === slug) || INDUSTRIES_BY_SLUG.get(slug);
}

