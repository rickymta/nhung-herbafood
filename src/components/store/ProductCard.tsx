"use client";

import Link from "next/link";
import { useState } from "react";
import { Gift, ShoppingCart } from "lucide-react";
import { vnd, discountPercent } from "@/lib/format";
import { COUNTRY_FLAG, type Product } from "@/lib/store/types";
import { useCart } from "./cart";

export function ProductCard({ p, flash }: { p: Product; flash?: boolean }) {
  const { add } = useCart();
  const [vi, setVi] = useState(0);
  const v = p.variants[vi] ?? p.variants[0];
  const price = v.price;
  const pct = discountPercent(price, p.originalPrice);
  const href = `/products/${p.slug}`;
  const soldPct = p.flashLimit ? Math.min(100, Math.round((p.flashSold / p.flashLimit) * 100)) : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-[0_2px_14px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
      <Link href={href} className="relative block aspect-square overflow-hidden rounded-2xl bg-[#F6F7FA]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105" />
        {pct > 0 && <span className="absolute left-2 top-2 rounded-lg bg-red-600 px-2 py-0.5 text-[11px] font-black text-white">-{pct}%</span>}
        {p.hasGift && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-extrabold text-white"><Gift className="h-3 w-3" />Quà tặng</span>
        )}
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
          <span>{COUNTRY_FLAG[p.origin] ?? "🌐"}</span>
          <span>{p.origin}</span>
          {p.brand && <span className="ml-auto truncate text-orange-600">{p.brand}</span>}
        </div>
        <Link href={href} className="mt-1 line-clamp-2 min-h-[2.6rem] text-[13.5px] font-bold leading-snug text-slate-900 hover:text-orange-600">{p.name}</Link>
        <div className="mt-1 text-[11.5px] font-medium text-slate-500">{p.unit} · {v.label === p.unit ? p.packSize : p.variants.length > 1 ? v.label : p.packSize || v.label}</div>

        {p.variants.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.variants.map((x, i) => (
              <button key={x.label} onClick={() => setVi(i)} className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${i === vi ? "border-orange-600 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-500 hover:border-orange-300"}`}>{x.label}</button>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-orange-600">{vnd(price)}</span>
            {p.originalPrice && p.originalPrice > price && <span className="text-xs font-semibold text-slate-400 line-through">{vnd(p.originalPrice)}</span>}
          </div>
          {flash && p.flashLimit > 0 && (
            <div className="mt-2">
              <div className="h-4 overflow-hidden rounded-full bg-orange-100">
                <div className="flex h-full items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 text-[10px] font-black text-white" style={{ width: `${Math.max(soldPct, 28)}%` }}>Đã bán {p.flashSold}</div>
              </div>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <Link href={href} className="flex-1 rounded-2xl bg-orange-600 py-2.5 text-center text-[13px] font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] transition hover:bg-orange-700">Chọn mua</Link>
            <button aria-label="Thêm vào giỏ" onClick={() => add(p, v.label)} className="flex w-11 items-center justify-center rounded-2xl bg-[#FFF5EB] text-orange-600 transition hover:bg-orange-100"><ShoppingCart className="h-[18px] w-[18px]" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
