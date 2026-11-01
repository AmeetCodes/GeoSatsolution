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
    canonical: "https://www.geosatsolutions.com.np/products",
  },
  openGraph: {
    title: "Products & Equipment Catalog | GeoSAT Solutions",
    description:
      "Enterprise-grade geospatial hardware, survey instruments, UAV payloads, LiDAR sensors, and engineering software catalog.",
    url: "https://www.geosatsolutions.com.np/products",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = await getDynamicProducts();

  return (
    <>
      <Navbar />
      <PageTransition className="min-h-screen bg-abyss pb-16 pt-[calc(var(--nav-h)+0.5rem)] sm:pt-[calc(var(--nav-h)+1rem)]">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12">
          <header className="max-w-4xl pt-8 pb-10 lg:pt-10 lg:pb-14">
            <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">Products & Hardware Catalog</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink lg:text-5xl">
              Tools and systems that keep field and office work moving.
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-base font-normal leading-relaxed text-slate-600 lg:text-lg">
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
