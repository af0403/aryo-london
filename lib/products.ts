export const sizeRun = ["XS", "S", "M", "L", "XL"] as const;

export type Size = (typeof sizeRun)[number];
export type LaunchState = "live" | "coming-soon";
export type InventoryCount = number | null;
export type ProductImageFit = "cover" | "contain";

export type ProductVariant = {
  id: string;
  size: Size;
  sku: string;
  stock: InventoryCount;
};

export type ProductMedia = {
  src: string;
  alt: string;
  fit?: ProductImageFit;
  position?: string;
};

export type Product = {
  slug: string;
  name: string;
  line: string;
  color: string;
  category: string;
  price: number;
  launchState: LaunchState;
  fulfillment: "stocked" | "made-to-order";
  fulfillmentNote?: string;
  editionNote?: string;
  summary: string;
  shortDescription: string;
  longDescription: string;
  leadImage: string;
  leadImagePosition?: string;
  leadImageFit?: ProductImageFit;
  cardImage: string;
  cardImagePosition?: string;
  cardImageFit?: ProductImageFit;
  gallery: ProductMedia[];
  details: Array<{ label: string; value: string }>;
  variants: ProductVariant[];
  notes: string[];
};

const createVariants = (
  prefix: string,
  color: string,
  stockMap: Partial<Record<Size, InventoryCount>>
): ProductVariant[] =>
  sizeRun.map((size) => ({
    id: `${prefix}-${size.toLowerCase()}`,
    size,
    sku: `AF-${color.toUpperCase()}-${prefix.toUpperCase()}-${size}`,
    stock: stockMap[size] ?? null,
  }));

