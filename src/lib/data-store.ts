import fs from "fs";
import path from "path";
import type { NavTreeColumn, NavTreeItem, NavTreeTab } from "./tree-store";

export interface SolutionItem {
  id?: string;
  slug?: string;
  title: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
  images: ContentImage[];
  faqs?: { question: string; answer: string }[];
  isPublished?: boolean;
}

export interface ProductItem {
  id?: string;
  slug?: string;
  title: string;
  group: string;
  subcategory?: string;
  brand?: string;
  brandUrl?: string;
  intro: string;
  description: string;
  outcomes: string[];
  images: ContentImage[];
  specifications?: Record<string, string>;
  faqs?: { question: string; answer: string }[];
  resources?: ProductDownloadItem[];
  isPublished?: boolean;
}

export { PRODUCT_TAXONOMY } from "./product-taxonomy";

export interface ProductDownloadItem {
  title: string;
  fileUrl: string;
  fileSource?: "upload" | "url";
  fileMediaId?: string;
  fileName?: string;
}

export interface ContentImage {
  src: string;
  alt: string;
  caption: string;
  source?: "upload" | "url";
  mediaId?: string;
}

export interface IndustryItem {
  id?: string;
  slug?: string;
  title: string;
  intro: string;
  description: string;
  items: string[];
  images?: ContentImage[];
  isPublished?: boolean;
}

export interface NewsItem {
  id?: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
  image?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  author?: string;
  isPublished?: boolean;
}

export interface ResourceItem {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  fileSource?: "upload" | "url";
  fileMediaId?: string;
  fileName?: string;
  thumbnail?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  updated: string;
  isPublished: boolean;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: string;
  tier: string;
  description: string;
  url?: string;
  logo?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  order?: number;
}

export interface CompanyClientItem {
  id?: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  image?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  order?: number;
}

export interface LeaderItem {
  id?: string;
  name: string;
  role: string;
  division: string;
  bio: string;
  expertise?: string;
  image?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  accent?: string;
  imagePosition?: string;
  order?: number;
}

export interface SiteContentData {
  Solutions: SolutionItem[];
  Products: ProductItem[];
  Industries: IndustryItem[];
  Company: {
    Leadership: LeaderItem[];
    Partners: PartnerItem[];
    Clients: CompanyClientItem[];
    Insights: NewsItem[];
    Resources: ResourceItem[];
  };
}

export type SiteSectionKey = "Solutions" | "Products" | "Industries";
export type SiteSectionItem = SolutionItem | ProductItem | IndustryItem;

export const DEFAULT_RESOURCES: ResourceItem[] = [
  { slug: "uav-lidar-workflow", title: "UAV LiDAR Survey Workflow Guide", category: "Operations", description: "Step-by-step field procedures for planning, executing, and processing UAV LiDAR survey missions including pre-flight checks, GCP placement, and trajectory post-processing.", fileUrl: "", updated: "2026-08-15", isPublished: true },
  { slug: "gnss-network-adjustment", title: "GNSS Network Adjustment Reference", category: "Geodetic Control", description: "Technical reference for designing, observing, and adjusting static GNSS baselines including loop closure tolerances and datum transformation parameters.", fileUrl: "", updated: "2026-07-22", isPublished: true },
  { slug: "point-cloud-classification", title: "Point Cloud Classification Standards", category: "Data Processing", description: "Classification schema and quality assurance criteria for airborne LiDAR point clouds following ASPRS LAS 1.4 standards.", fileUrl: "", updated: "2026-06-10", isPublished: true },
  { slug: "gis-data-delivery-spec", title: "GIS Data Delivery Specification", category: "GIS & Spatial Data", description: "File format requirements, coordinate reference system standards, and metadata documentation for spatial data deliverables.", fileUrl: "", updated: "2026-05-28", isPublished: true },
];

function normalizeContentSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "site-content.json");

