import Link from "next/link";
import Image from "next/image";
import { StagingEditsLink } from "@/components/StagingEditsLink";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/#how", label: "How it works" },
  { href: "/#story", label: "Story" },
  { href: "/#cards", label: "Print a card" },
  { href: "/#community", label: "Community" },
  { href: "/#press", label: "Press" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark" aria-label={`${siteConfig.name} home`}>
          <Image
            src={siteConfig.images.logo}
            alt=""
            width={48}
            height={48}
            className="brand-mark__logo"
            priority
          />
          <span className="brand-mark__text">
            <span className="brand-mark__word">Buck Buck</span>
            <span className="brand-mark__word brand-mark__word--accent">Bronco</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <StagingEditsLink />
          <a
            href={siteConfig.community.facebook}
            className="btn-cta btn-cta--sm header-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook group
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-row">
          <Image
            src={siteConfig.images.logo}
            alt=""
            width={56}
            height={56}
            className="site-footer__logo"
          />
          <div>
            <p className="font-display site-footer__name">{siteConfig.name}</p>
            <p className="site-footer__tag">{siteConfig.tagline}</p>
          </div>
        </div>
        <div className="site-footer__links">
          <Link href="/#how">How it works</Link>
          <Link href="/bucked">Print a card</Link>
          <a
            href={siteConfig.community.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook group
          </a>
          <StagingEditsLink className="site-footer__edits" label="Your edits" />
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </div>
        <p className="site-footer__note">
          Not affiliated with Ford Motor Company. Play kind. Leave trails of smiles.
        </p>
      </div>
    </footer>
  );
}
