"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

export type CircularGalleryItem = { image: string; text: string };

type CircularGalleryProps = {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollEase?: number;
  fontUrl?: string;
  font?: string;
  scrollSpeed?: number;
};

type GalleryScreen = { width: number; height: number };
type GalleryViewport = { width: number; height: number };
type ScrollState = { current: number; last: number; target: number; ease: number };

// OGL canvas gallery adapted from React Bits CircularGallery.
// See THIRD_PARTY_NOTICES.md for attribution and license terms.
const DEFAULT_ITEMS: CircularGalleryItem[] = [
  { image: "https://picsum.photos/seed/3/800/600?grayscale", text: "Waterfall" },
  { image: "https://picsum.photos/seed/4/800/600?grayscale", text: "Strawberries" },
  { image: "https://picsum.photos/seed/5/800/600?grayscale", text: "Deep Diving" },
  { image: "https://picsum.photos/seed/16/800/600?grayscale", text: "Train Track" },
  { image: "https://picsum.photos/seed/17/800/600?grayscale", text: "Santorini" },
  { image: "https://picsum.photos/seed/8/800/600?grayscale", text: "Blurry Lights" },
  { image: "https://picsum.photos/seed/9/800/600?grayscale", text: "New York" },
  { image: "https://picsum.photos/seed/10/800/600?grayscale", text: "Good Boy" },
  { image: "https://picsum.photos/seed/21/800/600?grayscale", text: "Coastline" },
  { image: "https://picsum.photos/seed/12/800/600?grayscale", text: "Palm Trees" },
];

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

function loadFont(font: string, fontUrl: string): Promise<string> {
  if (!fontUrl) {
    return document.fonts?.load(font).then(() => font).catch(() => font) ?? Promise.resolve(font);
  }

  return new Promise((resolve) => {
    const isStylesheet = fontUrl.includes("fonts.googleapis.com") || /\.css(?:\?|$)/i.test(fontUrl);
    if (isStylesheet) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      link.onload = () => {
        void document.fonts.load(font).finally(() => resolve(font));
      };
      link.onerror = () => resolve(font);
      document.head.appendChild(link);
      return;
    }

    const family = (fontUrl.split("/").pop() || "CircularGalleryFont")
      .split("?")[0]
      .replace(/\.(woff2?|ttf|otf)$/i, "")
      .replace(/[^a-zA-Z0-9-_ ]/g, "") || "CircularGalleryFont";
    const face = new FontFace(family, `url(${fontUrl})`);
    face.load().then((loaded) => {
      document.fonts.add(loaded);
      const prefix = font.match(/^\s*(.*?\d+(?:\.\d+)?px)/)?.[1]?.trim() ?? "bold 30px";
      resolve(`${prefix} "${family}"`);
    }).catch(() => resolve(font));
  });
}

class GalleryMedia {
  mesh: Mesh;
  program: Program;
  titleMesh: Mesh;
  x = 0;
  extra = 0;
  width = 0;
  widthTotal = 0;
  speed = 0;
  scale = 1;
  isBefore = false;
  isAfter = false;

