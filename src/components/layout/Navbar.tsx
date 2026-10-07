"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV } from "@/lib/content";
import { getPublicNavigation } from "@/lib/public-navigation-client";
import { cn, solutionSlug } from "@/lib/utils";
import type { NavTreeTab, NavTreeColumn, NavTreeItem, NavigationTree } from "@/lib/tree-store";

// ---------- types ----------
type DynIndustry = { title: string; intro?: string; description?: string; items: string[] };

type DynNavData = {
  tree?: NavigationTree;
  tabs?: NavTreeTab[];
  solutionGroups?: { title: string; links: string[] }[];
  productGroups?: { title: string; links: string[] }[];
  companyGroups?: { title: string; links: string[] }[];
  industries?: DynIndustry[];
} | null;

// ---------- Logo ----------
function Logo() {
  return (
    <a
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
    </a>
  );
}

// ---------- hooks ----------
const SECTION_IDS = ["capabilities", "equipment", "projects", "industries"];

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

// ---------- Industry accents ----------
const INDUSTRY_ACCENTS = [
  {
    shell: "border-cyan-400/25 bg-cyan-500/10",
    pill: "border-cyan-400/25 bg-cyan-500/10 text-cyan-100",
    glow: "from-cyan-500/18 via-cyan-400/10 to-transparent",
  },
  {
    shell: "border-violet-400/25 bg-violet-500/10",
    pill: "border-violet-400/25 bg-violet-500/10 text-violet-100",
    glow: "from-violet-500/18 via-violet-400/10 to-transparent",
  },
  {
    shell: "border-emerald-400/25 bg-emerald-500/10",
    pill: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
    glow: "from-emerald-500/18 via-emerald-400/10 to-transparent",
  },
  {
    shell: "border-amber-400/25 bg-amber-500/10",
    pill: "border-amber-400/25 bg-amber-500/10 text-amber-100",
    glow: "from-amber-500/18 via-amber-400/10 to-transparent",
  },
] as const;

const NAVBAR_TEXT_STYLE = {
  fontFamily: '"Times New Roman", serif',
  fontSize: "16px",
  backgroundColor: "#FFFFFF",
  color: "#000000",
} as const;

const NAV_LINK_TEXT_STYLE = {
  fontFamily: '"knowledge-medium", sans-serif',
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
  color: "#212223",
  marginRight: "4px",
} as const;

const DROPDOWN_ICON_STYLE = {
  width: "13.33px",
  height: "13.33px",
  color: "#212223",
} as const;

const CTA_BUTTON_STYLE = {
  fontFamily: '"knowledge-medium", sans-serif',
  fontSize: "14px",
  fontWeight: 500,
  backgroundColor: "#00A884",
  color: "#FFFFFF",
  borderRadius: "20px",
  padding: "10px 20px",
} as const;

const DROPDOWN_ITEM_STYLE = {
  fontFamily: '"knowledge-regular", sans-serif',
  fontSize: "16px",
  lineHeight: "24px",
  color: "#666666",
  padding: "8px 0px",
} as const;

const DROPDOWN_GROUP_STYLE = {
  fontFamily: '"knowledge-medium", sans-serif',
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "1.2",
  color: "#212223",
  backgroundColor: "transparent",
  border: "1px solid #212223",
  borderRadius: "9999px",
  padding: "6px 12px",
} as const;

