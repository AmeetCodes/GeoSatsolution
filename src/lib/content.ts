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
    ],
  },
];


export const HERO = {
  eyebrow: "Survey · LiDAR · GIS · Monitoring",
  /** Rendered as three lines; the middle one carries the gradient accent. */
  title: ["Precision you can", "build on.", ""] as const,
  sub: "GeoSAT captures survey-grade spatial data — UAV LiDAR, drone photogrammetry, engineering survey, enterprise GIS and continuous asset monitoring — for the infrastructure, institutions and industries that cannot afford to guess.",
  primaryCta: "Request a site assessment",
  secondaryCta: "Explore our platform",
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
    index: "02",
    label: "Platform",
    title: "Instruments that hold their calibration.",
    lede: "Capture, positioning, processing and analysis — maintained, traceable and checked before and after every mobilisation.",
  },
  projects: {
    index: "03",
    label: "Selected work",
    title: "Sites where a guess was not an option.",
    lede: "A cross-section of recent engagements, delivered as data the client's own engineers work from directly.",
  },
  industries: {
    index: "04",
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
    links: ["About", "Selected Projects", "Training", "Support", "Insights"],
  },
];

/**
 * Contact block for the footer and the closing CTA.
 * Shared contact details used by the footer and closing CTA.
 */
export const CONTACT = {
  email: "info@geosatsolutions.com.np",
  phone: "+977 9842496370",
  address: ["Phulbari Nagar Marg", "Koteshwor-32, Kathmandu 44600", "Nepal"],
  hours: "Sun–Fri · 09:30–18:00 NPT",
} as const;

