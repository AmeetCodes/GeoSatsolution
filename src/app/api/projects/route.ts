import { NextResponse } from "next/server";
import { listShowcaseProjects } from "@/lib/db/services/showcase-project.service";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ success: true, data: await listShowcaseProjects() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ success: false, data: [] }, { status: 200 }); }
}
