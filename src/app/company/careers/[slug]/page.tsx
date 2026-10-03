import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Check, MapPin } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CAREER_ROLES } from "@/lib/company-content";

type CareerDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CAREER_ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = CAREER_ROLES.find((entry) => entry.slug === slug);

  return {
    title: role ? `${role.title} | GeoSAT Solutions` : "Careers | GeoSAT Solutions",
    description: role?.summary,
  };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const role = CAREER_ROLES.find((entry) => entry.slug === slug);

  if (!role) notFound();

  return (
    <>
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
            <div className="border-b border-line bg-panel/40 p-6 sm:p-8">
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
            </div>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
              <section>
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

              <section>
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
