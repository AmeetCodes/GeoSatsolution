import { NextResponse } from "next/server";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import connectDB from "@/lib/db/connection";
import { MediaAsset } from "@/lib/models/MediaAsset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const session = await getAdminSessionServer();
  if (!session) {
    return NextResponse.json({ success: false, message: "Admin session required." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Choose an image file to upload." }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Use a JPEG, PNG, WebP, GIF, or AVIF image." },
        { status: 400 },
      );
    }
    if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { success: false, message: "Image must be smaller than 5 MB." },
        { status: 400 },
      );
    }

    await connectDB();
    const asset = await MediaAsset.create({
      mimeType: file.type,
      originalName: file.name.slice(0, 200),
      data: Buffer.from(await file.arrayBuffer()),
      size: file.size,
    });

    return NextResponse.json({
      success: true,
      data: {
        src: `/api/media/${asset._id.toString()}`,
        source: "upload",
        mediaId: asset._id.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image upload failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
