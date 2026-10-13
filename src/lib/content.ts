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
    href: "/solutions",
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
    href: "/products",
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
    href: "/company/about/geosat-partners",
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

