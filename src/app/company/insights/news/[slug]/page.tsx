import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { NEWS_ITEMS } from "@/lib/company-content";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return NEWS_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((entry) => entry.slug === slug);

  return {
    title: item ? `${item.title} | GeoSAT Solutions` : "News | GeoSAT Solutions",
    description: item?.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((entry) => entry.slug === slug);

  if (!item) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/company/insights/news"
            className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to news
          </Link>

          <article className="mt-8 rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink-3">
              <span className="inline-flex items-center gap-2">
                <Tag className="size-3.5" aria-hidden="true" />
                {item.category}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="size-3.5" aria-hidden="true" />
                {item.date}
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {item.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-ink-2">{item.excerpt}</p>

            <div className="mt-8 space-y-5 text-base leading-8 text-ink-3">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
