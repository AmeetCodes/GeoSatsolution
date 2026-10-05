import { NextResponse } from "next/server";
import { siteContentService } from "@/lib/db/services/site-content.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await siteContentService.getFullSiteContent();
    return NextResponse.json({
      success: true,
      data: {
        solutions: content.Solutions,
        products: content.Products,
        industries: content.Industries,
        company: content.Company,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}
