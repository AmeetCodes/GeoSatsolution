"use client";

import { useEffect, useRef } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import "./SpecularButton.css";

type SpecularButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
};

const PAD = 20;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;
out vec4 fragColor;

float roundedRectDistance(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float distanceToEdge = roundedRectDistance(p, uHalfSize, uRadius);
  vec2 lightDirection = vec2(cos(uAngle), sin(uAngle));
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float angleFromLight = acos(clamp(abs(dot(normal, lightDirection)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, angleFromLight);
  float edge = exp(-pow(distanceToEdge / max(uThickness, 0.001), 2.0));
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(distanceToEdge));
  float highlight = edge * rim * edgeClamp * uIntensity;
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(distanceToEdge))) * 0.45;
  float alpha = clamp(base + highlight, 0.0, 1.0);
  fragColor = vec4(uBaseColor * base + uLineColor * highlight, alpha);
}
`;

export function SpecularButton({
  children = "Consult",
  size = "md",
  radius = 16,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  baseColor = "#525252",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  className = "",
  type = "button",
  ...buttonProps
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const effectRef = useRef<HTMLSpanElement>(null);
  const configRef = useRef({
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  });

  useEffect(() => {
    configRef.current = {
      radius,
      lineColor,
      baseColor,
      intensity,
      shineSize,
      shineFade,
      thickness,
      speed,
      followMouse,
      proximity,
      autoAnimate,
    };
  }, [radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate]);

  useEffect(() => {
    const button = buttonRef.current;
    const effect = effectRef.current;
    if (!button || !effect) return;

    const dpr = window.devicePixelRatio || 1;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.32, 0.32, 0.32] },
        uIntensity: { value: 1 },
        uShineSize: { value: (shineSize * Math.PI) / 180 },
        uShineFade: { value: (shineFade * Math.PI) / 180 },
        uThickness: { value: thickness * dpr },
        uBaseWidth: { value: dpr },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    effect.appendChild(gl.canvas);

    const dimensions = { width: 1, height: 1 };
    const resize = () => {
      const rect = button.getBoundingClientRect();
      dimensions.width = rect.width;
      dimensions.height = rect.height;
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
      program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr];
      program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr];
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(button);
    resize();

    let pointerAngle: number | null = null;
    let proximityAmount = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const distance = Math.hypot(dx, dy);
      if (distance === 0) {
        const normalizedX = (event.clientX - centerX) / (rect.width / 2);
        const normalizedY = (centerY - event.clientY) / (rect.height / 2);
        pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + normalizedX * 0.3 + normalizedY * 0.15;
      } else {
        pointerAngle = Math.atan2(centerY - event.clientY, event.clientX - centerX);
      }
      const proximityRatio = Math.max(0, 1 - distance / Math.max(configRef.current.proximity, 1));
      proximityAmount = proximityRatio * proximityRatio * (3 - 2 * proximityRatio);
    };
    window.addEventListener("pointermove", onPointerMove);

    const lineColorValue = new Color();
    const baseColorValue = new Color();
    let angle = 2.4;
    let idleAngle = 2.4;
    let brightness = 0;
    let previousTime = performance.now();
    let animationFrame = 0;

    const draw = (now: number) => {
      animationFrame = requestAnimationFrame(draw);
      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      const config = configRef.current;
      idleAngle += config.speed * delta;
      const shouldFollowPointer = config.followMouse && pointerAngle !== null && (!config.autoAnimate || proximityAmount > 0);
      const targetAngle = shouldFollowPointer ? pointerAngle! : idleAngle;
      const angleDelta = ((targetAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += angleDelta * (1 - Math.exp(-delta * 7));
      const targetBrightness = config.autoAnimate ? 1 : proximityAmount;
      brightness += (targetBrightness - brightness) * (1 - Math.exp(-delta * 8));

      lineColorValue.set(config.lineColor);
      baseColorValue.set(config.baseColor);
      program.uniforms.uAngle.value = angle;
      program.uniforms.uRadius.value = Math.min(config.radius, Math.min(dimensions.width, dimensions.height) / 2) * dpr;
      program.uniforms.uLineColor.value = [lineColorValue.r, lineColorValue.g, lineColorValue.b];
      program.uniforms.uBaseColor.value = [baseColorValue.r, baseColorValue.g, baseColorValue.b];
      program.uniforms.uIntensity.value = config.intensity * brightness;
      program.uniforms.uShineSize.value = (config.shineSize * Math.PI) / 180;
      program.uniforms.uShineFade.value = (config.shineFade * Math.PI) / 180;
      program.uniforms.uThickness.value = config.thickness * dpr;
      renderer.render({ scene: mesh });
    };
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (gl.canvas.parentNode === effect) effect.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [shineFade, shineSize, thickness]);

  return (
    <button
      {...buttonProps}
      ref={buttonRef}
      type={type}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ""}`}
      style={{
        ...buttonProps.style,
        "--sb-radius": `${radius}px`,
        "--sb-tint": tint,
        "--sb-tint-opacity": tintOpacity,
        "--sb-base-color": baseColor,
        "--sb-blur": `${blur}px`,
        "--sb-text-color": textColor,
      } as React.CSSProperties}
    >
      <span ref={effectRef} className="specular-button__fx" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
}