import { faqs, howToSteps } from "../content";
import { siteConfig } from "../site";

const orgId = `${siteConfig.url}/#org`;
const websiteId = `${siteConfig.url}/#website`;
const founderId = `${siteConfig.url}/#founder`;

function pageUrl(path: string) {
  if (path === "/" || path === "") return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

function organization() {
  return {
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    foundingDate: String(siteConfig.foundedYear),
    foundingLocation: {
      "@type": "Place",
      name: "Midwest United States",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    logo: `${siteConfig.url}${siteConfig.images.logo}`,
    image: `${siteConfig.url}${siteConfig.images.og}`,
    sameAs: [
      siteConfig.community.facebook,
      siteConfig.community.goodsForSale.url,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "community inquiries",
      email: siteConfig.email,
      availableLanguage: "English",
    },
    founder: { "@id": founderId },
    knowsAbout: [
      "Buck Buck Bronco",
      "Ford Bronco community",
      "You've been Bucked",
      "Share a Smile",
    ],
  };
}

function person() {
  return {
    "@type": "Person",
    "@id": founderId,
    name: siteConfig.founder.name,
    jobTitle: "Founder",
    email: siteConfig.email,
    url: siteConfig.url,
    sameAs: [siteConfig.community.facebook],
    worksFor: { "@id": orgId },
    homeLocation: {
      "@type": "Place",
      name: "Midwest United States",
    },
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": orgId },
    inLanguage: "en-US",
  };
}

/** Sitewide identity. Safe on every route, including noindex pages. */
export function buildSiteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organization(), person(), website()],
  };
}

function homePage() {
  const press = siteConfig.press.realTruck;
  return {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    isPartOf: { "@id": websiteId },
    about: { "@id": orgId },
    inLanguage: "en-US",
    primaryImageOfPage: `${siteConfig.url}${siteConfig.images.og}`,
    mentions: { "@id": `${press.url}#article` },
  };
}

function howTo() {
  return {
    "@type": "HowTo",
    "@id": `${siteConfig.url}/#howto`,
    name: "How to play Buck Buck Bronco",
    description:
      "Leave a small token and an optional printed tag on another Ford Bronco as a random act of kindness.",
    step: howToSteps.map((step) => ({
      "@type": "HowToStep",
      position: Number(step.n),
      name: step.title,
      text: step.body,
    })),
  };
}

function faqPage() {
  return {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    url: `${siteConfig.url}/#faq`,
    isPartOf: { "@id": `${siteConfig.url}/#webpage` },
    inLanguage: "en-US",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq__q", ".faq__a p"],
    },
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * The press item is RealTruck's article, not a page we publish.
 * Headline, description, and publisher are the facts already on the homepage.
 * No date, author, rating, or review is invented.
 */
function pressArticle() {
  const press = siteConfig.press.realTruck;
  return {
    "@type": "NewsArticle",
    "@id": `${press.url}#article`,
    headline: press.title,
    description: press.blurb,
    url: press.url,
    mainEntityOfPage: press.url,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: press.outlet,
      url: "https://realtruck.com/",
    },
    about: { "@id": orgId },
  };
}

/** Homepage-only entities: the FAQ, how-to, and press mention live on `/`. */
export function buildHomeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [homePage(), howTo(), faqPage(), pressArticle()],
  };
}

export function buildPageGraph(opts: {
  name: string;
  description: string;
  path: string;
}) {
  const url = pageUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: opts.name,
        description: opts.description,
        isPartOf: { "@id": websiteId },
        about: { "@id": orgId },
        inLanguage: "en-US",
        primaryImageOfPage: `${siteConfig.url}${siteConfig.images.og}`,
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: opts.name,
            item: url,
          },
        ],
      },
    ],
  };
}
