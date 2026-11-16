"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { NAV } from "@/lib/content";
import { getPublicNavigation } from "@/lib/public-navigation-client";
import { cn, normalizeSlug, serviceSlug, stripTrailingNumericSuffix } from "@/lib/utils";
import { canonicalServiceSlug } from "@/lib/service-routing";
import type { NavTreeItem, NavTreeTab, NavTreeColumn, NavigationTree } from "@/lib/tree-store";

// ---------- types ----------
type DynService = { title: string; slug?: string; isPublished?: boolean };

type DynNavData = {
  tree?: NavigationTree;
  tabs?: NavTreeTab[];
  serviceGroups?: { title: string; links: string[] }[];
  productGroups?: { title: string; links: string[] }[];
  companyGroups?: { title: string; links: string[] }[];
  services?: DynService[];
} | null;

// ---------- Logo ----------
function Logo() {
  return (
    <Link
      href="/"
      aria-label="GeoSAT Solutions homepage"
      className="inline-flex items-center"
      onClick={() => typeof window !== "undefined" && window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
    >
      <Image
        src="/logo.png"
        alt="GeoSAT Solutions"
        width={260}
        height={78}
        priority
        className="h-9 w-auto object-contain sm:h-10"
      />
    </Link>
  );
}

// ---------- hooks ----------
const SECTION_IDS = ["capabilities", "equipment", "projects"];

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => n !== null,
    );
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.5] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
  return active;
}

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Load dynamic navigation once; the shared client helper deduplicates sibling requests. */
function useDynamicNav(): DynNavData {
  const [data, setData] = useState<DynNavData>(null);

  useEffect(() => {
    let active = true;
    void getPublicNavigation().then((payload) => {
      if (active && payload) setData(payload);
    });
    return () => {
      active = false;
    };
  }, []);

  return data;
}

const NAVBAR_TEXT_STYLE = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: "16px",
  color: "#0F172A",
} as const;

const NAV_LINK_TEXT_STYLE = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
  letterSpacing: "0",
  color: "#334155",
} as const;

const DROPDOWN_ICON_STYLE = {
  width: "13.33px",
  height: "13.33px",
  color: "#475569",
} as const;

const CTA_BUTTON_STYLE = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: "14px",
  fontWeight: 500,
  backgroundColor: "#009b83",
  color: "#FFFFFF",
  borderRadius: "9999px",
  padding: "10px 18px",
} as const;

const DROPDOWN_ITEM_STYLE = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#475569",
  padding: "8px 0px",
} as const;

const DROPDOWN_GROUP_STYLE = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "1.2",
  color: "#334155",
  backgroundColor: "transparent",
  border: "1px solid #CBD5E1",
  borderRadius: "9999px",
  padding: "6px 12px",
} as const;

