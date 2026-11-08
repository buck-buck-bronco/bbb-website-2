import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const publicPaths = {
  allow: "/",
  disallow: ["/staging-gate", "/review", "/api/"],
};

const allowedAgents = [
  "*",
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot",
];

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: allowedAgents.map((userAgent) => ({
      userAgent,
      ...publicPaths,
    })),
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
