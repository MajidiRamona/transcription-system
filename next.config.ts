import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

export default nextConfig;
