import type { Metadata } from "next";
import { BuckTagMaker } from "@/components/BuckTagMaker";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { pageMetadata } from "@/lib/seo/metadata";
import { buildPageGraph } from "@/lib/seo/schema";

const title = "Print a You’ve been Bucked tag";
const description =
  "Create a free printable You’ve been Bucked tag. Add your name and a note, download a PNG, and leave it with a Buck on another Ford Bronco.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/bucked",
});

export default function BuckedPage() {
  return (
    <>
      <JsonLd data={buildPageGraph({ name: title, description, path: "/bucked" })} />
      <header
        className="page-hero"
        data-review-id="bucked-hero"
        data-review-label="Tag maker intro"
      >
        <Reveal>
          <h1>Make a tag</h1>
          <p>
            Customize a “You’ve been Bucked” tag, download it, print a stack,
            and tuck one with your next horse.
          </p>
        </Reveal>
      </header>
      <section
        className="section"
        style={{ paddingTop: 0 }}
        data-review-id="bucked-maker"
        data-review-label="Tag maker tool"
      >
        <Reveal>
          <BuckTagMaker />
        </Reveal>
      </section>
    </>
  );
}
