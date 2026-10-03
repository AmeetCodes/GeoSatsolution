export type ProductImage = {
  src: string;
  alt: string;
  caption: string;
};

export type Product = {
  title: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
  images: ProductImage[];
};

export function productSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const galleries = {
  uav: [
    {
      src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85",
      alt: "Drone aircraft preparing for lift-off in an open field",
      caption: "UAV platforms configured for repeatable survey performance.",
    },
    {
      src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85",
      alt: "Survey drone and high-precision payload equipment",
      caption: "Lightweight platforms paired with mission-critical payloads.",
    },
    {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
      alt: "Remote terrain under clear light for aerial surveying",
      caption: "Reliable field capture across rugged, remote terrain.",
    },
  ],
  payloads: [
    {
      src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85",
      alt: "LiDAR payload and survey equipment in a field setup",
      caption: "Payloads designed to preserve detail from the first scan to the final model.",
    },
    {
      src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85",
      alt: "Landscape with geospatial equipment and site capture",
      caption: "Data quality built from calibrated, repeatable acquisition workflows.",
    },
    {
      src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1800&q=85",
      alt: "Forest canopy and aerial survey context",
      caption: "Capture the terrain and vegetation structure with confidence.",
    },
  ],
  surveyEquipment: [
    {
      src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85",
      alt: "High-precision surveying equipment in the field",
      caption: "Positioning tools built around traceable, repeatable field control.",
    },
    {
      src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85",
      alt: "Surveyor equipment across a rugged landscape",
      caption: "Accurate measurements start with the right instrument set.",
    },
    {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
      alt: "Surveying site under clear weather conditions",
      caption: "Built for high-performance line work and control workflows.",
    },
  ],
  software: [
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=85",
      alt: "Laptop and geospatial software workspace",
      caption: "Software workflows designed for efficient spatial analysis.",
    },
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=85",
      alt: "Geospatial teams working on digital processing",
      caption: "From field capture to deliverable workflows, in one system.",
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85",
      alt: "Remote sensing and analytical processing setup",
      caption: "Better decisions start with structured, quality-assured data.",
    },
  ],
  monitoring: [
    {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1800&q=85",
      alt: "Monitoring station and environmental data instrumentation",
      caption: "Sensor systems that keep data flowing in real time.",
    },
    {
      src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=85",
      alt: "Environmental monitoring in a field setting",
      caption: "Consistent observations for infrastructure and natural systems.",
    },
    {
      src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1800&q=85",
      alt: "Monitoring sensors in a remote landscape",
      caption: "A stable baseline for change detection and response.",
    },
  ],
} satisfies Record<string, ProductImage[]>;

