"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { vnd } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/store/types";
import { useCart } from "./cart";

export function CartView({ threshold, shipFee }: { threshold: number; shipFee: number }) {
  const { lines, count, subtotal, setQty, remove, clear, ready } = useCart();
  const shipping = subtotal >= threshold || subtotal === 0 ? 0 : shipFee;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Giỏ hàng của bạn ({count} sản phẩm)</h1>
        <Link href="/products" className="flex items-center gap-1 text-sm font-bold text-orange-600"><ArrowLeft className="h-4 w-4" />Tiếp tục chọn sản phẩm</Link>
      </div>

      {ready && lines.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500"><ShoppingBag className="h-9 w-9" /></div>
          <p className="mt-5 text-xl font-black text-slate-900">Giỏ hàng đang trống</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Khám phá các thực phẩm bảo vệ thành mạch, hoạt huyết não hoặc gói khám tầm soát đột quỵ chính hãng.</p>
          <Link href="/products" className="mt-6 inline-block rounded-2xl bg-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)]">Khám phá Nhà thuốc & Gói khám →</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {subtotal > 0 && subtotal < threshold && (
              <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">Mua thêm {vnd(threshold - subtotal)} để được Miễn phí giao hàng tận nhà.</div>
            )}
            {subtotal >= threshold && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Bạn đã được miễn phí giao hàng tận nhà.</div>}
            <div className="flex justify-end"><button onClick={clear} className="text-xs font-bold text-slate-400 hover:text-red-600">Xóa tất cả</button></div>
            {lines.map((l) => (
              <div key={l.key} className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm">
                <Link href={`/products/${l.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F6F7FA]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt="" className="h-full w-full object-contain p-2" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="w-fit rounded-md bg-orange-50 px-2 py-0.5 text-[10.5px] font-extrabold text-orange-700">{CATEGORY_LABEL[l.category] ?? "Sản phẩm"} · {l.unit}</span>
                  <Link href={`/products/${l.slug}`} className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 hover:text-orange-600">{l.name}</Link>
                  <span className="text-xs font-medium text-slate-500">{l.variant}</span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-orange-600">{vnd(l.price)}</span>
                      {l.originalPrice && <span className="text-xs text-slate-400 line-through">{vnd(l.originalPrice)}</span>}
                    </div>
                    <div className="inline-flex items-center rounded-xl border border-slate-200">
                      <button aria-label="Giảm" onClick={() => setQty(l.key, l.quantity - 1)} className="p-2 text-slate-600"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm font-black">{l.quantity}</span>
                      <button aria-label="Tăng" onClick={() => setQty(l.key, l.quantity + 1)} className="p-2 text-slate-600"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <span className="min-w-24 text-right text-sm font-black text-slate-900">{vnd(l.price * l.quantity)}</span>
                    <button onClick={() => remove(l.key)} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" />Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-3xl bg-white p-6 shadow-sm lg:self-start">
            <h2 className="text-lg font-black text-slate-900">Tóm tắt đơn hàng</h2>
            <dl className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              <div className="flex justify-between"><dt>Tạm tính ({count} sản phẩm)</dt><dd className="font-black text-slate-900">{vnd(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Phí vận chuyển dự kiến</dt><dd className="font-black text-slate-900">{shipping === 0 ? "Miễn phí" : vnd(shipping)}</dd></div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base"><dt className="font-extrabold text-slate-900">Thành tiền</dt><dd className="text-xl font-black text-orange-600">{vnd(total)}</dd></div>
            </dl>
            <Link href={lines.length ? "/checkout" : "/products"} className="mt-5 block rounded-2xl bg-orange-600 py-3.5 text-center text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] transition hover:bg-orange-700">Tiến hành đặt hàng →</Link>
            <p className="mt-4 text-[11.5px] leading-relaxed text-slate-500">Phiên giỏ hàng ẩn danh không cần tạo tài khoản. Bằng việc tiến hành đặt hàng, bạn đồng ý với <Link href="/terms" className="font-bold text-orange-600">Điều khoản</Link> và <Link href="/refund-policy" className="font-bold text-orange-600">Chính sách hoàn tiền</Link> (đổi trả 30 ngày).</p>
          </aside>
        </div>
      )}
    </div>
  );
}
