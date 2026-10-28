import Link from "next/link";

import { campaigns } from "../../lib/campaigns";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Campaigns",
  description:
    "The ARYO campaign archive. Each chapter of the house, documented through silhouette, material, and editorial imagery.",
  path: "/campaigns",
  image: campaigns[0].heroImage,
  imageAlt: campaigns[0].heroAlt,
});

export default function CampaignsPage() {
  return (
    <main className="section campaigns-index">
      <div className="campaign-lead">
        <p className="eyebrow">Campaigns</p>
        <h1 className="page-title">The archive</h1>
        <p>Each chapter of the house, held in one place.</p>
      </div>

      <div className="campaigns-index-list">
        {campaigns.map((campaign) => (
          <Link
            className="campaigns-index-tile"
            href={`/campaigns/${campaign.slug}`}
            key={campaign.slug}
          >
            <figure className="campaigns-index-media">
              <img src={campaign.heroImage} alt={campaign.heroAlt} />
            </figure>
            <span className="campaigns-index-copy">
              <span className="eyebrow">{campaign.chapter}</span>
              <h2>{campaign.title}</h2>
              <span className="campaigns-index-cta">Discover the campaign</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
