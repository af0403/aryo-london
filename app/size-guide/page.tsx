import { createPageMetadata } from "../../lib/seo";
import { SizeGuideTool } from "../../components/size-guide-tool";

export const metadata = createPageMetadata({
  title: "Size Guide",
  description:
    "View the ARYO Pennicella Jacket size guide, including garment measurements and fit guidance.",
  path: "/size-guide",
});

export default function SizeGuidePage() {
  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Pennicella | AF by ARYO</p>
        <h1 className="page-title">Find your ARYO fit.</h1>
        <p>
          Choose a category, enter your measurements and get a considered starting point for your ARYO size.
        </p>
        <p>
          The guide combines body measurements with the intended fit. Product pages remain the final reference.
        </p>
      </div>

      <div className="size-guide-wrap">
        <p className="size-guide-note">
          For immediate sizing assistance on any garment, message us on Instagram{" "}
          <a href="https://instagram.com/aryolondon" target="_blank" rel="noreferrer">
            @aryolondon
          </a>.
        </p>
        <SizeGuideTool />
      </div>
    </main>
  );
}
