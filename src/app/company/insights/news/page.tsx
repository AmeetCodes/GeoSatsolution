import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getDynamicNewsItems } from "@/app/company/_lib/company-content";
import { NewsMorphingGallery } from "@/components/ui/news-morphing-gallery";

export const metadata: Metadata = {
  title: "News & Field Notes | GeoSAT Solutions",
  description:
    "Recent updates, case studies, field notes and technology milestones from GeoSAT survey operations.",
  alternates: {
    canonical: "https://geosatsoln.com/company/insights/news",
  },
  openGraph: {
    title: "News & Field Notes | GeoSAT Solutions",
    description:
      "Recent updates, case studies, field notes and technology milestones from GeoSAT survey operations.",
    url: "https://geosatsoln.com/company/insights/news",
    type: "website",
  },
};

export default async function NewsPage() {
  const newsItems = await getDynamicNewsItems();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="max-w-3xl">
            <p className="label text-aqua">Insights</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
              News &amp; Field Notes
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-3">
              Recent updates from the field, project delivery, training programmes and continuous positioning work across our sectors.
            </p>
          </header>

          <div className="mt-10">
            <NewsMorphingGallery items={newsItems} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
