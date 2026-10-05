import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Check, MapPin } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  getDynamicCareerRoles,
  getDynamicCareerRoleBySlug,
  type CareerRole,
} from "@/app/company/_lib/company-content";

type CareerDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const roles = await getDynamicCareerRoles();
  return roles.map((role: CareerRole) => ({ slug: role.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = await getDynamicCareerRoleBySlug(slug);

  if (!role) {
    return {
      title: "Careers | GeoSAT Solutions",
      description: "Career opportunities at GeoSAT Solutions.",
    };
  }

  const title = `${role.title} | GeoSAT Careers`;
  const description = role.summary;
  const canonicalUrl = `https://geosatsoln.com/company/careers/${slug}`;

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
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const role = await getDynamicCareerRoleBySlug(slug);

  if (!role) notFound();

  const jobJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: role.summary,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "GeoSAT Solutions",
      sameAs: "https://geosatsoln.com",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: role.location,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/company/careers"
            className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to careers
          </Link>

          <article className="mt-8 overflow-hidden rounded-[var(--radius-panel)] border border-line bg-panel/30">
            <header className="border-b border-line bg-panel/40 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink-3">
                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
                  {role.category}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {role.location}
                </span>
              </div>

              <h1 className="mt-6 font-display text-4xl leading-tight text-ink sm:text-5xl">
                {role.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-2">{role.summary}</p>
            </header>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
              <section aria-label="Responsibilities">
                <h2 className="font-display text-2xl text-ink">Responsibilities</h2>
                <ul className="mt-5 space-y-3">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink-2">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-label="Requirements">
                <h2 className="font-display text-2xl text-ink">Requirements</h2>
                <ul className="mt-5 space-y-3">
                  {role.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink-2">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
