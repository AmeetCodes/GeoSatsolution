import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  INDUSTRIES,
  INDUSTRIES_BY_SLUG,
  industrySlug,
  getDynamicIndustryBySlug,
  getDynamicIndustries,
} from "@/lib/industries";

type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDynamicIndustries().map((industry) => ({ slug: industrySlug(industry.title) }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getDynamicIndustryBySlug(slug);

  return {
    title: industry ? `${industry.title} | GeoSAT Industries` : "Industry | GeoSAT Industries",
    description: industry?.intro,
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = getDynamicIndustryBySlug(slug);

  if (!industry) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All industries
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
            <div className="max-w-xl py-2">
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
            </div>

            <div className="rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 sm:p-8">
              <p className="label text-aqua">Use cases</p>
              <div className="mt-6 grid gap-3">
                {industry.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-white/[0.02] p-4"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-2">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
