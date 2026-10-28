export type CampaignFrame = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  text: string;
  /** The source asset is upside down; display it rotated until it is reshot. */
  rotate?: boolean;
};

export type Campaign = {
  slug: string;
  title: string;
  chapter: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  lead: string;
  frames: CampaignFrame[];
};

export const campaigns: Campaign[] = [
  {
    slug: "pennicella",
    title: "Pennicella | AF by ARYO",
    chapter: "Chapter One",
    description:
      "Explore the Pennicella campaign by ARYO through silhouette, hardware, texture, and editorial imagery.",
    heroImage: "/assets/generated/luma-pack/wide-collection-still-life.png",
    heroAlt: "The Pennicella collection still life",
    lead: "The direction stays stripped back so the house, the silhouette, and the material can lead.",
    frames: [
      {
        image: "/assets/generated/luma-pack/wide-collection-still-life.png",
        alt: "The Pennicella collection — jacket and trousers laid out as one look",
        eyebrow: "The collection",
        title: "The collection opens through silhouette.",
        text: "Pennicella is introduced through the full noir look. The jacket and trouser are designed as one piece of language — structure and ease held in the same quiet register.",
      },
      {
        image: "/assets/generated/luma-pack/detail-noir-hardware.png",
        alt: "Silver hardware and collar detail on the Pennicella Jacket",
        eyebrow: "Detail",
        title: "Hardware and collar are kept precise.",
        text: "The strength of the jacket sits in the collar line, the zip, and the way the surface texture holds them together.",
      },
      {
        image: "/assets/generated/luma-pack/detail-ivory-embroidery.png",
        alt: "ARYO signature embroidery on the ivory Essential Trouser",
        rotate: true,
        eyebrow: "Ivory",
        title: "A softer tone without changing the language.",
        text: "The ivory trouser keeps the same measured proportion. Only the colour shifts the mood.",
      },
    ],
  },
];

export const campaignBySlug = Object.fromEntries(
  campaigns.map((campaign) => [campaign.slug, campaign]),
) as Record<string, Campaign>;

export const getCampaign = (slug: string) => campaignBySlug[slug];
