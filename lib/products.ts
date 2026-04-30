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
  hidden?: boolean;
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
    fulfillmentNote: "Made to order — current lead time approximately 3 weeks before dispatch.",
    summary: "The lead outerwear piece from Pennicella, built around structure, silver hardware, and a controlled Noir finish.",
    shortDescription:
      "Made to order in our signature Pennicella fabric. Cropped silhouette with pointed collar, silver zip and snap closures, and black lining. ARYO MADE IN LONDON interior label.",
    longDescription:
      "The Structure Jacket in Noir is the clearest expression of the first ARYO release. Made to order in our signature Pennicella fabric — named after the Italian word for brushstroke — the silhouette is sharp, the surface stays quiet, and the silver hardware is kept bright enough to frame the garment without overpowering it. Fully lined, with the ARYO MADE IN LONDON label at the interior.",
    leadImage: "/assets/generated/luma-pack/product-noir-jacket.png",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-noir-jacket.png",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-noir-jacket.png",
        alt: "Front view of the Noir Structure Jacket",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/product-noir-jacket-open.png",
        alt: "Noir Structure Jacket open, showing collar and hardware detail",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/detail-noir-hardware.png",
        alt: "Silver zip and snap closure detail on the Noir Structure Jacket",
        fit: "cover",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Noir" },
      { label: "Fabric", value: "Pennicella — signature ARYO fabric" },
      { label: "Construction", value: "Structured cropped jacket, fully lined" },
      { label: "Closure", value: "Silver zip beneath snap closure" },
      { label: "Label", value: "ARYO MADE IN LONDON interior label" },
      { label: "Fulfillment", value: "Made to order — approximately 3 weeks" },
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
      "Made to order in all sizes. No stock is held — each piece is produced after purchase.",
      "Silver zip and snap hardware are kept deliberately clean against the textured Noir surface.",
      "Current lead time is approximately 3 weeks before dispatch.",
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
      "A limited edition of 100. The Noir Essential Trouser is now sold out.",
    shortDescription:
      "Relaxed straight-leg trouser in our signature Pennicella fabric. Elasticated waistband. ARYO signature embroidery on the back pocket. Only 100 made.",
    longDescription:
      "The Noir Essential Trouser balances the Structure Jacket with a softer, longer line. Crafted in our signature Pennicella fabric — named after the Italian word for brushstroke — the fit stays calm and fluid while the ARYO signature embroidery on the back pocket keeps it anchored inside the Pennicella language. Only 100 pieces were made.",
    leadImage: "/assets/generated/luma-pack/product-noir-trouser-front.jpg",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-noir-trouser-front.jpg",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-noir-trouser-front.jpg",
        alt: "Front view of the Noir Essential Trouser",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/processed/noir-trouser-back-rotated.jpg",
        alt: "Back view of the Noir Essential Trouser showing ARYO signature embroidery on the back pocket",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/processed/noir-embroidery-closeup.jpg",
        alt: "ARYO signature embroidery close-up detail on the Noir Essential Trouser",
        fit: "cover",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Noir" },
      { label: "Fabric", value: "Pennicella — signature ARYO fabric" },
      { label: "Silhouette", value: "Relaxed straight leg" },
      { label: "Waistband", value: "Elasticated" },
      { label: "Signature", value: "ARYO embroidery on the back pocket" },
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
      "Back pocket features the ARYO signature embroidery.",
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
      "A limited edition of 100. The lighter trouser expression for the drop, cut in Ivory with blue signature embroidery on the back pocket.",
    shortDescription:
      "Relaxed straight-leg trouser in our signature Pennicella fabric. Elasticated waistband. ARYO signature embroidery on the back pocket. Only 100 made.",
    longDescription:
      "The Ivory Essential Trouser opens the collection through a brighter tone without changing the proportion. Crafted in our signature Pennicella fabric — named after the Italian word for brushstroke — the blue ARYO signature embroidery on the back pocket stays quiet, which lets the material and silhouette carry the luxury of the piece. Only 100 pieces were produced.",
    leadImage: "/assets/generated/luma-pack/product-ivory-trouser-front.jpg",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-ivory-trouser-front.jpg",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-ivory-trouser-front.jpg",
        alt: "Front view of the Ivory Essential Trouser",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/processed/ivory-trouser-back-rotated.jpg",
        alt: "Back view of the Ivory Essential Trouser showing ARYO signature embroidery on the back pocket",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/generated/luma-pack/detail-ivory-embroidery-closeup.jpg",
        alt: "ARYO signature embroidery close-up detail on the Ivory Essential Trouser",
        fit: "cover",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Ivory" },
      { label: "Fabric", value: "Pennicella — signature ARYO fabric" },
      { label: "Silhouette", value: "Relaxed straight leg" },
      { label: "Waistband", value: "Elasticated" },
      { label: "Signature", value: "ARYO embroidery on the back pocket" },
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
      "Back pocket features the ARYO signature embroidery.",
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
    fulfillmentNote: "Made to order — current lead time approximately 3 weeks before dispatch.",
    summary:
      "The Ivory outerwear expression, made to order in our signature Pennicella fabric.",
    shortDescription:
      "Made to order in our signature Pennicella fabric. Ivory version of the Structure Jacket — cropped silhouette with pointed collar, silver zip and snap closures, and full lining. ARYO MADE IN LONDON interior label.",
    longDescription:
      "The Ivory Structure Jacket is made to order in our signature Pennicella fabric — named after the Italian word for brushstroke — so the collection can carry the lighter direction without forcing artificial stock pressure. The silhouette remains consistent with the Noir jacket: sharp, cropped, fully lined, with silver zip and snap closures. The Ivory colourway opens a softer dimension in the range while the structure remains uncompromised.",
    leadImage: "/assets/generated/luma-pack/product-ivory-jacket.png",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-ivory-jacket.png",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-ivory-jacket.png",
        alt: "Ivory Structure Jacket — made to order",
        fit: "cover",
        position: "center top",
      },
    ],
    details: [
      { label: "Colour", value: "Ivory" },
      { label: "Fabric", value: "Pennicella — signature ARYO fabric" },
      { label: "Construction", value: "Structured cropped jacket, fully lined" },
      { label: "Closure", value: "Silver zip beneath snap closure" },
      { label: "Label", value: "ARYO MADE IN LONDON interior label" },
      { label: "Fulfillment", value: "Made to order — approximately 3 weeks" },
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
      "Made to order in all sizes. No stock is held — each piece is produced after purchase.",
      "Current lead time is approximately 3 weeks before dispatch.",
    ],
  },
  {
    slug: "test-product",
    name: "Test Item",
    line: "Pennicella | AF by ARYO",
    color: "Noir",
    category: "Test",
    price: 1,
    launchState: "live",
    fulfillment: "stocked",
    summary: "Test product for checkout testing only.",
    shortDescription: "Test product — do not purchase.",
    longDescription: "Test product for internal checkout and crypto payment testing. Not for sale.",
    leadImage: "/assets/generated/luma-pack/product-noir-jacket.png",
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: "/assets/generated/luma-pack/product-noir-jacket.png",
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: "/assets/generated/luma-pack/product-noir-jacket.png",
        alt: "Test product",
        fit: "cover",
        position: "center top",
      },
    ],
    details: [],
    variants: createVariants("test-product", "noir", {
      XS: 99, S: 99, M: 99, L: 99, XL: 99,
    }),
    notes: ["Test product for checkout testing. Not visible on the collection page."],
    hidden: true,
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
