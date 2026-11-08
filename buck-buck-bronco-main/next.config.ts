import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [70, 75, 80],
    /**
     * Read when `next build` loads this file. Staging builds set STAGING_LOCK=1
     * so the pages do not emit /_next/image URLs. Customer builds leave it unset.
     * Do not reuse an unlocked `.next` directory or build cache for a locked deploy.
     * Middleware also refuses /_next/image while the lock is on, so a cached
     * optimizer response cannot be served to a logged-out client.
     */
    unoptimized: process.env.STAGING_LOCK === "1",
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
