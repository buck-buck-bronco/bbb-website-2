import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

const closeScript = `(function(){var m=document.getElementById("site-menu");if(!m||m.dataset.bound)return;m.dataset.bound="1";m.addEventListener("click",function(e){var t=e.target;if(t&&t.closest&&t.closest("a"))m.removeAttribute("open")});document.addEventListener("keydown",function(e){if(e.key==="Escape")m.removeAttribute("open")})})();`;

/** Phone menu. Native details so it works without waiting on React. */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  return (
    <>
      <details className="site-nav-mobile" id="site-menu">
        <summary className="site-nav-mobile__toggle" aria-label="Open site menu">
          Menu
        </summary>
        <div className="site-nav-mobile__panel">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav-mobile__link">
              {item.label}
            </Link>
          ))}
        </div>
      </details>
      <script dangerouslySetInnerHTML={{ __html: closeScript }} />
    </>
  );
}
