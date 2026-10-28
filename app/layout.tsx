import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";

import "../app/globals.css";
import "../app/storefront.css";
import { CartProvider } from "../components/cart-provider";
import { StoreHeader } from "../components/storefront/header";
import { StoreFooter } from "../components/storefront/footer";
import { StorefrontProvider } from "../components/storefront/store-provider";
import { SiteChatButton } from "../components/site-chat-button";
import {
  DEFAULT_SITE_DESCRIPTION,
  INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "../lib/seo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ARYO | Pennicella | AF by ARYO",
    template: "%s | ARYO",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "ARYO" }],
  creator: "ARYO",
  publisher: "ARYO",
  category: "fashion",
  verification: {
    google: "R2CpRSDBOzTn4DZ5tJNDe2cl-OKXjrIMm8jjzt1wbMM",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["ARYO London", "آریو"],
      description:
        "ARYO is a London luxury fashion house. Construction-led clothing made in London, opening with the Pennicella collection.",
      url: SITE_URL,
      logo: absoluteUrl("/apple-touch-icon.png"),
      foundingLocation: {
        "@type": "Place",
        name: "London, England",
      },
      sameAs: [INSTAGRAM_URL],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: "ARYO London",
      url: SITE_URL,
      description: DEFAULT_SITE_DESCRIPTION,
      inLanguage: "en-GB",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={cormorant.variable}>
        <CartProvider>
          <StorefrontProvider>
            <StoreHeader />
            <div id="main-content" tabIndex={-1}>
              {children}
            </div>
            <SiteChatButton />
            <StoreFooter />
          </StorefrontProvider>
        </CartProvider>
      </body>
    </html>
  );
}