const entries: Array<Omit<Product, "images"> & { gallery: keyof typeof galleries }> = [
  {
    title: "Unmanned Aerial Vehicles (UAV)",
    group: "UAV & Payloads",
    gallery: "uav",
    intro: "Flexible aerial platforms for mapping, inspection and site intelligence.",
    description: "GeoSAT UAV platforms are selected for payload balance, endurance, reliability and site access. They give field teams a practical way to capture survey-grade data with repeatable accuracy and predictable operation.",
    outcomes: ["Mission planning and field mobilization", "High-accuracy capture for survey and inspection", "Efficient coverage for inaccessible terrain"],
  },
  {
    title: "LiDAR & Photogrammetry Payloads",
    group: "UAV & Payloads",
    gallery: "payloads",
    intro: "Sensor packages that turn airborne capture into measurable project deliverables.",
    description: "From dense point clouds to calibrated imagery, our payload solutions are matched to project tolerance, site difficulty and output requirements so the raw collection can move smoothly into processing.",
    outcomes: ["Dense point cloud capture", "High-resolution imagery and 3D surfaces", "Flexible payload options for varied terrain"],
  },
  {
    title: "Surveillance & Search Payloads",
    group: "UAV & Payloads",
    gallery: "payloads",
    intro: "Operational payloads designed for reconnaissance, monitoring and rapid assessment.",
    description: "These systems support situational awareness and practical field oversight where time, safety and coverage matter. They are configured for the mission profile rather than a one-size-fits-all setup.",
    outcomes: ["Targeted airborne observation", "Fast field assessment and monitoring", "Improved operational awareness"],
  },
  {
    title: "GNSS Receivers",
    group: "Survey Equipment",
    gallery: "surveyEquipment",
    intro: "Robust positioning hardware for control, layout and field verification.",
    description: "Our receiver range supports surveys that need repeatability, quality control and clear traceability. Whether the task is a control network or daily construction layout, the hardware is selected to match field conditions and accuracy goals.",
    outcomes: ["RTK and PPK workflows", "Reliable field positioning", "Strong control and repeat verification"],
  },
  {
    title: "Total Stations",
    group: "Survey Equipment",
    gallery: "surveyEquipment",
    intro: "Precise angular and distance measurements for site control and layout.",
    description: "Total stations remain a dependable tool for precise detail capture, set-out and monitoring tasks where a clear measurement chain is essential. They support both routine project work and high-value control tasks.",
    outcomes: ["Precise angle and distance measurement", "Construction layout and control work", "Trusted field reference for surveying teams"],
  },
  {
    title: "Laser Scanners & SLAM",
    group: "Survey Equipment",
    gallery: "surveyEquipment",
    intro: "Fast capture of geometry where dense detail and speed both matter.",
    description: "Laser scanning and SLAM solutions can dramatically reduce time spent in the field while preserving detail for as-built, corridor and structural applications. The result is a richer and more complete measure of real-world conditions.",
    outcomes: ["Dense 3D measurement", "Rapid capture for complex geometry", "Ideal for as-built and corridor workflows"],
  },
  {
    title: "Mobile Mapping Systems",
    group: "Survey Equipment",
    gallery: "surveyEquipment",
    intro: "Continuous asset and corridor capture at operational speed.",
    description: "Mobile mapping gives you a practical route to capturing roads, rail corridors and urban infrastructure without repeated site access or long field interruptions. It delivers complete spatial context in one pass.",
    outcomes: ["High-density corridor capture", "Road and utility asset mapping", "Efficient data collection at speed"],
  },
  {
    title: "Survey Accessories",
    group: "Survey Equipment",
    gallery: "surveyEquipment",
    intro: "The supporting field kit that keeps every survey dependable.",
    description: "Accessories such as tripods, targets, poles and field consumables are critical to maintaining setup quality and reducing measurement drift across the project. These are the details that protect accuracy in real conditions.",
    outcomes: ["Field-ready setup support", "Improved rig consistency", "Better quality control on site"],
  },
  {
    title: "Trimble Business Center & Access",
    group: "Software",
    gallery: "software",
    intro: "Professional processing and geospatial workflows for field and office teams.",
    description: "Trimble workflows support survey data processing, geodetic adjustment and project management across engineering and geospatial tasks. They are a strong fit when consistency, control and professional deliverables matter.",
    outcomes: ["Survey data processing workflows", "Quality-controlled project outputs", "Efficient management of deliverables"],
  },
  {
    title: "DJI Terra & Modify",
    group: "Software",
    gallery: "software",
    intro: "Processing and modelling tools for efficient drone and photogrammetry work.",
    description: "This software stack helps translate airborne capture into usable 2D and 3D outputs quickly, with practical quality checks and processing transparency for project teams.",
    outcomes: ["Drone processing and modelling", "Rapid 2D and 3D output generation", "Practical field-to-office efficiency"],
  },
  {
    title: "LiDAR360 & LiGeoreference",
    group: "Software",
    gallery: "software",
    intro: "Powerful processing for LiDAR and georeferencing workflows.",
    description: "These platforms support modern point cloud processing, classification and georeferencing, helping teams bring raw scan data into a deliverable-ready state with clear control over quality and structure.",
    outcomes: ["Point-cloud classification and filtering", "Georeferencing controls", "Production-ready processing pipelines"],
  },
  {
    title: "Pix4D & Agisoft",
    group: "Software",
    gallery: "software",
    intro: "Photogrammetry workflows built for reproducibility and project scale.",
    description: "Pix4D and Agisoft provide dependable photogrammetric processing for aerial and terrestrial imagery, enabling accurate mapping, visual analytics and critical project outputs.",
    outcomes: ["Orthomosaic and 3D model generation", "Repeatable processing pipelines", "Strong visual and metric outputs"],
  },
  {
    title: "PLS-CADD & eCognition",
    group: "Software",
    gallery: "software",
    intro: "Specialized analysis environments for linear assets and complex feature extraction.",
    description: "For corridor and infrastructure work, these tools support engineering logic, feature separation and higher-level analysis. They help teams move from raw imagery and geospatial data into design-ready inputs.",
    outcomes: ["Linear asset analysis", "Feature extraction and classification", "Design-supporting spatial intelligence"],
  },
  {
    title: "Satellite Imagery (Multispectral, SAR, DEM)",
    group: "Satellite & Monitoring",
    gallery: "monitoring",
    intro: "Large-area observation layers for strategic planning and monitoring.",
    description: "Satellite imagery and derived products provide cost-effective coverage across wide areas and time periods. They are particularly useful for baseline mapping, resource assessment and change detection across large operations.",
    outcomes: ["Wide-area coverage and baseline mapping", "Multispectral and SAR interpretation", "DEM-driven terrain context"],
  },
  {
    title: "Geotechnical Monitoring Sensors",
    group: "Satellite & Monitoring",
    gallery: "monitoring",
    intro: "Field instrumentation for slope, structure and ground movement.",
    description: "These sensors support early detection of movement, deformation and structural risk. When integrated with a monitoring workflow, they provide the evidence needed for engineering review and corrective action.",
    outcomes: ["Movement and deformation tracking", "Reliable field observation data", "Early-warning monitoring on critical assets"],
  },
  {
    title: "Geospatial Optical Sensors",
    group: "Satellite & Monitoring",
    gallery: "monitoring",
    intro: "Optical monitoring for the visual evidence behind rapid decisions.",
    description: "Optical sensors provide repeatable imagery and observations that are easy to compare over time. This makes them valuable for monitoring changing terrain, assets and operational conditions.",
    outcomes: ["Image-based condition tracking", "Visual evidence for change review", "Operational monitoring at repeated intervals"],
  },
  {
    title: "Hydro-Met Logging Sensors",
    group: "Satellite & Monitoring",
    gallery: "monitoring",
    intro: "Environmental observations that connect weather and water data to real decisions.",
    description: "Hydro-met sensors log rainfall, flow and climate conditions so projects can correlate environmental variability with infrastructure or operational performance. The data is structured for interpretation and practical response.",
    outcomes: ["Environmental time-series logging", "Hydroclimate insight and baseline data", "Decision support for operations and design"],
  },
];

export const PRODUCTS: Product[] = entries.map(({ gallery, ...product }) => ({
  ...product,
  images: galleries[gallery],
}));

export const PRODUCTS_BY_SLUG = new Map(
  PRODUCTS.map((product) => [productSlug(product.title), product]),
);

export function getDynamicProducts(): Product[] {
  if (typeof window === "undefined") {
    try {
      const { getSiteContent } = require("@/lib/data-store");
      const content = getSiteContent();
      if (content?.Products?.length > 0) {
        return content.Products;
      }
    } catch {}
  }
  return PRODUCTS;
}

export function getDynamicProductBySlug(slug: string): Product | undefined {
  const dynamic = getDynamicProducts();
  return dynamic.find((p) => productSlug(p.title) === slug) || PRODUCTS_BY_SLUG.get(slug);
}

