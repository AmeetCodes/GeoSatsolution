/**
 * Single source of truth for every string rendered on the marketing site.
 * The information architecture mirrors the GeoSAT Solutions navigation model —
 * four solution groups, four industry groups — so the site and the product
 * catalogue stay in step.
 */

export type NavGroup = {
  title: string;
  links: string[];
};

export const NAV: { label: string; href: string; groups?: NavGroup[] }[] = [
  {
    label: "Solutions",
    href: "#capabilities",
    groups: [
      {
        title: "Survey & Mapping",
        links: [
          "UAV LiDAR Survey",
          "Drone Photogrammetry",
          "Engineering Survey",
          "GNSS & Total Station Survey",
          "Mobile Mapping",
          "Hydrographic Survey",
        ],
      },
      {
        title: "GIS & Data",
        links: [
          "Spatial Database & GIS Solutions",
          "Enterprise GIS Deployment",
          "Remote Sensing & Analytics",
          "Spatial Data Processing",
        ],
      },
      {
        title: "Monitoring",
        links: [
          "Geotechnical Displacement Monitoring",
          "Geospatial Optical Monitoring",
          "Hydrological & Meteorological Sensors",
        ],
      },
      {
        title: "Professional Services",
        links: [
          "Equipment Rental",
          "Software Development",
          "Capacity Building",
          "Calibration & Maintenance",
        ],
      },
    ],
  },
  {
    label: "Products",
    href: "#equipment",
    groups: [
      {
        title: "UAV & Payloads",
        links: [
          "Unmanned Aerial Vehicles (UAV)",
          "LiDAR & Photogrammetry Payloads",
          "Surveillance & Search Payloads",
        ],
      },
      {
        title: "Survey Equipment",
        links: [
          "GNSS Receivers",
          "Total Stations",
          "Laser Scanners & SLAM",
          "Mobile Mapping Systems",
          "Survey Accessories",
        ],
      },
      {
        title: "Software",
        links: [
          "Trimble Business Center & Access",
          "DJI Terra & Modify",
          "LiDAR360 & LiGeoreference",
          "Pix4D & Agisoft",
          "PLS-CADD & eCognition",
        ],
      },
      {
        title: "Satellite & Monitoring",
        links: [
          "Satellite Imagery (Multispectral, SAR, DEM)",
          "Geotechnical Monitoring Sensors",
          "Geospatial Optical Sensors",
          "Hydro-Met Logging Sensors",
        ],
      },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
  },
  {
    label: "Company",
    href: "#about",
    groups: [
      {
        title: "About",
        links: [
          "Executive & Technical Leads",
          "GeoSat Partners",
        ],
      },
      {
        title: "Insights",
        links: ["News & Field Notes", "Downloads & Technical Resources"],
      },
      {
        title: "Careers",
        links: [
          "Survey & GIS Engineering Roles",
          "UAV & LiDAR Operations Roles",
          "Software Development Roles",
        ],
      },
    ],
  },
];


export const HERO = {
  eyebrow: "Survey · LiDAR · GIS · Monitoring",
  /** Rendered as three lines; the middle one carries the gradient accent. */
  title: ["Precision you can", "build on.", ""] as const,
  sub: "GeoSAT captures survey-grade spatial data — UAV LiDAR, drone photogrammetry, engineering survey, enterprise GIS and continuous asset monitoring — for the infrastructure, institutions and industries that cannot afford to guess.",
  primaryCta: "Request a site assessment",
  secondaryCta: "See how we work",
} as const;

/** Credential strip under the hero — the fast trust check. */
export const CREDENTIALS = [
  "ISO 9001:2015 quality system",
  "FIG member organisation",
  "ISPRS contributing member",
  "Calibration-traceable instruments",
];

export const SECTION_HEADERS = {
  capabilities: {
    index: "01",
    label: "Capabilities",
    title: "Four disciplines, one coordinate system.",
    lede: "Most projects fail in the gaps between contractors. We keep capture, processing, data engineering and monitoring under one roof, on one datum, so nothing has to be reconciled twice.",
  },
  equipment: {
    index: "03",
    label: "Platform",
    title: "Instruments that hold their calibration.",
    lede: "Capture, positioning, processing and analysis — maintained, traceable and checked before and after every mobilisation.",
  },
  projects: {
    index: "04",
    label: "Selected work",
    title: "Sites where a guess was not an option.",
    lede: "A cross-section of recent engagements, delivered as data the client's own engineers work from directly.",
  },
  industries: {
    index: "05",
    label: "Industries",
    title: "Measured in the units your discipline uses.",
    lede: "The same accuracy, reported the way each sector already reasons about ground — volumes, slopes, corridors, baselines or change.",
  },
} as const;


export type Capability = {
  index: string;
  title: string;
  summary: string;
  detail: string;
  services: string[];
};

export const CAPABILITIES: Capability[] = [
  {
    index: "01",
    title: "Survey & Mapping",
    summary: "Ground truth for sites that refuse to be flat.",
    detail:
      "UAV LiDAR, photogrammetry and survey-grade GNSS combined into one deliverable set — contours, volumes, as-built geometry and control — captured in a single mobilisation.",
    services: ["UAV LiDAR Survey", "Drone Photogrammetry", "Engineering Survey", "GNSS & Total Station Survey", "Mobile Mapping", "Hydrographic Survey"],
  },
  {
    index: "02",
    title: "GIS & Data",
    summary: "Raw coordinates become decisions.",
    detail:
      "Spatial databases, enterprise GIS deployment and remote sensing analysis — structured so your engineers query the asset directly, not a consultant.",
    services: ["Spatial Database & GIS Solutions", "Enterprise GIS Deployment", "Remote Sensing & Analytics", "Spatial Data Processing"],
  },
  {
    index: "03",
    title: "Monitoring",
    summary: "The asset never stops moving.",
    detail:
      "Geotechnical displacement, geospatial optical and hydro-meteorological sensing feeding dashboards and alerting, so change is observed the day it happens.",
    services: ["Geotechnical Displacement Monitoring", "Geospatial Optical Monitoring", "Hydrological & Meteorological Sensors"],
  },
  {
    index: "04",
    title: "Professional Services",
    summary: "Extend the team, keep the work moving.",
    detail:
      "Survey-grade equipment rental, bespoke spatial software, capacity building for your field teams, and calibration that keeps instruments in specification.",
    services: ["Equipment Rental", "Software Development", "Capacity Building", "Calibration & Maintenance"],
  },
];

export type ExecutiveLead = {
  name: string;
  role: string;
  description: string;
  image: string;
};

export const EXECUTIVE_LEADS: ExecutiveLead[] = [
  {
    name: "Dipesh Kuwar",
    role: "CEO",
    description: "Company strategy, partnerships and client engagement.",
    image: "/team/dipesh-kuwar.svg",
  },
  {
    name: "Head of Survey Engineering",
    role: "Survey Operations",
    description: "Control networks, field operations and accuracy assurance.",
    image: "/team/head-of-survey-engineering.svg",
  },
  {
    name: "Dibbesh Kacoul",
    role: "Managing Director",
    description: "Company strategy, partnerships and client engagement.",
    image: "/team/dibbesh-kacoul.svg",
  },
  {
    name: "Head of GIS & Remote Sensing",
    role: "Geo-Analytics",
    description: "Enterprise GIS architecture and analytical products.",
    image: "/team/head-of-gis.svg",
  },
  {
    name: "LiDAR Processing Lead",
    role: "Data Processing",
    description: "Point-cloud classification, feature extraction and QA/QC.",
    image: "/team/lidar-processing-lead.svg",
  },
  {
    name: "UAV Operations Manager",
    role: "Flight Operations",
    description: "Flight safety, regulatory compliance and fleet readiness.",
    image: "/team/uav-operations-manager.svg",
  },
  {
    name: "Training & Capacity Building Lead",
    role: "Capability Development",
    description: "Curriculum design, certification and institutional programmes.",
    image: "/team/training-capacity-building.svg",
  },
];

export const partners = [
  "DJI Enterprise",
  "Trimble",
  "GreenValley International",
  "CHCNAV",
  "Esri",
  "Agisoft",
  "Pix4D",
];

export const clients = [
  "Nepal Electricity Authority",
  "Kathmandu University",
  "Food and Agriculture Organization",
  "Land Management Training Centre",
  "Armed Police Force Nepal",
  "Department of Survey",
  "Municipal Governments",
  "Hydropower Developers",
];

export const PROJECTS = [
  {
    code: "HYD-04",
    title: "Hydropower LiDAR corridors",
    sector: "Hydropower & Energy",
    body: "Full-surface corridor capture for penstock alignment and reservoir drawdown planning, delivered as classified point clouds with hydrographic bathymetry merged into one model.",
    tags: ["UAV LiDAR", "Bathymetry", "Volumetrics"],
  },
  {
    code: "PWR-11",
    title: "Transmission route selection",
    sector: "Transmission Lines",
    body: "Comparative terrain corridors across steep valley geometry, so tower positions are chosen against surveyed ground rather than desktop contours.",
    tags: ["Corridor LiDAR", "Engineering Survey", "Slope analysis"],
  },
  {
    code: "URB-02",
    title: "Municipal digital twin",
    sector: "Smart Cities & Digital Twins",
    body: "A city-scale spatial base combining aerial capture, enterprise GIS and asset registers — one authoritative model for planning and asset teams.",
    tags: ["Enterprise GIS", "Orthomosaics", "Asset registry"],
  },
  {
    code: "FOR-07",
    title: "Forest biomass inventories",
    sector: "Forestry & Biomass",
    body: "Multispectral and LiDAR-derived canopy metrics for stand-level volume estimation, reducing field sampling density without losing confidence.",
    tags: ["Remote Sensing", "LiDAR", "Analysis"],
  },
];

export const INDUSTRIES = [
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

export const EQUIPMENT = [
  { label: "UAV platforms", value: "Fixed-wing & multirotor" },
  { label: "LiDAR payloads", value: "UAV, terrestrial & SLAM" },
  { label: "Positioning", value: "RTK / PPK GNSS receivers" },
  { label: "Angle measurement", value: "Total stations & laser scanners" },
  { label: "Processing", value: "Trimble, LiDAR360, DJI Terra, Pix4D" },
  { label: "Analysis", value: "PLS-CADD, eCognition, GIS platforms" },
];

export const FOOTER_COLUMNS = [
  {
    title: "Solutions",
    links: ["Survey & Mapping", "GIS & Data", "Monitoring", "Professional Services"],
  },
  {
    title: "Industries",
    links: ["Infrastructure", "Government & Urban", "Natural Resources", "Safety & Research"],
  },
  {
    title: "Company",
    links: ["About", "Selected Projects", "Training", "Support", "Careers", "Insights"],
  },
];

/**
 * Contact block for the footer and the closing CTA.
 * NOTE: the address and inbox below are placeholders — swap them for the
 * production details before the site goes live.
 */
export const CONTACT = {
  email: "hello@geosat.co",
  phone: "+977 1 5912 340",
  address: ["Level 4, Trade Tower Annex", "Thapathali, Kathmandu", "Nepal"],
  hours: "Sun–Fri · 09:30–18:00 NPT",
} as const;

export const CTA = {
  eyebrow: "Start a project",
  title: "Tell us the decision you need to defend.",
  body: "Send us the site, the tolerance and the deadline. You will get a method, a crew and a schedule — not a brochure.",
  primaryCta: "Request a site assessment",
  secondaryCta: "Download capability profile",
} as const;

