import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConsultationDialog } from "@/components/ui/ConsultationDialog";
import { SolutionFaq } from "@/components/ui/SolutionFaq";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";
import {
  solutionPathSlug,
  getDynamicSolutionBySlug,
  getDynamicSolutions,
} from "../_lib/solutions";

type SolutionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const list = await getDynamicSolutions();
  return list.map((solution) => ({ slug: solutionPathSlug(solution) }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getDynamicSolutionBySlug(slug);

  if (!solution) {
    return {
      title: "Solution | GeoSAT Solutions",
      description: "Geospatial solutions and engineering services.",
    };
  }

  const title = `${solution.title} | GeoSAT Solutions`;
  const description = solution.intro || solution.description;
  const canonicalUrl = `https://www.geosatsolutions.com.np/solutions/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: solution.images?.length
        ? [{ url: solution.images[0].src, alt: solution.images[0].alt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = await getDynamicSolutionBySlug(slug);

  if (!solution) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution.title,
    serviceType: solution.group,
    description: solution.intro || solution.description,
    provider: {
      "@type": "Organization",
      name: "GeoSAT Solutions",
      url: "https://www.geosatsolutions.com.np",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${solution.title} Deliverables`,
      itemListElement: solution.outcomes.map((outcome, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: outcome,
        },
        position: idx + 1,
      })),
    },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "https://www.geosatsolutions.com.np/" },
    { name: "Solutions", url: "https://www.geosatsolutions.com.np/solutions" },
    { name: solution.title, url: `https://www.geosatsolutions.com.np/solutions/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([serviceJsonLd, breadcrumb]) }}
      />
      <Navbar />
      <PageTransition className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All solutions
          </Link>

          <article className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <header className="max-w-xl py-2">
              <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">{solution.group} · GeoSAT capability</p>
              <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink lg:text-5xl">
                {solution.title}
              </h1>
              <p className="mt-6 font-sans text-base font-normal leading-relaxed text-slate-600 lg:text-lg">
                {solution.intro}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <ConsultationDialog solutionTitle={solution.title} solutionGroup={solution.group} />
                <p className="max-w-60 font-sans text-xs leading-relaxed text-ink-3">
                  Talk directly with our survey team about this service.
                </p>
              </div>
              <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-slate-600">
                {solution.description}
              </p>
            </header>

            <SolutionGallery images={solution.images && solution.images.length > 0 ? solution.images : []} />
          </article>

          <section className="mt-16 border-t border-line pt-9 sm:mt-20 sm:pt-12" aria-labelledby="deliverables-heading">
            <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
              <div>
                <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">A clear handover</p>
                <h2 id="deliverables-heading" className="mt-4 max-w-sm font-heading text-3xl leading-tight tracking-tight text-ink">
                  Useful outputs, ready for the next decision.
                </h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {solution.outcomes.map((outcome) => (
                  <li key={outcome} className="flex min-h-16 items-start gap-3 border-b border-line py-4 font-sans text-sm leading-relaxed text-ink-2">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <SolutionFaq solutionTitle={solution.title} deliverables={solution.outcomes} items={solution.faqs} />
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
