import { faqs, howToSteps } from "../src/lib/content";
import {
  buildHomeGraph,
  buildPageGraph,
  buildSiteGraph,
} from "../src/lib/seo/schema";
import { siteConfig } from "../src/lib/site";

const ALLOWED_TYPES = new Set([
  "Organization",
  "Person",
  "WebSite",
  "WebPage",
  "FAQPage",
  "Question",
  "Answer",
  "HowTo",
  "HowToStep",
  "NewsArticle",
  "BreadcrumbList",
  "ListItem",
  "Place",
  "Country",
  "ContactPoint",
  "SpeakableSpecification",
]);

const FORBIDDEN = ["aggregateRating", "review", "ratingValue", "reviewCount"];

function walk(node: unknown, visit: (value: unknown, key?: string) => void, key?: string) {
  visit(node, key);
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit);
    return;
  }
  if (node && typeof node === "object") {
    for (const [childKey, child] of Object.entries(node)) {
      walk(child, visit, childKey);
    }
  }
}

function assertGraph(label: string, graph: unknown) {
  const serialized = JSON.stringify(graph);
  const parsed = JSON.parse(serialized) as {
    "@context"?: string;
    "@graph"?: unknown[];
  };
  if (parsed["@context"] !== "https://schema.org") {
    throw new Error(`${label}: @context must be https://schema.org`);
  }
  if (!Array.isArray(parsed["@graph"]) || parsed["@graph"].length === 0) {
    throw new Error(`${label}: @graph must be a non-empty array`);
  }

  const types: string[] = [];
  walk(parsed, (value, key) => {
    if (key && FORBIDDEN.includes(key)) {
      throw new Error(`${label}: forbidden field ${key}`);
    }
    if (value && typeof value === "object" && "@type" in value) {
      const type = (value as { "@type": unknown })["@type"];
      if (typeof type !== "string" || !ALLOWED_TYPES.has(type)) {
        throw new Error(`${label}: unexpected @type ${String(type)}`);
      }
      types.push(type);
    }
  });
  console.log(`${label}: ${types.join(", ")}`);
  return parsed;
}

const site = assertGraph("site", buildSiteGraph());
const home = assertGraph("home", buildHomeGraph());
const bucked = assertGraph(
  "bucked",
  buildPageGraph({
    name: "Print a You’ve been Bucked tag",
    description: "tag maker",
    path: "/bucked",
  }),
);
const privacy = assertGraph(
  "privacy",
  buildPageGraph({
    name: "Privacy policy",
    description: "privacy",
    path: "/privacy",
  }),
);

const siteTypes = new Set(
  (site["@graph"] as { "@type": string }[]).map((node) => node["@type"]),
);
for (const required of ["Organization", "WebSite"]) {
  if (!siteTypes.has(required)) throw new Error(`site graph missing ${required}`);
}

const homeNodes = home["@graph"] as { "@type": string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[]; step?: { name: string; text: string }[] }[];
const faq = homeNodes.find((node) => node["@type"] === "FAQPage");
if (!faq?.mainEntity || faq.mainEntity.length !== faqs.length) {
  throw new Error("FAQPage count does not match on-page FAQ");
}
faqs.forEach((item, index) => {
  const entity = faq.mainEntity?.[index];
  if (entity?.name !== item.q || entity.acceptedAnswer.text !== item.a) {
    throw new Error(`FAQ mismatch at ${item.q}`);
  }
});

const howTo = homeNodes.find((node) => node["@type"] === "HowTo");
howToSteps.forEach((step, index) => {
  const entity = howTo?.step?.[index];
  if (entity?.name !== step.title || entity.text !== step.body) {
    throw new Error(`HowTo mismatch at ${step.title}`);
  }
});

if (!homeNodes.some((node) => node["@type"] === "NewsArticle")) {
  throw new Error("homepage graph missing NewsArticle");
}
for (const graph of [bucked, privacy]) {
  const types = new Set(
    (graph["@graph"] as { "@type": string }[]).map((node) => node["@type"]),
  );
  if (!types.has("BreadcrumbList") || !types.has("WebPage")) {
    throw new Error("inner page missing WebPage or BreadcrumbList");
  }
}

const org = (site["@graph"] as { "@type": string; sameAs?: string[] }[]).find(
  (node) => node["@type"] === "Organization",
);
const sameAs = org?.sameAs ?? [];
if (!sameAs.includes(siteConfig.community.facebook)) {
  throw new Error("Organization sameAs missing the Facebook group");
}
if (!sameAs.includes(siteConfig.community.goodsForSale.url)) {
  throw new Error("Organization sameAs missing Goods for Sale");
}

console.log("JSON-LD ok");
