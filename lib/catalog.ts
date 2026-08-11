import {
  products,
  type CatalogDepartment,
  type CatalogSubcategory,
  type Product,
} from "./products";

export type DepartmentKey = Exclude<CatalogDepartment, "unisex">;

export type CatalogCategory = {
  slug: CatalogSubcategory;
  label: string;
  description: string;
};

export type DepartmentNavigation = {
  slug: DepartmentKey;
  label: string;
  eyebrow: string;
  description: string;
  categories: readonly CatalogCategory[];
};

const wardrobeCategories: readonly CatalogCategory[] = [
  {
    slug: "ready-to-wear",
    label: "Ready-to-wear",
    description: "Jackets, trousers, and the developing ARYO wardrobe.",
  },
  {
    slug: "headwear",
    label: "Headwear",
    description: "Beanies, caps, and seasonal forms.",
  },
  {
    slug: "scarves",
    label: "Scarves & wraps",
    description: "Silk, cashmere, and considered wraps.",
  },
  {
    slug: "gloves",
    label: "Gloves",
    description: "Tactile leather and winter accessories.",
  },
  {
    slug: "eyewear",
    label: "Eyewear",
    description: "Sculpted frames and everyday optical objects.",
  },
];

export const departmentNavigation: readonly DepartmentNavigation[] = [
  {
    slug: "women",
    label: "Women",
    eyebrow: "The wardrobe / Women",
    description:
      "A future ARYO wardrobe in development, considered through proportion, material, and movement.",
    categories: wardrobeCategories,
  },
  {
    slug: "men",
    label: "Men",
    eyebrow: "The wardrobe / Men",
    description:
      "Pennicella, headwear, and material-led accessories for the everyday.",
    categories: wardrobeCategories,
  },
  {
    slug: "home",
    label: "Home",
    eyebrow: "The house / Home",
    description:
      "Tabletop, textiles, fragrance, and sculptural objects with presence.",
    categories: [
      {
        slug: "tabletop",
        label: "Tabletop",
        description: "Objects for considered rituals and everyday use.",
      },
      {
        slug: "textiles",
        label: "Textiles",
        description: "Soft objects, woven surfaces, and quiet warmth.",
      },
      {
        slug: "fragrance",
        label: "Fragrance",
        description: "Atmospheric objects for the ARYO home.",
      },
      {
        slug: "small-objects",
        label: "Small objects",
        description: "Sculptural details for the spaces around you.",
      },
    ],
  },
] as const satisfies readonly DepartmentNavigation[];

export const getDepartmentNavigation = (department: string) =>
  departmentNavigation.find((entry) => entry.slug === department);

export const getCategoryNavigation = (
  department: DepartmentKey,
  subcategory: string,
) =>
  getDepartmentNavigation(department)?.categories.find(
    (entry) => entry.slug === subcategory,
  );

export const categoryHref = (
  department: DepartmentKey,
  subcategory: CatalogSubcategory,
) => `/collections/${department}/${subcategory}`;

export const getProductDepartment = (product: Product): CatalogDepartment =>
  product.department ?? "unisex";

export const getProductSubcategory = (product: Product): CatalogSubcategory => {
  if (product.subcategory) return product.subcategory;
  if (product.slug.includes("jacket") || product.slug.includes("trouser")) {
    return "ready-to-wear";
  }
  if (product.slug.includes("beanie")) return "headwear";
  return "ready-to-wear";
};

const visibleProducts = products.filter((product) => !product.hidden);

export const productsForDepartment = (department: DepartmentKey) =>
  visibleProducts.filter((product) => {
    const productDepartment = getProductDepartment(product);
    if (department === "home") return productDepartment === "home";
    if (department === "women") return productDepartment === "women";
    return productDepartment === "men" || productDepartment === "unisex";
  });

export const productsForCategory = (
  department: DepartmentKey,
  subcategory: CatalogSubcategory,
) =>
  productsForDepartment(department).filter(
    (product) => getProductSubcategory(product) === subcategory,
  );
