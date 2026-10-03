import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import AccordionGallery from "@/components/company/AccordionGallery";
import { LayoutGrid } from "@/components/ui/layout-grid";
import { EXECUTIVE_LEADS } from "@/lib/content";

const galleryItems = EXECUTIVE_LEADS.map((lead) => ({
  image: lead.image,
  label: lead.name,
  title: lead.role,
  description: lead.description,
  link: "#",
}));

const gridCards = EXECUTIVE_LEADS.map((lead, index) => ({
  id: index + 1,
  className: index % 2 === 0 ? "md:col-span-2" : "col-span-1",
  content: (
    <div>
      <p className="text-2xl font-bold text-white md:text-4xl">{lead.name}</p>
      <p className="mt-3 text-base font-medium text-[#44f0d3] md:text-xl">{lead.role}</p>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-200 md:text-lg">
        {lead.description}
      </p>
    </div>
  ),
  thumbnail: lead.image,
}));

export default function ExecutiveTechnicalLeadsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#f4f7f8] pt-28">
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-20 pt-8 sm:px-6 lg:px-10">
          <div className="mb-10 max-w-3xl">
            <p className="label text-[#11b7a8]">Company</p>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-medium text-[#0f172a]">
              Executive &amp; Technical Leads
            </h1>
          </div>

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
              gap={10}
              radius={16}
              orientation="horizontal"
            />
          </div>

          <div className="pt-2">
            <LayoutGrid cards={gridCards} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