  constructor(
    private gl: Renderer["gl"],
    private geometry: Plane,
    private scene: Transform,
    private screen: GalleryScreen,
    private viewport: GalleryViewport,
    private imageUrl: string,
    private label: string,
    private index: number,
    private length: number,
    private bend: number,
    private textColor: string,
    private borderRadius: number,
    private font: string,
  ) {
    const texture = new Texture(gl, { generateMipmaps: true });
    this.program = new Program(gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 imageUv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, imageUv);
          float distance = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, distance);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: Math.random() * 100 },
        uBorderRadius: { value: borderRadius },
      },
      transparent: true,
    });

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      texture.image = image;
      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
    };
    image.src = imageUrl;

    this.mesh = new Mesh(gl, { geometry, program: this.program });
    this.mesh.setParent(scene);
    this.titleMesh = this.createTitle();
    this.resize();
  }

  private createTitle() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create a canvas text context.");
    context.font = this.font;
    const fontSize = Number(this.font.match(/(\d+(?:\.\d+)?)px/)?.[1] ?? 30);
    const width = Math.ceil(context.measureText(this.label).width);
    canvas.width = width + 24;
    canvas.height = Math.ceil(fontSize * 1.5);
    context.font = this.font;
    context.fillStyle = this.textColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.label, canvas.width / 2, canvas.height / 2);

    const texture = new Texture(this.gl, { generateMipmaps: false });
    texture.image = canvas;
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() { vec4 color = texture2D(tMap, vUv); if (color.a < 0.1) discard; gl_FragColor = color; }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    const title = new Mesh(this.gl, { geometry: new Plane(this.gl), program });
    const titleHeight = 0.1;
    title.scale.set(titleHeight * (canvas.width / canvas.height), titleHeight, 1);
    title.position.y = -0.5 - titleHeight * 0.5 - 0.04;
    title.setParent(this.mesh);
    return title;
  }

  resize(screen: GalleryScreen = this.screen, viewport: GalleryViewport = this.viewport) {
    this.screen = screen;
    this.viewport = viewport;
    this.scale = screen.height / 1500;
    this.mesh.scale.y = (viewport.height * (900 * this.scale)) / screen.height;
    this.mesh.scale.x = (viewport.width * (700 * this.scale)) / screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.mesh.scale.x, this.mesh.scale.y];
    const padding = 2;
    this.width = this.mesh.scale.x + padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
    const titleHeight = 0.1;
    this.titleMesh.scale.set(titleHeight * (this.titleMesh.scale.x / this.titleMesh.scale.y), titleHeight, 1);
    this.titleMesh.position.y = -0.5 - titleHeight * 0.5 - 0.04;
  }

  update(scroll: ScrollState, direction: "left" | "right") {
    this.mesh.position.x = this.x - scroll.current - this.extra;
    const x = this.mesh.position.x;
    const halfWidth = this.viewport.width / 2;
    if (this.bend === 0) {
      this.mesh.position.y = 0;
      this.mesh.rotation.z = 0;
    } else {
      const bend = Math.abs(this.bend);
      const radius = (halfWidth * halfWidth + bend * bend) / (2 * bend);
      const arcX = Math.min(Math.abs(x), halfWidth);
      const arc = radius - Math.sqrt(radius * radius - arcX * arcX);
      this.mesh.position.y = this.bend > 0 ? -arc : arc;
      this.mesh.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(arcX / radius);
    }
    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;
    const halfPlane = this.mesh.scale.x / 2;
    const halfViewport = this.viewport.width / 2;
    this.isBefore = this.mesh.position.x + halfPlane < -halfViewport;
    this.isAfter = this.mesh.position.x - halfPlane > halfViewport;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
}

class CircularGalleryEngine {
  private renderer: Renderer;
  private camera: Camera;
  private scene = new Transform();
  private geometry: Plane;
  private screen: GalleryScreen;
  private viewport: GalleryViewport;
  private media: GalleryMedia[] = [];
  private frame = 0;
  private dragging = false;
  private dragStart = 0;
  private scrollStart = 0;
  private scroll: ScrollState;
  private readonly galleryItems: CircularGalleryItem[];
  private readonly speed: number;
  private readonly onResizeBound = () => this.onResize();
  private readonly onWheelBound = (event: WheelEvent) => this.onWheel(event);
  private readonly onPointerDownBound = (event: PointerEvent) => this.onPointerDown(event);
  private readonly onPointerMoveBound = (event: PointerEvent) => this.onPointerMove(event);
  private readonly onPointerUpBound = () => this.onPointerUp();
  private readonly onKeyDownBound = (event: KeyboardEvent) => this.onKeyDown(event);

