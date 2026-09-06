'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/data/products';

type CartLine = { product: Product; quantity: number };
type CartContextValue = { lines: CartLine[]; count: number; total: number; add: (product: Product) => void; remove: (id: string) => void };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => { const saved = localStorage.getItem('ollits-cart'); if (saved) setLines(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem('ollits-cart', JSON.stringify(lines)); }, [lines]);
  const value = useMemo(() => ({ lines, count: lines.reduce((n, l) => n + l.quantity, 0), total: lines.reduce((n, l) => n + l.product.price * l.quantity, 0), add: (product: Product) => setLines((current) => current.some((l) => l.product.id === product.id) ? current.map((l) => l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l) : [...current, { product, quantity: 1 }]), remove: (id: string) => setLines((current) => current.filter((l) => l.product.id !== id)) }), [lines]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used inside CartProvider'); return context; }
