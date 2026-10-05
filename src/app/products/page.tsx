import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { productPathSlug, getDynamicProducts } from "./_lib/products";

export const metadata: Metadata = {
  title: "Products | GeoSAT Solutions",
  description:
    "Enterprise-grade geospatial hardware and instruments: GNSS receivers, total stations, UAV survey drones, LiDAR sensors, and GIS controllers.",
  alternates: {
    canonical: "https://geosatsoln.com/products",
  },
  openGraph: {
    title: "Products | GeoSAT Solutions",
    description:
      "Enterprise-grade geospatial hardware and instruments: GNSS receivers, total stations, UAV survey drones, LiDAR sensors, and GIS controllers.",
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
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="max-w-3xl">
            <p className="label text-aqua">Products</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
              Tools and systems that keep field and office work moving.
            </h1>
          </header>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.title}
                href={`/products/${productPathSlug(product)}`}
                className="group rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-panel/55"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-3">{product.group}</span>
                  <ArrowUpRight className="size-4 text-aqua transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 font-display text-2xl leading-tight text-ink">{product.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">{product.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
