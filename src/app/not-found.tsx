import Link from "next/link";
import { ArrowRight, Compass, Layers, Package } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Section";

const SUGGESTIONS = [
  {
    href: "/solutions",
    label: "Solutions",
    copy: "Survey, GIS, monitoring and engineering services.",
    Icon: Compass,
  },
  {
    href: "/products",
    label: "Products",
    copy: "Certified hardware, UAV payloads and software.",
    Icon: Package,
  },
  {
    href: "/industries",
    label: "Industries",
    copy: "Sector-specific geospatial intelligence.",
    Icon: Layers,
  },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="pointer-events-none absolute inset-0 blueprint opacity-50" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-40 top-1/3 size-[460px] rounded-full bg-aqua/10 blur-3xl"
          aria-hidden="true"
        />

        <Container className="relative">
          <div className="max-w-2xl">
            <p className="label text-aqua">Error 404</p>
            <p className="mt-6 font-display text-[clamp(4.5rem,15vw,9rem)] leading-none tracking-tight text-ink">
              404
            </p>
            <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
              This coordinate isn&apos;t on our map.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-3">
              The page you requested may have moved, been renamed, or never existed.
              Let&apos;s get you back to solid ground.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-aqua px-6 text-sm font-medium text-white transition-colors hover:bg-aqua-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
              >
                Back to home
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium text-ink transition-colors hover:border-aqua/50 hover:text-aqua focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
              >
                Browse the catalog
              </Link>
            </div>

            <nav aria-label="Suggested sections" className="mt-12 grid gap-3 sm:grid-cols-3">
              {SUGGESTIONS.map(({ href, label, copy, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-[var(--radius-panel)] border border-line bg-panel/20 p-5 transition-colors hover:border-aqua/40 hover:bg-panel/50"
                >
                  <Icon className="size-5 text-aqua" aria-hidden="true" />
                  <p className="mt-4 font-display text-lg text-ink">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-3">{copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-aqua">
                    Explore
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
