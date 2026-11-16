import { NextResponse } from "next/server";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { deleteShowcaseProject, listShowcaseProjects, saveShowcaseProject, type ShowcaseProjectInput } from "@/lib/db/services/showcase-project.service";

export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await getAdminSessionServer())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json({ success: true, data: await listShowcaseProjects() }); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Could not load projects" }, { status: 500 }); }
}
export async function POST(request: Request) {
  if (!(await getAdminSessionServer())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json() as { data?: ShowcaseProjectInput; id?: string };
    if (!body.data || !["service", "sales"].includes(body.data.type)) return NextResponse.json({ message: "Valid project data is required." }, { status: 400 });
    const data = await saveShowcaseProject(body.data, body.id);
    return NextResponse.json({ success: true, data });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Could not save project" }, { status: 400 }); }
}
export async function DELETE(request: Request) {
  if (!(await getAdminSessionServer())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json() as { id?: string };
    if (!id) return NextResponse.json({ message: "Project id is required." }, { status: 400 });
    await deleteShowcaseProject(id);
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Could not delete project" }, { status: 400 }); }
}
