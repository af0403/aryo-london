import { StoreCatalog } from "../../../components/storefront/catalog";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  categoryHref,
  departmentNavigation,
  getDepartmentNavigation,
  getProductSubcategory,
  productsForDepartment,
  type DepartmentKey,
} from "../../../lib/catalog";
import { formatProductPrice } from "../../../lib/format";
import { getProductStatusLabel, type Product } from "../../../lib/products";
import { createPageMetadata } from "../../../lib/seo";

const displayPrice = (product: Product) =>
  product.price === null
    ? product.priceNote ?? "Price to be confirmed"
    : `${formatProductPrice(product.price)} GBP`;

export function generateStaticParams() {
  return departmentNavigation.map(({ slug }) => ({ department: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  const config = getDepartmentNavigation(department);
  if (!config) return {};

  return createPageMetadata({
    title: `${config.label} Collections`,
    description: config.description,
    path: `/collections/${department}`,
    image: "/assets/generated/aryo-drop01-products.png",
    imageAlt: `ARYO ${config.label.toLowerCase()} collections`,
  });
}

export default async function DepartmentCollectionsPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  const config = getDepartmentNavigation(department);
  if (!config) notFound();

  const key = config.slug as DepartmentKey;
  const departmentProducts = productsForDepartment(key);
  return <StoreCatalog title={config.label} products={departmentProducts} description={config.description} categories={[
    {label: "View all", href: `/collections/${key}`, active: true},
    ...config.categories.map(c => ({label:c.label, href:categoryHref(key,c.slug)})),
  ]} />;
}
