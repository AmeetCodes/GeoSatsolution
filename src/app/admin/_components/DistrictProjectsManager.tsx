"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ChevronDown,
  Loader2,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import {
  NEPAL_DISTRICTS,
  PROVINCE_NAMES,
  getDistrictByName,
} from "@/lib/data/nepal-districts";
import { NepalProjectMap } from "@/components/ui/NepalProjectMap";
import type {
  DistrictCountResponse,
  DistrictProjectRecord,
  DistrictProjectStatus,
} from "@/lib/nepal-map-types";

interface DistrictProjectsManagerProps {
  initialProjects?: DistrictProjectRecord[];
  onTriggerToast: (title: string, desc?: string) => void;
}

function buildCounts(projects: DistrictProjectRecord[]): DistrictCountResponse {
  const districts: DistrictCountResponse["districts"] = {};
  for (const district of NEPAL_DISTRICTS) {
    districts[district.name] = {
      count: 0,
      province: district.province,
      provinceName: PROVINCE_NAMES[district.province] ?? `Province ${district.province}`,
      lat: district.lat,
      lng: district.lng,
      projects: [],
    };
  }

  let totalProjects = 0;
  const provinceTotals = new Map<number, number>();

  for (const project of projects) {
    const entry = districts[project.district];
    if (!entry) continue;
    entry.count += 1;
    entry.projects.push({
      id: project.id,
      title: project.title || "Field survey project",
      category: project.category || "Geospatial survey",
      status: project.status,
    });
    totalProjects += 1;
    provinceTotals.set(project.province, (provinceTotals.get(project.province) ?? 0) + 1);
  }

  const districtsCovered = Object.values(districts).filter((entry) => entry.count > 0).length;

  let mostActiveProvince: DistrictCountResponse["summary"]["mostActiveProvince"] = null;
  for (const [id, count] of provinceTotals) {
    if (!mostActiveProvince || count > mostActiveProvince.count) {
      mostActiveProvince = { id, name: PROVINCE_NAMES[id] ?? `Province ${id}`, count };
    }
  }

  return {
    summary: {
      totalProjects,
      districtsCovered,
      totalDistricts: NEPAL_DISTRICTS.length,
      mostActiveProvince,
    },
    districts,
  };
}

