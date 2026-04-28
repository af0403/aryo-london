"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { formatPrice } from "../lib/format";
import { getProduct, type Size } from "../lib/products";
import { useCart } from "./cart-provider";
import { BagIcon, CloseIcon } from "./site-icons";

type LineItem = {
  slug: string;
  size: Size;
  quantity: number;
  product: NonNullable<ReturnType<typeof getProduct>>;
  lineTotal: number;
};

export const CartUI = () => {
  const { items, itemCount, isOpen, openCart, closeCart, removeItem, clearCart } = useCart();
  const [checkoutMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const lineItems = useMemo(() => {
    return items
      .map((item): LineItem | null => {
        const product = getProduct(item.slug);
        if (!product) return null;
        return { ...item, product, lineTotal: product.price * item.quantity };
      })
      .filter((item): item is LineItem => item !== null);
  }, [items]);

  const total = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const cartPanel = (
    <div className={`cart-shell ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <button className="cart-overlay" type="button" aria-label="Close cart" onClick={closeCart} />
      <aside className="cart-panel" aria-label="Shopping cart">
        <div className="cart-head">
          <div>
            <p className="eyebrow">Shopping bag</p>
            <h2>Pennicella</h2>
          </div>
          <button className="icon-button" type="button" onClick={closeCart} aria-label="Close shopping bag">
            <CloseIcon className="site-icon" />
          </button>
        </div>
        <div className="cart-body">
          {lineItems.length ? (
            lineItems.map((item) => (
              <article className="cart-item" key={`${item.slug}-${item.size}`}>
                <img src={item.product.cardImage} alt={item.product.name} />
                <div className="cart-item-copy">
                  <strong className="cart-item-title">
                    {item.product.name} / {item.product.color}
                  </strong>
                  <span>{formatPrice(item.product.price)}</span>
                  <span>Size {item.size} / Qty {item.quantity}</span>
                </div>
                <button
                  className="cart-remove"
                  type="button"
                  onClick={() => removeItem({ slug: item.slug, size: item.size })}
                >
                  Remove
                </button>
              </article>
            ))
          ) : (
            <div className="cart-empty">
              <p>Your shopping bag is empty.</p>
              <p>Select a Pennicella piece to begin the launch edit.</p>
            </div>
          )}
        </div>
        <div className="cart-foot">
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <Link
            className="checkout-button"
            href="/checkout"
            onClick={closeCart}
            aria-disabled={!lineItems.length}
            style={!lineItems.length ? { pointerEvents: "none", opacity: 0.45 } : undefined}
          >
            Proceed to checkout
          </Link>
          <button className="cart-clear" type="button" onClick={clearCart} disabled={!lineItems.length}>
            Clear bag
          </button>
          {checkoutMessage ? <p className="cart-message">{checkoutMessage}</p> : null}
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button className="cart-icon-button" type="button" onClick={openCart} aria-label="Open shopping bag">
        <BagIcon className="site-icon" />
        {itemCount > 0 ? <span>{itemCount}</span> : null}
      </button>
      {mounted ? createPortal(cartPanel, document.body) : null}
    </>
  );
};
