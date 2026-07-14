import { getProductStatusLabel, liveProducts } from "../../lib/products";
import { INSTAGRAM_URL, SITE_URL, absoluteUrl } from "../../lib/seo";

export const runtime = "edge";

export async function GET() {
  const publicProducts = liveProducts.filter((product) => !product.hidden);

  const productLines = publicProducts.map((product) => {
    const status = getProductStatusLabel(product);
    return `- [${product.name} — ${product.color}](${absoluteUrl(`/products/${product.slug}`)}): ${product.summary} Status: ${status}.`;
  });

  const body = [
    "# ARYO",
    "",
    "> ARYO is a London-based fashion house focused on the Pennicella collection: limited-edition outerwear and trousers made in London, with worldwide shipping and direct client service.",
    "",
    "Use the public pages below for information about the brand, collection, products, sizing, shipping, returns, and contact. Ignore account, admin, checkout, and API routes.",
    "",
    "## Brand",
    "",
    `- [Home](${SITE_URL}/): Landing page for ARYO and the current collection.`,
    `- [Story](${SITE_URL}/story): Brand story, house principles, and the Pennicella collection context.`,
    `- [House](${SITE_URL}/about): House overview, founder direction, and design language.`,
    `- [Campaign](${SITE_URL}/campaign): Campaign imagery and editorial framing for Pennicella.`,
    "",
    "## Collection",
    "",
    `- [Pennicella collection](${SITE_URL}/collections/pennicella): Current shoppable collection overview.`,
    ...productLines,
    "",
    "## Client Services",
    "",
    `- [Contact](${SITE_URL}/contact): Direct support for order questions, returns, shipping updates, and sizing guidance.`,
    `- [FAQs](${SITE_URL}/faqs): Frequently asked questions about sizing, made-to-order pieces, returns, and international shipping.`,
    `- [Shipping](${SITE_URL}/shipping): Shipping coverage and dispatch timing.`,
    `- [Returns](${SITE_URL}/returns): Returns policy and process.`,
    `- [Size Guide](${SITE_URL}/size-guide): Jacket measurements and sizing guidance.`,
    "",
    "## Legal",
    "",
    `- [Privacy Policy](${SITE_URL}/privacy): Data collection and privacy policy.`,
    `- [Terms of Use](${SITE_URL}/terms): Terms governing use of the website.`,
    "",
    "## Optional",
    "",
    `- [Instagram](${INSTAGRAM_URL}): Fastest direct client-services contact.`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