export function DistrictProjectsManager({
  initialProjects = [],
  onTriggerToast,
}: DistrictProjectsManagerProps) {
  const [projects, setProjects] = useState<DistrictProjectRecord[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [districtQuery, setDistrictQuery] = useState("");
  const [districtOpen, setDistrictOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<DistrictProjectStatus>("COMPLETED");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/district-projects", { cache: "no-store" });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to load district projects");
      }
      setProjects(json.data as DistrictProjectRecord[]);
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load district projects");
    } finally {
      setLoading(false);
    }
  }, []);

  const counts = useMemo(() => buildCounts(projects), [projects]);

  const filteredDistricts = useMemo(() => {
    const query = districtQuery.trim().toLowerCase();
    const list = query
      ? NEPAL_DISTRICTS.filter((district) => district.name.toLowerCase().includes(query))
      : NEPAL_DISTRICTS;
    const grouped = new Map<number, typeof NEPAL_DISTRICTS>();
    for (const district of list) {
      const bucket = grouped.get(district.province) ?? [];
      bucket.push(district);
      grouped.set(district.province, bucket);
    }
    return [...grouped.entries()].sort((a, b) => a[0] - b[0]);
  }, [districtQuery]);

  const districtProjectList = useMemo(
    () =>
      [...projects].sort((a, b) =>
        a.district === b.district
          ? (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
          : a.district.localeCompare(b.district),
      ),
    [projects],
  );

  async function request(body: unknown, successTitle: string) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/district-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Operation failed");
      }
      await load();
      onTriggerToast(successTitle, json.message);
      return true;
    } catch (error) {
      onTriggerToast("Action Failed", error instanceof Error ? error.message : "Operation failed");
      return false;
    } finally {
      setSaving(false);
    }
  }

  const handleSelectDistrict = (name: string) => {
    setSelectedDistrict(name);
    setDistrictQuery(name);
    setDistrictOpen(false);
  };

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDistrict) {
      onTriggerToast("Select a district", "Choose a district before adding a project.");
      return;
    }
    const ok = await request(
      {
        action: "create",
        data: {
          district: selectedDistrict,
          title: title.trim(),
          category: category.trim(),
          status,
        },
      },
      "Project Added",
    );
    if (ok) {
      setTitle("");
      setCategory("");
      setStatus("COMPLETED");
    }
  };

  const handleIncrement = async () => {
    if (!selectedDistrict) {
      onTriggerToast("Select a district", "Choose a district to increment.");
      return;
    }
    await request(
      {
        action: "increment",
        data: {
          district: selectedDistrict,
          title: title.trim(),
          category: category.trim(),
          status,
        },
      },
      "Project Count Increased",
    );
  };

  const handleDecrement = async () => {
    if (!selectedDistrict) {
      onTriggerToast("Select a district", "Choose a district to decrement.");
      return;
    }
    await request(
      { action: "decrement", data: { district: selectedDistrict } },
      "Project Count Decreased",
    );
  };

  const handleDelete = async (project: DistrictProjectRecord) => {
    await request({ action: "delete", id: project.id }, "Project Deleted");
  };

  const summary = counts.summary;
  const selectedMeta = selectedDistrict ? getDistrictByName(selectedDistrict) : undefined;

  return (
    <div className="space-y-6">
      {/* Stats summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Total projects across Nepal
          </p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{summary.totalProjects}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Districts covered
          </p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {summary.districtsCovered}
            <span className="text-lg font-medium text-zinc-400">/{summary.totalDistricts}</span>
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Most active province
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900">
            {summary.mostActiveProvince?.name ?? "—"}
          </p>
          {summary.mostActiveProvince ? (
            <p className="mt-1 text-xs text-zinc-500">
              {summary.mostActiveProvince.count}{" "}
              {summary.mostActiveProvince.count === 1 ? "project" : "projects"}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Manager + form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Project & Location Manager</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Assign projects to any of Nepal&apos;s 77 districts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  void load();
                }}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Refresh district projects"
              >
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-5 space-y-4">
              <div className="relative">
                <label className="text-xs font-semibold text-zinc-700">District</label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={districtQuery}
                    onChange={(event) => {
                      setDistrictQuery(event.target.value);
                      setSelectedDistrict("");
                      setDistrictOpen(true);
                    }}
                    onFocus={() => setDistrictOpen(true)}
                    onBlur={() => window.setTimeout(() => setDistrictOpen(false), 150)}
                    placeholder="Search all 77 districts"
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                </div>

                {districtOpen ? (
                  <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-xl">
                    {filteredDistricts.length === 0 ? (
                      <p className="px-3 py-3 text-sm text-zinc-500">No districts match.</p>
                    ) : (
                      filteredDistricts.map(([province, districts]) => (
                        <div key={province}>
                          <p className="sticky top-0 bg-zinc-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                            Province {province} · {PROVINCE_NAMES[province]}
                          </p>
                          {districts.map((district) => (
                            <button
                              key={district.name}
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                handleSelectDistrict(district.name);
                              }}
                              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-cyan-50 ${
                                selectedDistrict === district.name
                                  ? "bg-cyan-50 font-semibold text-cyan-800"
                                  : "text-zinc-700"
                              }`}
                            >
                              {district.name}
                              <span className="text-[11px] text-zinc-400">
                                {counts.districts[district.name]?.count ?? 0} proj.
                              </span>
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                ) : null}
              </div>

              {selectedMeta ? (
                <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="size-3.5 text-cyan-600" />
                  Province {selectedMeta.province} · {PROVINCE_NAMES[selectedMeta.province]}
                </p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-zinc-700">
                  Project title
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={200}
                    placeholder="e.g. Jajarkot LiDAR corridor"
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </label>
                <label className="block text-xs font-semibold text-zinc-700">
                  Category
                  <input
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    maxLength={120}
                    placeholder="e.g. UAV LiDAR, Cadastral Survey"
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </label>
              </div>

              <label className="block text-xs font-semibold text-zinc-700">
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as DistrictProjectStatus)}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ONGOING">ONGOING</option>
                </select>
              </label>

              <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  Add project to district
                </button>
                <button
                  type="button"
                  onClick={() => void handleIncrement()}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
                >
                  <Plus className="size-4" /> Increment
                </button>
                <button
                  type="button"
                  onClick={() => void handleDecrement()}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
                >
                  <Minus className="size-4" /> Decrement
                </button>
              </div>
            </form>
          </div>

          {/* Existing records */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900">
              Recorded district projects{" "}
              <span className="font-normal text-zinc-400">({projects.length})</span>
            </h3>

            {loading && projects.length === 0 ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </p>
            ) : loadError ? (
              <p className="mt-4 text-sm text-red-600">{loadError}</p>
            ) : districtProjectList.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
                No district projects recorded yet. Add one above.
              </p>
            ) : (
              <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                {districtProjectList.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {project.title || "Field survey project"}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {project.district} · {project.category || "Geospatial survey"} ·{" "}
                        {project.status === "ONGOING" ? "Ongoing" : "Completed"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDelete(project)}
                      disabled={saving}
                      aria-label={`Delete project in ${project.district}`}
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-zinc-900">Live map preview</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Updates instantly as you add, increment, or remove district projects.
            </p>
          </div>
          <NepalProjectMap data={counts} heading={false} compact />
        </div>
      </div>
    </div>
  );
}

export default DistrictProjectsManager;
