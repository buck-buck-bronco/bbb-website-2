export const siteConfig = {
  name: "Buck Buck Bronco",
  tagline: "Share a Smile.",
  description:
    "Buck Buck Bronco is the Ford Bronco community’s newest tradition: a small token and a printed tag equals a random act of kindness. Founded by Melissa Patterson from the Midwest.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buckbuckbronco.com",
  email: "melissa@buckbuckbronco.com",
  foundedYear: 2021,
  founder: {
    name: "Melissa Patterson",
    shortName: "Melissa",
  },
  press: {
    realTruck: {
      title: "What Is Buck Buck Bronco?",
      outlet: "RealTruck",
      url: "https://realtruck.com/blog/what-is-buck-buck-bronco/",
      blurb:
        "RealTruck went inside the trailside tradition: how a Midwest Bronco owner sparked a nationwide smile.",
    },
  },
  images: {
    /** Horse mark only (no lettering, no square border) */
    logo: "/brand/buck-buck-bronco-mark.webp",
    /** Full-bleed hero: orange Bronco on mountain road */
    hero: "/images/bronco-orange-trail.webp",
    /** Story / split: black Bronco at the cliffs */
    story: "/images/bronco-black-cliff.webp",
    /** Cards section: rear emblem / bucking horse badge */
    emblem: "/images/bronco-tailgate.webp",
    /** Detail strip */
    detail: "/images/bronco-detail-headlight.webp",
    /** Authenticity: chrome bucking-horse emblem on leather */
    authenticity: "/images/bucking-horse-emblem.webp",
    og: "/images/og.jpg",
  },
  community: {
    facebook: "https://www.facebook.com/groups/buckbuckbronco/",
    label: "Join the Facebook group",
    goodsForSale: {
      label: "Buck Buck Bronco Goods for Sale",
      /** Confirm exact page URL with Melissa; interim link points at the main group. */
      url: "https://www.facebook.com/groups/buckbuckbronco/",
    },
  },
  counter: {
    label: "members on the Facebook page",
    value: 32900,
    suffix: "+",
    since: "And growing from the Midwest since May 2021",
  },
  keywords: [
    "Buck Buck Bronco",
    "Buck Buck Bronco Facebook",
    "you've been bucked",
    "Ford Bronco community",
    "Bronco kindness tradition",
    "Share a Smile",
    "Melissa Patterson Bronco",
    "printable bucked tag",
    "Bronco trailside tradition",
  ],
} as const;
