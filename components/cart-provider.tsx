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
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aryo-launch-cart";
const supabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // ── Local storage hydration ──────────────────────────────────────────────
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // ── Supabase cart sync (optional — silently skipped if not configured) ───
  const syncFromSupabase = useCallback(async (userId: string) => {
    if (!supabaseConfigured) return;
    try {
      const { createClient } = await import("../lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("customer_carts")
        .select("product_slug, size, quantity")
        .eq("user_id", userId);
      if (!data?.length) return;
      setItems((current) => {
        const merged = [...current];
        for (const row of data) {
          const exists = merged.findIndex(
            (i) => i.slug === row.product_slug && i.size === row.size
          );
          if (exists === -1) {
            merged.push({ slug: row.product_slug, size: row.size as Size, quantity: row.quantity });
          }
        }
        return merged;
      });
    } catch {
      // Supabase unavailable — local cart still works
    }
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let unsubscribe: (() => void) | undefined;

    import("../lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) syncFromSupabase(data.session.user.id);
      });
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          syncFromSupabase(session.user.id);
        }
        if (event === "SIGNED_OUT") {
          setItems([]);
          window.localStorage.removeItem(STORAGE_KEY);
        }
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    });

    return () => unsubscribe?.();
  }, [syncFromSupabase]);

  const persistItem = useCallback(
    async (slug: string, size: Size, quantity: number, remove = false) => {
      if (!supabaseConfigured) return;
      try {
        const { createClient } = await import("../lib/supabase/client");
        const supabase = createClient();
        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user?.id;
        if (!userId) return;

        const product = getProduct(slug);
        if (!product) return;

        if (remove) {
          await supabase
            .from("customer_carts")
            .delete()
            .eq("user_id", userId)
            .eq("product_slug", slug)
            .eq("size", size);
        } else {
          await supabase.from("customer_carts").upsert(
            {
              user_id: userId,
              product_slug: slug,
              colorway: product.color,
              size,
              quantity,
            },
            { onConflict: "user_id,product_slug,size" }
          );
        }
      } catch {
        // Non-fatal
      }
    },
    []
  );

  // ── Cart mutations ───────────────────────────────────────────────────────
  const addItem = ({ slug, size }: { slug: string; size: Size }) => {
    setItems((current) => {
      const product = getProduct(slug);
      if (!product) return current;

      const variant = getSelectedVariant(product, size);
      if (!variant) return current;
      if (typeof variant.stock === "number" && variant.stock <= 0) return current;

      const existing = current.findIndex((item) => item.slug === slug && item.size === size);
      if (existing === -1) {
        const next = [...current, { slug, size, quantity: 1 }];
        persistItem(slug, size, 1);
        return next;
      }

      const next = [...current];
      const proposedQuantity = next[existing].quantity + 1;
      const safeQuantity =
        typeof variant.stock === "number"
          ? Math.min(proposedQuantity, variant.stock)
          : proposedQuantity;
      next[existing] = { ...next[existing], quantity: safeQuantity };
      persistItem(slug, size, safeQuantity);
      return next;
    });

    setIsOpen(true);
  };

  const removeItem = ({ slug, size }: { slug: string; size: Size }) => {
    setItems((current) =>
      current.filter((item) => !(item.slug === slug && item.size === size))
    );
    persistItem(slug, size, 0, true);
  };

  const clearCart = () => {
    setItems([]);
    if (supabaseConfigured) {
      import("../lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data }) => {
          const userId = data.session?.user?.id;
          if (userId) supabase.from("customer_carts").delete().eq("user_id", userId);
        });
      });
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, itemCount, isOpen, addItem, removeItem, clearCart, openCart, closeCart }}>
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
