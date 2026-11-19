import { createContext } from "react";
import type { Product } from "../data/products";

export const MAX_QTY = 10;

export interface CartLine {
  key: string;
  product: Product;
  color: string;
  size: string;
  qty: number;
}

export interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotalGhs: number;
  subtotalEur: number;
  addItem: (productId: string, color: string, size: string) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  notify: (message: string) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

// One cart row per product + color + size
export const cartKey = (productId: string, color: string, size: string) =>
  `${productId}|${color}|${size}`;

// e.g. "Navy · Size M" or "Navy · One size"
export const variantText = (l: Pick<CartLine, "color" | "size">) =>
  `${l.color} · ${l.size === "One size" ? "One size" : `Size ${l.size}`}`;