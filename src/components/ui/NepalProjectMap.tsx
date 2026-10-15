"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Layers, MapPin, X } from "lucide-react";
import nepalGeoJson from "@/lib/data/nepal-districts.geo.json";
import { PROVINCE_NAMES } from "@/lib/data/nepal-districts";
import type {
  DistrictCountEntry,
  DistrictCountResponse,
} from "@/lib/nepal-map-types";

type Ring = number[][];
type Polygon = Ring[];
type MultiPolygon = Polygon[];

type GeoFeature = {
  type: "Feature";
  properties: { name: string; province: number };
  geometry: {
    type: "MultiPolygon" | "Polygon";
    coordinates: MultiPolygon | Polygon;
  };
};

const GEO = nepalGeoJson as unknown as { type: string; features: GeoFeature[] };

const PAD = 24;
const BASE_WIDTH = 1000;

type Projection = {
  path: (lng: number, lat: number) => [number, number];
  viewBox: string;
};

function buildProjection(features: GeoFeature[]): Projection {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const feature of features) {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates as Polygon]
        : (feature.geometry.coordinates as MultiPolygon);
    for (const polygon of polygons) {
      for (const ring of polygon) {
        for (const [lng, lat] of ring) {
          if (lng < minLng) minLng = lng;
          if (lat < minLat) minLat = lat;
          if (lng > maxLng) maxLng = lng;
          if (lat > maxLat) maxLat = lat;
        }
      }
    }
  }

  const midLat = (minLat + maxLat) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);
  const spanX = (maxLng - minLng) * kx;
  const spanY = maxLat - minLat;
  const scale = BASE_WIDTH / spanX;
  const height = spanY * scale;

  const path = (lng: number, lat: number): [number, number] => [
    (lng - minLng) * kx * scale + PAD,
    (maxLat - lat) * scale + PAD,
  ];

  return {
    path,
    viewBox: `0 0 ${BASE_WIDTH + PAD * 2} ${height + PAD * 2}`,
  };
}

