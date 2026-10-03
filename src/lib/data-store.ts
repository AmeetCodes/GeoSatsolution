import fs from "fs";
import path from "path";

export interface SolutionItem {
  title: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
  images: { src: string; alt: string; caption: string }[];
}

export interface ProductItem {
  title: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
  images: { src: string; alt: string; caption: string }[];
}

export interface IndustryItem {
  title: string;
  intro: string;
  description: string;
  items: string[];
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
}

export interface CareerRole {
  slug: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export interface PartnerItem {
  id: string;
  name: string;
  category: string;
  tier: string;
  description: string;
}

export interface LeaderItem {
  name: string;
  role: string;
  division: string;
  bio: string;
}

export interface SiteContentData {
  Solutions: SolutionItem[];
  Products: ProductItem[];
  Industries: IndustryItem[];
  Company: {
    Leadership: LeaderItem[];
    Partners: PartnerItem[];
    Insights: NewsItem[];
    Careers: CareerRole[];
  };
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
      title: "Unmanned Aerial Vehicles (UAV)",
      group: "UAV & Payloads",
      intro: "Heavy-lift multirotors and long-endurance VTOL fixed-wing survey aircraft.",
      description: "Platforms engineered for high-altitude missions, heavy winds, and terrain-following survey operations.",
      outcomes: ["Up to 90 min flight endurance", "RTK/PPK GNSS receivers", "Modular payload bay", "Weather-resistant IP55 enclosure"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "UAV Drone", caption: "Industrial survey-grade UAV systems" }
      ]
    },
    {
      title: "LiDAR & Photogrammetry Payloads",
      group: "UAV & Payloads",
      intro: "High-density laser scanners and full-frame calibrated photogrammetry cameras.",
      description: "Multi-echo laser sensors capturing up to 2 million pulses per second alongside 61MP RGB mapping cameras.",
      outcomes: ["Multi-target return scanning", "Integrated tactical grade IMU", "Global shutter photogrammetry", "Pre-calibrated lens optics"],
      images: [
        { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85", alt: "LiDAR sensor payload", caption: "Payloads designed for bare-earth capture" }
      ]
    },
    {
      title: "Surveillance & Search Payloads",
      group: "UAV & Payloads",
      intro: "Radiometric thermal sensors and 30x optical zoom gimbal stabilization systems.",
      description: "Dual-sensor thermal and optical payloads for asset inspection, disaster response, and corridor security.",
      outcomes: ["640x512 Radiometric Thermal", "30x Optical Zoom with Laser Rangefinder", "Target tracking & geo-location", "Weatherproof IP44 rating"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Thermal payload", caption: "Actionable inspection intelligence" }
      ]
    },
    {
      title: "GNSS Receivers",
      group: "Survey Equipment",
      intro: "Multi-constellation, multi-frequency geodetic receivers with tilt compensation.",
      description: "1408 channels tracking GPS, GLONASS, Galileo, BeiDou, and QZSS with IMU calibration-free tilt survey.",
      outcomes: ["Sub-cm RTK accuracy", "60-degree IMU tilt compensation", "Internal 4G LTE & UHF radio", "Rugged IP68 magnesium alloy body"],
      images: [
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85", alt: "GNSS Rover", caption: "Field-tested geodetic positioning" }
      ]
    },
    {
      title: "Total Stations",
      group: "Survey Equipment",
      intro: "Sub-second robotic total stations with auto-pointing and prism tracking.",
      description: "Precision motorized optics delivering 0.5-second angular accuracy and 1000m reflectorless measurement.",
      outcomes: ["0.5\" / 1\" angular accuracy", "1000m non-prism range", "Long-range Bluetooth & robotic control", "Built-in camera for digital aiming"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Total Station", caption: "Robotic high-precision optics" }
      ]
    },
    {
      title: "Laser Scanners & SLAM",
      group: "Survey Equipment",
      intro: "Handheld mobile SLAM and terrestrial 3D laser scanners for interiors and underground.",
      description: "Rapid 3D mapping without GPS requirements for tunnels, mines, architectural BIM, and complex forestry.",
      outcomes: ["300,000 points per second capture", "Real-time SLAM trajectory calculation", "Colorized point clouds with 360 camera", "Lightweight handheld ergonomic form"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "Handheld SLAM", caption: "GPS-denied 3D laser scanning" }
      ]
    },
    {
      title: "Mobile Mapping Systems",
      group: "Survey Equipment",
      intro: "Turnkey vehicle-roof modular scanning rigs with dual LiDAR and 360 imaging.",
      description: "Survey-grade vehicular mapping solution delivering road topography, clearance, and street inventory.",
      outcomes: ["High-accuracy GNSS/INS integration", "Spherical high-res imagery", "Rapid mounting on standard vehicles", "Automated calibration routine"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85", alt: "Mobile Mapping", caption: "Highway-speed infrastructure capture" }
      ]
    },
    {
      title: "Survey Accessories",
      group: "Survey Equipment",
      intro: "Carbon-fiber tripods, tribrachs, prisms, survey poles, and solar battery systems.",
      description: "Heavy-duty accessories engineered to maintain stable geometry under windy and harsh field conditions.",
      outcomes: ["Heavy-duty wooden & carbon tripods", "Optical plummet tribrachs", "360-degree copper coated prisms", "Field-swappable lithium batteries"],
      images: [
        { src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1800&q=85", alt: "Accessories", caption: "Professional field hardware" }
      ]
    },
    {
      title: "Trimble Business Center & Access",
      group: "Software",
      intro: "Survey office and field software connecting total stations, GNSS, and scanning.",
      description: "Unified geodetic processing, network adjustment, corridor design, and CAD deliverable generation.",
      outcomes: ["Complete geodetic network adjustments", "Direct CAD and GIS export formats", "Surface modeling & volume analysis", "Field-to-finish workflow sync"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "Trimble Software", caption: "The industry standard for geodetic control" }
      ]
    },
    {
      title: "DJI Terra & Modify",
      group: "Software",
      intro: "High-efficiency photogrammetry, LiDAR processing, and 3D mesh editing suite.",
      description: "Accelerated reconstruction of 2D orthomosaics, 3D models, and point cloud colorization.",
      outcomes: ["Fast multi-core GPU processing", "Automated ground classification", "Interactive 3D mesh smoothing & repair", "GCP auto-identification"],
      images: [
        { src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85", alt: "DJI Terra", caption: "Rapid drone mapping & mesh generation" }
      ]
    },
    {
      title: "LiDAR360 & LiGeoreference",
      group: "Software",
      intro: "Comprehensive point cloud processing software for terrain, forestry, and power lines.",
      description: "Advanced classification algorithms for power line clearance, tree segmentation, and digital elevation models.",
      outcomes: ["Automated power line vegetation hazard analysis", "Single tree biomass & height extraction", "High-accuracy DTM stripping", "Batch cross-section generation"],
      images: [
        { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85", alt: "LiDAR360", caption: "Point cloud analytics and forestry modeling" }
      ]
    },
    {
      title: "Pix4D & Agisoft",
      group: "Software",
      intro: "Photogrammetric computer vision engines for drone and aerial mapping.",
      description: "Dense 3D point cloud generation and multispectral index calculation from overlapping imagery.",
      outcomes: ["True orthophoto generation", "Multispectral index maps (NDVI, NDRE)", "Dense 3D point clouds", "Detailed camera calibration reports"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85", alt: "Pix4D mapping", caption: "Computer vision photogrammetry" }
      ]
    },
    {
      title: "PLS-CADD & eCognition",
      group: "Software",
      intro: "Structural transmission line design and object-based image analysis.",
      description: "Advanced power line engineering modeling wire sag, clearance, structural loading, and automated feature extraction.",
      outcomes: ["Transmission tower structural modeling", "Thermal sag & blowout clearances", "Automated land cover classification", "Object-based feature recognition"],
      images: [
        { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85", alt: "PLS CADD", caption: "Power line corridor engineering" }
      ]
    },
    {
      title: "Satellite Imagery (Multispectral, SAR, DEM)",
      group: "Satellite & Monitoring",
      intro: "Very high resolution (VHR) commercial satellite tasking and archive access.",
      description: "Sub-meter optical constellations, SAR imagery for all-weather penetration, and global digital surface models.",
      outcomes: ["30cm - 50cm optical satellite imagery", "Interferometric SAR deformation data", "High-resolution satellite DEMs", "Stereo-pair 3D terrain models"],
      images: [
        { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=85", alt: "Earth observation", caption: "Global satellite constellations" }
      ]
    },
    {
      title: "Geotechnical Monitoring Sensors",
      group: "Satellite & Monitoring",
      intro: "Piezometers, inclinometers, crack gauges, and tiltmeters with wireless telemetry.",
      description: "Continuous ground movement and pore water pressure tracking with automated alarming.",
      outcomes: ["Vibrating wire piezometers", "Borehole in-place inclinometers (IPI)", "Wireless mesh telemetry nodes", "Real-time geotechnical cloud platform"],
      images: [
        { src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85", alt: "Geotechnical sensor", caption: "Continuous ground risk detection" }
      ]
    },
    {
      title: "Geospatial Optical Sensors",
      group: "Satellite & Monitoring",
      intro: "Autonomous solar-powered camera pods with edge AI object and displacement detection.",
      description: "Rugged cameras capturing high-resolution timelapses for construction verification and remote landslide activity.",
      outcomes: ["4K optical resolution", "Internal solar charging and 4G modem", "Edge AI crack detection", "Cloud-based visual dashboard"],
      images: [
        { src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85", alt: "Optical Camera", caption: "Edge AI visual observation" }
      ]
    },
    {
      title: "Hydro-Met Logging Sensors",
      group: "Satellite & Monitoring",
      intro: "Radar water level sensors, tipping bucket rain gauges, and river discharge meters.",
      description: "Telemetry stations recording climatic data, river stages, and flood forecasts in remote basins.",
      outcomes: ["Non-contact radar level sensors", "Automated weather stations (AWS)", "Satellite & cellular dual-telemetry", "Integrated data logger with battery backup"],
      images: [
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85", alt: "River sensor", caption: "Basin-scale hydrological telemetry" }
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
    Careers: [
      {
        slug: "senior-geomatics-engineer",
        title: "Senior Geomatics Engineer",
        category: "Survey & Engineering",
        location: "Kathmandu, Nepal (with field deployment)",
        summary: "Lead complex cadastral, LiDAR, and geodetic control surveys for major infrastructure projects.",
        responsibilities: [
          "Design and execute geodetic control networks using static GNSS and network adjustment",
          "Oversee quality assurance and accuracy reporting for client deliverables",
          "Mentor junior surveyors and train client engineering teams"
        ],
        requirements: [
          "Bachelor's or Master's degree in Geomatics / Survey Engineering",
          "Minimum 4 years experience with Trimble, Leica, or similar survey equipment",
          "Proficiency in Trimble Business Center, AutoCAD Civil 3D, and QGIS"
        ]
      },
      {
        slug: "uav-lidar-mission-pilot",
        title: "UAV LiDAR Mission Pilot & Operator",
        category: "Aerial Operations",
        location: "Field operations nationwide",
        summary: "Plan and execute aerial survey missions across challenging mountainous terrain.",
        responsibilities: [
          "Conduct pre-flight site assessments, risk analysis, and airspace coordination",
          "Fly multirotor and VTOL platforms carrying LiDAR and photogrammetric sensors",
          "Perform initial field data verification and trajectory processing"
        ],
        requirements: [
          "Certified drone pilot with at least 150 logged flight hours",
          "Experience flying commercial mapping payloads in rugged terrain",
          "Strong understanding of safety protocols and airspace regulations"
        ]
      },
      {
        slug: "full-stack-gis-developer",
        title: "Full-Stack Geospatial Software Developer",
        category: "Software Development",
        location: "Kathmandu / Hybrid",
        summary: "Build cloud-native GIS portals, real-time sensor dashboards, and geoprocessing microservices.",
        responsibilities: [
          "Develop web-based map interfaces using Next.js, MapLibre, and Three.js",
          "Design spatial schemas and REST/GraphQL APIs with PostGIS and Node.js",
          "Implement automated point cloud and raster processing pipelines"
        ],
        requirements: [
          "Proficiency in TypeScript, React, Next.js, and modern CSS",
          "Hands-on experience with spatial databases (PostGIS, GeoServer)",
          "Knowledge of cloud infrastructure (Docker, AWS/GCP)"
        ]
      }
    ]
  }
};

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
