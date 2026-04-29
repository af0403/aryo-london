import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";

import "../app/globals.css";
import { CartProvider } from "../components/cart-provider";
import { Web3Providers } from "../components/web3-providers";
import { CartUI } from "../components/cart-ui";
import { FooterSignupForm } from "../components/footer-signup-form";
import { HeaderAccountButton } from "../components/header-account-button";
import { SiteChatButton } from "../components/site-chat-button";
import { SiteMenu } from "../components/site-menu";
import { SiteSearch } from "../components/site-search";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aryo.london"),
  title: {
    default: "ARYO | Pennicella | AF by ARYO",
    template: "%s | ARYO",
  },
  description:
    "ARYO London. Discover the Pennicella | AF by ARYO collection.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.jpg",
    shortcut: "/favicon-32x32.png",
  },
  openGraph: {
    title: "ARYO | Pennicella | AF by ARYO",
    description: "ARYO London. Discover the Pennicella | AF by ARYO collection.",
    url: "https://aryo.london",
    siteName: "ARYO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.jpg" />
      </head>
      <body className={`${cormorant.variable} ${instrument.variable}`}>
        <Web3Providers>
        <CartProvider>
          <div className="site-announcement-bar">Complimentary worldwide shipping on all orders</div>

          <header className="site-header">
            <div className="site-header-inner">
              <div className="site-header-cluster">
                <SiteMenu />
                <SiteSearch />
              </div>

              <Link className="brand" href="/">
                ARYO
              </Link>

              <div className="site-header-cluster site-header-cluster-right">
                <HeaderAccountButton />
                <CartUI />
              </div>
            </div>
          </header>

          {children}

          <SiteChatButton />

          <footer className="site-footer">
            <div className="site-footer-inner">
              <div className="site-footer-col">
                <h3>About ARYO</h3>
                <Link href="/story">Story</Link>
                <Link href="/about">House</Link>
                <Link href="/contact">Contact</Link>
              </div>

              <div className="site-footer-col">
                <h3>Client Services</h3>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Use</Link>
                <Link href="/shipping">Shipping &amp; Returns</Link>
                <Link href="/size-guide">Size Guide</Link>
                <Link href="/faqs">FAQs</Link>
              </div>

              <div className="site-footer-col">
                <h3>Connect</h3>
                <Link href="/contact">Contact</Link>
                <a href="https://instagram.com/aryolondon" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </div>

              <div className="site-footer-col site-footer-col-signup">
                <h3>Be the first to access ARYO launches and events.</h3>
                <FooterSignupForm />
              </div>
            </div>

            <div className="site-footer-base">
              <span>© 2026 ARYO London</span>
            </div>
          </footer>
        </CartProvider>
        </Web3Providers>
      </body>
    </html>
  );
}
