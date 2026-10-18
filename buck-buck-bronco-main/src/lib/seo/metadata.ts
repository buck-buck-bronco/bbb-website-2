import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const shareImage = {
  url: siteConfig.images.og,
  width: 1200,
  height: 630,
  alt: "Orange Ford Bronco on a mountain road, Buck Buck Bronco",
} as const;

type PagePath = "/" | "/bucked" | "/privacy" | "/review" | "/staging-gate";

/**
 * Full per-page title, description, canonical, Open Graph, and Twitter card.
 * Nested metadata objects replace the layout's, so each page sets them whole.
 */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string | { absolute: string };
  description: string;
  path: PagePath;
  index?: boolean;
}): Metadata {
  const fullTitle =
    typeof title === "string" ? `${title} | ${siteConfig.name}` : title.absolute;
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en-US",
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${siteConfig.url}${siteConfig.images.og}`],
    },
  };
}