// ---------- IndustryCardMenu ----------
function IndustryCardMenu({ industries }: { industries: DynIndustry[] }) {
  const cols = industries.length <= 2 ? industries.length : industries.length <= 3 ? 3 : 4;

  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 1
          ? "grid-cols-1"
          : cols === 2
            ? "md:grid-cols-2"
            : cols === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-2 xl:grid-cols-4",
      )}
    >
      {industries.map((industry, index) => {
        const accent = INDUSTRY_ACCENTS[index % INDUSTRY_ACCENTS.length];
        return (
          <motion.div
            key={industry.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            whileHover={{ y: -4 }}
            className={cn(
              "group relative overflow-hidden rounded-[1.35rem] border bg-panel/60 p-4 text-left shadow-[0_18px_48px_-28px_rgba(21,40,52,0.9)] backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-panel/80",
              accent.shell,
            )}
          >
            <div
              aria-hidden="true"
              className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br opacity-80", accent.glow)}
            />
            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl border text-xs font-semibold tracking-[0.2em] text-ink",
                    accent.pill,
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-line bg-white/[0.03] px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ink-3">
                  Sector
                </span>
              </div>
              <h3 className="text-lg font-medium text-ink">{industry.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                {industry.intro || industry.description || ""}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(industry.items ?? []).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[0.68rem] text-ink-3"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <a
                href={`/industries/${solutionSlug(industry.title)}`}
                className="group/link mt-6 inline-flex items-center gap-2 text-sm font-medium text-aqua transition-colors duration-200 hover:text-aqua-bright"
              >
                Explore use cases
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------- Dynamic Column Renderer for Mega-Menu ----------
function TreeGroupColumn({
  tabSlug,
  column,
}: {
  tabSlug: string;
  column: NavTreeColumn;
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
          // Resolve target URL
          let href = item.href;
          if (!href) {
            if (tabSlug === "solutions") href = `/solutions/${item.slug || solutionSlug(item.title)}`;
            else if (tabSlug === "products") href = `/products/${item.slug || solutionSlug(item.title)}`;
            else if (tabSlug === "company") {
              const colSlug = column.slug || solutionSlug(column.title);
              const iSlug = item.slug || solutionSlug(item.title);
              if (item.title === "Executive & Technical Leads") href = "/company/about/executive-technical-leads";
              else if (item.title === "GeoSat Partners") href = "/company/about/geosat-partners";
              else if (item.title === "News & Field Notes") href = "/company/insights/news";
              else if (item.title === "Downloads & Technical Resources") href = "/company/insights/downloads-technical-resources";
              else if (item.title === "Survey & GIS Engineering Roles") href = "/company/careers/survey-gis-engineering-roles";
              else if (item.title === "UAV & LiDAR Operations Roles") href = "/company/careers/uav-lidar-operations-roles";
              else if (item.title === "Software Development Roles") href = "/company/careers/software-development-roles";
              else href = `/company/${colSlug}/${iSlug}`;
            } else {
              href = `/${tabSlug}/${column.slug}/${item.slug || solutionSlug(item.title)}`;
            }
          }

          return (
            <li key={item.id || item.title}>
              <a
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
              </a>
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
    id: n.label.toLowerCase(),
    label: n.label,
    slug: n.label.toLowerCase(),
    href: n.href,
    order: index + 1,
    type: n.label === "Industries" ? "cards" : "columns",
    footerNote:
      n.label === "Products"
        ? "Equipment rental, licensing and operator training available."
        : "Every engagement is scoped against a tolerance, not a template.",
    catalogueCta: `Request the full ${n.label.toLowerCase()} catalogue`,
    columns: (n.groups || []).map((g, gIdx) => ({
      id: `col-${gIdx}`,
      title: g.title,
      slug: solutionSlug(g.title),
      order: gIdx + 1,
      items: g.links.map((link, lIdx) => ({
        id: `item-${lIdx}`,
        title: link,
        slug: solutionSlug(link),
        order: lIdx + 1,
      })),
    })),
  }));
}

// ---------- Navbar ----------
export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const scrolled = useScrolled();
  const active = useActiveSection();
  const reduced = useReducedMotion();
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const dynData = useDynamicNav();
  const dynamicTabs = buildDynamicTabs(dynData);

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

  const isActive = (item: NavTreeTab) =>
    (item.columns?.length ?? 0) > 0 ? false : active === item.href?.replace("#", "");

  return (
    <header className="fixed inset-x-0 top-0 z-50" style={NAVBAR_TEXT_STYLE}>
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "bg-white" : "bg-white",
        )}
        style={{ border: "none" }}
      >
        <div className="mx-auto w-full max-w-none px-8 sm:px-8 lg:px-[130.5px]">
          <div className="flex h-[var(--nav-h)] items-center justify-between gap-6">
            <div className="text-[#000000] transition-opacity duration-200 hover:opacity-90">
              <Logo />
            </div>

            <nav className="hidden items-center lg:flex" aria-label="Primary">
              {dynamicTabs.map((item, index) => {
                const hasMenu = (item.columns && item.columns.length > 0) || item.label === "Industries";
                const expandedState = openMenu === item.label;

                return (
                  <div
                    key={item.id || item.label}
                    className="relative inline-flex px-2"
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenMenu(hasMenu ? item.label : null);
                    }}
                    onMouseLeave={scheduleClose}
                    onFocus={() => {
                      cancelClose();
                      setOpenMenu(hasMenu ? item.label : null);
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) setOpenMenu(null);
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
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full text-[#212223] transition-colors duration-200",
                          expandedState ? "bg-transparent text-[#000000]" : "hover:text-[#000000]",
                        )}
                      >
                        <span style={NAV_LINK_TEXT_STYLE}>{item.label}</span>
                        <ChevronDown
                          className={cn("transition-transform duration-200", expandedState && "rotate-180")}
                          style={DROPDOWN_ICON_STYLE}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <a
                        href={item.href || `/${item.slug}`}
                        className={cn(
                          "relative inline-flex items-center rounded-full text-[#212223] transition-colors duration-200 hover:text-[#000000]",
                          isActive(item) ? "text-[#000000]" : "",
                        )}
                      >
                        <span style={NAV_LINK_TEXT_STYLE}>{item.label}</span>
                        {isActive(item) ? (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-3 -bottom-0.5 h-px bg-[#000000]"
                            transition={reduced ? { duration: 0 } : { duration: 0.35 }}
                          />
                        ) : null}
                      </a>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#contact"
                className="hidden items-center justify-center whitespace-nowrap text-center transition-[transform,background-color] duration-200 hover:-translate-y-0.5 sm:inline-flex"
                style={CTA_BUTTON_STYLE}
              >
                Request assessment
              </a>
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
      </div>

      {/* Desktop mega menu */}
      <AnimatePresence>
        {openMenu
          ? (() => {
              const item = dynamicTabs.find((e) => e.label === openMenu);
              if (!item) return null;

              const isIndustriesCards = item.type === "cards" || item.label === "Industries";
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
                  className="absolute inset-x-0 top-[var(--nav-h)] hidden bg-white text-[#000000] shadow-none lg:block"
                  style={{ border: "none" }}
                >
                  <div className="mx-auto w-full max-w-none px-8 sm:px-8 lg:px-[130.5px] py-10">
                    {isIndustriesCards ? (
                      <>
                        <IndustryCardMenu industries={dynData?.industries ?? []} />
                        <div className="mt-9 flex items-center justify-between border-t border-line pt-6">
                          <p className="max-w-md text-sm text-ink-3">
                            Mission-critical data, mapped to the way each sector actually works.
                          </p>
                          <a href="/industries" className="group inline-flex items-center gap-2 text-sm text-aqua">
                            <span className="border-b border-aqua/30 pb-0.5 transition-colors duration-200 group-hover:border-aqua">
                              View all industries
                            </span>
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Dynamic multi-column grid automatically sized to number of columns */}
                        <div
                          className="grid gap-8"
                          style={{
                            gridTemplateColumns: `repeat(${Math.max(1, columns.length)}, minmax(0, 1fr))`,
                          }}
                        >
                          {columns.map((column) => (
                            <TreeGroupColumn
                              key={column.id || column.title}
                              tabSlug={item.slug || solutionSlug(item.label)}
                              column={column}
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
                          <a href="#contact" className="group inline-flex items-center gap-2 text-sm text-aqua">
                            <span className="border-b border-aqua/30 pb-0.5 transition-colors duration-200 group-hover:border-aqua">
                              {item.catalogueCta || `Request the full ${item.label.toLowerCase()} catalogue`}
                            </span>
                          </a>
                        </div>
                      </>
                    )}
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
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-white/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: reduced ? 0 : "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: reduced ? 0 : "-100%" }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-0 max-h-[92dvh] overflow-y-auto bg-white pb-8"
              style={{ border: "none" }}
            >
              <div className="mx-auto w-full max-w-none px-8 pt-5 sm:px-8">
                <div className="flex h-[3.5rem] items-center justify-between">
                  <span className="text-aqua">
                    <Logo />
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="flex size-10 items-center justify-center rounded-full border border-line text-ink"
                    aria-label="Close menu"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <nav className="mt-6" aria-label="Mobile">
                  <ul className="divide-y divide-line">
                    {dynamicTabs.map((item) => {
                      const isOpen = expanded === item.label;
                      const hasColumns = (item.columns && item.columns.length > 0) || item.label === "Industries";

                      if (!hasColumns) {
                        return (
                          <li key={item.id || item.label}>
                            <a
                              href={item.href || `/${item.slug}`}
                              onClick={() => setDrawerOpen(false)}
                              className="flex items-center justify-between py-4 font-display text-xl text-ink"
                            >
                              {item.label}
                            </a>
                          </li>
                        );
                      }

                      return (
                        <li key={item.id || item.label}>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => setExpanded(isOpen ? null : item.label)}
                            className="flex w-full items-center justify-between py-4 font-display text-xl text-ink"
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
                                {item.label === "Industries" ? (
                                  <div className="space-y-3 pb-6">
                                    {(dynData?.industries ?? []).map((industry, index) => (
                                      <a
                                        key={industry.title}
                                        href={`/industries/${solutionSlug(industry.title)}`}
                                        onClick={() => setDrawerOpen(false)}
                                        className={cn(
                                          "block rounded-2xl border p-4",
                                          INDUSTRY_ACCENTS[index % INDUSTRY_ACCENTS.length].shell,
                                        )}
                                      >
                                        <div className="mb-2 flex items-center justify-between">
                                          <h3 className="font-display text-lg text-ink">{industry.title}</h3>
                                          <span className="text-[0.55rem] uppercase tracking-[0.16em] text-ink-3">
                                            {String(index + 1).padStart(2, "0")}
                                          </span>
                                        </div>
                                        <p className="text-sm text-ink-2">
                                          {industry.intro || industry.description || ""}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                          {(industry.items ?? []).map((entry) => (
                                            <span
                                              key={entry}
                                              className="rounded-full border border-line bg-white/[0.03] px-2 py-1 text-[0.62rem] text-ink-3"
                                            >
                                              {entry}
                                            </span>
                                          ))}
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-6">
                                    {(item.columns ?? []).map((column) => (
                                      <TreeGroupColumn
                                        key={column.id || column.title}
                                        tabSlug={item.slug || solutionSlug(item.label)}
                                        column={column}
                                      />
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <a
                  href="#contact"
                  onClick={() => setDrawerOpen(false)}
                  className="mt-8 flex h-12 items-center justify-center rounded-full font-medium"
                  style={CTA_BUTTON_STYLE}
                >
                  Request assessment
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
