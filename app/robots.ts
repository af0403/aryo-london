import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/admin",
        "/checkout",
        "/order-confirmed",
        "/success",
        "/api/",
        "/*?key=*",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