export const products: Product[] = [
  {
    slug: "structure-jacket-noir",
    name: "Structure Jacket",
    line: "Pennicella | AF by ARYO",
    color: "Noir",
    category: "Outerwear",
    price: 200,
    launchState: "live",
    fulfillment: "made-to-order",
    fulfillmentNote: "Made to order. Please allow around 3 weeks before dispatch.",
    summary: "The lead outerwear piece from Pennicella, built around structure, silver hardware, and a controlled noir finish.",
    shortDescription:
      "A cropped jacket with pointed collar, silver zip beneath snap closure, and black lining.",
    longDescription:
      "The Structure Jacket in noir is the clearest expression of the first ARYO release. The silhouette is sharp, the surface stays quiet, and the hardware is kept bright enough to frame the garment without overpowering it.",
    leadImage: "/assets/generated/luma-pack/product-noir-jacket.png",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-noir-jacket.png",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-noir-jacket.png",
        alt: "Front view of the noir structure jacket",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/product-noir-jacket-open.png",
        alt: "Noir structure jacket open, showing collar and hardware detail",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/detail-noir-hardware.png",
        alt: "Close-up of the structure jacket silver hardware and closure",
        fit: "cover",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Noir" },
      { label: "Construction", value: "Structured cropped jacket" },
      { label: "Closure", value: "Silver zip beneath snap closure" },
      { label: "Interior", value: "Black lining" },
      { label: "Origin", value: "Made in London" },
    ],
    variants: createVariants("structure-jacket-noir", "noir", {
      XS: null,
      S: null,
      M: null,
      L: null,
      XL: null,
    }),
    notes: [
      "Silver zip and snap hardware are kept deliberately clean against the textured noir surface.",
    ],
  },
  {
    slug: "essential-trouser-noir",
    name: "Essential Trouser",
    line: "Pennicella | AF by ARYO",
    color: "Noir",
    category: "Trouser",
    price: 100,
    launchState: "live",
    fulfillment: "stocked",
    editionNote: "Only 100 made.",
    summary:
      "A limited edition of 100. The noir trouser is presented as sold out.",
    shortDescription:
      "Straight, relaxed trouser in noir Pennicella with white ARYO signature embroidery. Only 100 made.",
    longDescription:
      "The noir Essential Trouser balances the structure jacket with a softer, longer line. The fit stays calm and fluid while the signature embroidery and heavy texture keep it anchored inside the Pennicella language. Only 100 pieces were made.",
    leadImage: "/assets/generated/luma-pack/product-noir-trouser.png",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-noir-trouser.png",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-noir-trouser.png",
        alt: "Front view of the noir essential trouser",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/detail-noir-embroidery.png",
        alt: "White ARYO signature embroidery detail on the noir trouser",
        fit: "cover",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Noir" },
      { label: "Silhouette", value: "Relaxed straight leg" },
      { label: "Signature", value: "White embroidery at upper leg" },
      { label: "Edition", value: "Only 100 made" },
      { label: "Status", value: "Sold out" },
      { label: "Origin", value: "Made in London" },
    ],
    variants: createVariants("essential-trouser-noir", "noir", {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
    }),
    notes: [
      "This colourway is now sold out. Only 100 pieces were produced.",
      "The piece remains visible to preserve the complete Pennicella launch edit.",
    ],
  },
  {
    slug: "essential-trouser-ivory",
    name: "Essential Trouser",
    line: "Pennicella | AF by ARYO",
    color: "Ivory",
    category: "Trouser",
    price: 100,
    launchState: "live",
    fulfillment: "stocked",
    editionNote: "Only 100 made.",
    summary:
      "A limited edition of 100. The lighter trouser expression for the drop, cut in ivory with blue signature embroidery.",
    shortDescription:
      "Straight, relaxed trouser in ivory Pennicella with blue ARYO signature embroidery. Only 100 made.",
    longDescription:
      "The ivory Essential Trouser opens the collection through a brighter tone without changing the proportion. The blue signature detail stays quiet, which lets the material and silhouette carry the luxury of the piece. Only 100 pieces were produced.",
    leadImage: "/assets/generated/luma-pack/product-ivory-trouser.png",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-ivory-trouser.png",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-ivory-trouser.png",
        alt: "Front view of the ivory essential trouser",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/detail-ivory-embroidery.png",
        alt: "Blue ARYO signature embroidery detail on the ivory trouser",
        fit: "cover",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Ivory" },
      { label: "Silhouette", value: "Relaxed straight leg" },
      { label: "Signature", value: "Blue embroidery at upper leg" },
      { label: "Edition", value: "Only 100 made" },
      { label: "Availability", value: "XS unavailable / S to XL in stock" },
      { label: "Origin", value: "Made in London" },
    ],
    variants: createVariants("essential-trouser-ivory", "ivory", {
      XS: 0,
      S: 5,
      M: 10,
      L: 10,
      XL: 5,
    }),
    notes: [
      "Only 100 pieces were produced across both trouser colourways.",
      "Extra small is not currently available in this colourway.",
    ],
  },
  {
    slug: "structure-jacket-ivory",
    name: "Structure Jacket",
    line: "Pennicella | AF by ARYO",
    color: "Ivory",
    category: "Outerwear",
    price: 200,
    launchState: "live",
    fulfillment: "made-to-order",
    fulfillmentNote: "Made to order. Please allow around 3 weeks before dispatch.",
    summary:
      "The ivory outerwear expression, available made to order.",
    shortDescription:
      "Ivory version of the Structure Jacket, available made to order with a 3 week lead time.",
    longDescription:
      "The ivory Structure Jacket launches as a made-to-order piece so the collection can carry the lighter direction without forcing artificial stock pressure. The silhouette remains consistent with the noir jacket while the ivory colourway opens a softer dimension in the range.",
    leadImage: "/assets/generated/luma-pack/product-ivory-jacket.png",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-ivory-jacket.png",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-ivory-jacket.png",
        alt: "Ivory structure jacket — made to order colourway",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/detail-ivory-embroidery.png",
        alt: "Embroidery detail on the ivory structure jacket",
        fit: "cover",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Ivory" },
      { label: "Status", value: "Made to order" },
      { label: "Lead time", value: "Approximately 3 weeks before dispatch" },
      { label: "Silhouette", value: "Structure Jacket" },
      { label: "Origin", value: "Made in London" },
    ],
    variants: createVariants("structure-jacket-ivory", "ivory", {
      XS: null,
      S: null,
      M: null,
      L: null,
      XL: null,
    }),
    notes: [
      "This colourway is available on a made-to-order basis.",
    ],
  },
];

export const productBySlug = Object.fromEntries(
  products.map((product) => [product.slug, product])
) as Record<string, Product>;

export const liveProducts = products.filter((product) => product.launchState === "live");

export const getProduct = (slug: string) => productBySlug[slug];

export const getSelectedVariant = (product: Product, size: Size) =>
  product.variants.find((variant) => variant.size === size);

export const getProductStatusLabel = (product: Product) => {
  if (product.launchState !== "live") return "Forthcoming";
  if (product.fulfillment === "made-to-order") return "Made to order";

  const isSoldOut = product.variants.every(
    (variant) => typeof variant.stock === "number" && variant.stock <= 0
  );

  return isSoldOut ? "Sold out" : "Available";
};
