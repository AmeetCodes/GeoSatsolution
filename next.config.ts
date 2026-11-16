import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/solutions/uav-lidar-survey",
        destination: "/services/lidar-survey",
        permanent: true,
      },
      {
        source: "/services/uav-lidar-survey",
        destination: "/services/lidar-survey",
        permanent: true,
      },
      {
        source: "/services/spatial-database-and-gis-solutions",
        destination: "/services/spatial-database-and-gis-services",
        permanent: true,
      },
      {
        source: "/solutions",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/solutions/:path*",
        destination: "/services/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
