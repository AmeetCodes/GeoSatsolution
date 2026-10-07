import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import AccordionGallery, { type AccordionGalleryItem } from "@/components/ui/AccordionGallery";
import { getDynamicPartners, getDynamicClients } from "@/app/company/_lib/company-content";

export const metadata: Metadata = {
  title: "GeoSat Partners | GeoSAT Solutions",
  description:
    "Strategic technology partners and institutional clients working with GeoSAT Solutions on survey, GIS and geospatial intelligence projects.",
  alternates: {
    canonical: "https://geosatsoln.com/company/about/geosat-partners",
  },
  openGraph: {
    title: "GeoSat Partners | GeoSAT Solutions",
    description:
      "Strategic technology partners and institutional clients working with GeoSAT Solutions on survey, GIS and geospatial intelligence projects.",
    url: "https://geosatsoln.com/company/about/geosat-partners",
    type: "website",
  },
};

export default async function GeoSatPartnersPage() {
  const [partners, clients] = await Promise.all([
    getDynamicPartners(),
    getDynamicClients(),
  ]);

  const partnerItems: AccordionGalleryItem[] = partners.map((partner) => ({
    image: partner.logo?.src,
    alt: partner.logo?.alt || partner.name,
    label: partner.name,
    title: partner.tier || partner.category,
    description: partner.description,
  }));
  const clientItems: AccordionGalleryItem[] = clients.map((client) => ({
    image: client.image?.src,
    alt: client.image?.alt || client.name,
    label: client.name,
    title: client.category,
    description: client.description,
  }));

  const galleryProps = {
    height: 440,
    gap: 10,
    radius: 18,
    expandRatio: 0.48,
    trigger: "hover" as const,
    overlayColor: "#0b1720",
    textColor: "#ffffff",
    grayscale: true,
    showLabels: true,
    duration: 0.6,
    ease: "power3.out",
    parallax: 0.35,
    tilt: 5,
    stagger: 0.05,
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f4f7f6] pb-20 pt-28">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
          <header className="mb-14 max-w-3xl">
            <p className="label text-aqua">Company</p>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.2rem)] font-medium text-ink">
              GeoSat Partners
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              GeoSAT works with technology vendors and public institutions to bring precise geospatial intelligence, operational readiness and field-tested delivery to every project.
            </p>
          </header>

          <section id="partners" className="mb-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="label text-aqua">Technology network</p>
                <h2 className="mt-2 text-2xl font-medium text-ink md:text-3xl">Technology partners</h2>
              </div>
              <span className="hidden text-sm text-ink-3 sm:block">{partners.length} partners</span>
            </div>
            {partnerItems.length ? (
              <AccordionGallery
                items={partnerItems}
                ariaLabel="Technology partners"
                defaultIndex={0}
                accentColor="#48d4c0"
                {...galleryProps}
              />
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm text-ink-2">
                Partner profiles will appear here once they are added in the admin panel.
              </p>
            )}
          </section>

          <section id="clients">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="label text-amber">Trusted by</p>
                <h2 className="mt-2 text-2xl font-medium text-ink md:text-3xl">Clients &amp; institutions</h2>
              </div>
              <span className="hidden text-sm text-ink-3 sm:block">{clients.length} organisations</span>
            </div>
            {clientItems.length ? (
              <AccordionGallery
                items={clientItems}
                ariaLabel="Clients and institutions"
                defaultIndex={0}
                accentColor="#d5b35e"
                {...galleryProps}
              />
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm text-ink-2">
                Client profiles will appear here once they are added in the admin panel.
              </p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
