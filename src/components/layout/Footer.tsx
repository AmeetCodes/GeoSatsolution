"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { CONTACT, CREDENTIALS, FOOTER_COLUMNS } from "@/lib/content";
import { Container } from "@/components/ui/Section";
import { solutionSlug } from "@/lib/utils";

type FooterCol = {
  title: string;
  links: { label: string; href: string }[];
};

export function Footer() {
  const year = new Date().getFullYear();
  const [columns, setColumns] = useState<FooterCol[]>(() =>
    FOOTER_COLUMNS.map((col) => ({
      title: col.title,
      links: col.links.map((link) => ({
        label: link,
        href:
          col.title === "Solutions"
            ? `/solutions/${solutionSlug(link)}`
            : col.title === "Industries"
              ? `/industries/${solutionSlug(link)}`
              : "#contact",
      })),
    })),
  );

  useEffect(() => {
    async function loadNav() {
      try {
        const res = await fetch("/api/content/nav", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && json.data?.tree?.tabs) {
          const tabs = json.data.tree.tabs;
          const solTab = tabs.find((t: any) => t.id === "solutions");
          const indTab = tabs.find((t: any) => t.id === "industries");
          const compTab = tabs.find((t: any) => t.id === "company");

          const dynamicCols: FooterCol[] = [];

          if (solTab) {
            dynamicCols.push({
              title: solTab.label || "Solutions",
              links: solTab.columns.slice(0, 5).map((col: any) => ({
                label: col.title,
                href: `/solutions#${col.slug}`,
              })),
            });
          }

          if (indTab) {
            dynamicCols.push({
              title: indTab.label || "Industries",
              links: indTab.columns.slice(0, 5).map((col: any) => ({
                label: col.title,
                href: `/industries/${col.slug}`,
              })),
            });
          }

          if (compTab) {
            const allCompItems: { label: string; href: string }[] = [];
            compTab.columns.forEach((col: any) => {
              col.items.forEach((item: any) => {
                allCompItems.push({
                  label: item.title,
                  href: item.href || `/company/${col.slug}/${item.slug}`,
                });
              });
            });
            dynamicCols.push({
              title: compTab.label || "Company",
              links: allCompItems.slice(0, 6),
            });
          }

          if (dynamicCols.length > 0) {
            setColumns(dynamicCols);
          }
        }
      } catch {
        // Fallback remains active
      }
    }
    loadNav();
  }, []);

  return (
    <footer className="relative border-t border-line bg-abyss-2/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" aria-hidden="true" />

      <Container className="py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div>
            <a
              href="/"
              aria-label="GeoSAT Solutions homepage"
              className="inline-flex items-center"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
                }
              }}
            >
              <Image
                src="/logo.png"
                alt="GeoSAT Solutions"
                width={220}
                height={64}
                className="h-10 w-auto object-contain"
              />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-2">
              Survey-grade geospatial intelligence for infrastructure, government and natural
              resources — captured in the field, processed in house, handed over ready to use.
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group inline-flex items-center gap-3 py-1 text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  <Mail className="size-4 text-aqua/70" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="group inline-flex items-center gap-3 py-1 text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  <Phone className="size-4 text-aqua/70" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-ink-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-aqua/70" aria-hidden="true" />
                <span>
                  {CONTACT.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="label mb-5">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block py-1 text-sm text-ink-2 transition-colors duration-200 hover:text-aqua"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {CREDENTIALS.map((credential) => (
              <li key={credential} className="label text-ink-4">
                {credential}
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-4 tabular">
            © {year} GeoSAT Solutions. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