function pathLeaf(value?: string): string {
  if (!value) return "";
  return value.split(/[/?#]/).filter(Boolean).at(-1) ?? "";
}

/** Resolve a service menu item to the canonical slug stored in MongoDB. */
function resolveServiceHref(item: NavTreeItem, serviceSlugs: Map<string, string>): string {
  const candidates = [pathLeaf(item.href), item.slug, serviceSlug(item.title)];

  for (const candidate of candidates) {
    const normalized = normalizeSlug(candidate);
    if (!normalized) continue;

    const direct = serviceSlugs.get(normalized);
    if (direct) return `/services/${direct}`;

    const base = stripTrailingNumericSuffix(normalized);
    const stripped = base ? serviceSlugs.get(base) : undefined;
    if (stripped) return `/services/${stripped}`;
  }

  const fallback = candidates.map(normalizeSlug).find(Boolean) ?? "";
  return `/services/${canonicalServiceSlug(item.title, stripTrailingNumericSuffix(fallback) || fallback)}`;
}

// ---------- Dynamic Column Renderer for Mega-Menu ----------
function TreeGroupColumn({
  tabSlug,
  column,
  serviceSlugs,
}: {
  tabSlug: string;
  column: NavTreeColumn;
  serviceSlugs: Map<string, string>;
}) {
  return (
    <div>
      <p
        className="mb-4 inline-flex items-center"
        style={DROPDOWN_GROUP_STYLE}
      >
        {column.title}
      </p>
      <ul className="space-y-2.5">
        {column.items.map((item) => {
          // Resolve target URL. Services always use the canonical database slug so
          // stale hrefs/ids are never emitted.
          let href = item.href ?? "";
          if (tabSlug === "services" || tabSlug === "services") {
            href = resolveServiceHref(item, serviceSlugs);
          } else if (!href) {
            if (tabSlug === "products") href = `/products/${item.slug || serviceSlug(item.title)}`;
            else if (tabSlug === "company") {
              const colSlug = column.slug || serviceSlug(column.title);
              const iSlug = item.slug || serviceSlug(item.title);
              if (item.title === "Executive & Technical Leads") href = "/company/about/executive-technical-leads";
              else if (item.title === "GeoSat Partners") href = "/company/about/geosat-partners";
              else if (item.title === "News & Field Notes") href = "/company/insights/news";
              else if (item.title === "Downloads & Technical Resources") href = "/company/insights/downloads-technical-resources";
              else href = `/company/${colSlug}/${iSlug}`;
            } else {
              href = `/${tabSlug}/${column.slug}/${item.slug || serviceSlug(item.title)}`;
            }
          }

          return (
            <li key={item.id || item.title}>
              <Link
            href={href}
            className="group inline-flex items-start gap-2 text-[#666666] transition-colors duration-200 hover:text-[#000000]"
            style={{
              ...DROPDOWN_ITEM_STYLE,
              padding: "8px 0px",
            }}
          >
            <span
              aria-hidden="true"
              className="mt-[0.5em] size-1 shrink-0 rounded-full bg-[#000000]/40 transition-colors duration-200 group-hover:bg-[#000000]"
            />
            {item.title}
          </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- Build dynamic NAV structure ----------
function buildDynamicTabs(dynData: DynNavData): NavTreeTab[] {
  if (dynData?.tree?.tabs && dynData.tree.tabs.length > 0) {
    return dynData.tree.tabs;
  }
  if (dynData?.tabs && dynData.tabs.length > 0) {
    return dynData.tabs;
  }

  // Fallback to static NAV
  return NAV.map((n, index) => ({
    id: n.label === "Services" ? "services" : n.label.toLowerCase(),
    label: n.label,
    slug: n.label.toLowerCase(),
    href: n.href,
    order: index + 1,
    type: "columns",
    footerNote:
      n.label === "Products"
        ? "Equipment rental, licensing and operator training available."
        : "Every engagement is scoped against a tolerance, not a template.",
    catalogueCta: `Request the full ${n.label.toLowerCase()} catalogue`,
    columns: (n.groups || []).map((g, gIdx) => ({
      id: `col-${gIdx}`,
      title: g.title,
      slug: serviceSlug(g.title),
      order: gIdx + 1,
      items: g.links.map((link, lIdx) => ({
        id: `item-${lIdx}`,
        title: link,
        slug: serviceSlug(link),
        order: lIdx + 1,
      })),
    })),
  }));
}

// ---------- Navbar ----------
export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const scrolled = useScrolled(24);
  const pathname = usePathname();
  const active = useActiveSection();
  const reduced = useReducedMotion();
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const dynData = useDynamicNav();
  const dynamicTabs = buildDynamicTabs(dynData);
  const serviceSlugs = useMemo(() => {
    const map = new Map<string, string>();
    for (const service of dynData?.services ?? []) {
      const slug = canonicalServiceSlug(service.title, service.slug);
      if (slug) {
        map.set(normalizeSlug(service.slug || serviceSlug(service.title)), slug);
        map.set(normalizeSlug(service.title), slug);
      }
    }
    return map;
  }, [dynData]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    if (!openMenu && !drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (drawerOpen) setDrawerOpen(false);
      else setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, openMenu]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const isActive = (item: NavTreeTab) => {
    const href = item.href || `/${item.slug}`;
    const route = href.split("#")[0];
    if (route && route !== "/" && (pathname === route || pathname.startsWith(`${route}/`))) return true;
    return pathname === "/" && Boolean(href.includes("#") && active === href.split("#").at(-1));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <motion.div
        className={cn(
          "pointer-events-auto relative mx-auto border backdrop-blur-xl",
          scrolled
            ? "border-slate-300 bg-white/[0.94] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_50px_-24px_rgba(15,23,42,0.28)]"
            : "border-x-0 border-t-0 border-b border-[#E2E8F0] bg-white shadow-none",
        )}
        initial={false}
        animate={{
          width: scrolled ? "92%" : "100%",
          height: scrolled ? 62 : 76,
          y: scrolled ? 14 : 0,
          borderRadius: scrolled ? 22 : 0,
        }}
        transition={reduced ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={NAVBAR_TEXT_STYLE}
      >
        <div className="mx-auto h-full w-full max-w-[1680px] px-5 sm:px-8 md:px-10 lg:px-10">
          <div className="flex h-full items-center justify-between gap-4 lg:gap-6">
            <div className="text-slate-900 transition-transform duration-200 hover:scale-[1.025]">
              <Logo />
            </div>

            <nav className="hidden items-center lg:flex" aria-label="Primary">
              {dynamicTabs.map((item, index) => {
                const hasMenu = (item.columns?.length ?? 0) > 0;
                const expandedState = openMenu === item.label;

                return (
                  <div
                    key={item.id || item.label}
                    className="relative inline-flex px-1"
                    onMouseEnter={() => {
                      cancelClose();
                      setHoveredNav(item.label);
                      setOpenMenu(hasMenu ? item.label : null);
                    }}
                    onMouseLeave={() => {
                      setHoveredNav(null);
                      scheduleClose();
                    }}
                    onFocus={() => {
                      cancelClose();
                      setHoveredNav(item.label);
                      setOpenMenu(hasMenu ? item.label : null);
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setHoveredNav(null);
                        setOpenMenu(null);
                      }
                    }}
                  >
                    {hasMenu ? (
                      <button
                        ref={(node) => {
                          triggerRefs.current[index] = node;
                        }}
                        type="button"
                        aria-expanded={expandedState}
                        aria-controls={panelId}
                        onClick={() => setOpenMenu(expandedState ? null : item.label)}
                        className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-slate-700 transition-colors duration-200 hover:text-slate-950"
                      >
                        {hoveredNav === item.label ? (
                          <motion.span
                            layoutId="nav-hover-highlight"
                            className="absolute inset-0 rounded-full bg-slate-100"
                            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                          />
                        ) : null}
                        {isActive(item) ? <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-emerald-600" /> : null}
                        <span className="relative z-10" style={NAV_LINK_TEXT_STYLE}>{item.label}</span>
                        <ChevronDown
                          className={cn("relative z-10 transition-transform duration-200", expandedState && "rotate-180")}
                          style={DROPDOWN_ICON_STYLE}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href || `/${item.slug}`}
                        className={cn(
                          "relative inline-flex items-center rounded-full px-3 py-2 text-slate-700 transition-colors duration-200 hover:text-slate-950",
                          isActive(item) ? "text-slate-950" : "",
                        )}
                      >
                        {hoveredNav === item.label ? (
                          <motion.span
                            layoutId="nav-hover-highlight"
                            className="absolute inset-0 rounded-full bg-slate-100"
                            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                          />
                        ) : null}
                        <span className="relative z-10" style={NAV_LINK_TEXT_STYLE}>{item.label}</span>
                        {isActive(item) ? (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-emerald-600"
                            transition={reduced ? { duration: 0 } : { duration: 0.35 }}
                          />
                        ) : null}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/request-assessment"
                className="group hidden items-center justify-center gap-2 whitespace-nowrap text-center transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:!bg-[#00856f] sm:inline-flex"
                style={CTA_BUTTON_STYLE}
              >
                Contact us
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex size-10 items-center justify-center rounded-full border border-[#E6E6E6] bg-white text-[#000000] lg:hidden"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Desktop mega menu */}
      <AnimatePresence>
        {openMenu
          ? (() => {
              const item = dynamicTabs.find((e) => e.label === openMenu);
              if (!item) return null;

              const columns = item.columns || [];

              return (
                <motion.div
                  id={panelId}
                  key={openMenu}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.3)] lg:block"
                  style={{
                    top: scrolled ? 86 : 76,
                    width: scrolled ? "92%" : "100%",
                    maxWidth: 1440,
                  }}
                >
                  <div className="mx-auto w-full max-w-none px-8 sm:px-8 lg:px-[130.5px] py-10">
                    <div
                      className="grid gap-8"
                      style={{
                        gridTemplateColumns: `repeat(${Math.max(1, columns.length)}, minmax(0, 1fr))`,
                      }}
                    >
                      {columns.map((column) => (
                        <TreeGroupColumn
                          key={column.id || column.title}
                          tabSlug={item.slug || serviceSlug(item.label)}
                          column={column}
                          serviceSlugs={serviceSlugs}
                        />
                      ))}
                    </div>
                    <div className="mt-9 flex items-center justify-between border-t border-line pt-6">
                      <p className="max-w-md text-sm text-ink-3">
                        {item.footerNote ||
                          (item.label === "Products"
                            ? "Equipment rental, licensing and operator training available."
                            : "Every engagement is scoped against a tolerance, not a template.")}
                      </p>
                      <Link href="/request-assessment" className="group inline-flex items-center gap-2 text-sm text-aqua">
                        <span className="border-b border-aqua/30 pb-0.5 transition-colors duration-200 group-hover:border-aqua">
                          {item.catalogueCta || `Request the full ${item.label.toLowerCase()} catalogue`}
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })()
          : null}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="pointer-events-auto fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-slate-950/15 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: reduced ? 0 : "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: reduced ? 0 : "-100%" }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-4 top-[88px] max-h-[calc(100dvh-104px)] overflow-y-auto rounded-3xl border border-slate-300 bg-white pb-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.35)]"
            >
              <div className="mx-auto w-full px-5 pt-4 sm:px-6">
                <div className="flex h-10 items-center justify-between">
                  <span className="font-heading text-sm font-semibold tracking-wide text-slate-900">Navigation</span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    aria-label="Close menu"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <nav className="mt-6" aria-label="Mobile">
                  <ul className="divide-y divide-line">
                    {dynamicTabs.map((item) => {
                      const isOpen = expanded === item.label;
                      const hasColumns = (item.columns?.length ?? 0) > 0;

                      if (!hasColumns) {
                        return (
                          <li key={item.id || item.label}>
                            <Link
                              href={item.href || `/${item.slug}`}
                              onClick={() => setDrawerOpen(false)}
                              className="flex items-center justify-between py-4 font-heading text-xl text-ink"
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      }

                      return (
                        <li key={item.id || item.label}>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => setExpanded(isOpen ? null : item.label)}
                            className="flex w-full items-center justify-between py-4 font-heading text-xl text-ink"
                          >
                            {item.label}
                            <ChevronDown
                              className={cn(
                                "size-5 text-ink-3 transition-transform duration-200",
                                isOpen && "rotate-180",
                              )}
                              aria-hidden="true"
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-6">
                                  {(item.columns ?? []).map((column) => (
                                    <TreeGroupColumn
                                      key={column.id || column.title}
                                      tabSlug={item.slug || serviceSlug(item.label)}
                                      column={column}
                                      serviceSlugs={serviceSlugs}
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <Link
                  href="/request-assessment"
                  onClick={() => setDrawerOpen(false)}
                  className="mt-8 flex h-12 items-center justify-center rounded-full font-medium"
                  style={CTA_BUTTON_STYLE}
                >
                  Request assessment
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
