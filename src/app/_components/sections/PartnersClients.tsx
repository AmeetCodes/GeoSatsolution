import { Reveal } from "@/components/ui/Reveal";

export type PartnerClient = {
  name: string;
  logoUrl?: string;
  alt: string;
};

/**
 * Partners & clients shown as a clean logo wall.
 *
 * All assets are self-hosted under /public/partners so the grid never depends
 * on third-party hotlinks (the original Wikimedia URLs were broken). Entries
 * without an official logo (collective categories) render as wordmarks.
 */
export const PARTNERS_AND_CLIENTS: PartnerClient[] = [
  { name: "Trimble Geospatial", logoUrl: "/partners/trimble.svg", alt: "Trimble Geospatial logo" },
  { name: "DJI Enterprise", logoUrl: "/partners/dji.svg", alt: "DJI Enterprise logo" },
  {
    name: "GreenValley International",
    logoUrl: "/partners/greenvalley.png",
    alt: "GreenValley International logo",
  },
  { name: "Planet Labs & Maxar", logoUrl: "/partners/planet.svg", alt: "Planet Labs and Maxar logo" },
  {
    name: "Nepal Electricity Authority",
    logoUrl: "/partners/nea.png",
    alt: "Nepal Electricity Authority logo",
  },
  {
    name: "Kathmandu University",
    logoUrl: "/partners/kathmandu-university.svg",
    alt: "Kathmandu University logo",
  },
  {
    name: "Food and Agriculture Organization (FAO)",
    logoUrl: "/partners/fao.svg",
    alt: "Food and Agriculture Organization logo",
  },
  {
    name: "Land Management Training Centre",
    logoUrl: "/partners/emblem-of-nepal.svg",
    alt: "Land Management Training Centre logo",
  },
  {
    name: "Armed Police Force Nepal",
    logoUrl: "/partners/apf-nepal.svg",
    alt: "Armed Police Force Nepal logo",
  },
  {
    name: "Department of Survey",
    logoUrl: "/partners/emblem-of-nepal.svg",
    alt: "Department of Survey Nepal logo",
  },
  { name: "Municipal Governments", alt: "Municipal Governments" },
  { name: "Hydropower Developers", alt: "Hydropower Developers" },
];

export function PartnersClients() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="bg-white px-6 py-16 md:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <h2
            id="partners-heading"
            className="mb-12 font-serif text-xs font-semibold uppercase tracking-widest text-zinc-500 md:text-sm"
          >
            Trusted by Industry Leading Partners &amp; Clients
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 md:grid-cols-4 md:gap-12 lg:grid-cols-6">
          {PARTNERS_AND_CLIENTS.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.04} className="w-full">
              <div className="flex h-20 w-full items-center justify-center p-2">
                {item.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- logo URLs are CMS-provided and may be arbitrary remote hosts
                  <img
                    src={item.logoUrl}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-auto max-h-12 w-auto max-w-[140px] object-contain opacity-75 grayscale transition-all duration-300 ease-in-out hover:opacity-100 hover:grayscale-0 md:max-h-16 md:max-w-[160px]"
                  />
                ) : (
                  <span className="text-center font-serif text-base font-semibold leading-tight tracking-tight text-zinc-500 transition-colors duration-300 ease-in-out hover:text-[#38821B] md:text-lg">
                    {item.name}
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
