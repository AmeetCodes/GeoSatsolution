import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LayoutGrid } from "@/components/ui/layout-grid";
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

const referenceImages = [
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default async function GeoSatPartnersPage() {
  const [partners, clients] = await Promise.all([
    getDynamicPartners(),
    getDynamicClients(),
  ]);

  const partnerCards = partners.map((partner, index) => ({
    id: index + 1,
    title: partner.name,
    className: index % 4 === 0 ? "md:col-span-2" : "col-span-1",
    content: (
      <div>
        <p className="text-2xl font-bold text-white md:text-4xl">{partner.name}</p>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-cyan-100/80">
          {partner.tier || "Strategic partner"}
        </p>
        {partner.description && (
          <p className="mt-3 text-sm leading-relaxed text-white/70">{partner.description}</p>
        )}
      </div>
    ),
    thumbnail: referenceImages[index % referenceImages.length],
  }));

  const clientCards = clients.map((client, index) => ({
    id: index + 1,
    title: client.name,
    className: index % 4 === 0 ? "md:col-span-2" : "col-span-1",
    content: (
      <div>
        <p className="text-2xl font-bold text-white md:text-3xl">{client.name}</p>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-cyan-100/80">
          {client.category || "Client organisation"}
        </p>
      </div>
    ),
    thumbnail: referenceImages[index % referenceImages.length],
  }));

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#f3f5f6] pb-20 pt-28">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
          <section className="mb-8 max-w-3xl">
            <p className="label text-[#11b7a8]">Company</p>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.2rem)] font-medium text-[#0f172a]">
              GeoSat Partners
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#334155]">
              GeoSAT works with leading technology vendors and public institutions to bring precise geospatial intelligence, operational readiness and field-tested delivery to every project.
            </p>
          </section>

          {partnerCards.length > 0 && (
            <section className="mb-16">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-medium text-[#0f172a] md:text-3xl">Technology partners</h2>
              </div>
              <LayoutGrid id="partners" cards={partnerCards} />
            </section>
          )}

          {clientCards.length > 0 && (
            <section>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-medium text-[#0f172a] md:text-3xl">Clients &amp; institutions</h2>
              </div>
              <LayoutGrid id="clients" cards={clientCards} />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
