export const howToSteps = [
  {
    n: "01",
    title: "Stock your Bucks",
    body: "Our Bucks are many different things: keychains, microfiber cloths, Bronco die-cast cars like Hot Wheels and Matchbox, little horsey items like plastic horseshoes and figures, and yes, horse ducks. We’re not restricted to one type of Buck. Use your imagination!",
  },
  {
    n: "02",
    title: "Spot a Bronco",
    body: "Trailhead, grocery lot, office curb: when another Bronco shows up, you’ve found your next smile.",
  },
  {
    n: "03",
    title: "Leave a Buck",
    body: "Leave the Buck on a Bronco… all Broncos count! Big, little, old, or new. The door handle, top of the mirror, or the side step are good places. Add a printable tag if you want them to know they’ve been bucked.",
  },
  {
    n: "04",
    title: "Keep it going",
    body: "Snap a photo and share it on the Buck Buck Bronco Facebook page so the next owner can pay it forward. We don’t use a hashtag for this. The group is where the tradition keeps rolling.",
  },
] as const;

export const howItWorksNote =
  "In-person Bucks are amazing, because you get to meet other Bronco owners, but if you’d rather Buck secretly, the surprise is always fun to watch!";

export const etiquette = [
  "This is optional fun. Never pressure anyone to play.",
  "Don’t block cameras, sensors, or door seals.",
  "Skip locked lots, private property, and anything that feels unsafe.",
  "A plain Buck still counts. Tags are a bonus.",
] as const;

export const faqs = [
  {
    q: "What is Buck Buck Bronco?",
    a: "It’s the Bronco community’s newest tradition: a small token and a printed tag equals a random act of kindness. Leave a Buck on another Bronco and brighten someone’s day.",
  },
  {
    q: "Who started it?",
    a: "Melissa Patterson, a Midwest Ford fan who pre-ordered a returning Bronco the moment she could. A few months after that order, she launched the Buck Buck Bronco Facebook group in May 2021, well before her own truck arrived after a thirteen-month wait.",
  },
  {
    q: "Do you sell official merch?",
    a: "No official merchandise line. Fans get creative on Etsy, Amazon, eBay, Temu, and the Buck Buck Bronco Goods for Sale Facebook page. We offer free printable “You’ve been bucked” cards with the logo so anyone can join in.",
  },
  {
    q: "Where do I get Bucks?",
    a: "Search Buck Buck Bronco on Etsy, Amazon, eBay, and Temu, or check the Buck Buck Bronco Goods for Sale Facebook page. Bucks can be keychains, cloths, die-cast Broncos, horseshoes, figures, horse ducks, and more. Keep a few in the Bronco and you’re ready.",
  },
  {
    q: "Do I need to own a Bronco?",
    a: "The tradition centers on Bronco owners, but anyone can leave a little kindness. Most players both drive a Bronco and buck others. Every Bronco counts: big, little, old, or new.",
  },
  {
    q: "How do I join the community?",
    a: "Hop into the Buck Buck Bronco Facebook group, stock a few Bucks, and start watching for Broncos. Email melissa@buckbuckbronco.com anytime.",
  },
] as const;

export const storyBeats = {
  eyebrow: "The story",
  title: "A Midwest spark that went nationwide",
  lead:
    "Melissa Patterson pre-ordered a returning Bronco the moment she could. A few months after that order, she started Buck Buck Bronco so Bronco owners would have their own way to share a smile.",
  body: [
    "She talked it through with Allison Parliament, who was all for it. With that encouragement, Melissa launched the Buck Buck Bronco Facebook group in May 2021, months before her own Bronco finally arrived after a thirteen-month wait.",
    "What began in the Midwest is now a nationwide trailside tradition: leave a small token, add a printed tag if you like, and brighten another Bronco owner’s day.",
  ],
} as const;

/** Short authenticity beat near story/community (not in the hero). */
export const authenticityBeat = {
  eyebrow: "The real deal",
  title: "A mark the community knows",
  lead:
    "This chrome bucking-horse emblem is how Bronco owners recognize the Buck Buck Bronco tradition in the wild. The same horse that rides with the community from day one.",
  alt: "Chrome Ford Bronco bucking-horse emblem resting on brown leather, a mark of the Buck Buck Bronco tradition",
} as const;

export const findBucks = {
  intro:
    "You can find Bucks by searching Buck Buck Bronco on Etsy, Amazon, eBay, and Temu. Check out our Facebook page,",
  goodsLabel: "Buck Buck Bronco Goods for Sale",
  /** Exact Goods for Sale URL was not in the review note; using the main community group until Melissa confirms. */
  goodsUrl: "https://www.facebook.com/groups/buckbuckbronco/",
} as const;
