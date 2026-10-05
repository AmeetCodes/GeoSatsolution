import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import AccordionGallery from "@/components/ui/AccordionGallery";
import { Container } from "@/components/ui/Section";
import { getDynamicLeaders } from "@/app/company/_lib/company-content";

export const metadata: Metadata = {
  title: "Leadership — GeoSAT Solutions",
  description:
    "Leadership overview for GeoSAT Solutions and the executive and technical leads driving the company across survey, GIS and LiDAR operations.",
};

export default async function LeadershipPage() {
  const leaders = await getDynamicLeaders();

  const items = leaders.map((lead) => ({
    image: lead.image?.src || `/team/${lead.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`,
    label: lead.name,
    title: lead.role,
    description: lead.bio || "",
    link: "#",
  }));

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="relative bg-abyss py-16 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-0 blueprint opacity-40" aria-hidden="true" />

          <Container className="relative">
            <div className="max-w-3xl">
              <p className="label text-aqua/70">Leadership</p>
              <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.2rem)] leading-none text-ink">
                Leadership — GeoSAT Solutions
              </h1>
            </div>

            <div className="mt-12">
              <AccordionGallery
                items={items}
                defaultIndex={0}
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
                height={452}
                gap={12}
                radius={18}
                orientation="horizontal"
              />
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
