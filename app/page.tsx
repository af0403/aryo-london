import type { Metadata } from "next";

import { HomeCarousel } from "../components/home-carousel";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "../lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "ARYO | Pennicella | AF by ARYO",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ARYO | Pennicella | AF by ARYO",
    description: DEFAULT_SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        alt: "ARYO Pennicella campaign image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARYO | Pennicella | AF by ARYO",
    description: DEFAULT_SITE_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/assets/generated/aryo-campaign-noir.png"
      />
      <main className="home-main">
        <HomeCarousel />
      </main>
    </>
  );
}
