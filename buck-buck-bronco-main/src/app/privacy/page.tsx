import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Buck Buck Bronco handles information: we do not sell personal data, and this site does not require an account.",
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="page-hero">
        <p className="section__kicker">Privacy</p>
        <h1>Privacy policy</h1>
        <p>A short, plain explanation of what this site does with information.</p>
      </header>
      <section
        className="section privacy"
        data-review-id="privacy-body"
        data-review-label="Privacy policy text"
      >
        <p>
          Buck Buck Bronco is a community tradition run by {siteConfig.founder.name}.
          This website is a public brochure and a free printable tag maker. You do
          not need an account to use it.
        </p>
        <h2>What we collect</h2>
        <p>
          If you email {siteConfig.email}, we receive whatever you send so we can
          reply. We do not ask you to create a profile, and we do not sell personal
          information.
        </p>
        <p>
          The public site does not use advertising trackers. A private staging copy
          of the site may set a password cookie so reviewers can stay signed in.
          That cookie is not used on {siteConfig.url.replace("https://", "")}.
        </p>
        <h2>Other places</h2>
        <p>
          The Facebook group is hosted by Meta. If you leave this site to join the
          group, Meta’s own privacy policy applies. Printable tags are made in your
          browser; downloading or printing a card does not send that file to us.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a className="text-link" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          .
        </p>
      </section>
    </>
  );
}
