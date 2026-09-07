"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/catalog-schema";
import { getProductPrice } from "@/data/catalog";

type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ollits-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLines(JSON.parse(stored) as CartLine[]);
      }
    } catch {
      // Ignore malformed or unavailable browser storage.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore unavailable browser storage.
    }
  }, [lines]);

  const add = (product: Product) => {
    if (!product.available) return;

    setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  };

  const remove = (productId: string) => {
    setLines((current) =>
      current
        .map((line) =>
          line.product.id === productId
            ? { ...line, quantity: line.quantity - 1 }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const clear = () => setLines([]);

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  // Cart totals intentionally use the supplier's effective promotional price.
  const total = useMemo(
    () => lines.reduce((sum, line) => sum + getProductPrice(line.product) * line.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ lines, count, total, add, remove, clear }),
    [lines, count, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
