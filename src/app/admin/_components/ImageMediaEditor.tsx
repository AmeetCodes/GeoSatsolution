"use client";


import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Link2, LoaderCircle, Trash2, Upload } from "lucide-react";
import { IMAGE_FOCAL_POSITIONS, imageFocalPositionCss, type ContentImage, type ImageFitMode, type ImageFocalPosition } from "@/lib/content-types";

interface ImageMediaEditorProps {
  image: ContentImage;
  index: number;
  onChange: (image: ContentImage) => void;
  onRemove: () => void;
  showCaption?: boolean;
  title?: string;
  onUploadingChange?: (uploading: boolean) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  showFramingControls?: boolean;
}

export function ImageMediaEditor({ image, index, onChange, onRemove, showCaption = true, title = "Profile image", onUploadingChange, onMoveUp, onMoveDown, canMoveUp = false, canMoveDown = false, showFramingControls = false }: ImageMediaEditorProps) {
  const mode = image.source === "upload" || image.src.startsWith("/api/media/") ? "upload" : "url";
  const fitMode: ImageFitMode = image.fitMode ?? "contain";
  const focalPosition: ImageFocalPosition = image.focalPosition ?? "center";
  const focalCss = imageFocalPositionCss(focalPosition);
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
    <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold text-slate-900">{title}</legend>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(onMoveUp || onMoveDown) && (
            <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1" aria-label={`Image ${index + 1} display order`}>
              <button
                type="button"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                aria-label="Move image up"
                title="Move up"
                className="inline-flex size-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                aria-label="Move image down"
                title="Move down"
                className="inline-flex size-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowDown className="size-3.5" />
              </button>
            </div>
          )}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1" aria-label={`Image ${index + 1} source`}>
            <button
              type="button"
              onClick={() => changeMode("upload")}
              aria-pressed={mode === "upload"}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${mode === "upload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              <Upload className="size-3.5" /> Upload image
            </button>
            <button
              type="button"
              onClick={() => changeMode("url")}
              aria-pressed={mode === "url"}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${mode === "url" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              <Link2 className="size-3.5" /> External URL
            </button>
          </div>
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
            className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
          />
          <p className="text-xs text-slate-500">JPEG, PNG, WebP, GIF, or AVIF · up to 5 MB. Uploading stores the image in the database.</p>
          {isUploading && <p className="inline-flex items-center gap-2 text-xs text-slate-600"><LoaderCircle className="size-3.5 animate-spin" /> Uploading image…</p>}
        </div>
      ) : (
        <label className="block space-y-1.5 text-xs font-medium text-slate-700">
          Image URL <span className="font-normal text-slate-500">(https:// or site-relative path)</span>
          <input
            type="text"
            value={mode === "url" ? image.src : ""}
            onChange={(event) => onChange({ ...image, src: event.target.value, source: "url", mediaId: undefined })}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </label>
      )}

      {image.src && showFramingControls && (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="relative h-44 overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-40 blur-2xl scale-110" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="Image framing preview" className="relative z-10 h-full w-full p-1.5 drop-shadow-md" style={{ objectFit: fitMode, objectPosition: focalCss }} />
          </div>
          <span className="block min-w-0 break-all text-xs text-slate-600">{image.source === "upload" ? "Stored upload" : image.src}</span>
        </div>
      )}

      {image.src && !showFramingControls && (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt="" className="size-14 rounded-md border border-slate-200 object-cover" />
          <span className="min-w-0 break-all text-xs text-slate-600">{image.source === "upload" ? "Stored upload" : image.src}</span>
        </div>
      )}

      {showFramingControls && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-700">Fit mode</span>
            <div className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-50 p-1" role="group" aria-label={`Image ${index + 1} fit mode`}>
              <button
                type="button"
                onClick={() => onChange({ ...image, fitMode: "contain" })}
                aria-pressed={fitMode === "contain"}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium ${fitMode === "contain" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
              >
                Contain (Full map)
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...image, fitMode: "cover" })}
                aria-pressed={fitMode === "cover"}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium ${fitMode === "cover" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
              >
                Cover (Fill crop)
              </button>
            </div>
          </div>
          <label className="block space-y-1.5 text-xs font-medium text-slate-700">
            Focal point
            <select
              value={focalPosition}
              onChange={(event) => onChange({ ...image, focalPosition: event.target.value as ImageFocalPosition })}
              disabled={fitMode === "contain"}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              {IMAGE_FOCAL_POSITIONS.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
            <span className="block text-[11px] font-normal text-slate-500">
              {fitMode === "contain" ? "Focal point applies when fit mode is Cover." : `CSS object-position: ${focalCss}`}
            </span>
          </label>
        </div>
      )}

      <div className={`grid gap-3 ${showCaption ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        <label className="block space-y-1.5 text-xs font-medium text-slate-700">
          Alt text <span className="font-normal text-slate-500">(describe the image)</span>
          <input
            type="text"
            value={image.alt}
            onChange={(event) => onChange({ ...image, alt: event.target.value })}
            placeholder="Aerial survey of a mountain valley"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </label>
        {showCaption && (
          <label className="block space-y-1.5 text-xs font-medium text-slate-700">
            Caption <span className="font-normal text-slate-500">(optional)</span>
            <input
              type="text"
              value={image.caption}
              onChange={(event) => onChange({ ...image, caption: event.target.value })}
              placeholder="Short caption shown with the image"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </label>
        )}
      </div>
      {error && <p role="alert" className="text-xs font-medium text-red-700">{error}</p>}
    </fieldset>
  );
}