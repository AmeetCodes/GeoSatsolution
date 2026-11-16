import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConsultationDialog } from "@/components/ui/ConsultationDialog";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import { ServiceGallery } from "@/components/ui/ServiceGallery";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";
import { resolveDescriptionAlignment } from "@/lib/description-alignment";
import {
  servicePathSlug,
  getDynamicServiceBySlug,
  getDynamicServices,
} from "../_lib/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const list = await getDynamicServices();
  return list.map((service) => ({ slug: servicePathSlug(service) }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getDynamicServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service | GeoSAT Solutions",
      description: "Geospatial services and engineering expertise.",
    };
  }

  const title = `${service.title} | GeoSAT Solutions`;
  const description = service.intro || service.description;
  const canonicalSlug = service.slug || slug;
  const canonicalUrl = `https://www.geosatsolutions.com.np/services/${canonicalSlug}`;

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
      images: service.images?.length
        ? [{ url: service.images[0].src, alt: service.images[0].alt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getDynamicServiceBySlug(slug);

  if (!service) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.group,
    description: service.intro || service.description,
    provider: {
      "@type": "Organization",
      name: "GeoSAT Solutions",
      url: "https://www.geosatsolutions.com.np",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} Deliverables`,
      itemListElement: service.outcomes.map((outcome, idx) => ({
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
    { name: "Services", url: "https://www.geosatsolutions.com.np/services" },
    { name: service.title, url: `https://www.geosatsolutions.com.np/services/${service.slug || slug}` },
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
              href="/services"
              className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 hover:text-teal-600 uppercase transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All services
            </Link>

            <article className="my-auto grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <header className="flex flex-col justify-center lg:col-span-5">
                <p className="text-xs font-extrabold tracking-widest text-teal-600 uppercase mb-2 block">
                  {service.group} · GeoSAT capability
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  {service.title}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium leading-relaxed mt-4 max-w-2xl">
                  {service.intro}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <ConsultationDialog
                    serviceTitle={service.title}
                    serviceGroup={service.group}
                    triggerLabel="Request Consultation"
                    triggerVariant="solid"
                    triggerClassName="px-7 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-xl shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  />
                  <p className="text-xs text-slate-500 max-w-[180px] border-l-2 border-slate-200 pl-3 leading-snug">
                    Talk directly with our survey team about this service.
                  </p>
                </div>

                {service.description ? (
                  <div
                    className="description-copy mt-8 max-w-2xl border-t border-slate-200/80 pt-6 text-sm text-slate-600 sm:text-base lg:text-lg"
                    data-align={resolveDescriptionAlignment(service.descriptionAlignment)}
                  >
                    {service.description
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
                <ServiceGallery
                  images={service.images && service.images.length > 0 ? service.images : []}
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
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex min-h-16 items-start gap-3 border-b border-line py-4 font-sans text-sm leading-relaxed text-ink-2">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <ServiceFaq
            items={service.faqs}
            className="mt-14 border-t border-slate-200/80 pt-10 sm:mt-16 sm:pt-12"
          />
        </section>
      </PageTransition>
      <Footer />
    </>
  );
}
