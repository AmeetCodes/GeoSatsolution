import { NextResponse } from "next/server";
import { getShowcaseProject } from "@/lib/db/services/showcase-project.service";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: RouteContext<"/api/projects/[slug]">) {
  try {
    const { slug } = await context.params;
    const data = await getShowcaseProject(slug);
    return data ? NextResponse.json({ success: true, data }) : NextResponse.json({ success: false }, { status: 404 });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}
