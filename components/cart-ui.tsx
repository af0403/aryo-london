"use client";
import { Drawer } from "./storefront/drawer";

import { useCallback } from "react";
import Link from "next/link";

import { formatPrice } from "../lib/format";
import { getProduct } from "../lib/products";
import { useCart } from "./cart-provider";
import { BagIcon } from "./site-icons";

export const CartUI = () => {
  const {
    items,
    itemCount,
    isOpen,
    openCart,
    closeCart,
    removeItem,
    setQuantity,
  } = useCart();
  const close = useCallback(() => closeCart(), [closeCart]);
  const lineItems = items.flatMap((item) => {
    const product = getProduct(item.slug);
    return product && !product.hidden && product.price !== null
      ? [
          {
            ...item,
            product,
            price: product.price,
            lineTotal: product.price * item.quantity,
          },
        ]
      : [];
  });
  const total = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  return (
    <>
      <button
        className="store-icon"
        onClick={openCart}
        aria-label={`Open shopping bag${itemCount ? ` (${itemCount})` : ""}`}
      >
        <BagIcon />
        {itemCount ? <sup>{itemCount}</sup> : null}
      </button>
      <Drawer
        open={isOpen}
        close={close}
        title="Shopping bag"
        className="store-bag-drawer"
        footer={
          lineItems.length ? (
            <>
              <div className="store-bag-total">
                <span>Subtotal</span>
                <span>{formatPrice(total)} GBP</span>
              </div>
              <p>
                Complimentary worldwide shipping. International duties may apply.
              </p>
              <Link className="store-button" href="/checkout" onClick={close}>
                Checkout
              </Link>
              <button className="store-reset" onClick={close}>
                Continue shopping
              </button>
            </>
          ) : undefined
        }
      >
        {lineItems.length ? (
          <div className="store-bag-items">
            {lineItems.map((item) => (
              <article
                className="store-bag-item"
                key={`${item.slug}-${item.size}`}
              >
                <Link href={`/products/${item.slug}`} onClick={close}>
                  <img
                    src={item.product.cardImage}
                    alt={`${item.product.name} in ${item.product.color}`}
                  />
                </Link>
                <div>
                  <Link href={`/products/${item.slug}`} onClick={close}>
                    <h3>{item.product.name}</h3>
                  </Link>
                  <p>{formatPrice(item.price)} GBP</p>
                  <p>Colour: {item.product.color}</p>
                  <p>Size: {item.size}</p>
                  <div className="store-quantity">
                    <button
                      aria-label={`Decrease ${item.product.name} quantity`}
                      onClick={() =>
                        setQuantity({ ...item, quantity: item.quantity - 1 })
                      }
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.product.name} quantity`}
                      onClick={() =>
                        setQuantity({ ...item, quantity: item.quantity + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="store-text-button"
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                  {item.product.fulfillment === "made-to-order" ? (
                    <small>Made to order</small>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="store-empty">
            <p>Your shopping bag is empty.</p>
            <Link
              className="store-button"
              href="/collections/men"
              onClick={close}
            >
              Continue shopping
            </Link>
          </div>
        )}
      </Drawer>
    </>
  );
};
