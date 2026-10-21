import { StoreCatalog } from "../../../components/storefront/catalog";
import { products } from "../../../lib/products";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Pennicella Collection",
  description:
    "Shop the Pennicella collection by ARYO, including made-to-order jackets and limited-edition trousers.",
  path: "/collections/pennicella",
  image: "/assets/generated/product-refresh/stills/noir-jacket-front.png",
  imageAlt: "Pennicella Jacket in Noir",
});

export default function PennicellaCollectionPage() {
  return (
    <StoreCatalog
      title="Pennicella"
      products={products.filter(
        (p) => !p.hidden && /jacket|trouser/.test(p.slug),
      )}
    />
  );
}
