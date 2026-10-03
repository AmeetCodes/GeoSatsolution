export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
};

export type CareerRole = {
  slug: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export type ResourceDocument = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  updated: string;
};

export function newsSlug(rawTitle: string) {
  return rawTitle
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function careerSlug(rawTitle: string) {
  return rawTitle
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: "cors-network-expansion",
    title: "GeoSAT supports CORS network expansion for continuous positioning",
    date: "2026-06-18",
    category: "Infrastructure",
    excerpt:
      "New reference station deployments extend network-RTK coverage for engineering and cadastral teams working outside the Kathmandu valley.",
    body: [
      "GeoSAT is supporting the next phase of CORS network expansion to improve continuous positioning in areas that remain underserved by high-precision GNSS services.",
      "The new reference station deployments strengthen access to network-RTK coverage for engineering, cadastral and asset-management teams operating beyond the Kathmandu valley, where field conditions and site constraints often limit conventional survey methods.",
      "As more teams rely on geospatially accurate workflows for corridor design, parcel validation and infrastructure monitoring, the expanded positioning network improves both productivity and confidence in field decision-making.",
    ],
  },
  {
    slug: "lidar-academy-cohort",
    title: "Fifth LiDAR processing cohort completes advanced certification",
    date: "2026-05-02",
    category: "Training",
    excerpt:
      "Engineers from utilities, municipalities and consulting firms completed six days of hands-on classification and feature-extraction training.",
    body: [
      "The fifth GeoSAT LiDAR processing cohort completed a six-day intensive programme focused on classification, feature extraction and quality assurance workflows for point cloud data.",
      "Participants from utilities, municipalities and consulting firms worked through realistic field and office scenarios, with an emphasis on the technical checks that turn raw LiDAR into decision-ready assets and terrain models.",
      "The programme also reinforced standards for deliverable review, ensuring teams leave with a clearer understanding of how to validate outputs against project requirements.",
    ],
  },
  {
    slug: "digital-twin-milestone",
    title: "Digital twin delivery milestone for a growing municipality",
    date: "2026-03-21",
    category: "Projects",
    excerpt:
      "A city-scale 3D model and parcel geodatabase moved into production use for municipal planning and revenue workflows.",
    body: [
      "A growing municipality reached an important milestone as a city-scale 3D model and parcel geodatabase moved into production use for planning and operational management.",
      "The deliverables connect asset inventory, parcel information and urban context in a way that supports both internal decision-making and public-facing service workflows.",
      "This milestone reflects how GeoSAT combines survey capture, GIS structure and field validation into a consistent digital foundation that teams can actually use beyond the project handover.",
    ],
  },
];

export const CAREER_ROLES: CareerRole[] = [
  {
    slug: "survey-gis-engineering-roles",
    title: "Survey & GIS Engineering Roles",
    category: "Engineering",
    location: "Kathmandu and field projects",
    summary:
      "Lead survey control, geospatial analysis and GIS deliverables for infrastructure, municipal and monitoring projects.",
    responsibilities: [
      "Set up control networks, verify datasets and support field mobilisation planning.",
      "Process GNSS, LiDAR and photogrammetry outputs for engineering and GIS workflows.",
      "Translate spatial data into client-ready maps, models and asset inventories.",
      "Coordinate with project teams to validate quality and production readiness.",
    ],
    requirements: [
      "Degree in geodesy, surveying, civil engineering, GIS or a related field.",
      "Hands-on experience with RTK/PPK workflows, geospatial software and GIS data management.",
      "Strong attention to detail, QA documentation and field coordination.",
      "Ability to work across preparation, capture, processing and client handover.",
    ],
  },
  {
    slug: "uav-lidar-operations-roles",
    title: "UAV & LiDAR Operations Roles",
    category: "Field Operations",
    location: "Remote sites and project mobilisations",
    summary:
      "Operate advanced aerial platforms and LiDAR systems while keeping data quality, safety and operational readiness at the centre of every mission.",
    responsibilities: [
      "Plan flight missions, calibrate payloads and coordinate safe field operations.",
      "Capture high-quality LiDAR and drone imagery for survey, mapping and monitoring projects.",
      "Inspect raw datasets for completeness, accuracy and field conditions before handoff.",
      "Support equipment maintenance, reporting and client communication during mobilisations.",
    ],
    requirements: [
      "Experience in UAV operations, geospatial fieldwork or aerial survey missions.",
      "Familiarity with LiDAR, photogrammetry and georeferencing workflows.",
      "Comfort working in changing terrain, weather conditions and cross-functional teams.",
      "Commitment to operational safety, QA checks and clear field documentation.",
    ],
  },
  {
    slug: "software-development-roles",
    title: "Software Development Roles",
    category: "Technology",
    location: "Kathmandu office and hybrid project work",
    summary:
      "Build practical geospatial tools, integrations and dashboards that help teams use data confidently in the field and in operations.",
    responsibilities: [
      "Develop internal and client-facing tools for geospatial data processing and visualisation.",
      "Support automation, API integrations and spatial workflow improvements.",
      "Work closely with engineers and data teams to connect technical outputs to workflow needs.",
      "Contribute to software quality, testing and documentation across product iterations.",
    ],
    requirements: [
      "Experience with modern web or application development and data-driven product work.",
      "Strong understanding of APIs, workflows and software quality practices.",
      "Interest in geospatial systems, maps, dashboards and operational tooling.",
      "Ability to communicate clearly with technical and non-technical stakeholders.",
    ],
  },
];

export const RESOURCE_DOCUMENTS: ResourceDocument[] = [
  {
    slug: "survey-standards-and-qa-guidelines",
    title: "Survey Standards and QA Guidelines",
    category: "Technical",
    summary: "A practical reference for checklists, field controls, calibration expectations and approved audit steps.",
    updated: "2026-08-11",
  },
  {
    slug: "uav-lidar-acquisition-checklist",
    title: "UAV LiDAR Acquisition Checklist",
    category: "Operations",
    summary: "A field-ready checklist covering mission planning, sensor checks, overlap requirements and post-flight validation.",
    updated: "2026-07-23",
  },
  {
    slug: "lidar-processing-workflow-overview",
    title: "LiDAR Processing Workflow Overview",
    category: "Training",
    summary: "A concise overview of data import, classification, editing and quality checks for project deliverables.",
    updated: "2026-06-12",
  },
  {
    slug: "gis-data-stewardship-guide",
    title: "GIS Data Stewardship Guide",
    category: "Data Management",
    summary: "Guidance for organising, validating and maintaining geospatial assets across technical teams and stakeholders.",
    updated: "2026-05-30",
  },
];

export function getDynamicNewsItems(): NewsItem[] {
  if (typeof window === "undefined") {
    try {
      const { getSiteContent } = require("@/lib/data-store");
      const content = getSiteContent();
      if (content?.Company?.Insights?.length > 0) {
        return content.Company.Insights;
      }
    } catch {}
  }
  return NEWS_ITEMS;
}

export function getDynamicCareerRoles(): CareerRole[] {
  if (typeof window === "undefined") {
    try {
      const { getSiteContent } = require("@/lib/data-store");
      const content = getSiteContent();
      if (content?.Company?.Careers?.length > 0) {
        return content.Company.Careers;
      }
    } catch {}
  }
  return CAREER_ROLES;
}

