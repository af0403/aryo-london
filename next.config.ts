import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-store",
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
