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
    logo: `${siteConfig.url}${siteConfig.images.logo}`,
    image: `${siteConfig.url}${siteConfig.images.hero}`,
    sameAs: [siteConfig.community.facebook],
    founder: { "@id": `${siteConfig.url}/#founder` },
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

  const howTo = {
    "@type": "HowTo",
    "@id": `${siteConfig.url}/#howto`,
    name: "How to play Buck Buck Bronco",
    description: siteConfig.tagline,
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
    "@graph": [org, person, website, howTo, faqPage],
  };
}
