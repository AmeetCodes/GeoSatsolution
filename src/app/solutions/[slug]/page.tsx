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
  const canonicalSlug = solution.slug || slug;
  const canonicalUrl = `https://www.geosatsolutions.com.np/solutions/${canonicalSlug}`;

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
    { name: solution.title, url: `https://www.geosatsolutions.com.np/solutions/${solution.slug || slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([serviceJsonLd, breadcrumb]) }}
      />
      <Navbar />
      <PageTransition className="w-full min-h-screen bg-slate-50/50 flex flex-col justify-between">
        <section className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 lg:py-12 px-6 sm:px-10 lg:px-16">
          <div className="max-w-[1536px] w-full mx-auto">
            <Link
              href="/solutions"
              className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 hover:text-teal-600 uppercase transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All solutions
            </Link>

            <article className="my-auto grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <header className="flex flex-col justify-center lg:col-span-5">
                <p className="text-xs font-extrabold tracking-widest text-teal-600 uppercase mb-2 block">
                  {solution.group} · GeoSAT capability
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  {solution.title}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium leading-relaxed mt-4 max-w-2xl">
                  {solution.intro}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <ConsultationDialog
                    solutionTitle={solution.title}
                    solutionGroup={solution.group}
                    triggerLabel="Request Consultation"
                    triggerVariant="solid"
                    triggerClassName="px-7 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-xl shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  />
                  <p className="text-xs text-slate-500 max-w-[180px] border-l-2 border-slate-200 pl-3 leading-snug">
                    Talk directly with our survey team about this service.
                  </p>
                </div>

                {solution.description ? (
                  <div className="mt-8 pt-6 border-t border-slate-200/80 text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed space-y-4 max-w-2xl">
                    {solution.description
                      .split(/\n+/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                ) : null}
              </header>

              <div className="flex w-full items-center justify-center lg:col-span-7">
                <SolutionGallery
                  images={solution.images && solution.images.length > 0 ? solution.images : []}
                  className="rounded-3xl! border-slate-200/60 shadow-lg"
                  frameClassName="min-h-[420px] aspect-[4/3] sm:aspect-[4/3] lg:min-h-[500px] xl:min-h-[560px]"
                />
              </div>
            </article>
          </div>
        </section>

        <section
          className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-24 border-t border-slate-200/80"
          aria-labelledby="deliverables-heading"
        >
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

          <SolutionFaq
            solutionTitle={solution.title}
            deliverables={solution.outcomes}
            items={solution.faqs}
            className="mt-14 border-t border-slate-200/80 pt-10 sm:mt-16 sm:pt-12"
          />
        </section>
      </PageTransition>
      <Footer />
    </>
  );
}
