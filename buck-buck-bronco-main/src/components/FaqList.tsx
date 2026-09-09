type FaqItem = {
  q: string;
  a: string;
};

const exclusiveScript = `(function(){var root=document.querySelector(".faq");if(!root||root.dataset.bound)return;root.dataset.bound="1";root.addEventListener("toggle",function(e){var d=e.target;if(!d||d.tagName!=="DETAILS"||!d.open)return;root.querySelectorAll("details[open]").forEach(function(other){if(other!==d)other.removeAttribute("open")})},true)})();`;

/** Native details so an open answer always pushes everything below it down. */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <>
      <div className="faq">
        {items.map((item) => (
          <details key={item.q} className="faq__item">
            <summary className="faq__q">
              <span>{item.q}</span>
            </summary>
            <div className="faq__a">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: exclusiveScript }} />
    </>
  );
}
