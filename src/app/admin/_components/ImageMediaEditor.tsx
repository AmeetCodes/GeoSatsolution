"use client";

import { useRef, useState } from "react";
import { Link2, LoaderCircle, Trash2, Upload } from "lucide-react";
import type { ContentImage } from "@/lib/data-store";

interface ImageMediaEditorProps {
  image: ContentImage;
  index: number;
  onChange: (image: ContentImage) => void;
  onRemove: () => void;
  showCaption?: boolean;
  title?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImageMediaEditor({ image, index, onChange, onRemove, showCaption = true, title = "Profile image", onUploadingChange }: ImageMediaEditorProps) {
  const mode = image.source === "upload" || image.src.startsWith("/api/media/") ? "upload" : "url";
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const changeMode = (nextMode: "upload" | "url") => {
    setError("");
    onChange({ ...image, src: "", source: nextMode, mediaId: undefined });
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    setError("");
    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "The image could not be uploaded.");
      }
      onChange({
        ...image,
        src: result.data.src,
        source: "upload",
        mediaId: result.data.mediaId,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The image could not be uploaded.");
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <fieldset className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold text-zinc-900">{title}</legend>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1" aria-label={`Image ${index + 1} source`}>
          <button
            type="button"
            onClick={() => changeMode("upload")}
            aria-pressed={mode === "upload"}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${mode === "upload" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"}`}
          >
            <Upload className="size-3.5" /> Upload image
          </button>
          <button
            type="button"
            onClick={() => changeMode("url")}
            aria-pressed={mode === "url"}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${mode === "url" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"}`}
          >
            <Link2 className="size-3.5" /> External URL
          </button>
        </div>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-red-700 hover:bg-red-50">
          <Trash2 className="size-3.5" /> Remove image
        </button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={(event) => void uploadImage(event.target.files?.[0])}
            className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#517357] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#426349]"
          />
          <p className="text-xs text-zinc-500">JPEG, PNG, WebP, GIF, or AVIF · up to 5 MB. Uploading stores the image in the database.</p>
          {isUploading && <p className="inline-flex items-center gap-2 text-xs text-zinc-600"><LoaderCircle className="size-3.5 animate-spin" /> Uploading image…</p>}
        </div>
      ) : (
        <label className="block space-y-1.5 text-xs font-medium text-zinc-700">
          Image URL <span className="font-normal text-zinc-500">(https:// or site-relative path)</span>
          <input
            type="text"
            value={mode === "url" ? image.src : ""}
            onChange={(event) => onChange({ ...image, src: event.target.value, source: "url", mediaId: undefined })}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
        </label>
      )}

      {image.src && (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt="" className="size-14 rounded-md border border-zinc-200 object-cover" />
          <span className="min-w-0 break-all text-xs text-zinc-600">{image.source === "upload" ? "Stored upload" : image.src}</span>
        </div>
      )}

      <div className={`grid gap-3 ${showCaption ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        <label className="block space-y-1.5 text-xs font-medium text-zinc-700">
          Alt text <span className="font-normal text-zinc-500">(describe the image)</span>
          <input
            type="text"
            value={image.alt}
            onChange={(event) => onChange({ ...image, alt: event.target.value })}
            placeholder="Aerial survey of a mountain valley"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
        </label>
        {showCaption && (
          <label className="block space-y-1.5 text-xs font-medium text-zinc-700">
            Caption <span className="font-normal text-zinc-500">(optional)</span>
            <input
              type="text"
              value={image.caption}
              onChange={(event) => onChange({ ...image, caption: event.target.value })}
              placeholder="Short caption shown with the image"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            />
          </label>
        )}
      </div>
      {error && <p role="alert" className="text-xs font-medium text-red-700">{error}</p>}
    </fieldset>
  );
}
