import Link from "next/link";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { NEWS_ITEMS } from "@/lib/company-content";

export default function NewsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="label text-aqua">Insights</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
              News &amp; Field Notes
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-3">
              Recent updates from the field, project delivery, training programmes and continuous positioning work across our sectors.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {NEWS_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={`/company/insights/news/${item.slug}`}
                className="group relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-panel/55"
              >
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-ink-3">
                  <span className="inline-flex items-center gap-2">
                    <Tag className="size-3.5" aria-hidden="true" />
                    {item.category}
                  </span>
                  <ArrowUpRight className="size-4 text-aqua transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-ink-3">
                  <Calendar className="size-4 text-aqua/80" aria-hidden="true" />
                  {item.date}
                </div>

                <h2 className="mt-4 font-display text-2xl leading-tight text-ink">{item.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
