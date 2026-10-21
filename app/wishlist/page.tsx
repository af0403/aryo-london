import { SavedItems } from "../../components/storefront/saved-items";
import { createNoIndexMetadata } from "../../lib/seo";
export const metadata = createNoIndexMetadata({
  title: "Saved Items",
  description: "Your saved ARYO pieces.",
  path: "/wishlist",
});
export default function WishlistPage() {
  return <SavedItems />;
}
