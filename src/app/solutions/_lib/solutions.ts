export type SolutionImage = {
  src: string;
  alt: string;
  caption: string;
};

export type Solution = {
  title: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
  images: SolutionImage[];
};

export function solutionSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const galleries = {
  survey: [
    {
      src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85",
      alt: "Aerial view of a rugged landscape",
      caption: "Capture the full terrain, not just the visible surface",
    },
    {
      src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85",
      alt: "Drone prepared for a survey flight",
      caption: "Field methods matched to access, scale and tolerance",
    },
    {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
      alt: "Mountain terrain under clear light",
      caption: "Reliable ground data for demanding sites",
    },
  ],
  gis: [
    {
      src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85",
      alt: "City buildings viewed from above",
      caption: "A shared spatial view of places and assets",
    },
    {
      src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85",
      alt: "Aerial view across a broad landscape",
      caption: "Turn imagery and field observations into usable layers",
    },
    {
      src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1800&q=85",
      alt: "Dense forest canopy seen from above",
      caption: "Make complex spatial data easier to query and maintain",
    },
  ],
  monitoring: [
    {
      src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85",
      alt: "Water moving along a rugged coastline",
      caption: "Observe change across exposed and remote environments",
    },
    {
      src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85",
      alt: "Mountain slopes and valley terrain",
      caption: "Establish a baseline before movement becomes a risk",
    },
    {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
      alt: "Mountain landscape under a clear sky",
      caption: "Give teams consistent measurements over time",
    },
  ],
  services: [
    {
      src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85",
      alt: "Survey drone ready for field deployment",
      caption: "The right equipment and expertise for the job",
    },
    {
      src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85",
      alt: "Modern city infrastructure viewed from above",
      caption: "Practical tools built around real project workflows",
    },
    {
      src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85",
      alt: "Remote terrain ready for field surveying",
      caption: "Build capability that lasts beyond one assignment",
    },
  ],
} satisfies Record<string, SolutionImage[]>;

