"use client";

import confetti from "canvas-confetti";

export function launchConfetti(origin: { x?: number; y?: number } = { x: 0.5, y: 0.5 }, intensity = 1) {
  const burst = (offsetX = 0, offsetY = 0) => {
    const palette = ["#49d9cf", "#7cffdb", "#f4d35e", "#ff7d66", "#c5e7ff"]; 

    confetti({
      particleCount: Math.round(24 * intensity),
      spread: 120,
      startVelocity: 24 + intensity * 10,
      scalar: 1.05 + intensity * 0.2,
      origin: {
        x: Math.min(Math.max((origin.x ?? 0.5) + offsetX, 0.08), 0.92),
        y: Math.min(Math.max((origin.y ?? 0.5) + offsetY, 0.15), 0.8),
      },
      colors: palette,
      gravity: 0.9,
      decay: 0.94,
      ticks: 90,
      zIndex: 100,
    });

    confetti({
      particleCount: Math.round(12 * intensity),
      spread: 150,
      startVelocity: 18 + intensity * 8,
      scalar: 0.8 + intensity * 0.15,
      origin: {
        x: Math.min(Math.max((origin.x ?? 0.5) + offsetX * 1.4, 0.08), 0.92),
        y: Math.min(Math.max((origin.y ?? 0.5) + offsetY * 1.4, 0.15), 0.8),
      },
      colors: ["#ffffff", "#d9fbf6", "#8ae5c4"],
      shapes: ["circle"],
      gravity: 0.8,
      decay: 0.96,
      ticks: 90,
      zIndex: 100,
    });
  };

  burst(0, 0);
  window.setTimeout(() => burst(-0.08, -0.04), 120);
  window.setTimeout(() => burst(0.08, -0.08), 220);
}
