"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { CONTACT, FOOTER_COLUMNS } from "@/lib/content";
import { Container } from "@/components/ui/Section";
import { normalizeSlug, solutionSlug } from "@/lib/utils";
import { getPublicNavigation } from "@/lib/public-navigation-client";

type FooterCol = {
  title: string;
  links: { label: string; href: string }[];
};

type SocialIconProps = { className?: string };

function FacebookIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/GeoSATnepal", Icon: FacebookIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/geo-sat-solutions-pltd/",
    Icon: LinkedinIcon,
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const [columns, setColumns] = useState<FooterCol[]>(() =>
    FOOTER_COLUMNS.map((col) => ({
      title: col.title,
      links: col.links.map((link) => ({
        label: link,
        href:
          col.title === "Solutions"
            ? `/solutions#${solutionSlug(link)}`
            : col.title === "Industries"
              ? `/industries/${solutionSlug(link)}`
              : "/request-assessment",
      })),
    })),
  );

  useEffect(() => {
    async function loadNav() {
      try {
        const data = await getPublicNavigation();
        if (data?.tree?.tabs) {
          const tabs = data.tree.tabs;
          const solTab = tabs.find((t) => t.id === "solutions");
          const indTab = tabs.find((t) => t.id === "industries");
          const compTab = tabs.find((t) => t.id === "company");

          const dynamicCols: FooterCol[] = [];

          if (solTab) {
            const solutionLinks = (data.solutions ?? [])
              .filter((solution) => solution.isPublished !== false)
              .slice(0, 6)
              .map((solution) => ({
                label: solution.title,
                href: `/solutions/${normalizeSlug(solution.slug || solutionSlug(solution.title))}`,
              }));

            dynamicCols.push({
              title: solTab.label || "Solutions",
              links: solutionLinks.length
                ? solutionLinks
                : solTab.columns.slice(0, 5).map((col) => ({
                    label: col.title,
                    href: `/solutions#${col.slug}`,
                  })),
            });
          }

          if (indTab) {
            dynamicCols.push({
              title: indTab.label || "Industries",
              links: indTab.columns.slice(0, 5).map((col) => ({
                label: col.title,
                href: `/industries/${col.slug}`,
              })),
            });
          }

          if (compTab) {
            const allCompItems: { label: string; href: string }[] = [];
            compTab.columns.forEach((col) => {
              col.items.forEach((item) => {
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

      <Container className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div>
            <Link
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
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-2">
              Survey-grade geospatial intelligence for infrastructure, government and natural
              resources — captured in the field, processed in house, handed over ready to use.
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group inline-flex items-center gap-3 py-1 text-ink-2 transition-colors duration-200 hover:text-[#059669]"
                >
                  <Mail className="size-4 text-aqua/70" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="group inline-flex items-center gap-3 py-1 text-ink-2 transition-colors duration-200 hover:text-[#059669]"
                >
                  <Phone className="size-4 text-aqua/70" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-ink-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-aqua/70" aria-hidden="true" />
                <address className="not-italic">
                  {CONTACT.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="label mb-4">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-sm text-ink-2 transition-colors duration-200 hover:text-[#059669]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-ink-3 tabular md:text-sm">
            © {year} GeoSAT Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GeoSAT Solutions on ${label}`}
                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 hover:border-[#059669] hover:bg-[#059669] hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
