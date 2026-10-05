import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import AccordionGallery from "@/components/ui/AccordionGallery";
import { LayoutGrid } from "@/components/ui/layout-grid";
import { getDynamicLeaders } from "@/app/company/_lib/company-content";

export const metadata: Metadata = {
  title: "Executive & Technical Leads | GeoSAT Solutions",
  description: "Meet the executive and engineering leadership team guiding GeoSAT geospatial intelligence.",
  alternates: {
    canonical: "https://geosatsoln.com/company/about/executive-technical-leads",
  },
  openGraph: {
    title: "Executive & Technical Leads | GeoSAT Solutions",
    description: "Meet the executive and engineering leadership team guiding GeoSAT geospatial intelligence.",
    url: "https://geosatsoln.com/company/about/executive-technical-leads",
    type: "website",
  },
};

export default async function ExecutiveTechnicalLeadsPage() {
  const leaders = await getDynamicLeaders();

  const galleryItems = leaders.map((lead) => ({
    image: lead.image?.src || `/team/${lead.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`,
    label: lead.name,
    title: lead.role,
    description: lead.bio || "",
    link: "#",
  }));

  const gridCards = leaders.map((lead, index) => ({
    id: index + 1,
    className: index % 2 === 0 ? "md:col-span-2" : "col-span-1",
    content: (
      <div>
        <p className="text-2xl font-bold text-white md:text-4xl">{lead.name}</p>
        <p className="mt-3 text-base font-medium text-[#44f0d3] md:text-xl">{lead.role}</p>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-200 md:text-lg">
          {lead.bio}
        </p>
      </div>
    ),
    thumbnail: lead.image?.src || `/team/${lead.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`,
  }));

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#f4f7f8] pt-28">
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-20 pt-8 sm:px-6 lg:px-10">
          <header className="mb-10 max-w-3xl">
            <p className="label text-[#11b7a8]">Company</p>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-medium text-[#0f172a]">
              Executive &amp; Technical Leads
            </h1>
          </header>

          <div className="mb-12 overflow-hidden rounded-[2rem] border border-[#e3e8ee] bg-white/50 p-2">
            <AccordionGallery
              items={galleryItems}
              defaultIndex={2}
              expandRatio={0.52}
              trigger="hover"
              accentColor="#ffffff"
              overlayColor="#060010"
              textColor="#ffffff"
              grayscale
              showLabels
              duration={0.6}
              ease="power3.out"
              parallax={0.5}
              tilt={8}
              stagger={0.06}
              height={460}
            />
          </div>

          <section className="h-[600px] w-full" aria-label="Leadership profiles">
            <LayoutGrid cards={gridCards} />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}


