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
  /**
   * Tiny WebP data URLs so Next can paint a blur while the real photo loads.
   * Photos are served as AVIF/WebP from cleaner sources (not double-crushed).
   */
  imageBlurs: {
    hero: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwBACdASoTABgAPtVWok2oJKMiN+gBABqJZwDIXDJptj48RermyBYro/CeJ7mYAP7r371rxvZZI/GE8HotymjM+arsuNjYGqxi6slfxYYJboAA",
    story:
      "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoQABgAPu1krU6ppaSiMAgBMB2JZQCdACGCuelNTSlOB7AA/RG2rpuFd4VEHdMbBF31/aobSjwLkr/A000eZUIp94AAAA==",
    emblem:
      "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoQABgAPu1mqk4ppaOiMAgBMB2JQBdgAr6KJAOCLpatW1gArG5dnnjOQZgVAYAGeaw7GUEXNvWJ13FEBOVh1szQ0cQEMgIgAAA=",
    detail:
      "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQBACdASoQABgAPu1orU2ppqSiMAgBMB2JZwBTAAeh/nM54Tcera7ZYAD+5yjJIXRRt+sfipjWsYwHy2iHdEJ73LekCKixZa3JU7cmThA92s4FKfAAAA==",
    authenticity:
      "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwBACdASoYABMAPu1qqU8ppiOiMBgIATAdiWUAuDAQ7/5hcZPTgwqHNgAA/hqCt7WzV+SbfjXmcJHJ+l4wq8PhcD5Ye9Scg9N+LLqn9oFFgAAA",
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

/** Next Image quality: sharp enough without double-crushing the WebP sources. */
export const photoQuality = 80;
