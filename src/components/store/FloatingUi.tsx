"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Headphones, Phone, Smartphone } from "lucide-react";

export function FloatingButtons({ hotline, zaloUrl }: { hotline: string; zaloUrl: string }) {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3">
      <Link href="/download-app" className="hidden h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-slate-700 shadow-lg ring-1 ring-slate-200 hover:text-orange-600 md:flex">
        <Smartphone className="h-4 w-4" />Tải ứng dụng
      </Link>
      <a href={zaloUrl} target="_blank" rel="noreferrer" aria-label="Zalo" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0068FF] text-[13px] font-black text-white shadow-lg transition hover:scale-105">Zalo</a>
      <a href={`tel:${hotline.replace(/\s/g, "")}`} className="flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 pl-4 pr-5 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(234,88,12,0.45)] transition hover:scale-105">
        <span className="relative flex h-5 w-5 items-center justify-center">
          <Headphones className="h-5 w-5" />
        </span>
        <span className="hidden sm:inline">Tư vấn</span>
        <Phone className="h-4 w-4 sm:hidden" />
      </a>
    </div>
  );
}

const KEY = "tn_cookie_consent";
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  function save(v: string) {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
  }
  if (!show) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl md:bottom-5">
      <p className="text-sm font-extrabold text-slate-900">Chúng tôi tôn trọng quyền riêng tư của bạn</p>
      <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
        Website dùng cookie thiết yếu để lưu giỏ hàng và cookie phân tích để cải thiện trải nghiệm. Xem{" "}
        <Link href="/cookie-policy" className="font-bold text-orange-600 underline">Chính sách Cookie</Link>.
      </p>
      {custom && (
        <div className="mt-3 space-y-2 rounded-2xl bg-slate-50 p-3 text-[13px]">
          <label className="flex items-center gap-2 font-semibold text-slate-500"><input type="checkbox" checked disabled /> Cookie thiết yếu (luôn bật)</label>
          <label className="flex items-center gap-2 font-semibold text-slate-700"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Cookie phân tích</label>
          <button onClick={() => save(analytics ? "all" : "essential")} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">Lưu lựa chọn</button>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setCustom((v) => !v)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50">Tùy chỉnh</button>
        <button onClick={() => save("essential")} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50">Chỉ cookie thiết yếu</button>
        <button onClick={() => save("all")} className="rounded-xl bg-orange-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:bg-orange-700">Chấp nhận tất cả</button>
      </div>
    </div>
  );
}
