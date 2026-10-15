import { NextResponse } from "next/server";
import { districtProjectService } from "@/lib/db/services/district-project.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public, cached aggregation of project counts per Nepal district.
 * Powers the interactive map on the landing page.
 */
export async function GET() {
  try {
    const data = await districtProjectService.getDistrictCounts();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Failed to load district counts:", error);
    return NextResponse.json(
      { error: "Unable to load district project counts." },
      { status: 500 },
    );
  }
}
