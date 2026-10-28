import { type Product, products } from "../../lib/products";
import { StoreProductCard } from "./product-card";

const PENNICELLA_LINE = "Pennicella | AF by ARYO";

// The house edit: Pennicella ready-to-wear plus the beanie capsule. Concept /
// development pieces stay out of the cross-sell rails.
const isHouseEdit = (product: Product) =>
  product.line === PENNICELLA_LINE ||
  product.line.startsWith("Accessories / Beanie");

function CardRail({
  title,
  items,
  label,
}: {
  title: string;
  items: Product[];
  label: string;
}) {
  if (!items.length) return null;
  return (
    <section className="store-recent" aria-label={label}>
      <div className="store-recent-head">
        <h2>{title}</h2>
      </div>
      <div className="store-recent-track">
        {items.map((p) => (
          <StoreProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

export function RelatedProducts({ product }: { product: Product }) {
  const candidates = products.filter(
    (p) => !p.hidden && p.slug !== product.slug && isHouseEdit(p),
  );

  // Pieces designed to be worn with this one — the matching colourway leads.
  const completeTheLook = candidates
    .filter((p) => p.name !== product.name)
    .sort(
      (a, b) =>
        Number(b.line === PENNICELLA_LINE) -
          Number(a.line === PENNICELLA_LINE) ||
        Number(b.color === product.color) - Number(a.color === product.color),
    )
    .slice(0, 4);

  const shown = new Set(completeTheLook.map((p) => p.slug));
  const alsoLike = candidates
    .filter((p) => !shown.has(p.slug) && p.name !== product.name)
    .slice(0, 4);

  return (
    <>
      <CardRail
        title="Complete the Look"
        items={completeTheLook}
        label="Pieces that complete this look"
      />
      <CardRail
        title="You May Also Like"
        items={alsoLike}
        label="More from the house"
      />
    </>
  );
}
