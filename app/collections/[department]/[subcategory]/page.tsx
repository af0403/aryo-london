import { StoreCatalog } from "../../../../components/storefront/catalog";
import { notFound } from "next/navigation";
import {
  categoryHref,
  departmentNavigation,
  getCategoryNavigation,
  getDepartmentNavigation,
  productsForCategory,
  type DepartmentKey,
} from "../../../../lib/catalog";
import { createPageMetadata } from "../../../../lib/seo";

export function generateStaticParams() {
  return departmentNavigation.flatMap((department) =>
    department.categories.map((category) => ({
      department: department.slug,
      subcategory: category.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string; subcategory: string }>;
}) {
  const { department, subcategory } = await params;
  const departmentConfig = getDepartmentNavigation(department);
  const category = departmentConfig
    ? getCategoryNavigation(departmentConfig.slug, subcategory)
    : undefined;
  if (!departmentConfig || !category) return {};

  return createPageMetadata({
    title: `${category.label} / ${departmentConfig.label}`,
    description: category.description,
    path: `/collections/${department}/${subcategory}`,
    image: "/assets/generated/aryo-drop01-products.png",
    imageAlt: `ARYO ${departmentConfig.label.toLowerCase()} ${category.label.toLowerCase()}`,
  });
}

export default async function CategoryCollectionsPage({
  params,
}: {
  params: Promise<{ department: string; subcategory: string }>;
}) {
  const { department, subcategory } = await params;
  const departmentConfig = getDepartmentNavigation(department);
  if (!departmentConfig) notFound();

  const category = getCategoryNavigation(departmentConfig.slug, subcategory);
  if (!category) notFound();

  const key = departmentConfig.slug as DepartmentKey;
  const categoryProducts = productsForCategory(key, category.slug);

  return (
    <StoreCatalog
      title={category.label}
      products={categoryProducts}
      description={category.description}
      categories={[
        { label: "View all", href: `/collections/${key}` },
        ...departmentConfig.categories.map((c) => ({
          label: c.label,
          href: categoryHref(key, c.slug),
          active: c.slug === category.slug,
        })),
      ]}
    />
  );
}
