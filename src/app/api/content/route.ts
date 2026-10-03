import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = getSiteContent();
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
