import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [70, 75, 80],
    remotePatterns: [
      { protocol: "https", hostname: "buckbuckbronco.com" },
      { protocol: "https", hostname: "www.buckbuckbronco.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
