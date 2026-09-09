import type { Metadata } from "next";
import { BuckTagMaker } from "@/components/BuckTagMaker";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Make a tag",
  description:
    "Create a printable You've Been Bucked tag for Buck Buck Bronco. Add your name, note, and download a PNG.",
};

export default function BuckedPage() {
  return (
    <>
      <header
        className="page-hero"
        data-review-id="bucked-hero"
        data-review-label="Tag maker intro"
      >
        <Reveal>
          <h1>Make a tag</h1>
          <p>
            Customize a “You’ve been bucked” tag, download it, print a stack,
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
