import { NextResponse } from "next/server";
import { productService } from "@/lib/db/services/product.service";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { productItemSchema } from "@/lib/validations/product.schema";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group") || undefined;
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    const session = includeDrafts ? await getAdminSessionServer() : null;
    const products = session
      ? await productService.getAllForAdmin(group)
      : await productService.getAllPublished();

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to fetch products") },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = productItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await productService.create(parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to create product") },
      { status: 500 }
    );
  }
}
