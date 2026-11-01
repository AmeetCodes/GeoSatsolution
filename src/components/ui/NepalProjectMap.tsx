"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import nepalGeoJson from "@/lib/data/nepal-districts.geo.json";
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

  return (
    <section
      className={`relative w-full overflow-hidden bg-slate-50 ${className ?? ""}`}
      aria-label="Nepal project coverage map"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.07) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {heading ? (
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              Nationwide coverage
            </p>
            <h2 className="mb-3 mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Our Footprint Across Nepal
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Hover over any district to explore completed surveying, mapping, and monitoring projects.
            </p>
          </div>
        ) : null}

        {summary ? (
          <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm backdrop-blur-sm md:p-5">
              <dt className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-slate-400 md:text-xs">
                  Projects completed
                </span>
              </dt>
              <dd className="mt-1 text-2xl font-extrabold text-slate-900 md:text-3xl">
                {summary.totalProjects}
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm backdrop-blur-sm md:p-5">
              <dt className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-slate-400 md:text-xs">
                  Districts covered
                </span>
              </dt>
              <dd className="mt-1 text-slate-900">
                <span className="text-2xl font-extrabold md:text-3xl">
                  {summary.districtsCovered}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-400">
                  / {summary.totalDistricts}
                </span>
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm backdrop-blur-sm md:p-5">
              <dt className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-slate-400 md:text-xs">
                  Top province
                </span>
              </dt>
              <dd className="mt-1 truncate text-xl font-bold text-slate-900 md:text-2xl">
                {summary.mostActiveProvince?.name ?? "—"}
              </dd>
            </div>
          </dl>
        ) : null}

        <div
          ref={containerRef}
          onMouseMove={handleMove}
          onMouseLeave={() => {
            setHovered(null);
            setTooltip(null);
          }}
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
                  const isActive = hovered === district.name;
                  return (
                    <path
                      key={district.name}
                      d={district.d}
                      fill={isActive ? "#93c5fd" : hasProjects ? "#c7ddf7" : "#e8eef5"}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-default transition-colors duration-150"
                      onMouseEnter={() => setHovered(district.name)}
                    />
                  );
                })}

                {coverage.map(([name, entry]) => {
                  const [x, y] = projection.path(entry.lng, entry.lat);
                  const isActive = hovered === name;
                  return (
                    <g
                      key={name}
                      className="cursor-default"
                      onMouseEnter={() => setHovered(name)}
                    >
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

          {hovered && tooltip && entryFor(hovered) ? (
            <div
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
            </div>
          ) : null}
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
    </section>
  );
}

export default NepalProjectMap;
