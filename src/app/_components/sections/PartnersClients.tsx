import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export type PartnerItem = {
  id: string;
  name: string;
  category?: string;
  tier?: string;
  description?: string;
  url?: string;
  logoUrl?: string;
  alt?: string;
};

export type ClientItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  url?: string;
  logoUrl?: string;
  alt?: string;
};

const PARTNERS: PartnerItem[] = [
  {
    id: "PART-01",
    name: "Trimble Geospatial",
    category: "Hardware & Software",
    tier: "Global Technology Partner",
    description: "Authorized reseller and technical integration partner for survey-grade GNSS, total stations, and TBC software.",
    url: "https://geospatial.trimble.com/",
    logoUrl: "/partners/trimble.svg",
    alt: "Trimble Geospatial logo",
  },
  {
    id: "PART-02",
    name: "DJI Enterprise",
    category: "UAV Systems",
    tier: "Gold Systems Partner",
    description: "Certified enterprise dealer for Matrice series UAVs, Zenmuse LiDAR, and photogrammetry payloads.",
    url: "https://enterprise.dji.com/",
    logoUrl: "/partners/dji.svg",
    alt: "DJI Enterprise logo",
  },
  {
    id: "PART-03",
    name: "GreenValley International",
    category: "Point Cloud Analytics",
    tier: "Strategic Solution Partner",
    description: "Official technology partner for LiDAR360 forestry, power line inspection, and handheld SLAM systems.",
    url: "https://www.greenvalleyintl.com/",
    logoUrl: "/partners/greenvalley.png",
    alt: "GreenValley International logo",
  },
  {
    id: "PART-04",
    name: "Planet Labs & Maxar",
    category: "Satellite Imagery",
    tier: "Data Provider Partner",
    description: "Direct tasking and high-resolution optical and SAR imagery provider for multi-temporal site analytics.",
    url: "https://www.planet.com/",
    logoUrl: "/partners/planet.svg",
    alt: "Planet Labs and Maxar logo",
  },
];

const CLIENTS: ClientItem[] = [
  {
    id: "CLI-01",
    name: "Nepal Electricity Authority",
    category: "Government Utility",
    url: "https://www.nea.org.np/",
    logoUrl: "/partners/nea.png",
    alt: "Nepal Electricity Authority logo",
  },
  {
    id: "CLI-02",
    name: "Kathmandu University",
    category: "Academic & Research",
    url: "https://ku.edu.np/",
    logoUrl: "/partners/kathmandu-university.svg",
    alt: "Kathmandu University logo",
  },
  {
    id: "CLI-03",
    name: "Food and Agriculture Organization (FAO)",
    category: "International Organization",
    url: "https://www.fao.org/",
    logoUrl: "/partners/fao.svg",
    alt: "Food and Agriculture Organization logo",
  },
  {
    id: "CLI-04",
    name: "Land Management Training Centre",
    category: "Government Institution",
    url: "https://lmtc.gov.np/",
    logoUrl: "/partners/emblem-of-nepal.svg",
    alt: "Land Management Training Centre logo",
  },
  {
    id: "CLI-05",
    name: "Armed Police Force Nepal",
    category: "Public Security",
    url: "https://www.apf.gov.np/",
    logoUrl: "/partners/apf-nepal.svg",
    alt: "Armed Police Force Nepal logo",
  },
  {
    id: "CLI-06",
    name: "Department of Survey",
    category: "Government Institution",
    url: "https://dos.gov.np/",
    logoUrl: "/partners/emblem-of-nepal.svg",
    alt: "Department of Survey Nepal logo",
  },
  {
    id: "CLI-07",
    name: "Municipal Governments",
    category: "Local Government",
    url: "https://mofaga.gov.np/",
    logoUrl: "/partners/emblem-of-nepal.svg",
    alt: "Municipal Governments",
  },
  {
    id: "CLI-08",
    name: "Hydropower Developers",
    category: "Private Sector",
    url: "https://www.nepalhydro.org/",
    logoUrl: "/partners/emblem-of-nepal.svg",
    alt: "Hydropower Developers",
  },
];

export function PartnersClients() {
  return (
    <div>
      <section
        id="technology-partners"
        aria-labelledby="tech-partners-heading"
        className="bg-slate-50/60 px-6 py-16 md:py-20 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-12">
            <h2
              id="tech-partners-heading"
              className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl md:text-3xl font-extrabold uppercase tracking-[0.05em] text-[#1e293b]"
            >
              TECHNOLOGY &amp; EQUIPMENT PARTNERS
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-600 font-['Plus_Jakarta_Sans',sans-serif]">
              Survey-grade hardware, sensor payloads, and enterprise software integrations
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {PARTNERS.map((partner, index) => (
              <Reveal key={partner.id} delay={index * 0.06}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:p-8"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex h-12 w-auto items-center">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.alt || partner.name}
                          loading="lazy"
                          decoding="async"
                          className="h-10 w-auto max-w-[160px] object-contain"
                        />
                      ) : (
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold text-slate-900">
                          {partner.name}
                        </span>
                      )}
                    </div>
                    {partner.tier && (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {partner.tier}
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    {partner.category && (
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {partner.category}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold leading-[1.35] text-[#0f172a]">
                        {partner.name}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-emerald-600" />
                    </div>
                    {partner.description && (
                      <p className="text-sm leading-relaxed text-slate-600">
                        {partner.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
                      Visit Partner Site
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="trusted-clients"
        aria-labelledby="clients-heading"
        className="bg-white px-6 py-16 md:py-20 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-12">
            <h2
              id="clients-heading"
              className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl md:text-3xl font-extrabold uppercase tracking-[0.05em] text-[#1e293b]"
            >
              TRUSTED BY LEADING ORGANIZATIONS
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-600 font-['Plus_Jakarta_Sans',sans-serif]">
              Delivering geospatial solutions for government, energy, and research sectors
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {CLIENTS.map((client, index) => (
              <Reveal key={client.id} delay={index * 0.03}>
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <div className="mb-3 flex h-16 w-full items-center justify-center">
                    {client.logoUrl ? (
                      <img
                        src={client.logoUrl}
                        alt={client.alt || client.name}
                        loading="lazy"
                        decoding="async"
                        className="h-auto max-h-12 w-auto max-w-[120px] object-contain opacity-75 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    ) : (
                      <span className="text-center font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold leading-tight text-slate-700">
                        {client.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xs font-medium text-slate-600 transition-colors group-hover:text-slate-900">
                      {client.name}
                    </span>
                    <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-emerald-600" />
                  </div>
                  {client.category && (
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                      {client.category}
                    </p>
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
