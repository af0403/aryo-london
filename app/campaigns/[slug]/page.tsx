import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { campaigns, getCampaign } from "../../../lib/campaigns";
import { createNoIndexMetadata, createPageMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaign(slug);

  if (!campaign) {
    return createNoIndexMetadata({
      title: "Campaign",
      description: "This campaign is unavailable.",
      path: `/campaigns/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${campaign.title} Campaign`,
    description: campaign.description,
    path: `/campaigns/${campaign.slug}`,
    image: campaign.heroImage,
    imageAlt: campaign.heroAlt,
  });
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = getCampaign(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="section campaign-page">
      <div className="campaign-lead">
        <p className="eyebrow">{campaign.chapter}</p>
        <h1 className="page-title">{campaign.title}</h1>
        <p>{campaign.lead}</p>
      </div>

      <div className="campaign-stack">
        {campaign.frames.map((frame, index) => (
          <section
            className={`campaign-frame ${index === 0 ? "campaign-frame-full" : ""}`}
            key={frame.title}
          >
            <figure className="campaign-frame-media">
              <img src={frame.image} alt={frame.alt} />
            </figure>

            <div className="campaign-frame-copy">
              <p className="eyebrow">{frame.eyebrow}</p>
              <h2>{frame.title}</h2>
              <p>{frame.text}</p>
            </div>
          </section>
        ))}
      </div>

      <p className="campaign-return">
        <Link href="/campaigns">View all campaigns</Link>
      </p>
    </main>
  );
}
