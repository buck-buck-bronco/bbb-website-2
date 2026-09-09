import { faqs, howToSteps } from "../content";
import { siteConfig } from "../site";

export function buildGraph() {
  const org = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#org`,
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
    image: `${siteConfig.url}${siteConfig.images.hero}`,
    sameAs: [siteConfig.community.facebook],
    founder: { "@id": `${siteConfig.url}/#founder` },
    knowsAbout: [
      "Buck Buck Bronco",
      "Ford Bronco community",
      "You've been bucked",
      "Share a Smile",
    ],
  };

  const person = {
    "@type": "Person",
    "@id": `${siteConfig.url}/#founder`,
    name: siteConfig.founder.name,
    jobTitle: "Founder",
    email: siteConfig.email,
    url: siteConfig.url,
    sameAs: [siteConfig.community.facebook],
    worksFor: { "@id": `${siteConfig.url}/#org` },
    homeLocation: {
      "@type": "Place",
      name: "Midwest United States",
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#org` },
    inLanguage: "en-US",
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#org` },
    inLanguage: "en-US",
    primaryImageOfPage: `${siteConfig.url}${siteConfig.images.og}`,
  };

  const howTo = {
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

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    url: `${siteConfig.url}/#faq`,
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

  return {
    "@context": "https://schema.org",
    "@graph": [org, person, website, webPage, howTo, faqPage],
  };
}
