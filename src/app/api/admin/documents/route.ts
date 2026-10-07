import { NextResponse } from "next/server";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import connectDB from "@/lib/db/connection";
import { MediaAsset } from "@/lib/models/MediaAsset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/rtf",
  "application/zip",
  "text/csv",
  "text/plain",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  if (!(await getAdminSessionServer())) {
    return NextResponse.json({ success: false, message: "Admin session required." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Choose a document or image to upload." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: "Use a PDF, Office document, CSV, text file, or JPEG, PNG, WebP, GIF, or AVIF image." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ success: false, message: "File must be smaller than 20 MB." }, { status: 400 });
    }

    await connectDB();
    const asset = await MediaAsset.create({
      mimeType: file.type,
      originalName: file.name.slice(0, 200),
      data: Buffer.from(await file.arrayBuffer()),
      size: file.size,
    });
    const id = asset._id.toString();
    const encodedName = encodeURIComponent(file.name.slice(0, 160));
    return NextResponse.json({
      success: true,
      data: {
        fileUrl: `/api/media/${id}?download=1&name=${encodedName}`,
        fileMediaId: id,
        fileName: file.name.slice(0, 200),
        fileType: file.type,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "File upload failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
