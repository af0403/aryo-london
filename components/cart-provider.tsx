"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProduct, getSelectedVariant, type Size } from "../lib/products";

type CartItem = {
  slug: string;
  size: Size;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  isOpen: boolean;
  addItem: (payload: { slug: string; size: Size }) => void;
  removeItem: (payload: { slug: string; size: Size }) => void;
  clearCart: () => void;
  setQuantity: (payload: {
    slug: string;
    size: Size;
    quantity: number;
  }) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aryo-launch-cart";
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const stored: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(stored))
        setItems(
          stored.filter((item): item is CartItem => {
            if (
              !item ||
              typeof item.slug !== "string" ||
              !Number.isInteger(item.quantity) ||
              item.quantity < 1 ||
              item.quantity > 99
            )
              return false;
            const product = getProduct(item.slug);
            return Boolean(
              product &&
                !product.hidden &&
                getSelectedVariant(product, item.size),
            );
          }),
        );
    } catch {
      /* The bag remains usable when browser storage is unavailable. */
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Keep the current in-memory bag. */
    }
  }, [items, hydrated]);

  // ── Cart mutations ───────────────────────────────────────────────────────
  const addItem = ({ slug, size }: { slug: string; size: Size }) => {
    setItems((current) => {
      const product = getProduct(slug);
      if (
        !product ||
        product.hidden ||
        product.launchState !== "live" ||
        product.price === null
      )
        return current;

      const variant = getSelectedVariant(product, size);
      if (!variant) return current;
      if (typeof variant.stock === "number" && variant.stock <= 0)
        return current;

      const existing = current.findIndex(
        (item) => item.slug === slug && item.size === size,
      );
      if (existing === -1) {
        const next = [...current, { slug, size, quantity: 1 }];
        return next;
      }

      const next = [...current];
      const proposedQuantity = next[existing].quantity + 1;
      const safeQuantity =
        typeof variant.stock === "number"
          ? Math.min(proposedQuantity, variant.stock)
          : proposedQuantity;
      next[existing] = { ...next[existing], quantity: safeQuantity };
      return next;
    });

    setIsOpen(true);
  };

  const removeItem = ({ slug, size }: { slug: string; size: Size }) => {
    setItems((current) =>
      current.filter((item) => !(item.slug === slug && item.size === size)),
    );
  };

  const setQuantity = ({
    slug,
    size,
    quantity,
  }: {
    slug: string;
    size: Size;
    quantity: number;
  }) => {
    const product = getProduct(slug);
    if (!product || !Number.isFinite(quantity)) return;
    const variant = getSelectedVariant(product, size);
    if (!variant) return;
    const nextQuantity = Math.max(
      0,
      Math.min(
        Math.floor(quantity),
        typeof variant.stock === "number" ? variant.stock : 99,
      ),
    );
    setItems((current) =>
      nextQuantity === 0
        ? current.filter((item) => !(item.slug === slug && item.size === size))
        : current.map((item) =>
            item.slug === slug && item.size === size
              ? { ...item, quantity: nextQuantity }
              : item,
          ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isOpen,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
