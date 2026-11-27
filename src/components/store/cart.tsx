"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { CartLine, Product } from "@/lib/store/types";

type Toast = { id: number; message: string };

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (p: Product, variantLabel: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toast: (message: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "tn_cart_v1";

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const add = useCallback(
    (p: Product, variantLabel: string, qty = 1) => {
      const v = p.variants.find((x) => x.label === variantLabel) ?? p.variants[0];
      const key = `${p.id}::${v.label}`;
      setLines((prev) => {
        const found = prev.find((l) => l.key === key);
        if (found) return prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(l.quantity + qty, 99) } : l));
        return [
          ...prev,
          {
            key, productId: p.id, slug: p.slug, name: p.name, image: p.image, variant: v.label, unit: p.unit,
            price: v.price, originalPrice: p.originalPrice && p.originalPrice > v.price ? p.originalPrice : null,
            quantity: qty, category: p.category,
          },
        ];
      });
      toast(`Đã thêm vào giỏ hàng: ${p.name.length > 48 ? p.name.slice(0, 48) + "…" : p.name}`);
    },
    [toast],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, Math.min(99, qty)) } : l)));
  }, []);
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      lines, ready, add, setQty, remove, clear, toast,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.price * l.quantity, 0),
    }),
    [lines, ready, add, setQty, remove, clear, toast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[70] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
        {toasts.map((t) => (
          <div key={t.id} className="toast-in pointer-events-auto flex items-start gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <span className="flex-1">{t.message}</span>
            <button aria-label="Đóng" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>
              <X className="h-4 w-4 opacity-60" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
