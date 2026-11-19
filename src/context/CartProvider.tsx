import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { PRODUCT_BY_ID } from "../data/products";
import {
  CartContext,
  MAX_QTY,
  cartKey,
  type CartContextValue,
  type CartLine,
} from "./cartContext";

interface StoredItem {
  productId: string;
  color: string;
  size: string;
  qty: number;
}

const STORAGE_KEY = "policezebra-cart";

const load = (): StoredItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is StoredItem =>
        !!i &&
        typeof i.productId === "string" &&
        typeof i.color === "string" &&
        typeof i.size === "string" &&
        Number.isFinite(i.qty) &&
        !!PRODUCT_BY_ID[i.productId]
    );
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [stored, setStored] = useState<StoredItem[]>(load);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  // Keep the cart between visits
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable: the cart still works for this visit */
    }
  }, [stored]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const addItem = useCallback(
    (productId: string, color: string, size: string) => {
      if (!PRODUCT_BY_ID[productId]) return;
      const key = cartKey(productId, color, size);
      setStored((cur) => {
        const exists = cur.some((i) => cartKey(i.productId, i.color, i.size) === key);
        if (exists) {
          return cur.map((i) =>
            cartKey(i.productId, i.color, i.size) === key
              ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) }
              : i
          );
        }
        return [...cur, { productId, color, size, qty: 1 }];
      });
      notify("Added to cart");
    },
    [notify]
  );

  const removeItem = useCallback((key: string) => {
    setStored((cur) =>
      cur.filter((i) => cartKey(i.productId, i.color, i.size) !== key)
    );
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    const next = Math.max(1, Math.min(MAX_QTY, qty));
    setStored((cur) =>
      cur.map((i) =>
        cartKey(i.productId, i.color, i.size) === key ? { ...i, qty: next } : i
      )
    );
  }, []);

  const clear = useCallback(() => setStored([]), []);

  const lines = useMemo<CartLine[]>(
    () =>
      stored.flatMap((i) => {
        const product = PRODUCT_BY_ID[i.productId];
        return product
          ? [
              {
                key: cartKey(i.productId, i.color, i.size),
                product,
                color: i.color,
                size: i.size,
                qty: i.qty,
              },
            ]
          : [];
      }),
    [stored]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotalGhs: lines.reduce((n, l) => n + l.product.ghs * l.qty, 0),
      subtotalEur: lines.reduce((n, l) => n + l.product.eur * l.qty, 0),
      addItem,
      removeItem,
      setQty,
      clear,
      notify,
    }),
    [lines, addItem, removeItem, setQty, clear, notify]
  );

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Toast */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-130 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-lg bg-(--navy) px-4 py-3.5 text-(--white) shadow-2xl"
        >
          <i className="ri-checkbox-circle-fill text-[22px]" aria-hidden="true" />
          <span className="flex-1 text-[14px] font-medium">{toast.message}</span>
          <Link
            to="/cart"
            onClick={() => setToast(null)}
            className="shrink-0 text-[12px] font-bold uppercase tracking-[0.08em] underline underline-offset-4"
          >
            View cart
          </Link>
        </div>
      )}
    </CartContext.Provider>
  );
};