// Default initial dataset
export const DEFAULT_SITE_CONTENT: SiteContentData = {
  Solutions: [
    {
      title: "UAV LiDAR Survey",
      group: "Survey & Mapping",
      intro: "A dependable picture of the ground, even where the ground is hard to reach.",
      description: "Dense point clouds penetrating steep slopes and heavy vegetation to produce true bare-earth terrain models.",
      outcomes: ["Calibrated LAS/LAZ point clouds", "High-accuracy DTM & DSM", "1m / 0.5m contour packages", "Full QA verification report"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "Aerial landscape", caption: "Capture the full terrain, not just the visible surface" },
        { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85", alt: "Drone survey flight", caption: "Field methods matched to access, scale and tolerance" }
      ]
    },
    {
      title: "Drone Photogrammetry",
      group: "Survey & Mapping",
      intro: "High-resolution orthomosaics and visual terrain records for site planning.",
      description: "Sub-centimeter aerial imagery tied to survey-grade ground control for engineering and cadastral requirements.",
      outcomes: ["Sub-cm orthomosaics (GeoTIFF)", "3D textured mesh models", "Volumetric calculation sheets", "GCP accuracy check sheets"],
      images: [
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85", alt: "Mountain terrain", caption: "Reliable ground data for demanding sites" }
      ]
    },
    {
      title: "Engineering Survey",
      group: "Survey & Mapping",
      intro: "Precise dimensional control and as-built verification for heavy infrastructure.",
      description: "Millimeter-level alignments for tunnels, bridges, highways, and industrial structures with complete audit trails.",
      outcomes: ["As-built CAD drawings", "Alignment & profile surveys", "Setting-out reports", "Deformation tolerances"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "City buildings", caption: "Dimensional control for critical corridors" }
      ]
    },
    {
      title: "GNSS & Total Station Survey",
      group: "Survey & Mapping",
      intro: "Geodetic framework establishment and tight network adjustments across complex terrain.",
      description: "Static and kinematic GNSS baseline measurements tied to national datum and global reference frames.",
      outcomes: ["Network adjustment reports", "Coordinate registers (WGS84 / Local)", "Benchmark monuments", "Traverse loop closures"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "Field survey equipment", caption: "Survey-grade geodetic accuracy" }
      ]
    },
    {
      title: "Mobile Mapping",
      group: "Survey & Mapping",
      intro: "High-speed corridor capture for roads, utilities, and urban streetscapes.",
      description: "Vehicle-mounted LiDAR and spherical camera systems capturing thousands of points per second at highway speeds.",
      outcomes: ["Asset inventory databases", "Road cross-sections & clearances", "Pavement condition models", "360-degree georeferenced imagery"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Urban corridor", caption: "Continuous high-speed corridor intelligence" }
      ]
    },
    {
      title: "Hydrographic Survey",
      group: "Survey & Mapping",
      intro: "Bathymetric mapping for reservoirs, riverbeds, and coastal infrastructure.",
      description: "Single and multibeam sonar systems integrated with RTK GNSS for underwater topography and sediment monitoring.",
      outcomes: ["Bathymetric surface models", "Water storage capacity tables", "Sedimentation rate maps", "Sub-bottom profiles"],
      images: [
        { src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85", alt: "Water coastline", caption: "Precision bathymetry beneath water surfaces" }
      ]
    },
    {
      title: "Spatial Database & GIS Solutions",
      group: "GIS & Data",
      intro: "Scalable spatial infrastructure for enterprise analytics and map publishing.",
      description: "PostGIS, Oracle Spatial, and ArcGIS Enterprise architectures tailored for massive geospatial datasets.",
      outcomes: ["Normalized spatial schemas", "High-availability spatial DB", "RESTful feature services", "Automated ETL pipelines"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Spatial data layers", caption: "Enterprise spatial infrastructure" }
      ]
    },
    {
      title: "Enterprise GIS Deployment",
      group: "GIS & Data",
      intro: "End-to-end GIS integration connecting field crews to decision makers in real time.",
      description: "Turnkey deployment of Web GIS, field survey apps, dashboard reporting, and security roles across organizations.",
      outcomes: ["Web GIS web portals", "Custom field data collection apps", "Real-time executive dashboards", "Role-based access controls"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85", alt: "Enterprise map interface", caption: "Unified corporate GIS portal" }
      ]
    },
    {
      title: "Remote Sensing & Analytics",
      group: "GIS & Data",
      intro: "Multispectral and SAR satellite analytics for large-area monitoring.",
      description: "Automated vegetation indices, land use classification, mineral exploration, and environmental compliance.",
      outcomes: ["Classified land cover maps", "NDVI & canopy health analytics", "SAR deformation interferometry", "Time-series change detection"],
      images: [
        { src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1800&q=85", alt: "Satellite view", caption: "Automated earth observation intelligence" }
      ]
    },
    {
      title: "Spatial Data Processing",
      group: "GIS & Data",
      intro: "High-throughput data cleaning, format standardization, and quality auditing.",
      description: "Expert processing of massive point clouds, vector datasets, and imagery archives to rigorous national specifications.",
      outcomes: ["Cleaned & classified point clouds", "Topology-validated vector layers", "Seamless aerial orthomosaic tiles", "Metadata documentation compliant with ISO"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "Geoprocessing", caption: "Rigorous quality controls" }
      ]
    },
    {
      title: "Geotechnical Displacement Monitoring",
      group: "Monitoring",
      intro: "Sub-millimeter structural and slope movement tracking for critical assets.",
      description: "Automated motorized total stations and InSAR satellites monitoring dams, tunnels, bridges, and landslides.",
      outcomes: ["Automated alarm thresholds", "Live displacement charts", "3D vector displacement reports", "Early warning SMS/Email alerts"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85", alt: "Slope monitoring", caption: "Sub-millimeter movement tracking" }
      ]
    },
    {
      title: "Geospatial Optical Monitoring",
      group: "Monitoring",
      intro: "Continuous camera and optical sensor arrays for remote visual inspection.",
      description: "Solar-powered PTZ cameras and time-lapse arrays documenting construction progress and structural drift.",
      outcomes: ["Automated time-lapse archives", "Crack propagation detection", "Site security & progress views", "Cloud inspection portal"],
      images: [
        { src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85", alt: "Optical sensor", caption: "Continuous remote visual audits" }
      ]
    },
    {
      title: "Hydrological & Meteorological Sensors",
      group: "Monitoring",
      intro: "Real-time water level, discharge, and weather monitoring stations.",
      description: "Radar stage sensors, ultrasonic flow meters, and meteorological masts reporting over telemetry networks.",
      outcomes: ["Hourly hydrographs & rainfall", "Flood peak warning alerts", "Telemetry health logs", "Historical basin data exports"],
      images: [
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85", alt: "Hydro sensor", caption: "Real-time watershed telemetry" }
      ]
    },
    {
      title: "Equipment Rental",
      group: "Professional Services",
      intro: "Calibrated survey instruments and LiDAR systems available for project deployment.",
      description: "Rent GNSS receivers, robotic total stations, drone payloads, and accessories with calibration certificates.",
      outcomes: ["Inspected & calibrated gear", "Full field kit accessories", "Technical setup briefing", "Backup equipment options"],
      images: [
        { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85", alt: "Survey gear", caption: "Fleet ready for mobilization" }
      ]
    },
    {
      title: "Software Development",
      group: "Professional Services",
      intro: "Bespoke geospatial algorithms, web apps, and automated analysis tools.",
      description: "Custom Python, C++, and React GIS tools for specialized spatial engineering workflows.",
      outcomes: ["Custom plugins & tools", "API integrations", "Secure cloud architectures", "Comprehensive documentation"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Code and software", caption: "Software tailored to field workflows" }
      ]
    },
    {
      title: "Capacity Building",
      group: "Professional Services",
      intro: "Hands-on training in UAV flight operations, point cloud processing, and GIS.",
      description: "Industry-certified curricula taught by licensed surveyors and experienced geomatics engineers.",
      outcomes: ["Certified operator skills", "Standard operating manuals", "Course completion certificates", "Ongoing post-training support"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "Training room", caption: "Practical skills for field teams" }
      ]
    },
    {
      title: "Calibration & Maintenance",
      group: "Professional Services",
      intro: "Collimator-tested service, optical alignment, and sensor calibration.",
      description: "Authorized service center with traceable standards ensuring your instruments maintain design tolerances.",
      outcomes: ["ISO calibration certificates", "Optical alignment checks", "Firmware & sensor diagnostics", "Preventative service maintenance"],
      images: [
        { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85", alt: "Lab calibration", caption: "Traceable metrological precision" }
      ]
    }
  ],
  Products: [
    {
      title: "DJI Matrice 350 RTK",
      group: "UAV & Payloads",
      subcategory: "Unmanned Aerial Vehicles (UAV)",
      brand: "DJI Enterprise",
      brandUrl: "https://enterprise.dji.com/matrice-350-rtk",
      intro: "Flagship commercial drone platform with 55-min flight time, IP55 rating, and multi-payload support.",
      description: "The Matrice 350 RTK sets an industrial benchmark with next-generation video transmission, enhanced flight safety, and comprehensive payload compatibility for surveying, mapping, and public safety.",
      outcomes: ["55-minute max flight time", "IP55 weather resistance rating", "DJI O3 Enterprise transmission up to 20 km", "2.7 kg max payload capacity"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "DJI Matrice 350 RTK", caption: "Heavy-duty enterprise survey UAV" }
      ]
    },
    {
      title: "DJI Zenmuse L2",
      group: "UAV & Payloads",
      subcategory: "LiDAR & Photogrammetry Payloads",
      brand: "DJI Enterprise",
      brandUrl: "https://enterprise.dji.com/zenmuse-l2",
      intro: "Integrated aerial LiDAR system with high-precision IMU and 4/3 CMOS RGB mapping camera.",
      description: "Combines high-accuracy frame LiDAR, a self-developed high-accuracy IMU system, and a 4/3 CMOS RGB mapping camera to deliver precise geospatial data acquisition under dense vegetation and complex terrain.",
      outcomes: ["250,000 pts/s sampling rate", "Up to 5 returns support", "4/3 CMOS 20MP mechanical shutter camera", "Vertical accuracy 4 cm / Horizontal 5 cm"],
      images: [
        { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85", alt: "DJI Zenmuse L2 LiDAR", caption: "Industrial aerial LiDAR & photogrammetry payload" }
      ]
    },
    {
      title: "DJI Zenmuse H30 Series",
      group: "UAV & Payloads",
      subcategory: "Surveillance & Search Payloads",
      brand: "DJI Enterprise",
      brandUrl: "https://enterprise.dji.com/zenmuse-h30-series",
      intro: "All-weather multi-sensor aerial payload with zoom, wide-angle, thermal, and laser rangefinder.",
      description: "Integrates five major modules: wide camera, zoom camera, infrared thermal camera, laser rangefinder, and NIR auxiliary light for 24/7 security, emergency inspection, and monitoring.",
      outcomes: ["Up to 34x optical zoom (400x digital)", "1280x1024 high-res infrared thermal", "3,000 m laser rangefinder range", "IP54 protection from -20°C to 50°C"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Zenmuse H30 Series", caption: "Multi-sensor aerial surveillance payload" }
      ]
    },
    {
      title: "Trimble R12i GNSS Receiver",
      group: "Survey Equipment",
      subcategory: "GNSS Receivers",
      brand: "Trimble",
      brandUrl: "https://geospatial.trimble.com/en/products/hardware/trimble-r12i",
      intro: "Industry-leading GNSS system powered by Trimble ProPoint RTK engine and TIP tilt compensation.",
      description: "Delivers unmatched GNSS performance, speed, and accuracy to boost surveyor productivity. TIP technology allows tilt compensation without magnetic interference calibration.",
      outcomes: ["Trimble ProPoint GNSS technology", "Trimble TIP tilt compensation", "672-channel multi-constellation tracking", "Sub-centimeter RTK precision"],
      images: [
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85", alt: "Trimble R12i GNSS Receiver", caption: "Survey-grade geodetic rover and base system" }
      ]
    },
    {
      title: "Trimble S9 Robotic Total Station",
      group: "Survey Equipment",
      subcategory: "Total Stations",
      brand: "Trimble",
      brandUrl: "https://geospatial.trimble.com/en/products/hardware/trimble-s9-total-station",
      intro: "Top-tier 0.5-second robotic total station for high-precision engineering, monitoring, and tunneling.",
      description: "Engineered for superior performance in specialized applications like monitoring and tunneling where maximum accuracy and precision are paramount.",
      outcomes: ["0.5\" or 1\" angular accuracy", "Trimble DR Plus & DR HP EDM options", "MagDrive servo technology", "FineLock technology for interference-free locking"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Trimble S9 Total Station", caption: "Sub-second robotic total station optics" }
      ]
    },
    {
      title: "GreenValley LiGrip H300 Handheld SLAM",
      group: "Survey Equipment",
      subcategory: "Laser Scanners & SLAM",
      brand: "GreenValley",
      brandUrl: "https://greenvalleyintl.com",
      intro: "Handheld mobile LiDAR scanner with multi-platform adaptability and real-time SLAM point cloud display.",
      description: "Lightweight and versatile mobile mapping system designed to capture high-density 3D spatial data in GPS-denied indoor, underground, and forest canopy environments.",
      outcomes: ["300 m measurement range", "640,000 points per second rate", "Real-time SLAM point cloud display", "Integrated panoramic HD camera"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "LiGrip H300 SLAM", caption: "Mobile handheld 3D laser scanner" }
      ]
    },
    {
      title: "Trimble MX50 Mobile Mapping System",
      group: "Survey Equipment",
      subcategory: "Mobile Mapping Systems",
      brand: "Trimble",
      brandUrl: "https://geospatial.trimble.com/en/products/hardware/trimble-mx50",
      intro: "Vehicle-mounted mobile LiDAR scanning and 360-degree high-resolution imaging system.",
      description: "Practical mobile mapping solution combining LiDAR profiling with high-resolution imagery for asset management, road inspection, and corridor engineering.",
      outcomes: ["Dual-laser LiDAR sensor technology", "360-degree panoramic camera system", "Trimble AP-20 GNSS-inertial system", "Survey-grade road surface point clouds"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85", alt: "Trimble MX50", caption: "Highway-speed mobile spatial capture" }
      ]
    },
    {
      title: "Seco Carbon-Fiber Geodetic Survey Kit",
      group: "Survey Equipment",
      subcategory: "Survey Accessories",
      brand: "Seco",
      brandUrl: "https://surveying.com",
      intro: "Heavy-duty carbon-fiber rover rods, tribrachs with optical plumet, and all-weather bipods.",
      description: "Rigorous field survey accessories designed to keep instrumentation stable and accurately leveled across steep and windy terrain.",
      outcomes: ["Carbon-fiber snap-lock rover rods", "Heavy-duty wooden & fiberglass tripods", "Precision optical plummet tribrachs", "360-degree copper coated survey prisms"],
      images: [
        { src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1800&q=85", alt: "Seco Survey Accessories", caption: "Professional field survey accessories" }
      ]
    },
    {
      title: "Trimble Business Center (TBC)",
      group: "Software",
      subcategory: "Trimble Business Center & Access",
      brand: "Trimble",
      brandUrl: "https://geospatial.trimble.com/en/products/software/trimble-business-center",
      intro: "Complete field-to-finish office software package for geodetic control, CAD, and corridor design.",
      description: "Combines geodetic network adjustments, photogrammetry, point clouds, and corridor design into a single software environment for surveyors and civil engineers.",
      outcomes: ["Rigorous least squares network adjustments", "Direct CAD and GIS integration", "Automated feature code processing", "Full UAV and terrestrial point cloud support"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Trimble Business Center", caption: "Comprehensive geodetic survey office software" }
      ]
    },
    {
      title: "DJI Terra Reconstruction Suite",
      group: "Software",
      subcategory: "DJI Terra & Modify",
      brand: "DJI Enterprise",
      brandUrl: "https://enterprise.dji.com/dji-terra",
      intro: "High-throughput 2D and 3D photogrammetric reconstruction software with LiDAR point cloud processing.",
      description: "Delivers rapid 2D multispectral maps, true orthophotos, high-density 3D textured meshes, and LiDAR point cloud colorization powered by CUDA GPU acceleration.",
      outcomes: ["High-speed 2D and 3D modeling", "LiDAR point cloud POS trajectory fusion", "Multispectral radiometric index calculation", "Seamless DJI drone flight mission synchronization"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "DJI Terra", caption: "2D and 3D drone reconstruction software" }
      ]
    },
    {
      title: "GreenValley LiDAR360 Suite",
      group: "Software",
      subcategory: "LiDAR360 & LiGeoreference",
      brand: "GreenValley",
      brandUrl: "https://greenvalleyintl.com/LiDAR360/",
      intro: "Advanced point cloud post-processing software with modules for terrain, forestry, and power lines.",
      description: "Comprehensive software suite capable of handling terabytes of LiDAR point cloud data with automated ground filtering, powerline clearance detection, and forest inventory.",
      outcomes: ["Automated powerline danger tree analysis", "Individual tree segmentation (biomass & height)", "Machine learning ground classification", "Massive point cloud rendering and editing"],
      images: [
        { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85", alt: "LiDAR360 Suite", caption: "Point cloud processing & analytics" }
      ]
    },
    {
      title: "Pix4Dmatic & Pix4Dsurvey",
      group: "Software",
      subcategory: "Pix4D & Agisoft",
      brand: "Pix4D",
      brandUrl: "https://www.pix4d.com",
      intro: "Next-generation photogrammetry and LiDAR software for large-scale drone and terrestrial mapping.",
      description: "Engineered to handle massive datasets with survey-grade accuracy, seamlessly integrating aerial photogrammetry with terrestrial LiDAR.",
      outcomes: ["High-accuracy corridor and corridor orthomosaics", "Hybrid LiDAR and photogrammetry fusion", "Vectorization and CAD layer extraction", "Dense 3D point clouds with automated noise filtering"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85", alt: "Pix4Dmatic", caption: "Survey-grade large-scale drone mapping" }
      ]
    },
    {
      title: "PLS-CADD Power Line System",
      group: "Software",
      subcategory: "PLS-CADD & eCognition",
      brand: "Power Line Systems",
      brandUrl: "https://www.powline.com",
      intro: "Worldwide industry standard in overhead transmission line design and conductor thermal rating.",
      description: "Integrates terrain models from aerial LiDAR surveys with structural analysis and conductor sag-tension calculations for complete transmission line engineering.",
      outcomes: ["Conductor clearance & thermal rating analysis", "Structural tower finite element analysis", "Plan and profile drawing automated generation", "Full LiDAR point cloud terrain modeling"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "PLS-CADD", caption: "Transmission line design & engineering" }
      ]
    },
    {
      title: "Maxar WorldView-3 VHR Satellite Tasking",
      group: "Satellite & Monitoring",
      subcategory: "Satellite Imagery (Multispectral, SAR, DEM)",
      brand: "Maxar",
      brandUrl: "https://www.maxar.com",
      intro: "30 cm super-resolution commercial optical and shortwave infrared (SWIR) satellite imagery.",
      description: "Provides commercial optical imagery at 30 cm resolution with 8 multispectral bands and 8 SWIR bands, enabling deep environmental and infrastructural insights from orbit.",
      outcomes: ["30 cm native panchromatic resolution", "8-band multispectral + 8-band SWIR", "Stereo-pair Digital Surface Models (DSM)", "Archive query and dedicated orbital tasking"],
      images: [
        { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=85", alt: "WorldView-3 Satellite", caption: "30 cm commercial Earth observation" }
      ]
    },
    {
      title: "RST Instruments Wireless Inclinometer System",
      group: "Satellite & Monitoring",
      subcategory: "Geotechnical Monitoring Sensors",
      brand: "RST Instruments",
      brandUrl: "https://rstinstruments.com",
      intro: "Automated in-place inclinometer strings with wireless LoRa mesh telemetry for slope stability.",
      description: "Continuous real-time tracking of lateral ground displacement in landslides, open pit mines, and dam embankments with automated alarms.",
      outcomes: ["Biaxial MEMS in-place inclinometer string", "Long-range wireless LoRa mesh nodes", "Cloud dashboard with automated threshold alarms", "Sub-millimeter displacement detection"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85", alt: "Geotechnical Inclinometer", caption: "Sub-surface geotechnical displacement monitoring" }
      ]
    },
    {
      title: "Phase One iXM-100 Geospatial Camera",
      group: "Satellite & Monitoring",
      subcategory: "Geospatial Optical Sensors",
      brand: "Phase One",
      brandUrl: "https://geospatial.phaseone.com",
      intro: "100 MP medium format metric camera engineered specifically for aerial inspection and mapping.",
      description: "Features a backside-illuminated medium format sensor with high dynamic range and leaf shutter optics for high-resolution aerial mapping and infrastructure inspection.",
      outcomes: ["100 MP medium format BSI sensor", "Leaf shutter with speeds up to 1/2500 s", "Metric calibration for photogrammetric rigor", "Dynamic range exceeding 83 dB"],
      images: [
        { src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85", alt: "Phase One iXM-100", caption: "Medium format metric aerial sensor" }
      ]
    },
    {
      title: "Campbell Scientific CR1000X Hydro-Met Station",
      group: "Satellite & Monitoring",
      subcategory: "Hydro-Met Logging Sensors",
      brand: "Campbell Scientific",
      brandUrl: "https://www.campbellsci.com",
      intro: "Rugged core data logger with non-contact radar water level sensor and telemetry for basins.",
      description: "Industrial measurement and control data logger for severe environmental conditions, monitoring water levels, discharge, rainfall, and climate parameters.",
      outcomes: ["Non-contact radar water level sensor (±2 mm)", "Tipping bucket rain gauge with pulse counter", "Cellular and Iridium satellite dual telemetry", "Low-power solar charging power supply"],
      images: [
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85", alt: "Campbell Scientific Station", caption: "Automated hydrological & meteorological monitoring" }
      ]
    }
  ],
  Industries: [
    {
      title: "Infrastructure",
      intro: "Accurate spatial intelligence for energy, transport and network-critical assets.",
      description: "From hydropower corridors to telecom networks, we help infrastructure owners measure, validate and manage assets with the geospatial precision those decisions require.",
      items: [
        "Hydropower & Energy",
        "Roads, Highways & Bridges",
        "Transmission Lines",
        "Telecom Networks"
      ]
    },
    {
      title: "Government & Urban",
      intro: "National and municipal datasets built to support planning, public service and accountability.",
      description: "Government teams need a trusted baseline for planning, asset visibility and public reporting. Our data capture and GIS delivery supports digital twins, municipal operations and national mapping programmes.",
      items: [
        "Smart Cities & Digital Twins",
        "Municipalities",
        "National Mapping Agencies"
      ]
    },
    {
      title: "Natural Resources",
      intro: "Operational insight across forestry, agriculture and extractive landscapes.",
      description: "Resource managers work across large, complex terrain. We turn field reality into interpretable spatial data so teams can estimate inventory, monitor change and plan with more certainty.",
      items: [
        "Forestry & Biomass",
        "Agriculture & Irrigation",
        "Mining & Quarrying"
      ]
    },
    {
      title: "Safety & Research",
      intro: "High-trust geospatial information for risk management, field research and site safety.",
      description: "Whether it is flood resilience, construction layout or university-led research, dependable spatial data reduces uncertainty and makes field decisions more defensible.",
      items: [
        "Disaster & Flood Management",
        "Construction & Site Layout",
        "Universities & R&D"
      ]
    }
  ],
  Company: {
    Leadership: [
      {
        name: "Er. Ameet Niraula",
        role: "Chief Executive Officer & Geomatics Lead",
        division: "Executive & Strategic Leadership",
        bio: "Specialist in geodetic control networks, UAV LiDAR missions, and national spatial infrastructure with over 12 years of mission execution."
      },
      {
        name: "Er. Suman Karki",
        role: "Head of Remote Sensing & Aerial Operations",
        division: "LiDAR & Aerial Operations",
        bio: "Commercial flight operations lead directing multi-sensor drone campaigns, bathymetric surveys, and high-altitude corridor capture."
      },
      {
        name: "Pooja Sharma",
        role: "Director of Enterprise GIS & Software",
        division: "Software & Spatial Databases",
        bio: "Architect of enterprise spatial databases, real-time telemetry pipelines, and municipal digital twins."
      }
    ],
    Partners: [
      {
        id: "PART-01",
        name: "Trimble Geospatial",
        category: "Hardware & Software",
        tier: "Global Technology Partner",
        description: "Authorized reseller and technical integration partner for survey-grade GNSS, total stations, and TBC software."
      },
      {
        id: "PART-02",
        name: "DJI Enterprise",
        category: "UAV Systems",
        tier: "Gold Systems Partner",
        description: "Certified enterprise dealer for Matrice series UAVs, Zenmuse LiDAR, and photogrammetry payloads."
      },
      {
        id: "PART-03",
        name: "GreenValley International",
        category: "Point Cloud Analytics",
        tier: "Strategic Solution Partner",
        description: "Official technology partner for LiDAR360 forestry, power line inspection, and handheld SLAM systems."
      },
      {
        id: "PART-04",
        name: "Planet Labs & Maxar",
        category: "Satellite Imagery",
        tier: "Data Provider Partner",
        description: "Direct tasking and high-resolution optical and SAR imagery provider for multi-temporal site analytics."
      }
    ],
    Clients: [
      { name: "Nepal Electricity Authority", category: "Energy & Infrastructure", description: "", order: 1 },
      { name: "Kathmandu University", category: "Education & Research", description: "", order: 2 },
      { name: "Food and Agriculture Organization", category: "Public Institutions", description: "", order: 3 },
      { name: "Land Management Training Centre", category: "Land & Geospatial", description: "", order: 4 },
      { name: "Armed Police Force Nepal", category: "Public Institutions", description: "", order: 5 },
      { name: "Department of Survey", category: "Land & Geospatial", description: "", order: 6 },
      { name: "Municipal Governments", category: "Local Government", description: "", order: 7 },
      { name: "Hydropower Developers", category: "Energy & Infrastructure", description: "", order: 8 },
    ],
    Insights: [
      {
        slug: "cors-network-expansion",
        title: "GeoSAT supports CORS network expansion for continuous positioning",
        date: "2026-06-18",
        category: "Infrastructure",
        excerpt: "New reference station deployments extend network-RTK coverage for engineering and cadastral teams working outside the Kathmandu valley.",
        body: [
          "GeoSAT is supporting the next phase of CORS network expansion to improve continuous positioning in areas that remain underserved by high-precision GNSS services.",
          "The new reference station deployments strengthen access to network-RTK coverage for engineering, cadastral and asset-management teams operating beyond the Kathmandu valley.",
          "As more teams rely on geospatially accurate workflows for corridor design and parcel validation, the expanded network improves productivity and precision."
        ]
      },
      {
        slug: "lidar-academy-cohort",
        title: "Fifth LiDAR processing cohort completes advanced certification",
        date: "2026-05-02",
        category: "Training",
        excerpt: "Engineers from utilities, municipalities and consulting firms completed six days of hands-on classification and feature-extraction training.",
        body: [
          "The fifth GeoSAT LiDAR processing cohort completed a six-day intensive programme focused on classification, feature extraction and quality assurance workflows.",
          "Participants from utilities and consulting firms worked through realistic field and office scenarios, turning raw point clouds into decision-ready assets."
        ]
      },
      {
        slug: "hydropower-monitoring-study",
        title: "Long-term dam deformation monitoring with automated total stations",
        date: "2026-04-10",
        category: "Monitoring",
        excerpt: "Case study on how continuous sub-millimeter displacement monitoring helps prevent slope failure on major hydro assets.",
        body: [
          "Continuous optical and GNSS monitoring deployed along the spillway structure provided real-time telemetry throughout the monsoon season without human intervention."
        ]
      }
    ],
    Resources: DEFAULT_RESOURCES,
  }
};

export function getPageContentForTreeItem(match: {
  tab?: { id?: string; label?: string; slug?: string };
  column?: { title?: string; slug?: string };
  item: {
    title?: string;
    slug?: string;
    href?: string;
    intro?: string;
    description?: string;
    outcomes?: string[];
    images?: { src: string; alt: string; caption: string }[];
  };
} | null): SiteSectionItem | null {
  if (!match) {
    return null;
  }

  const content = getSiteContent();
  const tabId = match.tab?.id;
  const sectionKey: SiteSectionKey | null =
    tabId === "solutions"
      ? "Solutions"
      : tabId === "products"
        ? "Products"
        : tabId === "industries"
          ? "Industries"
          : null;

  if (!sectionKey) {
    return null;
  }

  const sections = content as unknown as Record<SiteSectionKey, SiteSectionItem[]>;
  const sectionData = sections[sectionKey];
  if (!Array.isArray(sectionData)) {
    return null;
  }

  const title = match.item.title || "";
  const slug = match.item.slug || "";
  const href = match.item.href || "";

  const matchedEntry = sectionData.find((entry) => {
    const entryTitle = entry?.title || "";
    const entrySlug = normalizeContentSlug(entryTitle);
    const itemSlug = normalizeContentSlug(title || slug || "");

    return (
      entryTitle === title ||
      entrySlug === slug ||
      itemSlug === entrySlug ||
      (href && entryTitle && href.endsWith(`/${normalizeContentSlug(entryTitle)}`)) ||
      (itemSlug && entrySlug === itemSlug)
    );
  });

  return matchedEntry ?? null;
}

export function syncTreeItemWithSiteContent(
  tab: NavTreeTab,
  column: NavTreeColumn,
  item: NavTreeItem,
): boolean {
  const content = getSiteContent();
  const sectionKey: SiteSectionKey | null =
    tab.id === "solutions"
      ? "Solutions"
      : tab.id === "products"
        ? "Products"
        : tab.id === "industries"
          ? "Industries"
          : null;

  if (!sectionKey) {
    return false;
  }

  const sections = content as unknown as Record<SiteSectionKey, SiteSectionItem[]>;
  const sectionData: SiteSectionItem[] = Array.isArray(sections[sectionKey])
    ? sections[sectionKey]
    : [];
  const targetTitle = item.title || "";
  const targetSlug = item.slug || normalizeContentSlug(targetTitle);
  const entryIndex = sectionData.findIndex((entry) => {
    const entryTitle = entry?.title || "";
    return (
      entryTitle === targetTitle ||
      normalizeContentSlug(entryTitle) === targetSlug ||
      (entry?.slug && normalizeContentSlug(entry.slug) === targetSlug)
    );
  });

  const nextEntry: SolutionItem = {
    title: targetTitle || tab.label || column.title || "Untitled page",
    group: column.title || tab.label || "General",
    intro: item.intro || "",
    description: item.description || "",
    outcomes: Array.isArray(item.outcomes) ? item.outcomes : [],
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [],
  };

  if (entryIndex >= 0) {
    sectionData[entryIndex] = { ...sectionData[entryIndex], ...nextEntry };
  } else {
    sectionData.push(nextEntry);
  }

  sections[sectionKey] = sectionData;
  return saveSiteContent(content);
}

export function removeTreeItemFromSiteContent(
  tabId: string,
  item: { title?: string; slug?: string },
): boolean {
  const content = getSiteContent();
  const sectionKey: SiteSectionKey | null =
    tabId === "solutions"
      ? "Solutions"
      : tabId === "products"
        ? "Products"
        : tabId === "industries"
          ? "Industries"
          : null;

  const sections = content as unknown as Record<SiteSectionKey, SiteSectionItem[]>;

  if (!sectionKey || !Array.isArray(sections[sectionKey])) {
    return false;
  }

  const targetTitle = item.title || "";
  const targetSlug = item.slug || normalizeContentSlug(targetTitle);
  const filtered = sections[sectionKey].filter((entry) => {
    const entryTitle = entry?.title || "";
    return !(
      entryTitle === targetTitle ||
      normalizeContentSlug(entryTitle) === targetSlug ||
      (entry?.slug && normalizeContentSlug(entry.slug) === targetSlug)
    );
  });

  sections[sectionKey] = filtered;
  return saveSiteContent(content);
}

/**
 * Initializes and gets the current site content data
 */
export function getSiteContent(): SiteContentData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading site-content.json:", err);
  }

  // Ensure directory exists and write initial file
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing initial site-content.json:", err);
  }

  return DEFAULT_SITE_CONTENT;
}

/**
 * Saves updated content to disk
 */
export function saveSiteContent(data: SiteContentData): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to save site content:", err);
    return false;
  }
}
