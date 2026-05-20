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
  type?: "image" | "video";
  poster?: string;
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

const refreshedStillPath = "/assets/generated/product-refresh/stills";
const refreshedMotionPath = "/assets/generated/product-refresh/motion";

export const products: Product[] = [
  {
    slug: "structure-jacket-noir",
    name: "Pennicella Jacket",
    line: "Pennicella | AF by ARYO",
    color: "Noir",
    category: "Outerwear",
    price: 250,
    launchState: "live",
    fulfillment: "made-to-order",
    fulfillmentNote: "Made to order — current lead time approximately 3 weeks before dispatch.",
    summary: "The lead outerwear piece from Pennicella, built around structure, silver hardware, and a controlled Noir finish.",
    shortDescription:
      "Made to order in our signature Pennicella fabric. Cut to a size M block with concealed zip placket, four-popper front fastening, functional cuff vents, and welt pockets inside and out. Fully lined in black cotton. Made in London.",
    longDescription:
      "The Pennicella Jacket is crafted in our signature Pennicella fabric — named after the Italian word for brushstroke. Made to order in London. Each piece is produced individually after your order is placed.",
    leadImage: `${refreshedStillPath}/noir-jacket-front.png`,
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: `${refreshedStillPath}/noir-jacket-front.png`,
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: `${refreshedStillPath}/noir-jacket-front.png`,
        alt: "Front view of the Noir Pennicella Jacket",
        fit: "cover",
        position: "center top",
      },
      {
        type: "video",
        src: `${refreshedMotionPath}/noir-jacket-hover.mp4`,
        poster: `${refreshedStillPath}/noir-jacket-front.png`,
        alt: "Motion preview of the Noir Pennicella Jacket showing the front, the back, and the construction detail",
        fit: "cover",
        position: "center top",
      },
      {
        src: `${refreshedStillPath}/noir-jacket-back.png`,
        alt: "Back view of the Noir Pennicella Jacket",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/reference/black-jacket-open.jpeg",
        alt: "Open view of the Noir Pennicella Jacket showing the lining, concealed placket, and ARYO neck label",
        fit: "contain",
        position: "center center",
      },
    ],
    details: [
      { label: "Fabric", value: "Black Fleck Pennicella" },
      { label: "Lining", value: "Black cotton, fully lined" },
      { label: "Fit", value: "Cut to a size M block — see our Size Guide for measurements" },
      { label: "Closure", value: "59cm open-ended front metal zip with concealed zip placket" },
      { label: "Fastening", value: "4 concealed poppers on front placket" },
      { label: "Pockets", value: "2 outer welt pockets (5cm × 19cm), 1 inner left chest welt pocket (2cm × 14cm), 1 inner right zip pocket (14cm)" },
      { label: "Cuffs", value: "Functional cuff vent with concealed popper, 4cm felled finish" },
      { label: "Topstitch", value: "0.6cm topstitch on collar, front edge, placket and pockets" },
      { label: "Made in", value: "London, England" },
      { label: "Fulfillment", value: "Made to order — current lead time approximately 3 weeks" },
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
      "Pattern is cut to a size M block. For sizing or fit guidance, message us on Instagram @aryolondon.",
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
    leadImage: `${refreshedStillPath}/noir-trouser-front.png`,
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: `${refreshedStillPath}/noir-trouser-front.png`,
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: `${refreshedStillPath}/noir-trouser-front.png`,
        alt: "Front view of the Noir Essential Trouser",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/processed/noir-trouser-back-legs-clean.png",
        alt: "Back view of the Noir Essential Trouser",
        fit: "contain",
        position: "center center",
      },
      {
        src: "/assets/reference/black-signature-closeup.jpeg",
        alt: "Close detail of the ARYO signature embroidery on the Noir Essential Trouser",
        fit: "contain",
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
    leadImage: `${refreshedStillPath}/ivory-trouser-front.png`,
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: `${refreshedStillPath}/ivory-trouser-front.png`,
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: `${refreshedStillPath}/ivory-trouser-front.png`,
        alt: "Front view of the Ivory Essential Trouser",
        fit: "cover",
        position: "center top",
      },
      {
        src: "/assets/reference/ivory-trouser-back.jpeg",
        alt: "Back view of the Ivory Essential Trouser",
        fit: "contain",
        position: "center center",
      },
      {
        src: "/assets/reference/ivory-fabric-texture-clean.png",
        alt: "Fabric detail of the Ivory Essential Trouser",
        fit: "contain",
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
    name: "Pennicella Jacket",
    line: "Pennicella | AF by ARYO",
    color: "Ivory",
    category: "Outerwear",
    price: 250,
    launchState: "live",
    fulfillment: "made-to-order",
    fulfillmentNote: "Made to order — current lead time approximately 3 weeks before dispatch.",
    summary:
      "The Ivory outerwear expression, made to order in our signature Pennicella fabric.",
    shortDescription:
      "Made to order in our signature Pennicella fabric. Cut to a size M block with concealed zip placket, four-popper front fastening, functional cuff vents, and welt pockets inside and out. Fully lined. Made in London.",
    longDescription:
      "The Pennicella Jacket is crafted in our signature Pennicella fabric — named after the Italian word for brushstroke. Made to order in London. Each piece is produced individually after your order is placed.",
    leadImage: `${refreshedStillPath}/ivory-jacket-front.png`,
    leadImagePosition: "center top",
    leadImageFit: "cover",
    cardImage: `${refreshedStillPath}/ivory-jacket-front.png`,
    cardImagePosition: "center top",
    cardImageFit: "cover",
    gallery: [
      {
        src: `${refreshedStillPath}/ivory-jacket-front.png`,
        alt: "Front view of the Ivory Pennicella Jacket",
        fit: "cover",
        position: "center top",
      },
      {
        type: "video",
        src: `${refreshedMotionPath}/ivory-jacket-hover.mp4`,
        poster: `${refreshedStillPath}/ivory-jacket-front.png`,
        alt: "Motion preview of the Ivory Pennicella Jacket showing the front and the back",
        fit: "cover",
        position: "center top",
      },
      {
        src: `${refreshedStillPath}/ivory-jacket-back.png`,
        alt: "Back view of the Ivory Pennicella Jacket",
        fit: "cover",
        position: "center top",
      },
    ],
    details: [
      { label: "Fabric", value: "Ivory Pennicella" },
      { label: "Lining", value: "Black cotton, fully lined" },
      { label: "Fit", value: "Cut to a size M block — see our Size Guide for measurements" },
      { label: "Closure", value: "59cm open-ended front metal zip with concealed zip placket" },
      { label: "Fastening", value: "4 concealed poppers on front placket" },
      { label: "Pockets", value: "2 outer welt pockets (5cm × 19cm), 1 inner left chest welt pocket (2cm × 14cm), 1 inner right zip pocket (14cm)" },
      { label: "Cuffs", value: "Functional cuff vent with concealed popper, 4cm felled finish" },
      { label: "Topstitch", value: "0.6cm topstitch on collar, front edge, placket and pockets" },
      { label: "Made in", value: "London, England" },
      { label: "Fulfillment", value: "Made to order — current lead time approximately 3 weeks" },
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
      "Pattern is cut to a size M block. For sizing or fit guidance, message us on Instagram @aryolondon.",
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
