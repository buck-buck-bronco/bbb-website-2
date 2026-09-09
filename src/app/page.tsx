import Image from "next/image";
import Link from "next/link";
import { CommunityCounter } from "@/components/CommunityCounter";
import { Reveal } from "@/components/Reveal";
import {
  authenticityBeat,
  etiquette,
  faqs,
  findBucks,
  howItWorksNote,
  howToSteps,
  storyBeats,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section
        className="hero"
        aria-label="Buck Buck Bronco hero"
        data-review-id="home-hero"
        data-review-label="Home hero"
      >
        <div
          className="hero__media"
          aria-hidden
          data-review-id="home-hero-image"
          data-review-label="Hero background photo"
          data-review-kind="image"
        >
          <Image
            src={siteConfig.images.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            placeholder="empty"
          />
          <div className="hero__shade" />
        </div>
        <div className="hero__content">
          <div
            className="hero__brand-lockup"
            data-review-id="home-brand"
            data-review-label="Brand mark"
          >
            <Image
              src={siteConfig.images.logo}
              alt=""
              width={160}
              height={160}
              className="hero__logo"
              sizes="(max-width: 600px) 72px, 112px"
              priority
            />
            <h1 className="hero__brand-name">
              Buck Buck
              <br />
              Bronco
            </h1>
          </div>
          <p
            className="hero__headline"
            data-review-id="home-headline"
            data-review-label="Hero headline"
          >
            Share a Smile.
          </p>
          <p
            className="hero__support"
            data-review-id="home-support"
            data-review-label="Hero supporting sentence"
          >
            The Bronco Community’s newest tradition: a small token and a
            printed tag equals a random act of kindness.
          </p>
          <div
            className="hero__actions"
            data-review-id="home-ctas"
            data-review-label="Hero buttons"
            data-review-kind="cta"
          >
            <a href="#how" className="btn-cta">
              How it works
            </a>
            <Link href="/bucked" className="btn-ghost">
              Print a card
            </Link>
          </div>
        </div>
      </section>

      <section
        id="how"
        className="section"
        data-review-id="home-how"
        data-review-label="How it works section"
      >
        <Reveal>
          <p className="section__kicker">How it works</p>
          <h2 className="section__title">Four moves. Endless grins.</h2>
          <p className="section__lede">
            No apps. No scoreboard. Just trail courtesy with a Buck and a smile.
          </p>
        </Reveal>
        <div className="steps">
          {howToSteps.map((step, i) => (
            <Reveal
              key={step.n}
              className="step"
              delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
              data-review-id={`home-step-${step.n}`}
              data-review-label={`Step ${step.n}: ${step.title}`}
            >
              <p className="step__n">{step.n}</p>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
              {step.n === "01" ? (
                <p className="step__body step__body--find">
                  {findBucks.intro}{" "}
                  <a
                    className="text-link"
                    href={findBucks.goodsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {findBucks.goodsLabel}
                  </a>
                  .
                </p>
              ) : null}
            </Reveal>
          ))}
        </div>
        <Reveal className="how-note" delay={1}>
          <p className="how-note__text">{howItWorksNote}</p>
        </Reveal>
        <Reveal className="manners" delay={2}>
          <p className="section__kicker">Trail manners</p>
          <ul className="etiquette">
            {etiquette.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section
        id="story"
        className="section section--wide"
        data-review-id="home-story"
        data-review-label="Melissa story section"
      >
        <div className="split">
          <div
            className="split__media"
            data-review-id="home-trail-image"
            data-review-label="Trail / Bronco photo"
            data-review-kind="image"
          >
            <Image
              src={siteConfig.images.story}
              alt="Black Ford Bronco at the cliffs"
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              quality={70}
              loading="lazy"
            />
          </div>
          <div className="split__copy">
            <Reveal>
              <p className="section__kicker">{storyBeats.eyebrow}</p>
              <h2 className="section__title">{storyBeats.title}</h2>
              <p className="section__lede">{storyBeats.lead}</p>
              {storyBeats.body.map((para) => (
                <p key={para.slice(0, 24)} className="story-para">
                  {para}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="authenticity"
        className="section section--authenticity"
        data-review-id="home-authenticity"
        data-review-label="Authenticity emblem"
      >
        <div className="authenticity">
          <Reveal className="authenticity__media-wrap" delay={1}>
            <div
              className="authenticity__media"
              data-review-id="home-authenticity-image"
              data-review-label="Bucking-horse emblem photo"
              data-review-kind="image"
            >
              <Image
                src={siteConfig.images.authenticity}
                alt={authenticityBeat.alt}
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                quality={70}
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal className="authenticity__copy">
            <p className="section__kicker">{authenticityBeat.eyebrow}</p>
            <h2 className="section__title">{authenticityBeat.title}</h2>
            <p className="section__lede section__lede--wide">
              {authenticityBeat.lead}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="cards"
        className="section section--band"
        data-review-id="home-cards"
        data-review-label="Printable cards CTA"
      >
        <Reveal className="band">
          <div className="band__copy">
            <p className="section__kicker">Printable cards</p>
            <h2 className="section__title">You’ve been bucked</h2>
            <p className="section__lede">
              Free printable cards with the Buck Buck Bronco logo. Add a note,
              download a PNG, and tuck one with your next horse.
            </p>
            <Link href="/bucked" className="btn-cta">
              Open the tag maker
            </Link>
          </div>
          <div className="band__visual" aria-hidden>
            <div className="band__photo">
              <Image
                src={siteConfig.images.emblem}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={70}
                loading="lazy"
              />
            </div>
            <Image
              src={siteConfig.images.logo}
              alt=""
              width={120}
              height={120}
              className="band__logo"
              sizes="120px"
            />
          </div>
        </Reveal>
      </section>

      <section
        id="merch"
        className="section"
        data-review-id="home-merch"
        data-review-label="Merch note"
      >
        <div className="merch-split">
          <Reveal>
            <p className="section__kicker">Merch</p>
            <h2 className="section__title">No official merch line</h2>
            <p className="section__lede section__lede--wide">
              We don’t sell official Buck Buck Bronco merchandise. Search Buck
              Buck Bronco on Etsy, Amazon, eBay, and Temu, or browse{" "}
              <a
                className="text-link"
                href={siteConfig.community.goodsForSale.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.community.goodsForSale.label}
              </a>
              . What we do offer: free printable “You’ve been bucked” cards so
              anyone can join the fun.
            </p>
            <Link href="/bucked" className="btn-ghost btn-ghost--dark">
              Make a printable card
            </Link>
          </Reveal>
          <div
            className="merch-split__media"
            data-review-id="home-detail-image"
            data-review-label="Bronco detail photo"
            data-review-kind="image"
          >
            <Image
              src={siteConfig.images.detail}
              alt="Ford Bronco headlight detail"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              quality={70}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section
        id="press"
        className="section section--press"
        data-review-id="home-press"
        data-review-label="Press / RealTruck"
      >
        <Reveal>
          <p className="section__kicker">Featured</p>
          <h2 className="section__title">In the press</h2>
        </Reveal>
        <Reveal className="press-feature" delay={1}>
          <p className="press-feature__outlet">
            {siteConfig.press.realTruck.outlet}
          </p>
          <h3 className="press-feature__title">
            {siteConfig.press.realTruck.title}
          </h3>
          <p className="press-feature__blurb">
            {siteConfig.press.realTruck.blurb}
          </p>
          <a
            href={siteConfig.press.realTruck.url}
            className="btn-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read on RealTruck
          </a>
        </Reveal>
      </section>

      <section
        id="community"
        className="section section--wide"
        data-review-id="home-community"
        data-review-label="Community / Facebook"
      >
        <div className="community">
          <Reveal className="community__copy">
            <p className="section__kicker">Community</p>
            <h2 className="section__title">Growing from the Midwest</h2>
            <p className="section__lede">
              The Buck Buck Bronco Facebook group is where buckers share photos,
              find their buckee, and keep the tradition rolling, since May
              2021.
            </p>
            <a
              href={siteConfig.community.facebook}
              className="btn-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.community.label}
            </a>
          </Reveal>
          <CommunityCounter
            value={siteConfig.counter.value}
            suffix={siteConfig.counter.suffix}
            label={siteConfig.counter.label}
            since={siteConfig.counter.since}
          />
        </div>
      </section>

      <section
        id="faq"
        className="section"
        data-review-id="home-faq"
        data-review-label="FAQ section"
      >
        <Reveal>
          <p className="section__kicker">FAQ</p>
          <h2 className="section__title">Quick answers</h2>
        </Reveal>
        <div className="faq">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="section section--contact"
        data-review-id="home-contact"
        data-review-label="Contact"
      >
        <Reveal>
          <p className="section__kicker">Contact</p>
          <h2 className="section__title">Say hello</h2>
          <p className="section__lede">
            Questions, press, or just want to share a Buck? Reach Melissa at{" "}
            <a className="text-link" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}
