import {
  ArrowRight,
  Camera,
  Navigation,
  Ruler,
  Satellite,
  Scan,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    icon: Scan,
    title: "UAV LiDAR Survey",
    description:
      "High-density aerial 3D point cloud generation for detailed terrain modeling, corridor mapping, and canopy penetration.",
    href: "/solutions/uav-lidar-survey",
  },
  {
    icon: Camera,
    title: "Drone Photogrammetry",
    description:
      "Ultra-high resolution aerial imagery processing, orthomosaic creation, and accurate 3D surface mesh modeling.",
    href: "/solutions/drone-photogrammetry",
  },
  {
    icon: Ruler,
    title: "Engineering Survey",
    description:
      "Precise topographic mapping, boundary verification, and structural layout support for civil infrastructure projects.",
    href: "/solutions/engineering-survey",
  },
  {
    icon: Satellite,
    title: "GNSS & Total Station Survey",
    description:
      "Sub-centimeter geodetic positioning, control point setup, and boundary surveying using modern RTK GNSS systems.",
    href: "/solutions/gnss-and-total-station-survey",
  },
  {
    icon: Navigation,
    title: "Mobile Mapping",
    description:
      "Rapid 3D data capture along road corridors, urban environments, and infrastructure assets using vehicle-mounted LiDAR.",
    href: "/solutions/mobile-mapping",
  },
  {
    icon: Waves,
    title: "Hydrographic Survey",
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
            className="font-serif font-bold text-3xl md:text-4xl text-[#0f172a] tracking-tight"
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
                className="group flex h-full cursor-pointer flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md shadow-slate-900/10 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38821B] focus-visible:ring-offset-2 sm:p-8"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#38821B]/10 transition-colors duration-300 ease-in-out group-hover:bg-[#38821B]/15">
                  <service.icon
                    aria-hidden="true"
                    className="h-6 w-6 text-[#38821B]"
                  />
                </span>
                <h3 className="font-circular-medium text-lg md:text-xl font-medium text-center text-[#0f172a] mt-5">
                  {service.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-center text-[#334155] mt-3">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#38821B]">
                  Learn more
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
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