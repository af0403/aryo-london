import type { MetadataRoute } from "next";

import { liveProducts } from "../lib/products";
import { absoluteUrl } from "../lib/seo";

const now = new Date();

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.98 },
  { path: "/collections/pennicella", changeFrequency: "weekly", priority: 0.95 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/story", changeFrequency: "monthly", priority: 0.8 },
  { path: "/campaign", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.7 },
  { path: "/shipping", changeFrequency: "monthly", priority: 0.6 },
  { path: "/returns", changeFrequency: "monthly", priority: 0.6 },
  { path: "/size-guide", changeFrequency: "monthly", priority: 0.65 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const publicProducts = liveProducts.filter((product) => !product.hidden);

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...publicProducts.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: product.gallery.map((media) => absoluteUrl(media.src)),
    })),
  ];
}
