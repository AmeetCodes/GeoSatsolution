"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import "./DomeGallery.css";

export type DomeGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  title: string;
  sector: string;
  description: string;
  code?: string;
};

type DomeGalleryProps = {
  images: DomeGalleryImage[];
  placeholderProjects?: DomeGalleryImage[];
  fit?: number;
  minRadius?: number;
  maxVerticalRotationDeg?: number;
  segments?: number;
  dragDampening?: number;
  grayscale?: boolean;
};

export default function DomeGallery({
  images,
  placeholderProjects = [],
  fit = 0.8,
  minRadius = 600,
  maxVerticalRotationDeg = 0,
  segments = 34,
  dragDampening = 2,
  grayscale = false,
}: DomeGalleryProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<{ image: DomeGalleryImage; rect: DOMRect } | null>(null);
  const [dragging, setDragging] = useState(false);
  const moved = useRef(false);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const sourceItems = images.length ? images : placeholderProjects;
  const tiles = useMemo(() => sourceItems.length
    ? Array.from({ length: Math.max(sourceItems.length, segments) }, (_, index) => sourceItems[index % sourceItems.length])
    : [], [sourceItems, segments]);

  const startDrag = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    moved.current = false;
    setDragging(true);
    // Capture on the tile itself so a pointer click still targets that tile.
    // Capturing on the gallery root retargets the click and prevents expansion.
    if (event.target instanceof HTMLElement) event.target.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    const dx = event.clientX - pointer.current.x;
    const dy = event.clientY - pointer.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved.current = true;
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    setRotation((current) => ({
      y: current.y + dx * dragDampening * 0.18,
      x: Math.max(-maxVerticalRotationDeg, Math.min(maxVerticalRotationDeg, current.x - dy * dragDampening * 0.12)),
    }));
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (pointer.current?.id === event.pointerId) pointer.current = null;
    setDragging(false);
  };

  return (
    <section className="dome-gallery" aria-label="Selected GeoSAT project images">
      {tiles.length ? <div
        role="group"
        aria-label="Interactive project dome gallery"
        className={`dome-gallery__main${dragging ? " is-dragging" : ""}`}
        style={{ "--dome-fit": fit, "--dome-radius": `${Math.max(minRadius, 600 * fit)}px`, "--dome-rotation-x": `${rotation.x}deg`, "--dome-rotation-y": `${rotation.y}deg`, "--dome-image-filter": grayscale ? "grayscale(1)" : "none" } as CSSProperties}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="dome-gallery__stage">
          <div className="dome-gallery__sphere" aria-label="Drag to explore projects">
            {tiles.map((image, index) => {
              const count = tiles.length;
              const vertical = Math.acos(1 - 2 * (index + 0.5) / count);
              const horizontal = Math.PI * (3 - Math.sqrt(5)) * index;
              const yaw = horizontal * 180 / Math.PI;
              const pitch = 90 - vertical * 180 / Math.PI;
              return <button
                key={`${image.src}-${index}`}
                type="button"
                className="dome-gallery__tile"
                style={{ transform: `rotateY(${yaw}deg) rotateX(${pitch}deg) translateZ(var(--dome-radius))` }}
                aria-label={`View ${image.title}: ${image.alt}`}
                onClick={(event) => {
                  if (!moved.current) setSelected({ image, rect: event.currentTarget.getBoundingClientRect() });
                }}
              >
                {image.src ? <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt={image.alt} draggable={false} />
                </> : <span className="dome-gallery__placeholder" aria-hidden="true">
                  <span className="dome-gallery__placeholder-kicker">GEO SAT · {image.sector}</span>
                  <span className="dome-gallery__placeholder-orbit" />
                  <span className="dome-gallery__placeholder-code">{image.code || "FIELD PROJECT"}</span>
                </span>}
                <span className="dome-gallery__tile-label">{image.title}</span>
              </button>;
            })}
          </div>
        </div>
        <div className="dome-gallery__overlay" aria-hidden="true" />
        <div className="dome-gallery__edge dome-gallery__edge--top" aria-hidden="true" />
        <div className="dome-gallery__edge dome-gallery__edge--bottom" aria-hidden="true" />
        <p className="dome-gallery__hint">Drag to explore · Select a project for details</p>
        {selected && <div className="dome-gallery__viewer" role="dialog" aria-modal="true" aria-label={selected.image.title}>
          <button type="button" className="dome-gallery__scrim" aria-label="Close project details" onClick={() => setSelected(null)} />
          <article
            className="dome-gallery__enlarge"
            style={{
              "--dome-from-x": `${selected.rect.left + selected.rect.width / 2 - window.innerWidth / 2}px`,
              "--dome-from-y": `${selected.rect.top + selected.rect.height / 2 - window.innerHeight / 2}px`,
              "--dome-from-scale": `${selected.rect.width / Math.min(980, window.innerWidth - 48)}`,
            } as CSSProperties}
          >
            {selected.image.src ? <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image.src} alt={selected.image.alt} />
            </> : <div className="dome-gallery__placeholder dome-gallery__placeholder--large"><span className="dome-gallery__placeholder-orbit" /></div>}
            <div className="dome-gallery__details"><p className="label text-aqua">{selected.image.sector}</p><h2>{selected.image.title}</h2><p>{selected.image.caption || selected.image.description}</p><button type="button" onClick={() => setSelected(null)}>Close</button></div>
          </article>
        </div>}
      </div> : <div className="dome-gallery__empty"><p className="label text-aqua">Selected projects</p><h2>Our work</h2><p>Project gallery images will appear here when an administrator adds them in Admin → Projects.</p></div>}
    </section>
  );
}