const entries: Array<Omit<Solution, "images"> & { gallery: keyof typeof galleries }> = [
  {
    title: "UAV LiDAR Survey",
    group: "Survey & Mapping",
    gallery: "survey",
    intro: "A dependable picture of the ground, even where the ground is hard to reach.",
    description: "We combine calibrated UAV LiDAR, GNSS control and field checks to capture dense terrain data beneath vegetation and across complex sites. The result is a verified base for design, planning and measurement.",
    outcomes: ["Classified point clouds and bare-earth models", "Contours, sections and surface models", "Documented control and accuracy checks"],
  },
  {
    title: "Drone Photogrammetry",
    group: "Survey & Mapping",
    gallery: "survey",
    intro: "High-resolution aerial imagery transformed into measurable site models.",
    description: "Planned image capture and surveyed ground control produce orthomosaics and 3D models that make site conditions easier to inspect, measure and share.",
    outcomes: ["Georeferenced orthomosaics", "Textured 3D models and elevation surfaces", "Repeatable capture for progress tracking"],
  },
  {
    title: "Engineering Survey",
    group: "Survey & Mapping",
    gallery: "survey",
    intro: "Precise site geometry for design, construction and as-built decisions.",
    description: "Control networks, topographic detail and construction set-out are planned around your design tolerances, with field observations checked before they become project inputs.",
    outcomes: ["Topographic and detail surveys", "Construction set-out and control", "As-built checks and CAD-ready files"],
  },
  {
    title: "GNSS & Total Station Survey",
    group: "Survey & Mapping",
    gallery: "survey",
    intro: "Ground control and measured positions you can trace back to their source.",
    description: "RTK, PPK and total-station workflows establish reliable control and detailed observations for sites where position, repeatability and a clear survey record matter.",
    outcomes: ["Primary and secondary control networks", "RTK / PPK observations and setting-out", "Field records with adjustment checks"],
  },
  {
    title: "Mobile Mapping",
    group: "Survey & Mapping",
    gallery: "survey",
    intro: "Capture continuous streetscape and corridor detail at operational speed.",
    description: "Mobile LiDAR and imaging collect dense, georeferenced asset information along roads, rail and built environments while limiting time spent in active corridors.",
    outcomes: ["Georeferenced point clouds and imagery", "Road, façade and corridor asset detail", "Data ready for inventory and design"],
  },
  {
    title: "Hydrographic Survey",
    group: "Survey & Mapping",
    gallery: "survey",
    intro: "A clear view of the underwater terrain that shapes your project.",
    description: "Bathymetric observations are tied to an appropriate vertical datum and combined with shoreline or land surveys to support water-resource, infrastructure and navigation decisions.",
    outcomes: ["Bathymetric surfaces and contours", "Cross-sections and depth soundings", "Integrated land-to-water datasets"],
  },
  {
    title: "Spatial Database & GIS Solutions",
    group: "GIS & Data",
    gallery: "gis",
    intro: "Bring spatial records together so teams can find and trust the same information.",
    description: "We structure spatial databases, clean source data and establish practical schemas so your organization can manage assets, locations and survey deliverables in one consistent system.",
    outcomes: ["Designed geospatial database schemas", "Migrated, validated and documented data", "Clear access and maintenance workflows"],
  },
  {
    title: "Enterprise GIS Deployment",
    group: "GIS & Data",
    gallery: "gis",
    intro: "A useful GIS is one that fits the way your teams already work.",
    description: "From platform configuration to service publishing and user roles, we deploy enterprise GIS environments that make authoritative spatial information available to the right people.",
    outcomes: ["Configured GIS services and workspaces", "Role-based access and publishing patterns", "Team onboarding and operating guidance"],
  },
  {
    title: "Remote Sensing & Analytics",
    group: "GIS & Data",
    gallery: "gis",
    intro: "Use satellite and aerial observations to see patterns across entire regions.",
    description: "Multispectral, radar and elevation data are processed into interpretable indicators for land cover, vegetation, change and site screening, with assumptions made explicit.",
    outcomes: ["Land-cover and condition mapping", "Change detection and time-series analysis", "Decision-ready maps and data layers"],
  },
  {
    title: "Spatial Data Processing",
    group: "GIS & Data",
    gallery: "gis",
    intro: "Turn raw survey files into consistent, quality-checked project data.",
    description: "We process point clouds, imagery and field observations into structured deliverables, preserving coordinate reference, metadata and quality checks throughout the workflow.",
    outcomes: ["Classified and cleaned point clouds", "Integrated GIS, CAD and raster datasets", "QA notes and reusable metadata"],
  },
  {
    title: "Geotechnical Displacement Monitoring",
    group: "Monitoring",
    gallery: "monitoring",
    intro: "Measure subtle ground and structure movement before it changes the plan.",
    description: "A monitoring design combines suitable sensors, stable reference points and an agreed observation schedule to reveal movement trends and support timely engineering review.",
    outcomes: ["Baseline surveys and monitoring networks", "Displacement trends and threshold reporting", "Repeatable observations for engineering review"],
  },
  {
    title: "Geospatial Optical Monitoring",
    group: "Monitoring",
    gallery: "monitoring",
    intro: "Track structures and terrain remotely with repeatable optical measurements.",
    description: "Prism networks, robotic total stations and image-based observations provide a consistent view of movement across structures, slopes and infrastructure corridors.",
    outcomes: ["Automated or scheduled observation plans", "Position changes tied to stable control", "Clear alerts and periodic reports"],
  },
  {
    title: "Hydrological & Meteorological Sensors",
    group: "Monitoring",
    gallery: "monitoring",
    intro: "Connect field conditions to the decisions that depend on them.",
    description: "Weather, rainfall and water-level sensors provide reliable time-series observations for hydropower, watershed and environmental operations, with telemetry and data checks planned from the start.",
    outcomes: ["Sensor selection and field installation", "Telemetry-ready environmental data", "Thresholds, dashboards and maintenance plans"],
  },
  {
    title: "Equipment Rental",
    group: "Professional Services",
    gallery: "services",
    intro: "Get calibrated survey equipment matched to your project and crew.",
    description: "Flexible access to survey instruments and mapping payloads, with setup support and practical guidance to help your team mobilize confidently.",
    outcomes: ["UAV, GNSS and survey instrument options", "Pre-deployment checks and setup support", "Operator guidance and flexible periods"],
  },
  {
    title: "Software Development",
    group: "Professional Services",
    gallery: "services",
    intro: "Make spatial software work around your data and daily processes.",
    description: "We build focused GIS tools, automations and integrations that reduce repetitive work and make spatial information easier to use across your organization.",
    outcomes: ["Workflow-specific GIS applications", "Data integrations and processing automation", "Documentation and handover"],
  },
  {
    title: "Calibration & Maintenance",
    group: "Professional Services",
    gallery: "services",
    intro: "Keep instruments accurate, traceable and ready for mobilisation.",
    description: "Scheduled calibration, servicing and maintenance keep your survey equipment in specification and reduce avoidable drift before it affects mission-critical measurements.",
    outcomes: ["Calibration traceability and service records", "Preventive maintenance planning", "Field-ready instrument performance checks"],
  },
  {
    title: "Capacity Building",
    group: "Professional Services",
    gallery: "services",
    intro: "Give your team the confidence to collect, manage and use spatial data.",
    description: "Practical training is shaped around your equipment, software and real project datasets, so new skills can be applied directly in the field and office.",
    outcomes: ["Field and office training programmes", "Exercises using your own project data", "Reference materials and follow-up support"],
  },
];

export const SOLUTIONS: Solution[] = entries.map(({ gallery, ...solution }) => ({
  ...solution,
  images: galleries[gallery],
}));

export const SOLUTIONS_BY_SLUG = new Map(
  SOLUTIONS.map((solution) => [solutionSlug(solution.title), solution]),
);

export function getDynamicSolutions(): Solution[] {
  if (typeof window === "undefined") {
    try {
      // Lazy load server data-store without breaking client bundles
      const { getSiteContent } = require("@/lib/data-store");
      const content = getSiteContent();
      if (content?.Solutions?.length > 0) {
        return content.Solutions;
      }
    } catch {}
  }
  return SOLUTIONS;
}

export function getDynamicSolutionBySlug(slug: string): Solution | undefined {
  const dynamic = getDynamicSolutions();
  return dynamic.find((s) => solutionSlug(s.title) === slug) || SOLUTIONS_BY_SLUG.get(slug);
}