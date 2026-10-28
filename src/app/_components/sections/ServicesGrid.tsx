import {
  Aperture,
  ArrowRight,
  Compass,
  Crosshair,
  Radar,
  Route,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

type Service = {
  icon: LucideIcon;
  title: string;
  tag: string;
  description: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    icon: Radar,
    title: "UAV LiDAR Survey",
    tag: "3D Point Cloud",
    description:
      "High-density aerial 3D point cloud generation for detailed terrain modeling, corridor mapping, and canopy penetration.",
    href: "/solutions/uav-lidar-survey",
  },
  {
    icon: Aperture,
    title: "Drone Photogrammetry",
    tag: "Orthomosaic & Mesh",
    description:
      "Ultra-high resolution aerial imagery processing, orthomosaic creation, and accurate 3D surface mesh modeling.",
    href: "/solutions/drone-photogrammetry",
  },
  {
    icon: Compass,
    title: "Engineering Survey",
    tag: "Cadastral & Site",
    description:
      "Precise topographic mapping, boundary verification, and structural layout support for civil infrastructure projects.",
    href: "/solutions/engineering-survey",
  },
  {
    icon: Crosshair,
    title: "GNSS & Total Station Survey",
    tag: "Sub-cm RTK",
    description:
      "Sub-centimeter geodetic positioning, control point setup, and boundary surveying using modern RTK GNSS systems.",
    href: "/solutions/gnss-and-total-station-survey",
  },
  {
    icon: Route,
    title: "Mobile Mapping",
    tag: "Corridor LiDAR",
    description:
      "Rapid 3D data capture along road corridors, urban environments, and infrastructure assets using vehicle-mounted LiDAR.",
    href: "/solutions/mobile-mapping",
  },
  {
    icon: Waves,
    title: "Hydrographic Survey",
    tag: "Bathymetric",
    description:
      "Bathymetric mapping, riverbed profiling, and underwater topography for water resources and marine engineering.",
    href: "/solutions/hydrographic-survey",
  },
];

export function ServicesGrid() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-[#94a3b8] px-6 py-20 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <h2
            id="services-heading"
            className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[28px] md:text-[32px] text-[#1e293b] tracking-[0.05em] uppercase"
          >
            OUR SERVICES
          </h2>
          <p className="font-sans text-sm md:text-base text-[#0f172a]/80 max-w-2xl mx-auto mt-4 leading-relaxed">
            We deliver high-precision surveying, geospatial data acquisition,
            and spatial mapping solutions tailored to meet the highest industry
            standards.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SERVICES.map((service, index) => (
            <Reveal
              key={service.title}
              as="article"
              className="h-full"
              delay={index * 0.06}
            >
              <Link
                href={service.href}
                className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:p-8"
              >
                {/* Animated top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex items-center justify-between mb-6">
                  <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/80 border border-emerald-200/60 text-emerald-700 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600">
                    <service.icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200/80 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200">
                    {service.tag}
                  </span>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[18px] leading-[1.35] text-[#0f172a] mt-3 mb-2 transition-colors group-hover:text-emerald-700">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 group-hover:text-emerald-800">
                  Explore Service
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
