import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { getDynamicProducts } from "./_lib/products";
import { ProductsCatalogView } from "./_components/ProductsCatalogView";

export const metadata: Metadata = {
  title: "Products & Equipment Catalog | GeoSAT Solutions",
  description:
    "Enterprise-grade geospatial hardware, survey instruments, UAV payloads, LiDAR sensors, and engineering software catalog.",
  alternates: {
    canonical: "https://geosatsoln.com/products",
  },
  openGraph: {
    title: "Products & Equipment Catalog | GeoSAT Solutions",
    description:
      "Enterprise-grade geospatial hardware, survey instruments, UAV payloads, LiDAR sensors, and engineering software catalog.",
    url: "https://geosatsoln.com/products",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = await getDynamicProducts();

  return (
    <>
      <Navbar />
      <PageTransition className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="max-w-3xl">
            <p className="label text-aqua">Products & Hardware Catalog</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
              Tools and systems that keep field and office work moving.
            </h1>
            <p className="mt-4 text-base text-ink-2 max-w-2xl leading-relaxed">
              Explore certified geospatial hardware, high-end optical total stations, GNSS rover systems,
              aerial drone payloads, and industry-standard processing software suites.
            </p>
          </header>

          <ProductsCatalogView products={products} />
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
