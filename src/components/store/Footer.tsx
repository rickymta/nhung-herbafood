import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/store/content";
import { Phone } from "lucide-react";

export function Footer({ hotline, hours, zaloUrl }: { hotline: string; hours: string; zaloUrl: string }) {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://tn-stroke-guard.vercel.app/assets/logo-tn-orange.png" alt="" className="h-11 w-11 rounded-xl bg-white p-1 object-contain" />
            <div>
              <div className="text-lg font-black text-white">TN STROKE GUARD</div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-orange-400">FRAMINGHAM · AHA LE8</div>
            </div>
          </div>
          <p className="mt-4 text-xs font-extrabold tracking-[0.18em] text-orange-300">ĐỒNG HÀNH DỰ PHÒNG ĐỘT QUỴ</p>
          <a href={`tel:${hotline.replace(/\s/g, "")}`} className="mt-5 flex items-center gap-3 rounded-2xl bg-white/5 p-4 hover:bg-white/10">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 text-white"><Phone className="h-5 w-5" /></span>
            <span>
              <span className="block text-[11px] font-bold tracking-wider text-slate-400">TỔNG ĐÀI ({hours})</span>
              <span className="block text-xl font-black text-white">{hotline.replace(/\s/g, "")}</span>
            </span>
          </a>
          <div className="mt-5 flex gap-2.5 text-xs font-bold">
            {[["Facebook", "https://facebook.com"], ["Zalo", zaloUrl], ["TikTok", "https://tiktok.com"], ["YouTube", "https://youtube.com"]].map(([n, u]) => (
              <a key={n} href={u} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-orange-600 hover:text-white">{n}</a>
            ))}
          </div>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-xs font-black tracking-[0.18em] text-white">{col.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="text-slate-400 hover:text-orange-400">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 md:flex-row">
          <p>© 2026 TNMALL / Pharmacy.vn. Thông tin chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-orange-400">Chính sách Bảo mật</Link>
            <Link href="/cookie-policy" className="hover:text-orange-400">Xem Chính sách Cookie chi tiết</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