  constructor(
    private container: HTMLDivElement,
    items: CircularGalleryItem[],
    private bend: number,
    textColor: string,
    borderRadius: number,
    font: string,
    scrollSpeed: number,
    scrollEase: number,
  ) {
    this.galleryItems = items.length ? [...items, ...items] : [...DEFAULT_ITEMS, ...DEFAULT_ITEMS];
    this.speed = scrollSpeed;
    this.scroll = { current: 0, last: 0, target: 0, ease: scrollEase };
    this.screen = { width: container.clientWidth, height: container.clientHeight };
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.renderer.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas);
    this.camera = new Camera(this.renderer.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
    this.geometry = new Plane(this.renderer.gl, { heightSegments: 50, widthSegments: 100 });
    this.viewport = this.measureViewport();
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    this.media = this.galleryItems.map((item, index) => new GalleryMedia(
      this.renderer.gl,
      this.geometry,
      this.scene,
      this.screen,
      this.viewport,
      item.image,
      item.text,
      index,
      this.galleryItems.length,
      bend,
      textColor,
      borderRadius,
      font,
    ));
    this.addListeners();
    this.update();
  }

  private measureViewport(): GalleryViewport {
    const height = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    return { width: height * (this.screen.width / this.screen.height), height };
  }

  private onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    if (!this.screen.width || !this.screen.height) return;
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    this.viewport = this.measureViewport();
    this.media.forEach((item) => item.resize(this.screen, this.viewport));
  }

  private onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY || event.deltaX;
    this.scroll.target += (delta > 0 ? 1 : -1) * this.speed * 0.2;
  }

  private onPointerDown(event: PointerEvent) {
    this.dragging = true;
    this.dragStart = event.clientX;
    this.scrollStart = this.scroll.current;
    this.container.setPointerCapture(event.pointerId);
  }

  private onPointerMove(event: PointerEvent) {
    if (!this.dragging) return;
    this.scroll.target = this.scrollStart + (this.dragStart - event.clientX) * (this.speed * 0.025);
  }

  private onPointerUp() {
    this.dragging = false;
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") this.scroll.target += this.speed * 5;
    else if (event.key === "ArrowLeft") this.scroll.target -= this.speed * 5;
    else return;
    event.preventDefault();
  }

  private addListeners() {
    this.container.addEventListener("wheel", this.onWheelBound, { passive: false });
    this.container.addEventListener("pointerdown", this.onPointerDownBound);
    this.container.addEventListener("pointermove", this.onPointerMoveBound);
    this.container.addEventListener("pointerup", this.onPointerUpBound);
    this.container.addEventListener("pointercancel", this.onPointerUpBound);
    this.container.addEventListener("keydown", this.onKeyDownBound);
    window.addEventListener("resize", this.onResizeBound);
  }

  private update = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.media.forEach((item) => item.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.frame = window.requestAnimationFrame(this.update);
  };

  destroy() {
    window.cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.onResizeBound);
    this.container.removeEventListener("wheel", this.onWheelBound);
    this.container.removeEventListener("pointerdown", this.onPointerDownBound);
    this.container.removeEventListener("pointermove", this.onPointerMoveBound);
    this.container.removeEventListener("pointerup", this.onPointerUpBound);
    this.container.removeEventListener("pointercancel", this.onPointerUpBound);
    this.container.removeEventListener("keydown", this.onKeyDownBound);
    this.renderer.gl.canvas.remove();
    this.renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export default function CircularGallery({
  items = DEFAULT_ITEMS,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  scrollEase = 0.05,
  fontUrl = "",
  font = "bold 30px Figtree",
  scrollSpeed = 2,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let app: CircularGalleryEngine | undefined;
    let mounted = true;
    void loadFont(font, fontUrl).then((resolvedFont) => {
      if (!mounted || !containerRef.current) return;
      try {
        app = new CircularGalleryEngine(
          container,
          items,
          bend,
          textColor,
          borderRadius,
          resolvedFont,
          scrollSpeed,
          scrollEase,
        );
      } catch (error) {
        console.error("CircularGallery could not initialize WebGL.", error);
      }
    });
    return () => {
      mounted = false;
      app?.destroy();
    };
  }, [items, bend, textColor, borderRadius, scrollEase, fontUrl, font, scrollSpeed]);

  return (
    <div
      ref={containerRef}
      className="circular-gallery"
      role="region"
      aria-label="Circular image gallery. Drag, scroll, or use the arrow keys to browse."
      tabIndex={0}
    />
  );
}
