import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TeamRevealGrid, type TeamRevealMember } from "@/components/ui/team-reveal-grid";
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
  const members: TeamRevealMember[] = leaders.map((lead, index) => ({
    id: lead.id || `${lead.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    name: lead.name,
    role: lead.role,
    expertise: lead.expertise || lead.bio || "",
    image: lead.image?.src,
    imageAlt: lead.image?.alt || `${lead.name}, ${lead.role}`,
    imagePosition: lead.imagePosition || "center top",
    accent: lead.accent || "#0d9488",
  }));

  return (
    <>
      <Navbar />

      <PageTransition className="flex-1 bg-[#f8faf9] pt-24 sm:pt-28">
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 lg:px-10">
          {members.length > 0 ? (
            <TeamRevealGrid
              members={members}
              eyebrow="GeoSAT · Leadership"
              title="Executive & Technical Leads"
              description="Meet the people guiding our surveying, geospatial engineering, and spatial intelligence work."
              autoPlay={false}
              className="!h-auto min-h-[min(760px,calc(100dvh-8rem))] rounded-3xl border border-slate-200 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.3)]"
            />
          ) : (
            <section className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm" aria-labelledby="leadership-title">
              <div className="max-w-xl">
                <p className="label text-aqua">GeoSAT · Leadership</p>
                <h1 id="leadership-title" className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">Executive &amp; Technical Leads</h1>
                <p className="mt-4 text-base text-ink-2">Leadership profiles will appear here once they have been added in the admin panel.</p>
              </div>
            </section>
          )}
        </div>
      </PageTransition>

      <Footer />
    </>
  );
}
