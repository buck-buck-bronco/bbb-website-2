import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/staging-gate", "/review", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/staging-gate", "/review", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/staging-gate", "/review", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/staging-gate", "/review", "/api/"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/staging-gate", "/review", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
