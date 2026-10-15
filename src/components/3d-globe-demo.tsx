"use client";
import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";
import { cn } from "@/lib/utils";

const sampleMarkers: GlobeMarker[] = [
  {
    lat: 27.7172,
    lng: 85.324,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "Kathmandu",
  },
  {
    lat: 27.6729,
    lng: 85.4291,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "Bhaktapur",
  },
  {
    lat: 27.6949,
    lng: 85.3343,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Lalitpur",
  },
  {
    lat: 28.2096,
    lng: 83.9856,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Pokhara",
  },
  {
    lat: 26.4555,
    lng: 87.2709,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Biratnagar",
  },
  {
    lat: 26.8065,
    lng: 87.2835,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "Dharan",
  },
  {
    lat: 27.4874,
    lng: 83.2759,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Lumbini",
  },
  {
    lat: 27.5549,
    lng: 84.3546,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Chitwan",
  },
  {
    lat: 26.7298,
    lng: 85.9264,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Janakpur",
  },
  {
    lat: 29.2916,
    lng: 80.4542,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Kailali",
  },
  {
    lat: 28.5973,
    lng: 81.6328,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Surkhet",
  },
  {
    lat: 27.1807,
    lng: 87.046,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Bhojpur",
  },
  {
    lat: 28.8217,
    lng: 83.9166,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Mustang",
  },
];

export function Globe3DDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[600px] max-h-[600px] overflow-visible bg-transparent",
        className,
      )}
    >
      <div className="pointer-events-auto relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing">
        <Globe3D
          className="h-full w-full max-w-none"
          markers={sampleMarkers}
          config={{
            radius: 2,
            showAtmosphere: false,
            bumpScale: 1,
            autoRotateSpeed: 0.18,
            enableRotate: true,
            enableZoom: false,
            enablePan: false,
            backgroundColor: "transparent",
            ambientIntensity: 0.9,
            pointLightIntensity: 1.2,
          }}
          onMarkerClick={(marker) => {
            console.log("Clicked marker:", marker.label);
          }}
          onMarkerHover={(marker) => {
            if (marker) {
              console.log("Hovering:", marker.label);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Globe3DDemo;
