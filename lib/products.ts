export const sizeRun = ["XS", "S", "M", "L", "XL"] as const;
export const sizeValues = [...sizeRun, "ONE SIZE"] as const;

export type Size = (typeof sizeValues)[number];
export type LaunchState = "live" | "coming-soon";
export type InventoryCount = number | null;
export type ProductImageFit = "cover" | "contain";
export type CatalogDepartment = "women" | "men" | "unisex" | "home";
export type CatalogSubcategory =
  | "ready-to-wear"
  | "headwear"
  | "scarves"
  | "gloves"
  | "eyewear"
  | "tabletop"
  | "textiles"
  | "small-objects"
  | "fragrance";

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
  editorialImage?: ProductMedia;
  details: Array<{ label: string; value: string }>;
  variants: ProductVariant[];
  notes: string[];
  department?: CatalogDepartment;
  subcategory?: CatalogSubcategory;
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

type ConceptProductInput = {
  slug: string;
  name: string;
  color: string;
  category: string;
  department: CatalogDepartment;
  subcategory: CatalogSubcategory;
  image: string;
  reference: string;
  material: string;
  construction: string;
  finish: string;
  summary: string;
  description: string;
};

const conceptNote =
  "Concept / development edit. Final materials, dimensions, price, care instructions, and availability will be confirmed after physical sampling.";

const createConceptProduct = (input: ConceptProductInput): Product => {
  const collectionLine =
    input.department === "home"
      ? "Home Objects / Development Edit"
      : input.subcategory === "headwear"
        ? "Headwear / Development Edit"
        : "Accessories / Development Edit";

  const imageAlt = `${input.name} in ${input.color}`;

  return {
    slug: input.slug,
    name: input.name,
    line: collectionLine,
    color: input.color,
    category: input.category,
    price: null,
    priceNote: "In development",
    launchState: "coming-soon",
    fulfillment: "stocked",
    editionNote: "Concept / development edit",
    summary: input.summary,
    shortDescription: input.summary,
    longDescription: `${input.description} ${conceptNote}`,
    leadImage: input.image,
    leadImageFit: "contain",
    cardImage: input.image,
    cardImageFit: "contain",
    gallery: [{ src: input.image, alt: imageAlt, fit: "contain" }],
    editorialImage: {
      src: input.reference,
      alt: `ARYO development reference board for ${input.name}`,
      fit: "contain",
    },
    details: [
      { label: "Material target", value: input.material },
      { label: "Construction", value: input.construction },
      { label: "Finish", value: input.finish },
      { label: "Colourway", value: input.color },
      { label: "Sizing", value: "To be confirmed after physical sampling" },
      { label: "Status", value: "Concept / development edit" },
    ],
    variants: [createOneSizeVariant(input.slug, input.color.toLowerCase(), null)],
    notes: [conceptNote, "The clean render is a direction reference, not a confirmation of final production details."],
    department: input.department,
    subcategory: input.subcategory,
  };
};

