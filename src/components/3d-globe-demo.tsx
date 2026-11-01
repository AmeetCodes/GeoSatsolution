"use client";
import { Globe3D } from "@/components/ui/3d-globe";
import { cn } from "@/lib/utils";

export function Globe3DDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto flex aspect-square h-auto w-full max-w-[600px] items-center justify-center overflow-hidden rounded-full bg-transparent lg:max-w-[700px]",
        className,
      )}
    >
      <div className="pointer-events-auto relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing">
        <Globe3D
          className="h-full w-full max-w-none"
          config={{
            radius: 2.6,
            cameraDistanceFactor: 2.9,
            showAtmosphere: false,
            bumpScale: 1,
            autoRotateSpeed: 0.18,
            enableRotate: true,
            enableZoom: true,
            enablePan: false,
            minDistance: 4,
            maxDistance: 11,
            backgroundColor: "transparent",
            ambientIntensity: 0.9,
            pointLightIntensity: 1.2,
          }}
        />
      </div>
    </div>
  );
}

export default Globe3DDemo;
