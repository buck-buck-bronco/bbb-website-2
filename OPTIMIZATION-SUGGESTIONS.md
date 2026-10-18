# Optimization suggestions

Ranked by impact. Each item is either done in this pull request or waiting on an owner decision.

## 1. Performance

1. **Keep the hero photo paintable for LCP** — done-in-this-PR. The background image animates `transform` only (scale 1.03 to 1, 1200ms). Opacity stays 1. Text uses opacity and a 12px rise. No animation library.
2. **Stop unused image preloads on inner pages** — done-in-this-PR. The header mark is no longer `priority`, so `/bucked` and `/privacy` do not preload it. The Facebook QR is `loading="lazy"` and is not on those pages.
3. **Don’t hide content without JavaScript** — done-in-this-PR. Scroll reveals start visible unless the `js` class is present. `prefers-reduced-motion` shows everything immediately.
4. **Measure the preview** — needs-owner-decision. Confirm LCP and CLS on a Vercel preview (home, `/bucked` at 390px, `/privacy`) before this is merged. This PR does not deploy production.
5. **Permanent Goods for Sale URL** — needs-owner-decision. The sister-page link is a Facebook share URL (`mibextid`). A stable page URL would be a better preload-free link target and a cleaner `sameAs` entry.

## 2. Conversion

1. **Readable tag preview and tighter step cards** — done-in-this-PR. Preview type is larger so the note and URL lines stay legible near 390px. Step cards share a row height with less padding, and the QR is slightly smaller so short cards are not mostly empty.
2. **Inline link spacing** — done-in-this-PR. Goods for Sale and email links no longer force a 44px line box, so the sentence after them sits on a normal line.
3. **Hero call-to-action order** — needs-owner-decision. “How it works” is primary and “Print a card” is secondary. If printing a tag is the action Melissa wants first, swap them. Copy and layout were otherwise left alone.
4. **Member count freshness** — needs-owner-decision. The counter is a fixed 32,900+. A stale number will be quoted by people and by answer engines. Decide who updates it and how often.

## 3. Content for AI answers

1. **Definition sentence, FAQ schema, and llms.txt** — done-in-this-PR. The hero now states what Buck Buck Bronco is, in the same sentence as the meta description. FAQPage JSON-LD uses the on-page questions and answers verbatim. `llms.txt` repeats those facts.
2. **Crawler access** — done-in-this-PR. `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, and Google-Extended on public pages, and still blocks `/review`, `/staging-gate`, and `/api/`.
3. **Press structured data** — done-in-this-PR. The RealTruck piece is a `NewsArticle` with the headline, blurb, URL, and publisher already shown on the page. No date, author, rating, or review was added.
4. **Privacy staging sentence** — needs-owner-decision. The privacy policy still says a private staging copy may set a password cookie. That was left in place on purpose. If the public policy should not mention staging, Melissa should say what to replace it with.
5. **City or region Melissa wants public** — needs-owner-decision. The site says Midwest United States. A city or state, only if she wants it public, would help both answer engines and local search. Do not invent one.

## 4. Local and community SEO

1. **Organization and sameAs** — done-in-this-PR. Organization JSON-LD includes the name, logo, email, Midwest founding place, the Facebook group, and the Goods for Sale link that is already on the site.
2. **www to apex** — done-in-this-PR in middleware: `www.buckbuckbronco.com` returns 308 to `https://buckbuckbronco.com`. This runs when the request hits the Next.js app. A Vercel domain-level redirect, if one is added later in the dashboard, should be the same destination so the two do not chain.
3. **Google Business Profile or a local landing page** — needs-owner-decision. This is a nationwide community tradition, not a storefront. Only add a local profile if Melissa wants the Midwest origin to rank as a place.

## 5. Analytics

1. **No tracker added** — needs-owner-decision. The privacy policy says the public site does not use advertising trackers. Adding PostHog, Plausible, or Google Analytics needs Melissa’s yes and a policy sentence. Do not add it in a later PR without that.

## 6. Accessibility

1. **Reduced motion and the hero alt** — done-in-this-PR. Reduced motion disables the entrance, the scroll reveal, the logo glow, and smooth scrolling. The hero photo alt is “Orange Ford Bronco on a mountain road”.
2. **May 2021 line break** — done-in-this-PR. A non-breaking space keeps “2021” with “May” in the community sentence and the counter line.
3. **Story crop on small screens** — done-in-this-PR. The mobile story photo uses `object-position: center 82%` so more of the Bronco, which sits low in the frame, stays in view.
4. **Skip link** — needs-owner-decision. A “Skip to content” link would help keyboard users. It is a small visible change, so it was not added here.