const conceptProducts: Product[] = [
  createConceptProduct({
    slug: "craquele-lambskin-cap",
    name: "Craquelé Lambskin Baseball Cap",
    color: "Espresso",
    category: "Headwear",
    department: "unisex",
    subcategory: "headwear",
    image: "/assets/concepts/generated/headwear/lambskin-baseball-cap.png",
    reference: "/assets/concepts/references/craquele-lambskin-baseball-cap.png",
    material: "Lambskin with a hand-finished craquelé surface and natural shearling edge detail",
    construction: "Five-panel baseball cap with shaped crown, curved peak, and adjustable leather strap",
    finish: "Aged surface character with tonal edge binding and understated ARYO branding",
    summary: "A character-rich lambskin cap with a worn-in surface, soft shearling edge, and refined ARYO proportion.",
    description: "The Craquelé Lambskin Cap is designed as a future ARYO headwear signature: tactile, slightly irregular, and more considered than a standard sports cap.",
  }),
  createConceptProduct({
    slug: "cashmere-cap",
    name: "Cashmere Baseball Cap",
    color: "Charcoal",
    category: "Headwear",
    department: "unisex",
    subcategory: "headwear",
    image: "/assets/concepts/generated/headwear/cashmere-cap.png",
    reference: "/assets/concepts/references/cashmere-cap-board.png",
    material: "100% cashmere target with a soft, brushed hand",
    construction: "Refined six-panel construction with a softly structured crown and curved peak",
    finish: "Tonally stitched panels, leather adjuster, and discreet debossed ARYO branding",
    summary: "A quiet, lightweight cashmere cap with a clean silhouette and an unusually soft hand.",
    description: "The Cashmere Cap brings the softness of ARYO knitwear into a more structured everyday form, balancing ease with a precise six-panel shape.",
  }),
  createConceptProduct({
    slug: "linen-cap",
    name: "Linen Baseball Cap",
    color: "Natural",
    category: "Headwear",
    department: "unisex",
    subcategory: "headwear",
    image: "/assets/concepts/generated/headwear/linen-cap.png",
    reference: "/assets/concepts/references/linen-cap-board.png",
    material: "100% linen target with a breathable, naturally textured surface",
    construction: "Unstructured six-panel crown with curved peak and adjustable leather strap",
    finish: "Washed natural tone with tonal stitching and a soft, lived-in drape",
    summary: "A breathable linen cap with a relaxed crown and the calm, tactile character of summer ARYO cloth.",
    description: "The Linen Cap is a warm-weather foundation for the house: deliberately light, unforced, and designed to gain character through wear.",
  }),
  createConceptProduct({
    slug: "cashmere-flat-cap",
    name: "Cashmere Flat Cap",
    color: "Charcoal",
    category: "Headwear",
    department: "unisex",
    subcategory: "headwear",
    image: "/assets/concepts/generated/headwear/cashmere-flat-cap.png",
    reference: "/assets/concepts/references/cashmere-flat-cap-board.png",
    material: "90% cashmere / 10% wool target blend",
    construction: "Low-profile flat-cap silhouette with softly structured crown and integrated peak",
    finish: "Subtle tonal herringbone texture with discreet debossed ARYO detail",
    summary: "A low-profile cashmere-wool flat cap with a soft structure and quietly architectural texture.",
    description: "The Cashmere Flat Cap translates ARYO's restrained luxury into a more tailored headwear silhouette, intended to sit between formal and everyday dressing.",
  }),
  createConceptProduct({
    slug: "shearling-winter-hat",
    name: "Shearling Winter Hat",
    color: "Chocolate",
    category: "Headwear",
    department: "unisex",
    subcategory: "headwear",
    image: "/assets/concepts/generated/personal-accessories/shearling-winter-hat.png",
    reference: "/assets/concepts/references/shearling-winter-hat-board.png",
    material: "Lambskin exterior with curly shearling lining and trim target",
    construction: "Panelled winter hat with ear flaps, structured crown, and adjustable chin strap",
    finish: "Natural insulating pile, curved leather binding, and a softly aged surface",
    summary: "A cold-weather ARYO hat built around lambskin, curly shearling, and an expressive ear-flap silhouette.",
    description: "The Shearling Winter Hat is a more sculptural cold-weather object, bringing warmth and material contrast into the ARYO accessories language.",
  }),
  createConceptProduct({
    slug: "persian-silk-headscarf",
    name: "Persian Silk Headscarf",
    color: "Noir",
    category: "Accessories",
    department: "unisex",
    subcategory: "scarves",
    image: "/assets/concepts/generated/personal-accessories/silk-headscarf.png",
    reference: "/assets/concepts/references/silk-headscarf-board.png",
    material: "100% silk twill target with a smooth, lustrous hand",
    construction: "Square scarf with hand-rolled edges and a considered Persian-inspired border",
    finish: "Noir ground with antique-gold pattern and a signature ARYO corner detail",
    summary: "A Persian-inspired silk twill scarf with a smooth drape, hand-finished edge, and quiet house identity.",
    description: "The Persian Silk Headscarf is a house accessory with a clear cultural point of view, designed to be worn, tied, or displayed as an object.",
  }),
  createConceptProduct({
    slug: "reversible-linen-bucket-hat",
    name: "Reversible Linen Bucket Hat",
    color: "Chocolate / Beige",
    category: "Headwear",
    department: "unisex",
    subcategory: "headwear",
    image: "/assets/concepts/generated/personal-accessories/reversible-linen-bucket-hat.png",
    reference: "/assets/concepts/references/reversible-linen-bucket-hat-board.png",
    material: "Lightweight reversible linen target",
    construction: "Structured bucket crown with shaped brim, reversible construction, and tonal topstitching",
    finish: "Chocolate outer face reversing to a warm beige, with a discreet ARYO label detail",
    summary: "A reversible linen bucket hat that moves between a rich chocolate face and a quiet beige reverse.",
    description: "The Reversible Linen Bucket Hat gives the ARYO summer edit a more relaxed gesture without losing the precision of the house's material language.",
  }),
  createConceptProduct({
    slug: "nappa-leather-gloves",
    name: "Nappa Leather Gloves",
    color: "Espresso",
    category: "Accessories",
    department: "unisex",
    subcategory: "gloves",
    image: "/assets/concepts/generated/personal-accessories/nappa-leather-gloves.png",
    reference: "/assets/concepts/references/nappa-leather-gloves-board.png",
    material: "Supple nappa leather with cashmere lining target",
    construction: "Five-finger glove with hand-finished seams, shaped thumb, and refined cuff slit",
    finish: "Espresso leather with tonal stitching and debossed ARYO signature at the cuff",
    summary: "Supple nappa gloves lined in cashmere, finished with hand-sewn precision and a quiet cuff mark.",
    description: "The Nappa Leather Gloves are intended as an everyday luxury object: tactile, warm, and finished with the kind of detail that only reveals itself in use.",
  }),
  createConceptProduct({
    slug: "cashmere-scarf",
    name: "Cashmere Scarf",
    color: "Noir",
    category: "Accessories",
    department: "unisex",
    subcategory: "scarves",
    image: "/assets/concepts/generated/personal-accessories/cashmere-scarf.png",
    reference: "/assets/concepts/references/cashmere-scarf-board.png",
    material: "100% cashmere target with a soft, warm hand",
    construction: "Oversized rectangular scarf with clean finished edges and generous natural drape",
    finish: "Noir surface with restrained ARYO detail and a softly brushed handle",
    summary: "An oversized pure-cashmere scarf designed for warmth, drape, and understated daily wear.",
    description: "The Cashmere Scarf is a foundational ARYO object: simple in silhouette, exact in proportion, and built around the quality of the fibre.",
  }),
  createConceptProduct({
    slug: "aryo-acetate-sunglasses",
    name: "Acetate Sunglasses",
    color: "Black / Smoke",
    category: "Accessories",
    department: "unisex",
    subcategory: "eyewear",
    image: "/assets/concepts/generated/personal-accessories/acetate-sunglasses.png",
    reference: "/assets/concepts/references/acetate-sunglasses-board.png",
    material: "Premium acetate with CR-39 lens target and full UV protection",
    construction: "Bold refined frame with precision hinge, shaped temple, and balanced square lens",
    finish: "Gloss black acetate with subtle gold-toned ARYO hardware detail",
    summary: "A bold acetate frame with a precise hinge, smoke lens, and a restrained house hardware language.",
    description: "The ARYO Acetate Sunglasses are conceived as an everyday signature: recognisable in outline, but considered in the small details that reward a closer look.",
  }),
  createConceptProduct({
    slug: "marble-chess-set",
    name: "Marble Chess Set",
    color: "Nero / Ivory",
    category: "Home Accessories",
    department: "home",
    subcategory: "tabletop",
    image: "/assets/concepts/generated/home/marble-chess-set.png",
    reference: "/assets/concepts/references/marble-chess-set-board.png",
    material: "Solid black and ivory stone target with polished and honed surfaces",
    construction: "Weighted sculptural pieces on a precision-cut chequered board",
    finish: "Contrasting stone surfaces with subtle ARYO inlay and presentation box direction",
    summary: "A sculptural marble chess set designed as much for display as for play.",
    description: "The Marble Chess Set extends ARYO into the home through contrast, balance, and weight: a tabletop object that holds its presence between games.",
  }),
  createConceptProduct({
    slug: "marble-brass-ashtray",
    name: "Marble & Brass Ashtray",
    color: "Nero Marquina",
    category: "Home Accessories",
    department: "home",
    subcategory: "tabletop",
    image: "/assets/concepts/generated/home/marble-brass-ashtray.png",
    reference: "/assets/concepts/references/marble-brass-ashtray-board.png",
    material: "Solid Nero Marquina marble with brushed brass rests",
    construction: "Weighted circular form with polished inner basin and four integrated rests",
    finish: "Natural veining, polished rim, and warm brass hardware detail",
    summary: "A weighted Nero Marquina ashtray with precise brass rests and a permanent, sculptural presence.",
    description: "The Marble & Brass Ashtray is a small object built around material honesty: stone, metal, weight, and the calm ritual of use.",
  }),
  createConceptProduct({
    slug: "cashmere-throw-noir",
    name: "Cashmere Throw",
    color: "Noir",
    category: "Home Accessories",
    department: "home",
    subcategory: "textiles",
    image: "/assets/concepts/generated/home/cashmere-throw-noir.png",
    reference: "/assets/concepts/references/cashmere-throw-noir-board.png",
    material: "100% cashmere target with a soft, warm hand",
    construction: "Double-faced woven throw with hand-finished fringe",
    finish: "Onyx surface with subtle ARYO leather label and generous natural drape",
    summary: "An onyx cashmere throw with hand-finished fringe, designed to bring quiet warmth into the room.",
    description: "The Noir Cashmere Throw is a study in softness and form, designed to sit across a chair or bed as an object with its own visual weight.",
  }),
  createConceptProduct({
    slug: "sculptural-marble-candle",
    name: "Sculptural Marble Candle",
    color: "Nero Marquina",
    category: "Home Accessories",
    department: "home",
    subcategory: "fragrance",
    image: "/assets/concepts/generated/home/sculptural-marble-candle.png",
    reference: "/assets/concepts/references/sculptural-candle-board.png",
    material: "Dark marble vessel with natural soy wax and premium fragrance oil target",
    construction: "Weighted cylindrical vessel with two-wick format and fitted brass lid",
    finish: "Polished dark marble, brushed brass lid, and restrained ARYO marking",
    summary: "A permanent dark-marble candle vessel with a two-wick flame and a warm brass lid.",
    description: "The Sculptural Marble Candle is conceived as a fragrance object that remains useful after the final burn, with the vessel carrying the lasting presence.",
  }),
  createConceptProduct({
    slug: "marble-leather-coaster-set",
    name: "Marble & Leather Coaster Set",
    color: "Nero / Espresso",
    category: "Home Accessories",
    department: "home",
    subcategory: "tabletop",
    image: "/assets/concepts/generated/home/marble-leather-coasters.png",
    reference: "/assets/concepts/references/marble-leather-coasters-board.png",
    material: "Solid marble, full-grain leather holder, and cork base target",
    construction: "Set of four stacked stone coasters with a structured leather sleeve",
    finish: "Black stone with fine brass edge detail and debossed ARYO holder",
    summary: "A set of four marble coasters held in a full-grain leather sleeve with quiet brass detailing.",
    description: "The Marble & Leather Coaster Set brings the ARYO material language to a smaller daily ritual: stone, leather, and a sense of order on the table.",
  }),
  createConceptProduct({
    slug: "marble-brass-bookends",
    name: "Sculptural Marble Bookends",
    color: "Nero Marquina",
    category: "Home Accessories",
    department: "home",
    subcategory: "small-objects",
    image: "/assets/concepts/generated/home/marble-brass-bookends.png",
    reference: "/assets/concepts/references/marble-brass-bookends-board.png",
    material: "Solid Nero Marquina marble with brass inlay target",
    construction: "Matched architectural pair with felt base protection and substantial weight",
    finish: "Polished stone faces, honed edges, and a narrow brass line through the form",
    summary: "Architectural marble bookends with a brass inlay, designed to give a shelf a quiet sense of structure.",
    description: "The Sculptural Marble Bookends are functional architecture in miniature: heavy, balanced, and deliberately simple enough to live beside a collection of books.",
  }),
  createConceptProduct({
    slug: "cashmere-throw-ivory",
    name: "Cashmere Throw",
    color: "Ivory",
    category: "Home Accessories",
    department: "home",
    subcategory: "textiles",
    image: "/assets/concepts/generated/home/cashmere-throw-ivory.png",
    reference: "/assets/concepts/references/cashmere-throw-ivory-board.png",
    material: "100% cashmere target with a soft, warm hand",
    construction: "Double-faced woven throw with hand-finished fringe",
    finish: "Warm ivory surface with subtle ARYO embroidery and generous natural drape",
    summary: "An ivory cashmere throw with hand-finished fringe, bringing a lighter expression to the ARYO home edit.",
    description: "The Ivory Cashmere Throw is the brighter counterpart to Noir: warm, tactile, and intended to soften the room without becoming decorative noise.",
  }),
];

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
      { src: "/assets/beanies/nur-signature-noir/skully-rear-three-quarter.png", alt: "Nūr Signature Beanie in Noir, skully rear three-quarter view", fit: "contain" },
      { src: "/assets/beanies/nur-signature-noir/skully-macro-signature-af.png", alt: "Nūr Signature Beanie in Noir, warm-bone signature AF and rib detail", fit: "contain" },
      { src: "/assets/beanies/nur-signature-noir/skully-inside-construction.png", alt: "Nūr Signature Beanie in Noir, skully inside construction detail", fit: "contain" },
    ],
    editorialImage: { src: "/assets/beanies/nur-signature-noir/editorial-approved-model.png", alt: "Nūr Signature Beanie in Noir, ARYO editorial campaign image" },
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
      { src: "/assets/beanies/nur-signature-bone/skully-rear-three-quarter.png", alt: "Nūr Signature Beanie in Bone, skully rear three-quarter view", fit: "contain" },
      { src: "/assets/beanies/nur-signature-bone/skully-macro-signature-af.png", alt: "Nūr Signature Beanie in Bone, tonal almond-bone signature AF and rib detail", fit: "contain" },
      { src: "/assets/beanies/nur-signature-bone/skully-inside-construction.png", alt: "Nūr Signature Beanie in Bone, skully inside construction detail", fit: "contain" },
    ],
    editorialImage: { src: "/assets/beanies/nur-signature-bone/editorial-approved-model.png", alt: "Nūr Signature Beanie in Bone, ARYO editorial campaign image" },
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
    ],
    editorialImage: { src: "/assets/beanies/gozar-aryo-noir/editorial-approved-model.png", alt: "Gozar ARYO Beanie in Noir, ARYO editorial campaign image" },
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
  ...conceptProducts,
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
