import { NextResponse } from "next/server";
import { listShowcaseProjects } from "@/lib/db/services/showcase-project.service";
import { NEPAL_DISTRICTS, PROVINCE_NAMES } from "@/lib/data/nepal-districts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const serviceProjects = await listShowcaseProjects("service");
    const districts = Object.fromEntries(NEPAL_DISTRICTS.map((district) => [district.name, {
      count: 0, province: district.province, provinceName: PROVINCE_NAMES[district.province], lat: district.lat, lng: district.lng,
      projects: [] as { id: string; status: "COMPLETED"; slug: string; title: string }[],
    }]));
    for (const project of serviceProjects) for (const name of project.districts ?? []) {
      const entry = districts[name as keyof typeof districts];
      if (!entry) continue;
      entry.count++;
      entry.projects.push({ id: String(project._id), status: "COMPLETED", slug: project.slug, title: project.projectName ?? "Service project" });
    }
    const districtsCovered = Object.values(districts).filter((d) => d.count > 0).length;
    const totalArea = serviceProjects.reduce((sum, project) => sum + (Number(project.area) || 0), 0);
    return NextResponse.json({ summary: { totalProjects: serviceProjects.length, districtsCovered, totalDistricts: 77, totalArea, mostActiveProvince: null }, districts }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load service project coverage:", error);
    return NextResponse.json({ error: "Unable to load service project coverage." }, { status: 500 });
  }
}
