import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import { MediaAsset } from "@/lib/models/MediaAsset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toImageBuffer(value: unknown): Buffer | null {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (!value || typeof value !== "object") return null;

  // Mongoose lean queries can expose a BSON Binary instead of a Node Buffer.
  const binary = value as {
    buffer?: unknown;
    position?: number;
    value?: (asRaw?: boolean) => Uint8Array;
  };
  if (binary.buffer instanceof Uint8Array) {
    const length = Number.isInteger(binary.position)
      ? Math.min(binary.position as number, binary.buffer.byteLength)
      : binary.buffer.byteLength;
    return Buffer.from(binary.buffer.subarray(0, length));
  }
  if (typeof binary.value === "function") {
    const bytes = binary.value(true);
    if (bytes instanceof Uint8Array) return Buffer.from(bytes);
  }
  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse("Image not found", { status: 404 });
  }

  try {
    await connectDB();
    const asset = await MediaAsset.findById(id).select("mimeType originalName data").lean().exec();
    if (!asset) return new NextResponse("Image not found", { status: 404 });

    const bytes = toImageBuffer(asset.data);
    if (!bytes?.byteLength) {
      return new NextResponse("Stored image data unavailable", { status: 500 });
    }
    const url = new URL(request.url);
    const downloadName = url.searchParams.get("name") || (asset as { originalName?: string }).originalName || "download";
    const safeName = downloadName.replace(/[\r\n"\\]/g, "_").slice(0, 180);
    const isDownload = url.searchParams.get("download") === "1";
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(bytes.byteLength),
        ...(isDownload ? { "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}` } : {}),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Image unavailable", { status: 500 });
  }
}