function ringToPath(ring: Ring, project: Projection["path"]) {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = project(ring[i][0], ring[i][1]);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}Z`;
}

function featureToPath(feature: GeoFeature, project: Projection["path"]) {
  const polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates as Polygon]
      : (feature.geometry.coordinates as MultiPolygon);
  return polygons
    .map((polygon) => polygon.map((ring) => ringToPath(ring, project)).join(" "))
    .join(" ");
}

type NepalProjectMapProps = {
  /** Controlled data (admin preview). When provided the component will not fetch. */
  data?: DistrictCountResponse | null;
  className?: string;
  heading?: boolean;
  compact?: boolean;
};

export function NepalProjectMap({
  data,
  className,
  heading = true,
  compact = false,
}: NepalProjectMapProps) {
  const isControlled = data !== undefined;
  const [fetched, setFetched] = useState<DistrictCountResponse | null>(null);
  const [loading, setLoading] = useState(!isControlled);
  const counts = isControlled ? data ?? null : fetched;
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { paths, projection } = useMemo(() => {
    const proj = buildProjection(GEO.features);
    const list = GEO.features.map((feature) => ({
      name: feature.properties.name,
      province: feature.properties.province,
      d: featureToPath(feature, proj.path),
    }));
    return { paths: list, projection: proj };
  }, []);

  useEffect(() => {
    if (isControlled) return;

    let active = true;
    fetch("/api/projects/district-counts", { cache: "no-store" })
      .then((response) => response.json())
      .then((json: DistrictCountResponse) => {
        if (active && json && json.districts) setFetched(json);
      })
      .catch(() => {
        // Leave counts empty; the map still renders with zero coverage.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [data, isControlled]);

  const coverage = useMemo(() => {
    if (!counts) return [];
    return Object.entries(counts.districts)
      .filter(([, entry]) => entry.count > 0)
      .sort((a, b) => b[1].count - a[1].count);
  }, [counts]);

  const entryFor = useCallback(
    (name: string): DistrictCountEntry | null => counts?.districts[name] ?? null,
    [counts],
  );

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }, []);

  const summary = counts?.summary;
  const selectedEntry = selected ? entryFor(selected) : null;

  return (
    <section
      className={`relative w-full overflow-hidden bg-slate-50 ${className ?? ""}`}
      aria-label="Nepal project coverage map"
    >
      {/* Subtle grid overlay behind the map */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.07) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {heading ? (
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              <MapPin className="size-3.5" aria-hidden="true" />
              Nationwide coverage
            </p>
            <h2 className="mt-5 font-serif text-3xl font-bold text-slate-900 md:text-4xl">
              Our Footprint Across Nepal
            </h2>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Hover over or click any district to explore completed surveying, mapping, and
              monitoring projects.
            </p>
          </div>
        ) : null}

        {/* Summary stats */}
        {summary ? (
          <dl className="mt-8 grid grid-cols-3 gap-4 sm:max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Projects
              </dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">{summary.totalProjects}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Districts
              </dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">
                {summary.districtsCovered}
                <span className="text-base font-medium text-slate-400">
                  /{summary.totalDistricts}
                </span>
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Top province
              </dt>
              <dd className="mt-1 truncate text-lg font-bold text-slate-900">
                {summary.mostActiveProvince?.name ?? "—"}
              </dd>
            </div>
          </dl>
        ) : null}

        <div
          ref={containerRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setHovered(null)}
          className="relative mt-8"
        >
          {loading && !counts ? (
            <div
              className={`w-full animate-pulse rounded-3xl border border-slate-200 bg-white ${
                compact ? "h-64" : "h-[420px] sm:h-[520px]"
              }`}
            />
          ) : (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <svg
                viewBox={projection.viewBox}
                className="h-auto w-full"
                role="img"
                aria-label="Vector map of Nepal's 77 districts"
              >
                {paths.map((district) => {
                  const entry = entryFor(district.name);
                  const hasProjects = (entry?.count ?? 0) > 0;
                  const isActive = hovered === district.name || selected === district.name;
                  return (
                    <path
                      key={district.name}
                      d={district.d}
                      fill={isActive ? "#93c5fd" : hasProjects ? "#c7ddf7" : "#e8eef5"}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-colors duration-150"
                      onMouseEnter={() => setHovered(district.name)}
                      onClick={() => setSelected(district.name)}
                    />
                  );
                })}

                {coverage.map(([name, entry]) => {
                  const [x, y] = projection.path(entry.lng, entry.lat);
                  const isActive = hovered === name || selected === name;
                  return (
                    <g
                      key={name}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(name)}
                      onClick={() => setSelected(name)}
                    >
                      <motion.circle
                        cx={x}
                        cy={y}
                        r={6}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth={2}
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: [0.6, 0], scale: [1, 2.6] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 7 : 5}
                        fill="#2563eb"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <circle cx={x} cy={y} r={1.8} fill="#ffffff" />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Hover tooltip */}
          <AnimatePresence>
            {hovered && tooltip && entryFor(hovered) ? (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+14px)]"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-xl">
                  <p className="text-sm font-bold text-slate-900">{hovered}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                      Projects: {entryFor(hovered)?.count ?? 0}
                    </span>
                    <span>Province {entryFor(hovered)?.province}</span>
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {!loading && !counts ? (
          <p className="mt-4 text-center text-sm text-slate-500">
            Live project data is temporarily unavailable. Please check back shortly.
          </p>
        ) : null}

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <span className="inline-flex size-3 items-center justify-center">
            <span className="size-2.5 rounded-full bg-blue-600 ring-4 ring-blue-400/30" />
          </span>
          Districts with completed or ongoing GeoSAT projects
        </p>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              aria-label="Close district details"
              onClick={() => setSelected(null)}
              className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    {selectedEntry ? PROVINCE_NAMES[selectedEntry.province] : ""} Province
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-slate-900">{selected}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedEntry?.count ?? 0}{" "}
                    {selectedEntry?.count === 1 ? "project" : "projects"} recorded
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {selectedEntry && selectedEntry.projects.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedEntry.projects.map((project) => (
                      <li
                        key={project.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-900">{project.title}</p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              project.status === "ONGOING"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {project.status === "ONGOING" ? "Ongoing" : "Completed"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{project.category}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                    <Layers className="mx-auto size-6 text-slate-400" aria-hidden="true" />
                    <p className="mt-3 text-sm text-slate-600">
                      No projects recorded in {selected} yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 p-6">
                <Link
                  href="/company/our-work"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  View all completed work
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default NepalProjectMap;
