import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Story",
  description:
    "Read the story of ARYO London and the Pennicella collection, from house principles to limited-edition production.",
  path: "/story",
});

export default function StoryPage() {
  return (
    <main className="section">
      <div className="page-intro">
        <p className="eyebrow">About ARYO</p>
        <h1 className="page-title">The House</h1>
        <p>
          ARYO is a London-based house built on the belief that considered
          design outlasts the cycle. Every piece is conceived as a limited
          edition — made in small numbers, with materials and proportions that
          hold their weight over time.
        </p>
        <p>
          Production is kept deliberately tight. Made-to-order pieces are
          produced only after purchase. Stocked editions are limited from the
          outset. This is not artificial scarcity — it is how the house intends
          to work: fewer pieces, more attention paid to each one.
        </p>
        <p>ARYO is made in London. The next chapter builds from here.</p>
      </div>
    </main>
  );
}
