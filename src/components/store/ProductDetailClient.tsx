"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ShieldCheck, RotateCcw, Truck, Gift } from "lucide-react";
import { vnd, discountPercent } from "@/lib/format";
import type { Product } from "@/lib/store/types";
import { useCart } from "./cart";

export function ProductGallery({ p }: { p: Product }) {
  const imgs = p.gallery.length ? p.gallery : [p.image];
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F6F7FA]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgs[i]} alt={p.name} className="h-full w-full object-contain p-6" />
        {discountPercent(p.price, p.originalPrice) > 0 && <span className="absolute left-4 top-4 rounded-xl bg-red-600 px-3 py-1 text-sm font-black text-white">-{discountPercent(p.price, p.originalPrice)}%</span>}
      </div>
      {imgs.length > 1 && (
        <div className="mt-3 flex gap-2">
          {imgs.map((src, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <button key={idx} onClick={() => setI(idx)} className={`h-16 w-16 overflow-hidden rounded-xl bg-[#F6F7FA] ring-2 ${idx === i ? "ring-orange-600" : "ring-transparent"}`}><img src={src} alt="" className="h-full w-full object-contain p-1" /></button>
          ))}
          <span className="ml-auto self-center text-xs font-semibold text-slate-400">Xem thêm {imgs.length - 1} ảnh</span>
        </div>
      )}
      <p className="mt-3 text-[11.5px] italic text-slate-500">Mẫu mã bao bì sản phẩm có thể thay đổi theo từng lô sản xuất từ nhà máy.</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          [ShieldCheck, "100% Chính Hãng", "Kiểm định Bộ Y Tế"],
          [RotateCcw, "Đổi Trả 30 Ngày", "Nếu phát hiện lỗi"],
          [Truck, "Giao Nhanh 2H", "Nội thành các tỉnh"],
        ].map(([Icon, t, s]) => {
          const I = Icon as typeof ShieldCheck;
          return (
            <div key={t as string} className="rounded-2xl bg-orange-50 p-3 text-center">
              <I className="mx-auto h-5 w-5 text-orange-600" />
              <div className="mt-1 text-[11.5px] font-extrabold text-slate-800">{t as string}</div>
              <div className="text-[10.5px] font-medium text-slate-500">{s as string}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProductBuyBox({ p }: { p: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const v = p.variants[vi];
  const pct = discountPercent(v.price, p.originalPrice);
  const outOfStock = p.stock <= 0;
  return (
    <div>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-black text-orange-600">{vnd(v.price)}</span>
        <span className="pb-1 text-sm font-bold text-slate-500">/ {p.unit}</span>
        {p.originalPrice && p.originalPrice > v.price && <span className="pb-1 text-base font-semibold text-slate-400 line-through">{vnd(p.originalPrice)}</span>}
        {pct > 0 && <span className="mb-1 rounded-lg bg-red-600 px-2 py-0.5 text-xs font-black text-white">-{pct}%</span>}
      </div>
      <p className="mt-1 text-sm font-bold text-emerald-600">Miễn phí vận chuyển toàn quốc cho đơn từ 500.000đ</p>
      {p.hasGift && <p className="mt-2 flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-[13px] font-bold text-orange-700"><Gift className="h-4 w-4" />Tặng kèm quà sức khỏe khi mua online</p>}

      <div className="mt-5">
        <div className="text-sm font-extrabold text-slate-800">Quy cách</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {p.variants.map((x, i) => (
            <button key={x.label} onClick={() => setVi(i)} className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${i === vi ? "border-orange-600 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-600 hover:border-orange-300"}`}>{x.label}</button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-extrabold text-slate-800">Đơn vị tính</div>
        <div className="mt-2"><span className="rounded-xl border-2 border-orange-600 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">{p.unit}</span></div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-extrabold text-slate-800">Số lượng</div>
        <div className="mt-2 inline-flex items-center rounded-2xl border-2 border-slate-200">
          <button aria-label="Giảm" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-slate-600 hover:text-orange-600"><Minus className="h-4 w-4" /></button>
          <span className="w-12 text-center text-base font-black">{qty}</span>
          <button aria-label="Tăng" onClick={() => setQty((q) => Math.min(99, q + 1))} className="p-3 text-slate-600 hover:text-orange-600"><Plus className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button disabled={outOfStock} onClick={() => add(p, v.label, qty)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FFF5EB] py-3.5 text-sm font-bold text-orange-600 transition hover:bg-orange-100 disabled:opacity-50"><ShoppingCart className="h-4 w-4" />Thêm vào giỏ hàng</button>
        <button disabled={outOfStock} onClick={() => { add(p, v.label, qty); router.push("/cart"); }} className="flex-1 rounded-2xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] transition hover:bg-orange-700 disabled:opacity-50">{outOfStock ? "Tạm hết hàng" : "Chọn mua ngay"}</button>
      </div>
    </div>
  );
}

export function DetailTabs({ p }: { p: Product }) {
  const tabs = [
    { k: "desc", label: "Thông tin chuyên môn", text: p.description },
    ...(p.ingredients ? [{ k: "ing", label: "Thành phần", text: p.ingredients }] : []),
    ...(p.usage ? [{ k: "use", label: "Hướng dẫn sử dụng", text: p.usage }] : []),
  ];
  const [t, setT] = useState("desc");
  const cur = tabs.find((x) => x.k === t) ?? tabs[0];
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((x) => (
          <button key={x.k} onClick={() => setT(x.k)} className={`whitespace-nowrap border-b-[3px] px-4 py-3 text-sm font-extrabold ${x.k === cur.k ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500"}`}>{x.label}</button>
        ))}
      </div>
      <div className="mt-5 space-y-3 text-[14.5px] leading-relaxed text-slate-700">
        {cur.text.split("\n\n").map((para, i) => {
          const lines = para.split("\n");
          const bullets = lines.filter((l) => l.startsWith("- "));
          const head = lines.filter((l) => !l.startsWith("- "));
          return (
            <div key={i}>
              {head.length > 0 && <p className={bullets.length ? "mb-2 font-extrabold text-slate-900" : ""}>{head.join(" ")}</p>}
              {bullets.length > 0 && (
                <ul className="space-y-1.5">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-2"><span className="mt-1 text-emerald-500">✓</span><span>{b.slice(2)}</span></li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
