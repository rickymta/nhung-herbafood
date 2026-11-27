"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, Phone, Search, ShoppingCart, X, Siren } from "lucide-react";
import { NAV } from "@/lib/store/content";
import { useCart } from "./cart";

export function Header({ hotline, zaloUrl }: { hotline: string; zaloUrl: string }) {
  const router = useRouter();
  const { count } = useCart();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const tel = hotline.replace(/\s/g, "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    router.push(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
      {/* utility bar */}
      <div className="hidden bg-slate-900 text-[12px] font-semibold text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-5">
            <a href={`tel:${tel}`} className="flex items-center gap-1.5 hover:text-orange-300"><Phone className="h-3.5 w-3.5" />Tư vấn ngay: {hotline}</a>
            <a href="tel:115" className="flex items-center gap-1.5 text-orange-300 hover:text-orange-200"><Siren className="h-3.5 w-3.5" />Cấp cứu Đột quỵ: 115</a>
          </div>
          <div className="flex items-center gap-5">
            <a href={zaloUrl} target="_blank" rel="noreferrer" className="hover:text-orange-300">Đăng nhập Zalo</a>
            <Link href="/download-app" className="hover:text-orange-300">Tải ứng dụng</Link>
          </div>
        </div>
      </div>

      {/* main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
        <button className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 xl:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://tn-stroke-guard.vercel.app/assets/logo-tn-orange.png" alt="TN Stroke Guard" className="h-10 w-10 object-contain md:h-11 md:w-11" />
          <div className="leading-tight">
            <div className="text-[15px] font-black tracking-tight text-orange-600 md:text-lg">TN STROKE GUARD</div>
            <div className="hidden text-[10px] font-bold tracking-[0.18em] text-slate-400 sm:block">FRAMINGHAM · AHA LE8</div>
          </div>
        </Link>

        <form onSubmit={submit} className="relative hidden flex-1 md:block">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tầm soát đột quỵ miễn phí, dấu hiệu B.E.F.A.S.T, Nattokinase..."
            className="h-11 w-full rounded-full border-2 border-orange-100 bg-orange-50/60 pl-5 pr-28 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white"
          />
          <button className="absolute right-1 top-1 flex h-9 items-center gap-1.5 rounded-full bg-orange-600 px-5 text-sm font-bold text-white hover:bg-orange-700">
            <Search className="h-4 w-4" />Tìm
          </button>
        </form>
        <div className="flex-1 md:hidden" />

        <Link href="/results" className="hidden text-xs font-bold text-slate-600 hover:text-orange-600 xl:block">Kết quả tầm soát</Link>
        <Link href="/cart" className="relative flex items-center gap-2 rounded-full bg-orange-50 px-3.5 py-2.5 text-sm font-bold text-orange-700 hover:bg-orange-100" aria-label="Giỏ hàng">
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden sm:inline">Giỏ hàng</span>
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-black text-white" data-testid="cart-count">{count}</span>
        </Link>
      </div>

      {/* mobile search */}
      <form onSubmit={submit} className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm thuốc, gói khám, bài viết..." className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-orange-500" />
        </div>
      </form>

      {/* mega nav (desktop) */}
      <nav className="hidden border-t border-slate-100 xl:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          {NAV.map((item) => (
            <li key={item.label} className="group relative">
              <Link href={item.href} className="flex items-center gap-1 whitespace-nowrap px-3.5 py-3 text-[13.5px] font-bold text-slate-700 transition hover:text-orange-600">
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 rounded-2xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link key={c.label} href={c.href} className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600">{c.label}</Link>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li className="ml-auto">
            <Link href="/cart" className="flex items-center gap-1.5 px-3 py-3 text-[13.5px] font-bold text-orange-600">
              <ShoppingCart className="h-4 w-4" />Giỏ hàng
              <span className="rounded-full bg-orange-600 px-1.5 text-[11px] text-white">{count}</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* mobile drawer */}
      {open && (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-slate-100 bg-white px-4 py-3 xl:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-slate-50 py-1.5">
              <Link href={item.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-extrabold text-slate-800">{item.label}</Link>
              {item.children?.map((c) => (
                <Link key={c.label} href={c.href} onClick={() => setOpen(false)} className="block py-1.5 pl-4 text-sm font-medium text-slate-500">{c.label}</Link>
              ))}
            </div>
          ))}
          <div className="flex gap-3 py-3 text-sm font-bold">
            <a href={`tel:${tel}`} className="flex-1 rounded-xl bg-orange-600 py-2.5 text-center text-white">Gọi {hotline}</a>
            <a href="tel:115" className="flex-1 rounded-xl bg-red-600 py-2.5 text-center text-white">Cấp cứu 115</a>
          </div>
        </nav>
      )}
    </header>
  );
}
