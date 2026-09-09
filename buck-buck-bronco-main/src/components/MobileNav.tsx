"use client";

import Link from "next/link";
import { useRef } from "react";

type NavItem = {
  href: string;
  label: string;
};

/** Phone/tablet drawer. Closes after a tap so hash links are not covered. */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    const details = detailsRef.current;
    if (!details) return;
    details.open = false;
  }

  return (
    <details ref={detailsRef} className="site-nav-mobile">
      <summary className="site-nav-mobile__toggle" aria-label="Open site menu">
        Menu
      </summary>
      <div className="site-nav-mobile__panel">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="site-nav-mobile__link"
            onPointerDown={closeMenu}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
