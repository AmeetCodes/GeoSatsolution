import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import {
  industryPathSlug,
  getDynamicIndustryBySlug,
  getDynamicIndustries,
} from "../_lib/industries";

type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const list = await getDynamicIndustries();
  return list.map((industry) => ({ slug: industryPathSlug(industry) }));
}

export const dynamicParams = true;


export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getDynamicIndustryBySlug(slug);

  if (!industry) {
    return {
      title: "Industry | GeoSAT Industries",
      description: "Industry solutions and spatial intelligence.",
    };
  }

  const title = `${industry.title} | GeoSAT Industries`;
  const description = industry.intro || industry.description;
  const canonicalUrl = `https://geosat.co/industries/${slug}`;

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = await getDynamicIndustryBySlug(slug);

  if (!industry) notFound();

  const industryJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${industry.title} Geospatial Solutions`,
    serviceType: "Industry Solutions",
    description: industry.intro || industry.description,
    provider: {
      "@type": "Organization",
      name: "GeoSAT Solutions",
      url: "https://geosat.co",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industryJsonLd) }}
      />
      <Navbar />
      <PageTransition className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All industries
          </Link>

          <article className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[0.96fr_1.08fr] lg:gap-14">
            <header className="max-w-xl py-2">
              <p className="label text-aqua">Sector focus · {industry.title}</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.8rem]">
                {industry.title}
              </h1>
              <p className="mt-6 font-display text-xl leading-relaxed text-ink-2 sm:text-2xl">
                {industry.intro}
              </p>
              <p className="mt-5 max-w-lg text-base leading-7 text-ink-3">{industry.description}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-aqua px-5 text-sm font-medium text-abyss shadow-[0_12px_30px_-18px_rgba(60,227,214,0.9)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-aqua-bright"
                >
                  Talk to our sector team
                </a>
                <Link
                  href="/industries"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-strong hover:bg-white/[0.04]"
                >
                  View all industries
                </Link>
              </div>
            </header>

            <div className="space-y-6">
              {industry.images.length > 0 ? (
                <section className="grid gap-3 sm:grid-cols-2" aria-label={`${industry.title} images`}>
                  {industry.images.map((image, index) => (
                    <figure key={`${image.src}-${index}`} className={`overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface ${index === 0 ? "sm:col-span-2" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.src}
                        alt={image.alt || industry.title}
                        className={`w-full object-cover ${index === 0 ? "h-64 sm:h-80" : "h-44"}`}
                      />
                      {image.caption ? <figcaption className="px-4 py-3 text-xs text-ink-3">{image.caption}</figcaption> : null}
                    </figure>
                  ))}
                </section>
              ) : null}

              <section className="rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 sm:p-8" aria-label="Use cases">
                <p className="label text-aqua">Use cases</p>
                <ul className="mt-6 grid gap-3">
                  {industry.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-line bg-white/[0.02] p-4"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
