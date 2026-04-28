import { formatPrice } from "./format";
import {
  getProduct,
  getSelectedVariant,
  sizeRun,
  type Product,
  type ProductVariant,
  type Size,
} from "./products";

export type CheckoutRequestItem = {
  slug: string;
  size: string;
  quantity: number;
};

export type ValidatedCheckoutItem = {
  slug: string;
  size: Size;
  quantity: number;
  product: Product;
  variant: ProductVariant;
  lineTotal: number;
};

export type CheckoutValidationResult = {
  items: ValidatedCheckoutItem[];
  total: number;
  errors: string[];
};

const isSize = (value: string): value is Size =>
  sizeRun.some((size) => size === value);

export const validateCheckoutItems = (
  requestItems: CheckoutRequestItem[]
): CheckoutValidationResult => {
  const groupedItems = new Map<string, CheckoutRequestItem>();

  for (const requestItem of requestItems) {
    const key = `${requestItem.slug}::${requestItem.size}`;
    const previous = groupedItems.get(key);

    if (!previous) {
      groupedItems.set(key, requestItem);
      continue;
    }

    groupedItems.set(key, {
      ...previous,
      quantity: previous.quantity + requestItem.quantity,
    });
  }

  const items: ValidatedCheckoutItem[] = [];
  const errors: string[] = [];

  for (const requestItem of groupedItems.values()) {
    const product = getProduct(requestItem.slug);
    if (!product) {
      errors.push("One of the selected pieces is no longer available.");
      continue;
    }

    if (product.launchState !== "live") {
      errors.push(`${product.name} / ${product.color} is not marked live yet.`);
      continue;
    }

    if (!isSize(requestItem.size)) {
      errors.push(`The selected size for ${product.name} / ${product.color} is not valid.`);
      continue;
    }

    const variant = getSelectedVariant(product, requestItem.size);
    if (!variant) {
      errors.push(`The selected size for ${product.name} / ${product.color} is unavailable.`);
      continue;
    }

    const quantity = Number.isInteger(requestItem.quantity) ? requestItem.quantity : 0;
    if (quantity <= 0) {
      errors.push(`${product.name} / ${product.color} needs a valid quantity.`);
      continue;
    }

    if (typeof variant.stock === "number") {
      if (variant.stock <= 0) {
        errors.push(`${product.name} / ${product.color} in size ${variant.size} is sold out.`);
        continue;
      }

      if (quantity > variant.stock) {
        errors.push(
          `${product.name} / ${product.color} in size ${variant.size} only has ${variant.stock} piece${
            variant.stock === 1 ? "" : "s"
          } available.`
        );
        continue;
      }
    }

    items.push({
      slug: requestItem.slug,
      size: requestItem.size,
      quantity,
      product,
      variant,
      lineTotal: product.price * quantity,
    });
  }

  return {
    items,
    total: items.reduce((sum, item) => sum + item.lineTotal, 0),
    errors,
  };
};

export const buildPrototypeCheckoutMessage = (result: CheckoutValidationResult) => {
  if (!result.items.length) {
    return "No valid items were passed into checkout.";
  }

  const leadItem = result.items[0];
  if (result.items.length === 1) {
    return `${leadItem.product.name} / ${leadItem.product.color} is ready to move into live checkout at ${formatPrice(
      result.total
    )}.`;
  }

  return `${result.items.length} live line items are ready to move into live checkout at ${formatPrice(
    result.total
  )}.`;
};
