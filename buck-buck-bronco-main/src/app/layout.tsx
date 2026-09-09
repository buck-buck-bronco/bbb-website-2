import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Source_Sans_3 } from "next/font/google";
import { ReviewGate } from "@/components/ReviewGate";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { buildGraph } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.founder.name, url: siteConfig.url }],
  creator: siteConfig.founder.name,
  publisher: siteConfig.name,
  category: "Community",
  openGraph: {
    type: "website",
    locale: "en-US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.images.og,
        width: 1200,
        height: 630,
        alt: "Ford Bronco on the trail: Buck Buck Bronco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.images.og],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "US",
    "geo.placename": "Midwest United States",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const graph = buildGraph();

  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ReviewGate />
      </body>
    </html>
  );
}
