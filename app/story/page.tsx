import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story",
  description: "The story of ARYO London.",
};

export default function StoryPage() {
  return (
    <main className="section">
      <div className="page-intro">
        <p className="eyebrow">About ARYO</p>
        <h1 className="page-title">The House</h1>
        <p>
          ARYO is a London-based house built on the belief that considered design outlasts the cycle. Every piece is
          conceived as a limited edition — made in small numbers, with materials and proportions that hold their
          weight over time.
        </p>
        <p>
          The name Pennicella comes from the Italian for brushstroke. It is the opening collection and the clearest
          expression of what ARYO stands for: structure, texture, and restraint over volume, graphics, or noise. The
          debut release introduces two silhouettes across two colourways — noir and ivory — each finished with
          signature hardware and embroidery that sit inside the garment rather than on top of it.
        </p>
        <p>
          Production is kept deliberately tight. Made-to-order pieces are produced only after purchase. Stocked
          editions are limited from the outset. This is not artificial scarcity — it is how the house intends to
          work: fewer pieces, more attention paid to each one.
        </p>
        <p>
          ARYO is made in London. The next chapter builds from here.
        </p>
      </div>
    </main>
  );
}
