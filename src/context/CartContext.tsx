"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;          // printify product id
  slugEs: string;
  slugEn: string;
  nameEs: string;
  nameEn: string;
  price: number;       // cents
  type: string;
  qty: number;
  colorId: string;
  colorEs: string;
  colorEn: string;
  size: string;
  image: string;
  variantId: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "gzs-cart-v1";

export const cartKey = (i: Pick<CartItem, "id" | "colorId" | "size">) => `${i.id}|${i.colorId}|${i.size}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    /* La cesta vive en localStorage y solo puede leerse en el cliente: leerla
       antes provocaría un desajuste de hidratación. */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  const value = useMemo<CartCtx>(() => ({
    items,
    ready,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
    add(item) {
      setItems((prev) => {
        const k = cartKey(item);
        const existing = prev.find((p) => cartKey(p) === k);
        if (existing) {
          return prev.map((p) => (cartKey(p) === k ? { ...p, qty: Math.min(10, p.qty + item.qty) } : p));
        }
        return [...prev, item];
      });
      setDrawerOpen(true);
    },
    remove(key) {
      setItems((prev) => prev.filter((p) => cartKey(p) !== key));
    },
    setQty(key, qty) {
      setItems((prev) =>
        qty <= 0
          ? prev.filter((p) => cartKey(p) !== key)
          : prev.map((p) => (cartKey(p) === key ? { ...p, qty: Math.min(10, qty) } : p)),
      );
    },
    clear: () => setItems([]),
  }), [items, ready, drawerOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
