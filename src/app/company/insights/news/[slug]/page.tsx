import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  getDynamicNewsItems,
  getDynamicNewsItemBySlug,
} from "@/app/company/_lib/company-content";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getDynamicNewsItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDynamicNewsItemBySlug(slug);

  if (!item) {
    return {
      title: "News | GeoSAT Solutions",
      description: "News and field notes from GeoSAT Solutions.",
    };
  }

  const title = `${item.title} | GeoSAT News`;
  const description = item.excerpt;
  const canonicalUrl = `https://geosatsoln.com/company/insights/news/${slug}`;

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
      type: "article",
      publishedTime: item.date,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = await getDynamicNewsItemBySlug(slug);

  if (!item) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    author: {
      "@type": "Organization",
      name: item.author || "GeoSAT Solutions",
      url: "https://geosatsoln.com",
    },
    publisher: {
      "@type": "Organization",
      name: "GeoSAT Solutions",
      logo: {
        "@type": "ImageObject",
        url: "https://geosatsoln.com/icon.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
            <header>
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
            </header>

            <div className="mt-8 space-y-5 text-base leading-8 text-ink-3">
              {item.body.map((paragraph: string) => (
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
