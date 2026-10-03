import fs from "fs";
import path from "path";

export interface NavTreeItem {
  id: string;
  title: string;
  slug: string;
  href?: string; // Optional custom URL or auto-generated, e.g. /solutions/uav-lidar-survey
  order: number;
  intro?: string;
  description?: string;
  outcomes?: string[];
  images?: { src: string; alt: string; caption: string }[];
  metadata?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface NavTreeColumn {
  id: string;
  title: string; // e.g. "Survey & Mapping", "About", "Insights"
  slug: string;
  order: number;
  items: NavTreeItem[];
}

export interface NavTreeTab {
  id: string; // e.g. "solutions", "products", "industries", "company"
  label: string; // e.g. "Solutions", "Products", "Industries", "Company"
  slug: string;
  href: string; // e.g. "#capabilities", "#equipment", "/industries", "#about"
  order: number;
  type?: "columns" | "cards";
  footerNote?: string;
  catalogueCta?: string;
  columns: NavTreeColumn[];
}

export interface NavigationTree {
  tabs: NavTreeTab[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TREE_FILE_PATH = path.join(process.cwd(), "src", "data", "navigation-tree.json");

/** Default initial navigation tree strictly adhering to task.md specifications */
export const DEFAULT_NAVIGATION_TREE: NavigationTree = {
  tabs: [
    {
      id: "solutions",
      label: "Solutions",
      slug: "solutions",
      href: "#capabilities",
      order: 1,
      type: "columns",
      footerNote: "Every engagement is scoped against a tolerance, not a template.",
      catalogueCta: "Request the full solutions catalogue",
      columns: [
        {
          id: "col-survey-mapping",
          title: "Survey & Mapping",
          slug: "survey-mapping",
          order: 1,
          items: [
            {
              id: "item-uav-lidar",
              title: "UAV LiDAR Survey",
              slug: "uav-lidar-survey",
              href: "/solutions/uav-lidar-survey",
              order: 1,
              intro: "A dependable picture of the ground, even where the ground is hard to reach.",
              description: "Dense point clouds penetrating steep slopes and heavy vegetation to produce true bare-earth terrain models.",
              outcomes: [
                "Calibrated LAS/LAZ point clouds",
                "High-accuracy DTM & DSM",
                "1m / 0.5m contour packages",
                "Full QA verification report",
              ],
            },
            {
              id: "item-drone-photo",
              title: "Drone Photogrammetry",
              slug: "drone-photogrammetry",
              href: "/solutions/drone-photogrammetry",
              order: 2,
              intro: "High-resolution orthomosaics and visual terrain records for site planning.",
              description: "Sub-centimeter aerial imagery tied to survey-grade ground control for engineering and cadastral requirements.",
              outcomes: [
                "Sub-cm orthomosaics (GeoTIFF)",
                "3D textured mesh models",
                "Volumetric calculation sheets",
                "GCP accuracy check sheets",
              ],
            },
            {
              id: "item-eng-survey",
              title: "Engineering Survey",
              slug: "engineering-survey",
              href: "/solutions/engineering-survey",
              order: 3,
              intro: "Precise dimensional control and as-built verification for heavy infrastructure.",
              description: "Millimeter-level alignments for tunnels, bridges, highways, and industrial structures with complete audit trails.",
              outcomes: [
                "As-built CAD drawings",
                "Alignment & profile surveys",
                "Setting-out reports",
                "Deformation tolerances",
              ],
            },
            {
              id: "item-gnss-total",
              title: "GNSS & Total Station Survey",
              slug: "gnss-and-total-station-survey",
              href: "/solutions/gnss-and-total-station-survey",
              order: 4,
              intro: "Geodetic framework establishment and tight network adjustments across complex terrain.",
              description: "Static and kinematic GNSS baseline measurements tied to national datum and global reference frames.",
              outcomes: [
                "Network adjustment reports",
                "Coordinate registers (WGS84 / Local)",
                "Benchmark monuments",
                "Traverse loop closures",
              ],
            },
            {
              id: "item-mobile-map",
              title: "Mobile Mapping",
              slug: "mobile-mapping",
              href: "/solutions/mobile-mapping",
              order: 5,
              intro: "High-speed road, railway, and corridor laser scanning at highway speeds.",
              description: "Vehicle-mounted multi-camera LiDAR capture providing asset inventories and streetscape point clouds.",
              outcomes: [
                "Continuous 360° street view imagery",
                "Calibrated corridor point clouds",
                "Asset attribute extraction tables",
              ],
            },
            {
              id: "item-hydro-survey",
              title: "Hydrographic Survey",
              slug: "hydrographic-survey",
              href: "/solutions/hydrographic-survey",
              order: 6,
              intro: "Bathymetric mapping and riverbed cross-sections for hydropower and water resources.",
              description: "Single-beam and multibeam sonar profiling coupled with RTK GNSS for reservoir volume calculations and river morphology.",
              outcomes: [
                "Underwater contour maps & 3D bathymetry",
                "Sedimentation & capacity curves",
                "River cross-section profiles",
              ],
            },
          ],
        },
        {
          id: "col-gis-data",
          title: "GIS & Data",
          slug: "gis-and-data",
          order: 2,
          items: [
            {
              id: "item-spatial-db",
              title: "Spatial Database & GIS Solutions",
              slug: "spatial-database-and-gis-solutions",
              href: "/solutions/spatial-database-and-gis-solutions",
              order: 1,
              intro: "Centralized enterprise spatial databases and spatial analytics infrastructure.",
              description: "Cloud and on-premise PostGIS, Oracle Spatial, and ArcGIS Enterprise architectures.",
              outcomes: ["Normalized spatial schemas", "Role-based security & backups", "High-throughput spatial APIs"],
            },
            {
              id: "item-enterprise-gis",
              title: "Enterprise GIS Deployment",
              slug: "enterprise-gis-deployment",
              href: "/solutions/enterprise-gis-deployment",
              order: 2,
              intro: "Scalable web GIS portals and field data capture synchronization for organizations.",
              description: "Turnkey enterprise GIS rollouts connecting field inspectors with decision-makers.",
              outcomes: ["Custom web map dashboards", "Mobile survey collection forms", "Live syncing pipelines"],
            },
            {
              id: "item-remote-sensing",
              title: "Remote Sensing & Analytics",
              slug: "remote-sensing-and-analytics",
              href: "/solutions/remote-sensing-and-analytics",
              order: 3,
              intro: "Multispectral, hyperspectral, and satellite radar image processing for land use and forestry.",
              description: "Automated classification pipelines for crop health, forest canopy, and environmental change.",
              outcomes: ["NDVI & vegetation health indices", "Land use / land cover classification maps", "Deforestation alerts"],
            },
            {
              id: "item-spatial-processing",
              title: "Spatial Data Processing",
              slug: "spatial-data-processing",
              href: "/solutions/spatial-data-processing",
              order: 4,
              intro: "High-volume raster, vector, and 3D point cloud classification pipelines.",
              description: "Automated feature extraction, contour generation, and clean geodatabase delivery.",
              outcomes: ["Classified LAS ground truth", "Topologically clean shapefiles", "Optimized cloud web tiles"],
            },
          ],
        },
        {
          id: "col-monitoring",
          title: "Monitoring",
          slug: "monitoring",
          order: 3,
          items: [
            {
              id: "item-geotech-disp",
              title: "Geotechnical Displacement Monitoring",
              slug: "geotechnical-displacement-monitoring",
              href: "/solutions/geotechnical-displacement-monitoring",
              order: 1,
              intro: "Automated sub-millimeter displacement tracking for dams, slopes, and deep excavations.",
              description: "Automated total stations, inclinometers, and piezometers transmitting real-time sensor streams.",
              outcomes: ["Live displacement vector graphs", "Automated SMS/Email exceedance alarms", "Weekly geotechnical reports"],
            },
            {
              id: "item-geospatial-opt",
              title: "Geospatial Optical Monitoring",
              slug: "geospatial-optical-monitoring",
              href: "/solutions/geospatial-optical-monitoring",
              order: 2,
              intro: "Time-lapse photogrammetry and robotic camera surveillance for critical structural stability.",
              description: "Continuous automated optical imaging tracking crack propagation and surface deformation.",
              outcomes: ["Sub-pixel crack measurements", "Comparative thermal orthomosaics", "Automated inspection logs"],
            },
            {
              id: "item-hydro-met",
              title: "Hydrological & Meteorological Sensors",
              slug: "hydrological-and-meteorological-sensors",
              href: "/solutions/hydrological-and-meteorological-sensors",
              order: 3,
              intro: "Automated water level, rainfall, and meteorological telemetry for early warning and watershed management.",
              description: "Solar-powered telemetry stations logging radar river level and weather data with satellite backup.",
              outcomes: ["Real-time gauge height logs", "Flood threshold alert notifications", "Hydrological modeling data feeds"],
            },
          ],
        },
        {
          id: "col-prof-services",
          title: "Professional Services",
          slug: "professional-services",
          order: 4,
          items: [
            {
              id: "item-equip-rental",
              title: "Equipment Rental",
              slug: "equipment-rental",
              href: "/solutions/equipment-rental",
              order: 1,
              intro: "Survey-grade GNSS, robotic total stations, UAV platforms, and LiDAR payloads on flexible terms.",
              description: "Calibrated and field-ready instruments with full accessory packages and technical mobilization support.",
              outcomes: ["Traceable calibration certificates", "Field-ready instrument kits", "Optional on-site support technician"],
            },
            {
              id: "item-soft-dev",
              title: "Software Development",
              slug: "software-development",
              href: "/solutions/software-development",
              order: 2,
              intro: "Bespoke geospatial algorithms, desktop plugins, and cloud data distribution portals.",
              description: "Custom python plugins for QGIS/ArcGIS, automated CAD LISP routines, and scalable Next.js map apps.",
              outcomes: ["Production-ready software builds", "Complete source code & documentation", "Dedicated maintenance SLAs"],
            },
            {
              id: "item-capacity-bldg",
              title: "Capacity Building",
              slug: "capacity-building",
              href: "/solutions/capacity-building",
              order: 3,
              intro: "Hands-on training for engineers, surveyors, and GIS technicians using real project datasets.",
              description: "Specialized training programs in drone piloting, point cloud processing, and GIS analysis.",
              outcomes: ["Certified course syllabus", "Hands-on workflow exercises", "Practical field execution guides"],
            },
            {
              id: "item-calib-maint",
              title: "Calibration & Maintenance",
              slug: "calibration-and-maintenance",
              href: "/solutions/calibration-and-maintenance",
              order: 4,
              intro: "Collimator bench testing, baseline EDM calibration, and preventative servicing.",
              description: "Routine servicing and accuracy audits for optical total stations, digital levels, and GNSS receivers.",
              outcomes: ["Official calibration certification", "EDM baseline distance audit report", "Sensor diagnostic checklist"],
            },
          ],
        },
      ],
    },
    {
      id: "products",
      label: "Products",
      slug: "products",
      href: "#equipment",
      order: 2,
      type: "columns",
      footerNote: "Equipment rental, licensing and operator training available.",
      catalogueCta: "Request the full products catalogue",
      columns: [
        {
          id: "col-uav-payloads",
          title: "UAV & Payloads",
          slug: "uav-and-payloads",
          order: 1,
          items: [
            {
              id: "prod-uav",
              title: "Unmanned Aerial Vehicles (UAV)",
              slug: "unmanned-aerial-vehicles-uav",
              href: "/products/unmanned-aerial-vehicles-uav",
              order: 1,
              intro: "Enterprise multirotor and VTOL fixed-wing aircraft built for high-altitude survey missions.",
              description: "Weather-resistant aerial platforms with RTK precision and swappable mapping payloads.",
              outcomes: ["Up to 55 min flight endurance", "Centimeter RTK positioning", "Wind resistance to 12 m/s"],
            },
            {
              id: "prod-lidar-payloads",
              title: "LiDAR & Photogrammetry Payloads",
              slug: "lidar-and-photogrammetry-payloads",
              href: "/products/lidar-and-photogrammetry-payloads",
              order: 2,
              intro: "Survey-grade laser scanners and full-frame oblique cameras for drone integration.",
              description: "High-frequency multichannel LiDAR paired with calibrated lenses for dense foliage penetration.",
              outcomes: ["Triple-return laser capability", "Sub-centimeter GSD sensors", "Integrated high-accuracy IMU"],
            },
            {
              id: "prod-surveillance",
              title: "Surveillance & Search Payloads",
              slug: "surveillance-and-search-payloads",
              href: "/products/surveillance-and-search-payloads",
              order: 3,
              intro: "Dual optical zoom and radiometric thermal cameras for inspection and disaster response.",
              description: "Long-range stabilized gimbal cameras with laser rangefinders for security and search missions.",
              outcomes: ["Radiometric thermal imaging", "Up to 200x hybrid zoom", "Precise GPS pin-pointing"],
            },
          ],
        },
        {
          id: "col-survey-equip",
          title: "Survey Equipment",
          slug: "survey-equipment",
          order: 2,
          items: [
            {
              id: "prod-gnss-recv",
              title: "GNSS Receivers",
              slug: "gnss-receivers",
              href: "/products/gnss-receivers",
              order: 1,
              intro: "Multi-constellation, multi-frequency geodetic GNSS receivers for RTK and static surveying.",
              description: "Tilt-compensated smart antennas tracking GPS, GLONASS, Galileo, BeiDou, and NavIC.",
              outcomes: ["Calibration-free IMU tilt up to 60°", "Ultra-rugged IP68 alloy housing", "All-day dual battery life"],
            },
            {
              id: "prod-total-stations",
              title: "Total Stations",
              slug: "total-stations",
              href: "/products/total-stations",
              order: 2,
              intro: "Manual and robotic total stations delivering sub-second angular precision for engineering.",
              description: "Long-range reflectorless EDM with automatic target recognition and motorized prism tracking.",
              outcomes: ["0.5\" to 1\" angular accuracy", "Up to 1000m reflectorless range", "Onboard field software suite"],
            },
            {
              id: "prod-laser-scanners",
              title: "Laser Scanners & SLAM",
              slug: "laser-scanners-and-slam",
              href: "/products/laser-scanners-and-slam",
              order: 3,
              intro: "Handheld, terrestrial, and mobile LiDAR systems for rapid 3D point cloud generation.",
              description: "Real-time SLAM scanning capturing underground mines, building interiors, and forest plots without GPS.",
              outcomes: ["Millions of points per second", "Colorized RGB point clouds", "Handheld walk-and-scan portability"],
            },
            {
              id: "prod-mobile-mapping",
              title: "Mobile Mapping Systems",
              slug: "mobile-mapping-systems",
              href: "/products/mobile-mapping-systems",
              order: 4,
              intro: "Vehicle-mountable high-accuracy LiDAR and 360-degree panoramic camera systems.",
              description: "Turnkey vehicular scanning rigs for highway inventory and utility corridor surveys.",
              outcomes: ["Highway-speed data capture", "Seamless GNSS/IMU dead reckoning", "GIS-ready feature outputs"],
            },
            {
              id: "prod-survey-access",
              title: "Survey Accessories",
              slug: "survey-accessories",
              href: "/products/survey-accessories",
              order: 5,
              intro: "Heavy-duty wooden tripods, carbon-fiber rover poles, precision prisms, and tribrachs.",
              description: "Industrial survey accessories tested for stability and repeatability in extreme field environments.",
              outcomes: ["Survey-grade optical tribrachs", "Quick-release carbon poles", "Zero-constant prism assemblies"],
            },
          ],
        },
        {
          id: "col-software",
          title: "Software",
          slug: "software",
          order: 3,
          items: [
            {
              id: "prod-trimble-tbc",
              title: "Trimble Business Center & Access",
              slug: "trimble-business-center-and-access",
              href: "/products/trimble-business-center-and-access",
              order: 1,
              intro: "Complete office and field surveying software suite for GNSS and total station processing.",
              description: "Network adjustment, corridor modeling, CAD deliverables, and point cloud classification.",
              outcomes: ["Rigorous least-squares adjustment", "Surface & volume calculations", "Seamless field-to-finish workflow"],
            },
            {
              id: "prod-dji-terra",
              title: "DJI Terra & Modify",
              slug: "dji-terra-and-modify",
              href: "/products/dji-terra-and-modify",
              order: 2,
              intro: "Photogrammetry and LiDAR processing software for high-efficiency 3D reconstruction.",
              description: "Fast point cloud processing, orthophoto generation, and interactive mesh defect repair.",
              outcomes: ["Real-time 2D mapping", "High-density 3D textured meshes", "Integrated LiDAR point cloud output"],
            },
            {
              id: "prod-lidar360",
              title: "LiDAR360 & LiGeoreference",
              slug: "lidar360-and-ligeoreference",
              href: "/products/lidar360-and-ligeoreference",
              order: 3,
              intro: "Comprehensive point cloud post-processing software for forestry, power lines, and terrain.",
              description: "Advanced AI classification, individual tree segmentation, and powerline danger clearance inspection.",
              outcomes: ["Automated ground filtering", "Powerline tower & conductor extraction", "Forest inventory metric tables"],
            },
            {
              id: "prod-pix4d",
              title: "Pix4D & Agisoft",
              slug: "pix4d-and-agisoft",
              href: "/products/pix4d-and-agisoft",
              order: 4,
              intro: "Photogrammetric computer vision software generating accurate orthomosaics and DEMs.",
              description: "Structure-from-Motion image alignment and multi-temporal volumetric monitoring.",
              outcomes: ["Survey-grade bundle adjustment", "Calibrated reflectance indices", "High-resolution DEM generation"],
            },
            {
              id: "prod-pls-cadd",
              title: "PLS-CADD & eCognition",
              slug: "pls-cadd-and-ecognition",
              href: "/products/pls-cadd-and-ecognition",
              order: 5,
              intro: "Overhead power line engineering design and object-based satellite image analysis.",
              description: "Industry-standard transmission line thermal rating calculation and AI land cover classification.",
              outcomes: ["Sag-tension conductor analysis", "Structural loading checks", "Rule-based object classification"],
            },
          ],
        },
        {
          id: "col-sat-mon",
          title: "Satellite & Monitoring",
          slug: "satellite-and-monitoring",
          order: 4,
          items: [
            {
              id: "prod-sat-imagery",
              title: "Satellite Imagery (Multispectral, SAR, DEM)",
              slug: "satellite-imagery-multispectral-sar-dem",
              href: "/products/satellite-imagery-multispectral-sar-dem",
              order: 1,
              intro: "High-resolution optical satellite tasking and all-weather radar constellation access.",
              description: "Sub-meter optical imagery, InSAR surface deformation tracking, and stereo DEM extraction.",
              outcomes: ["Up to 30cm optical resolution", "Interferometric mm-level ground displacement", "Regional DEM coverage"],
            },
            {
              id: "prod-geotech-sensors",
              title: "Geotechnical Monitoring Sensors",
              slug: "geotechnical-monitoring-sensors",
              href: "/products/geotechnical-monitoring-sensors",
              order: 2,
              intro: "Vibrating wire piezometers, crackmeters, and in-place inclinometers for structural safety.",
              description: "Rugged downhole sensors logging pore pressure, joint displacement, and subsurface movement.",
              outcomes: ["Vibrating-wire signal stability", "Sub-millimeter crack gauges", "Automated datalogger connectivity"],
            },
            {
              id: "prod-geospatial-opt-sens",
              title: "Geospatial Optical Sensors",
              slug: "geospatial-optical-sensors",
              href: "/products/geospatial-optical-sensors",
              order: 3,
              intro: "Automated deformation total stations and robotic cameras for high-precision structure tracking.",
              description: "Continuous 24/7 prism measurement cycles with atmospheric correction algorithms.",
              outcomes: ["Automatic target recognition", "Sub-millimeter 3D coordinate logs", "Solar-powered field enclosures"],
            },
            {
              id: "prod-hydro-met-sens",
              title: "Hydro-Met Logging Sensors",
              slug: "hydro-met-logging-sensors",
              href: "/products/hydro-met-logging-sensors",
              order: 4,
              intro: "Non-contact radar river level gauges, tipping bucket rain gauges, and weather stations.",
              description: "Solar-powered telemetry stations transmitting river stage and meteorological records via cellular and Iridium.",
              outcomes: ["Non-contact radar water level", "Tipping bucket precipitation logs", "Continuous telemetry uplink"],
            },
          ],
        },
      ],
    },
    {
      id: "industries",
      label: "Industries",
      slug: "industries",
      href: "/industries",
      order: 3,
      type: "cards",
      columns: [
        {
          id: "col-infrastructure",
          title: "Infrastructure",
          slug: "infrastructure",
          order: 1,
          items: [
            { id: "ind-hydro-energy", title: "Hydropower & Energy", slug: "hydropower-and-energy", href: "/industries/infrastructure#hydropower", order: 1, intro: "High-precision surveys for dam axes, headrace tunnels, and powerhouses." },
            { id: "ind-roads-bridges", title: "Roads, Highways & Bridges", slug: "roads-highways-and-bridges", href: "/industries/infrastructure#roads", order: 2, intro: "Corridor LiDAR and alignment staking for mountainous highways." },
            { id: "ind-trans-lines", title: "Transmission Lines", slug: "transmission-lines", href: "/industries/infrastructure#transmission", order: 3, intro: "Danger tree clearance and tower spot surveys across remote ridges." },
            { id: "ind-telecom", title: "Telecom Networks", slug: "telecom-networks", href: "/industries/infrastructure#telecom", order: 4, intro: "Line-of-sight analysis and tower structural audit surveys." },
          ],
        },
        {
          id: "col-govt-urban",
          title: "Government & Urban",
          slug: "government-and-urban",
          order: 2,
          items: [
            { id: "ind-smart-cities", title: "Smart Cities & Digital Twins", slug: "smart-cities-and-digital-twins", href: "/industries/government-and-urban#smart-cities", order: 1, intro: "Citywide 3D textured mesh and street-level asset inventory." },
            { id: "ind-municipalities", title: "Municipalities", slug: "municipalities", href: "/industries/government-and-urban#municipalities", order: 2, intro: "Cadastral parcel updating and tax assessment GIS databases." },
            { id: "ind-national-mapping", title: "National Mapping Agencies", slug: "national-mapping-agencies", href: "/industries/government-and-urban#mapping", order: 3, intro: "Geodetic network adjustments and 1:1000 base mapping." },
          ],
        },
        {
          id: "col-natural-resources",
          title: "Natural Resources",
          slug: "natural-resources",
          order: 3,
          items: [
            { id: "ind-forestry", title: "Forestry & Biomass", slug: "forestry-and-biomass", href: "/industries/natural-resources#forestry", order: 1, intro: "Canopy height modeling and individual tree biomass inventory." },
            { id: "ind-agri", title: "Agriculture & Irrigation", slug: "agriculture-and-irrigation", href: "/industries/natural-resources#agriculture", order: 2, intro: "Canal network alignments and crop stress multispectral mapping." },
            { id: "ind-mining", title: "Mining & Quarrying", slug: "mining-and-quarrying", href: "/industries/natural-resources#mining", order: 3, intro: "Stockpile volume audits and highwall geotechnical stability." },
          ],
        },
        {
          id: "col-safety-research",
          title: "Safety & Research",
          slug: "safety-and-research",
          order: 4,
          items: [
            { id: "ind-disaster-flood", title: "Disaster & Flood Management", slug: "disaster-and-flood-management", href: "/industries/safety-and-research#disaster", order: 1, intro: "Flood inundation modeling and landslide hazard mapping." },
            { id: "ind-construction", title: "Construction & Site Layout", slug: "construction-and-site-layout", href: "/industries/safety-and-research#construction", order: 2, intro: "Millimeter-level dimensional verification for structural civil engineering." },
            { id: "ind-univ-rd", title: "Universities & R&D", slug: "universities-and-rd", href: "/industries/safety-and-research#research", order: 3, intro: "High-accuracy baseline datasets for academic geosciences research." },
          ],
        },
      ],
    },
    {
      id: "company",
      label: "Company",
      slug: "company",
      href: "#about",
      order: 4,
      type: "columns",
      footerNote: "Every engagement is scoped against a tolerance, not a template.",
      catalogueCta: "Request the full company catalogue",
      columns: [
        {
          id: "col-about",
          title: "About",
          slug: "about",
          order: 1,
          items: [
            {
              id: "comp-leadership",
              title: "Executive & Technical Leads",
              slug: "executive-technical-leads",
              href: "/company/about/executive-technical-leads",
              order: 1,
              intro: "Executive and technical leadership directing surveying, LiDAR operations, and enterprise software.",
              description: "Geomatics specialists, commercial UAV mission directors, and spatial software architects.",
              outcomes: [
                "12+ years of mission execution experience",
                "Licensed Geomatics & Survey Engineers",
                "National geodetic reference specialists",
              ],
            },
            {
              id: "comp-partners",
              title: "GeoSat Partners",
              slug: "geosat-partners",
              href: "/company/about/geosat-partners",
              order: 2,
              intro: "Global technology partners and institutional relationships powering our mission capabilities.",
              description: "Authorized reseller and technical integration partners including Trimble, DJI Enterprise, and GreenValley.",
              outcomes: [
                "Authorized Hardware & Software Partner tier",
                "Certified calibration & service facilities",
                "Direct tasking access to commercial satellite constellations",
              ],
            },
          ],
        },
        {
          id: "col-insights",
          title: "Insights",
          slug: "insights",
          order: 2,
          items: [
            {
              id: "comp-news",
              title: "News & Field Notes",
              slug: "news",
              href: "/company/insights/news",
              order: 1,
              intro: "Dispatches, technical case studies, and mission debriefs from survey crews in the field.",
              description: "Observations on CORS network expansions, mountainous LiDAR flights, and dam deformation tracking.",
              outcomes: [
                "Practical field engineering case studies",
                "GNSS accuracy benchmarking data",
                "LiDAR calibration workflows",
              ],
            },
            {
              id: "comp-downloads",
              title: "Downloads & Technical Resources",
              slug: "downloads-technical-resources",
              href: "/company/insights/downloads-technical-resources",
              order: 2,
              intro: "Technical whitepapers, accuracy specification sheets, and sample LAS/LAZ datasets.",
              description: "Reference documents, accuracy tolerances, and sample point cloud deliveries for verification.",
              outcomes: [
                "Sample calibrated LAS / LAZ point clouds",
                "Standard Operating Procedure (SOP) manuals",
                "Geodetic coordinate transformation parameters",
              ],
            },
          ],
        },
        {
          id: "col-careers",
          title: "Careers",
          slug: "careers",
          order: 3,
          items: [
            {
              id: "comp-career-survey",
              title: "Survey & GIS Engineering Roles",
              slug: "survey-gis-engineering-roles",
              href: "/company/careers/survey-gis-engineering-roles",
              order: 1,
              intro: "Join our geodetic control and cadastral engineering teams executing complex terrain surveys.",
              description: "Opportunities for Senior Geomatics Engineers, GIS Analysts, and Cadastral Surveyors.",
              outcomes: [
                "Work on nation-building infrastructure projects",
                "Access to Trimble, Leica, and high-end survey equipment",
                "Competitive compensation and continuous professional development",
              ],
            },
            {
              id: "comp-career-uav",
              title: "UAV & LiDAR Operations Roles",
              slug: "uav-lidar-operations-roles",
              href: "/company/careers/uav-lidar-operations-roles",
              order: 2,
              intro: "Plan and execute aerial survey missions across high-altitude and rugged corridors.",
              description: "Roles for Commercial Drone Pilots, LiDAR Operators, and Flight Operations Leads.",
              outcomes: [
                "Fly enterprise DJI Matrice and VTOL aircraft",
                "High-altitude mountainous mission experience",
                "Flight safety training and certification support",
              ],
            },
            {
              id: "comp-career-software",
              title: "Software Development Roles",
              slug: "software-development-roles",
              href: "/company/careers/software-development-roles",
              order: 3,
              intro: "Build cloud-native GIS portals, real-time sensor dashboards, and geoprocessing pipelines.",
              description: "Full-Stack Geospatial Software Developers, PostGIS Engineers, and WebGL/Three.js creators.",
              outcomes: [
                "Build modern Next.js and MapLibre platforms",
                "Architect real-time IoT sensor telemetry streams",
                "Flexible hybrid working environment",
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** Load the navigation tree from disk, initializing if file doesn't exist */
export function getNavigationTree(): NavigationTree {
  try {
    if (fs.existsSync(TREE_FILE_PATH)) {
      const data = fs.readFileSync(TREE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed?.tabs && Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading navigation-tree.json:", err);
  }

  // Save default tree and return it
  saveNavigationTree(DEFAULT_NAVIGATION_TREE);
  return DEFAULT_NAVIGATION_TREE;
}

/** Persist navigation tree to disk */
export function saveNavigationTree(tree: NavigationTree): void {
  try {
    const dir = path.dirname(TREE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TREE_FILE_PATH, JSON.stringify(tree, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving navigation-tree.json:", err);
  }
}

/**
 * Search the tree for an item by slug path or title slug.
 * Supports both single-slug lookups and multi-segment paths.
 * Multi-segment resolution strategy:
 *   1. If the first segment matches a tab slug, search within that tab only.
 *   2. Otherwise, fall back to a global search across all tabs.
 */
export function findTreeItem(slugPath: string[] | string): {
  tab: NavTreeTab;
  column: NavTreeColumn;
  item: NavTreeItem;
} | null {
  const tree = getNavigationTree();
  const searchSlugs = Array.isArray(slugPath) ? slugPath : [slugPath];
  const terminalSlug = searchSlugs[searchSlugs.length - 1];

  // Determine which tabs to search: prefer tabs whose slug matches the first segment.
  const firstSegment = searchSlugs[0];
  const narrowedTabs = tree.tabs.filter(
    (t) => t.slug === firstSegment || t.id === firstSegment,
  );
  const tabsToSearch = narrowedTabs.length > 0 ? narrowedTabs : tree.tabs;

  for (const tab of tabsToSearch) {
    for (const column of tab.columns) {
      for (const item of column.items) {
        if (
          item.slug === terminalSlug ||
          slugify(item.title) === terminalSlug ||
          item.href?.endsWith(`/${terminalSlug}`) ||
          // Also match by full href path for deeply nested slugs
          (item.href && searchSlugs.length > 1 &&
            item.href === `/${searchSlugs.join("/")}`)
        ) {
          return { tab, column, item };
        }
      }
    }
  }

  // If narrowed search found nothing, do a global fallback search
  if (narrowedTabs.length > 0) {
    for (const tab of tree.tabs) {
      for (const column of tab.columns) {
        for (const item of column.items) {
          if (
            item.slug === terminalSlug ||
            slugify(item.title) === terminalSlug ||
            item.href?.endsWith(`/${terminalSlug}`)
          ) {
            return { tab, column, item };
          }
        }
      }
    }
  }

  return null;
}

export function getTreeItem(slugPath: string[] | string) {
  return findTreeItem(slugPath);
}

export const findTreeItemBySlug = findTreeItem;

/**
 * Return all leaf items across the entire navigation tree.
 * Used by generateStaticParams in the catch-all route.
 */
export function getAllTreeItems(): Array<{
  tab: NavTreeTab;
  column: NavTreeColumn;
  item: NavTreeItem;
}> {
  const tree = getNavigationTree();
  const results: Array<{ tab: NavTreeTab; column: NavTreeColumn; item: NavTreeItem }> = [];
  for (const tab of tree.tabs) {
    for (const column of tab.columns) {
      for (const item of column.items) {
        results.push({ tab, column, item });
      }
    }
  }
  return results;
}
