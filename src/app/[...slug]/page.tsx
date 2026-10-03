import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, Layers } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/solutions/ConsultationDialog";
import { SolutionGallery } from "@/components/solutions/SolutionGallery";
import { findTreeItem, getNavigationTree } from "@/lib/tree-store";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = findTreeItem(slug);

  if (!match) {
    return {
      title: "Page Not Found | GeoSAT Solutions",
    };
  }

  const { item, tab, column } = match;
  return {
    title: item.metadata?.metaTitle || `${item.title} | ${tab.label} · GeoSAT Solutions`,
    description:
      item.metadata?.metaDescription ||
      item.intro ||
      `${item.title} under ${column.title} - geospatial intelligence and engineering survey services.`,
  };
}

export default async function DynamicCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const match = findTreeItem(slug);

  if (!match) {
    notFound();
  }

  const { tab, column, item } = match;

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85",
      alt: `${item.title} field operations`,
      caption: "High-precision survey execution and sensor deployment",
    },
    {
      src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85",
      alt: `${item.title} aerial capture`,
      caption: "Rigorous quality verification against national datum",
    },
  ];

  const galleryImages = item.images && item.images.length > 0 ? item.images : defaultImages;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Breadcrumb back link */}
          <div className="flex items-center gap-2 text-sm text-ink-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-aqua"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span>Home</span>
            </Link>
            <ChevronRight className="size-3 text-ink-4" />
            <span className="text-ink-3">{tab.label}</span>
            <ChevronRight className="size-3 text-ink-4" />
            <span className="text-aqua font-medium">{column.title}</span>
          </div>

          {/* Hero Section */}
          <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="max-w-2xl py-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aqua">
                <Layers className="size-3.5" />
                <span>
                  {tab.label} · {column.title}
                </span>
              </div>

              <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.5rem]">
                {item.title}
              </h1>

              {item.intro && (
                <p className="mt-6 text-lg leading-relaxed text-ink-2 font-medium">
                  {item.intro}
                </p>
              )}

              {item.description && (
                <p className="mt-4 text-base leading-relaxed text-ink-3">
                  {item.description}
                </p>
              )}

              {/* Outcomes / Key Deliverables */}
              {item.outcomes && item.outcomes.length > 0 && (
                <div className="mt-8 rounded-2xl border border-line bg-panel/30 p-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-aqua mb-4">
                    Key Specifications & Deliverables
                  </h2>
                  <ul className="space-y-3">
                    {item.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-ink-2">
                        <CheckCircle2 className="size-4 text-aqua shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ConsultationDialog
                  title={item.title}
                  triggerText="Request consultation"
                  buttonClassName="rounded-full bg-aqua px-6 py-3 text-sm font-medium text-abyss hover:bg-aqua-bright transition-colors shadow-lg shadow-aqua/20"
                />
                <a
                  href="#contact"
                  className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-2 hover:border-line-strong hover:text-ink transition-colors"
                >
                  Contact engineering team
                </a>
              </div>
            </div>

            {/* Gallery / Visual Showcase */}
            <div className="relative">
              <SolutionGallery images={galleryImages} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
