import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    useTypeScriptCli: false,
  },
};

export default nextConfig;
