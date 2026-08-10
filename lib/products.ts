export const sizeRun = ["XS", "S", "M", "L", "XL"] as const;
export const sizeValues = [...sizeRun, "ONE SIZE"] as const;

export type Size = (typeof sizeValues)[number];
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
  price: number | null;
  priceNote?: string;
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

const createOneSizeVariant = (prefix: string, color: string, stock: InventoryCount): ProductVariant => ({
  id: `${prefix}-one-size`,
  size: "ONE SIZE",
  sku: `AF-${color.toUpperCase()}-${prefix.toUpperCase()}-OS`,
  stock,
});

const refreshedStillPath = "/assets/generated/product-refresh/stills";
export const products: Product[] = [
  {
    slug: "nur-signature-noir",
    name: "Nūr Signature Beanie",
    line: "Accessories / Beanie Capsule",
    color: "Noir",
    category: "Accessories",
    price: null,
    priceNote: "Price to be confirmed",
    launchState: "coming-soon",
    fulfillment: "stocked",
    editionNote: "Small-batch release",
    summary: "A rounded fine-rib beanie in ARYO Noir, finished with the continuous signature AF in warm bone.",
    shortDescription:
      "A dense, fine-gauge rib knit skully with one continuous warm-bone signature AF embroidered across the front.",
    longDescription:
      "Nūr is ARYO's first house beanie: a quiet, tactile object designed to feel permanent rather than seasonal. The approved skully silhouette uses a rounded crown, thin stretchy body, and dense vertical rib. The signature AF is treated as one connected embroidered gesture on the front, so the mark belongs to the knit rather than sitting on top of it.",
    leadImage: "/assets/beanies/nur-signature-noir/skully-front-three-quarter.png",
    leadImageFit: "contain",
    cardImage: "/assets/beanies/nur-signature-noir/skully-front-three-quarter.png",
    cardImageFit: "contain",
    gallery: [
      { src: "/assets/beanies/nur-signature-noir/skully-front-three-quarter.png", alt: "Nūr Signature Beanie in Noir, skully front three-quarter view", fit: "contain" },
      { src: "/assets/beanies/nur-signature-noir/rear-three-quarter.png", alt: "Nūr Signature Beanie in Noir, rear three-quarter view", fit: "contain" },
      { src: "/assets/beanies/nur-signature-noir/macro-signature-af.png", alt: "Nūr Signature Beanie in Noir, warm-bone signature AF and rib detail", fit: "contain" },
      { src: "/assets/beanies/nur-signature-noir/inside-construction.png", alt: "Nūr Signature Beanie in Noir, inside construction detail", fit: "contain" },
      { src: "/assets/beanies/nur-signature-noir/editorial-approved-model.png", alt: "Nūr Signature Beanie in Noir, approved editorial model image", fit: "contain" },
    ],
    details: [
      { label: "Material target", value: "Premium 100% cashmere lead yarn, subject to fibre and hand-feel approval" },
      { label: "Knit", value: "Dense fine-gauge vertical rib, target 7-gauge or supplier-equivalent density" },
      { label: "Hem", value: "Single-layer tubular hem with soft stretch and clean recovery" },
      { label: "Mark", value: "Continuous signature AF in warm bone, engineered knit or approved knit/embroidery hybrid" },
      { label: "Fit", value: "Unisex, one size" },
      { label: "SKU", value: "ARY-NUR-001-BLK" },
      { label: "Origin", value: "To be confirmed from final supplier documentation" },
    ],
    variants: [createOneSizeVariant("nur-signature-noir", "noir", null)],
    notes: [
      "Final retail price and stock quantity will be confirmed before release.",
      "Do not treat the digital imagery as a substitute for the approved physical sample.",
      "Final fibre composition, care instructions, and country of origin will follow supplier certification.",
    ],
  },
  {
    slug: "nur-signature-bone",
    name: "Nūr Signature Beanie",
    line: "Accessories / Beanie Capsule",
    color: "Bone",
    category: "Accessories",
    price: null,
    priceNote: "Price to be confirmed",
    launchState: "coming-soon",
    fulfillment: "stocked",
    editionNote: "Small-batch release",
    summary: "The Nūr silhouette in warm ARYO Bone, finished with a tonal almond-bone signature AF.",
    shortDescription:
      "A dense, fine-gauge rib knit skully with a tonal bone signature AF embroidered into the front.",
    longDescription:
      "Nūr Bone keeps the same rounded, stretchy skully silhouette as the Noir colourway while shifting the knit and mark into a quieter almond-bone tone. The result is deliberately restrained: the signature remains legible at close range, but the knit, proportion, and hand feel carry the first impression.",
    leadImage: "/assets/beanies/nur-signature-bone/skully-front-three-quarter.png",
    leadImageFit: "contain",
    cardImage: "/assets/beanies/nur-signature-bone/skully-front-three-quarter.png",
    cardImageFit: "contain",
    gallery: [
      { src: "/assets/beanies/nur-signature-bone/skully-front-three-quarter.png", alt: "Nūr Signature Beanie in Bone, skully front three-quarter view", fit: "contain" },
      { src: "/assets/beanies/nur-signature-bone/rear-three-quarter.png", alt: "Nūr Signature Beanie in Bone, rear three-quarter view", fit: "contain" },
      { src: "/assets/beanies/nur-signature-bone/macro-signature-af.png", alt: "Nūr Signature Beanie in Bone, tonal almond-bone signature AF and rib detail", fit: "contain" },
      { src: "/assets/beanies/nur-signature-bone/inside-construction.png", alt: "Nūr Signature Beanie in Bone, inside construction detail", fit: "contain" },
      { src: "/assets/beanies/nur-signature-bone/model-portrait-approved.png", alt: "Nūr Signature Beanie in Bone, approved model portrait", fit: "contain" },
    ],
    details: [
      { label: "Material target", value: "Premium 100% cashmere lead yarn, subject to fibre and hand-feel approval" },
      { label: "Knit", value: "Dense fine-gauge vertical rib, target 7-gauge or supplier-equivalent density" },
      { label: "Hem", value: "Single-layer tubular hem with soft stretch and clean recovery" },
      { label: "Mark", value: "Continuous signature AF in almond bone, engineered knit or approved knit/embroidery hybrid" },
      { label: "Fit", value: "Unisex, one size" },
      { label: "SKU", value: "ARY-NUR-001-BNE" },
      { label: "Origin", value: "To be confirmed from final supplier documentation" },
    ],
    variants: [createOneSizeVariant("nur-signature-bone", "bone", null)],
    notes: [
      "Final retail price and stock quantity will be confirmed before release.",
      "Do not treat the digital imagery as a substitute for the approved physical sample.",
      "Final fibre composition, care instructions, and country of origin will follow supplier certification.",
    ],
  },
  {
    slug: "gozar-aryo-noir",
    name: "Gozar ARYO Beanie",
    line: "Accessories / Beanie Capsule",
    color: "Noir",
    category: "Accessories",
    price: null,
    priceNote: "Price to be confirmed",
    launchState: "coming-soon",
    fulfillment: "stocked",
    editionNote: "Small-batch release",
    summary: "A fine-rib Noir beanie with the ARYO wordmark softened into a directional silver-graphite passage across the cuff.",
    shortDescription:
      "The same rounded ARYO silhouette, carrying a controlled horizontal motion treatment that reads like a wordmark passing through the frame.",
    longDescription:
      "Gozar takes its name from the idea of passage. The ARYO wordmark is not presented as a hard, static logo; it is stretched into a soft silver-graphite passage across the cuff, as though seen from a moving train. The treatment remains integrated with the knit and centred on the front cuff.",
    leadImage: "/assets/beanies/gozar-aryo-noir/front-three-quarter.png",
    leadImageFit: "contain",
    cardImage: "/assets/beanies/gozar-aryo-noir/front-three-quarter.png",
    cardImageFit: "contain",
    gallery: [
      { src: "/assets/beanies/gozar-aryo-noir/front-three-quarter.png", alt: "Gozar ARYO Beanie in Noir, front three-quarter view", fit: "contain" },
      { src: "/assets/beanies/gozar-aryo-noir/rear-three-quarter.png", alt: "Gozar ARYO Beanie in Noir, rear three-quarter view", fit: "contain" },
      { src: "/assets/beanies/gozar-aryo-noir/macro-aryo-motion.png", alt: "Gozar ARYO Beanie in Noir, directional silver-graphite wordmark and rib detail", fit: "contain" },
      { src: "/assets/beanies/gozar-aryo-noir/inside-construction.png", alt: "Gozar ARYO Beanie in Noir, inside construction detail", fit: "contain" },
      { src: "/assets/beanies/gozar-aryo-noir/editorial-approved-model.png", alt: "Gozar ARYO Beanie in Noir, approved editorial model image", fit: "contain" },
    ],
    details: [
      { label: "Material target", value: "Premium 100% cashmere lead yarn, subject to fibre and hand-feel approval" },
      { label: "Knit", value: "Dense fine-gauge vertical rib, target 7-gauge or supplier-equivalent density" },
      { label: "Cuff", value: "Double-layer medium folded cuff with stable recovery" },
      { label: "Mark", value: "ARYO wordmark in aged silver graphite with controlled directional textile streaking" },
      { label: "Fit", value: "Unisex, one size" },
      { label: "SKU", value: "ARY-GOZ-001-BLK" },
      { label: "Origin", value: "To be confirmed from final supplier documentation" },
    ],
    variants: [createOneSizeVariant("gozar-aryo-noir", "noir", null)],
    notes: [
      "Final retail price and stock quantity will be confirmed before release.",
      "The motion treatment must be approved as a physical textile strike-off before production.",
      "Final fibre composition, care instructions, and country of origin will follow supplier certification.",
    ],
  },
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
      "The Noir Essential Trouser balances the Pennicella Jacket with a softer, longer line. Crafted in our signature Pennicella fabric — named after the Italian word for brushstroke — the fit stays calm and fluid while the ARYO signature embroidery on the back pocket keeps it anchored inside the Pennicella language. Only 100 pieces were made.",
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
        src: "/assets/processed/noir-trouser-back-clean.jpg",
        alt: "Back view of the Noir Essential Trouser",
        fit: "contain",
        position: "center center",
      },
      {
        src: "/assets/processed/noir-embroidery-detail-correct.jpg",
        alt: "Back pocket detail of the ARYO signature embroidery on the Noir Essential Trouser",
        fit: "contain",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Noir" },
      { label: "Fabric", value: "Pennicella — signature ARYO fabric" },
      { label: "Silhouette", value: "Relaxed straight leg" },
      { label: "Waistband", value: "Elasticated" },
      { label: "Front", value: "Clean front finish with no belt loops or centre crease" },
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
        src: "/assets/processed/ivory-trouser-back-clean.jpg",
        alt: "Back view of the Ivory Essential Trouser",
        fit: "contain",
        position: "center center",
      },
      {
        src: "/assets/processed/ivory-embroidery-closeup-clean.jpg",
        alt: "Back pocket detail of the blue ARYO signature embroidery on the Ivory Essential Trouser",
        fit: "contain",
        position: "center center",
      },
    ],
    details: [
      { label: "Colour", value: "Ivory" },
      { label: "Fabric", value: "Pennicella — signature ARYO fabric" },
      { label: "Silhouette", value: "Relaxed straight leg" },
      { label: "Waistband", value: "Elasticated" },
      { label: "Front", value: "Clean front finish with no belt loops or centre crease" },
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
        src: `${refreshedStillPath}/ivory-jacket-back.png`,
        alt: "Back view of the Ivory Pennicella Jacket",
        fit: "cover",
        position: "center top",
      },
      {
        src: `${refreshedStillPath}/ivory-jacket-open.png`,
        alt: "Open view of the Ivory Pennicella Jacket showing the lining, concealed placket, and ARYO neck label",
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
