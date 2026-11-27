"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X, Zap } from "lucide-react";
import type { Product, VideoItem } from "@/lib/store/types";
import type { HomeFeatured } from "@/lib/store/queries";
import { BEFAST, PREVENTION_AGE, PREVENTION_SEASON } from "@/lib/store/content";
import { ProductCard } from "./ProductCard";

const IMG = "https://tn-stroke-guard.vercel.app/images/hero/";

/* ---------------- Hero carousel ---------------- */
const SLIDES = [
  { bg: IMG + "lc-bg-royal-sakura.jpg", tone: "from-orange-700/90 via-orange-600/70 to-orange-500/20" },
  { bg: IMG + "lc-bg-meadow.jpg", tone: "from-orange-800/90 via-orange-700/70 to-amber-500/20" },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative overflow-hidden rounded-[2rem] shadow-[0_12px_40px_rgba(234,88,12,0.25)]">
      {SLIDES.map((s, idx) => (
        <div key={s.bg} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.bg} alt="" className="h-full w-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.tone}`} />
        </div>
      ))}
      <div className="relative px-6 py-12 text-white md:px-14 md:py-20">
        <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-extrabold tracking-[0.18em] backdrop-blur md:text-xs">CHUẨN LÂM SÀNG QUỐC TẾ AHA / ESC 2026</span>
        <h1 className="mt-5 text-4xl font-black leading-[1.08] md:text-6xl">Chủ động Dự phòng<br /><span className="text-amber-200">Vững vàng Mạch não</span></h1>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/assessment/general" className="rounded-2xl bg-white px-7 py-4 text-orange-600 shadow-xl transition hover:scale-[1.02]"><span className="block text-sm font-black">ĐÁNH GIÁ NGUY CƠ SỚM</span><span className="text-xs font-semibold opacity-70">Kết quả sau 3 phút</span></Link>
          <Link href="/assessment/afib" className="rounded-2xl border-2 border-white/70 px-7 py-4 text-white backdrop-blur transition hover:bg-white/15"><span className="block text-sm font-black">SÀNG LỌC RUNG NHĨ AFIB</span><span className="text-xs font-semibold opacity-80">Thang CHA₂DS₂-VASc</span></Link>
        </div>
      </div>
      <button aria-label="Trước" onClick={() => setI((i + SLIDES.length - 1) % SLIDES.length)} className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur hover:bg-white/40 md:flex"><ChevronLeft /></button>
      <button aria-label="Sau" onClick={() => setI((i + 1) % SLIDES.length)} className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur hover:bg-white/40 md:flex"><ChevronRight /></button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => <button key={idx} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? "w-7 bg-white" : "w-2 bg-white/50"}`} />)}
      </div>
    </section>
  );
}

/* ---------------- Flash sale ---------------- */
const pad = (n: number) => String(n).padStart(2, "0");

export function FlashSale({ products, startHour, endHour }: { products: Product[]; startHour: number; endHour: number }) {
  const [now, setNow] = useState<number | null>(null);
  const [day, setDay] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return [0, 1, 2].map((d) => {
      const dt = new Date(base);
      dt.setDate(dt.getDate() + d);
      const s = new Date(dt); s.setHours(startHour, 0, 0, 0);
      const e = new Date(dt); e.setHours(endHour, 0, 0, 0);
      return { label: `${pad(startHour)}:00 - ${pad(endHour)}:00`, date: `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}`, start: s.getTime(), end: e.getTime() };
    });
  }, [startHour, endHour]);

  const cur = days[day];
  let status = "Sắp diễn ra";
  let target = cur.start;
  if (now !== null) {
    if (now >= cur.end) { status = "Đã kết thúc"; target = cur.end; }
    else if (now >= cur.start) { status = "Đang diễn ra"; target = cur.end; }
  }
  const diff = now === null ? 0 : Math.max(0, Math.floor((target - now) / 1000));
  const hh = Math.floor(diff / 3600), mm = Math.floor((diff % 3600) / 60), ss = diff % 60;

  return (
    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-600 to-red-600 p-4 shadow-[0_12px_40px_rgba(220,38,38,0.25)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <Zap className="h-7 w-7 fill-amber-300 text-amber-300" />
          <h2 className="text-xl font-black italic tracking-wide md:text-2xl">FLASHSALE GIÁ TỐT</h2>
          <Link href="/products?sort=price_asc" className="hidden rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold hover:bg-white/30 sm:block">XEM NGAY ›</Link>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="opacity-90">{status === "Sắp diễn ra" ? "Bắt đầu sau" : "Kết thúc sau"}</span>
          <div className="flex items-center gap-1" suppressHydrationWarning>
            {[hh, mm, ss].map((v, k) => (
              <span key={k} className="flex items-center gap-1"><span className="rounded-lg bg-slate-900 px-2 py-1 text-base font-black tabular-nums">{pad(v)}</span>{k < 2 && <span className="font-black">:</span>}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {days.map((d, k) => {
          const st = now === null ? "" : now >= d.end ? "Đã kết thúc" : now >= d.start ? "Đang diễn ra" : "Sắp diễn ra";
          return (
            <button key={k} onClick={() => setDay(k)} className={`rounded-2xl px-2 py-2.5 text-center transition ${k === day ? "bg-white text-orange-600 shadow-lg" : "bg-white/15 text-white hover:bg-white/25"}`}>
              <span className="block text-[13px] font-black">{d.label} <span className="hidden sm:inline">{d.date}</span></span>
              <span className="block text-[11px] font-bold opacity-80" suppressHydrationWarning>{st || " "}</span>
            </button>
          );
        })}
      </div>
      <div className="no-scrollbar -mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-2">
        {products.map((p) => <div key={p.id} className="w-[200px] shrink-0 md:w-[230px]"><ProductCard p={p} flash /></div>)}
      </div>
      <div className="mt-1 text-right"><Link href="/products" className="text-sm font-extrabold text-white hover:underline">Xem tất cả ›</Link></div>
    </section>
  );
}

/* ---------------- B.E.F.A.S.T interactive tabs ---------------- */
export function BefastTabs() {
  const [k, setK] = useState(0);
  const b = BEFAST[k];
  return (
    <div className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-sm md:grid-cols-[auto_1fr] md:p-8">
      <div className="flex gap-2 md:flex-col">
        {BEFAST.map((x, i) => (
          <button key={x.letter} onClick={() => setK(i)} className={`flex h-14 flex-1 items-center justify-center rounded-2xl text-2xl font-black transition md:h-16 md:w-16 md:flex-none ${i === k ? "bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-[0_6px_16px_rgba(234,88,12,0.4)]" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>{x.letter}</button>
        ))}
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-white p-6 ring-1 ring-orange-100">
        <div className="text-xs font-extrabold tracking-[0.25em] text-orange-600">{b.word}</div>
        <h3 className="mt-1 text-2xl font-black text-slate-900">{b.title}</h3>
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-600">{b.description}</p>
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm"><b className="text-orange-700">Cách kiểm tra nhanh: </b>{b.checkHow}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href="tel:115" className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-[0_6px_20px_rgba(220,38,38,0.4)]">Khẩn cấp gọi 115</a>
          <Link href="/symptoms?tab=emergency" className="text-sm font-black text-orange-600">Khám phá phác đồ xử trí →</Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Video rail ---------------- */
export function VideoRail({ videos }: { videos: VideoItem[] }) {
  const [open, setOpen] = useState<VideoItem | null>(null);
  const [more, setMore] = useState(false);
  const shown = more ? videos : videos.slice(0, 6);
  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-6">
        {shown.map((v) => (
          <button key={v.id} onClick={() => setOpen(v)} className="group relative aspect-[9/16] w-[150px] shrink-0 overflow-hidden rounded-3xl bg-slate-800 text-left shadow-md md:w-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <span className="absolute left-2 top-2 rounded-full bg-orange-600 px-2 py-0.5 text-[9px] font-black tracking-wider text-white">{v.tag}</span>
            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur"><Play className="h-3.5 w-3.5 fill-current" /></span>
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <p className="line-clamp-4 text-[12px] font-black leading-tight">{v.overlayTitle}</p>
            </div>
          </button>
        ))}
      </div>
      {videos.length > 6 && !more && <div className="mt-4 text-center"><button onClick={() => setMore(true)} className="rounded-2xl bg-white px-7 py-2.5 text-sm font-black text-orange-600 shadow-sm hover:bg-orange-50">Xem thêm</button></div>}
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" onClick={() => setOpen(null)}>
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Đóng" onClick={() => setOpen(null)} className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"><X className="h-5 w-5" /></button>
            <div className="relative aspect-[9/16] max-h-[60vh] w-full bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.image} alt="" className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white"><span className="rounded-full bg-orange-600 px-3 py-1 text-[10px] font-black tracking-wider">{open.tag}</span><p className="text-xl font-black leading-tight">{open.overlayTitle}</p></div>
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-slate-800">{open.title}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Video đang được biên tập, sẽ sớm phát tại đây. Trong lúc chờ, xem bài viết chuyên môn liên quan.</p>
              <Link href="/education" className="mt-4 block rounded-2xl bg-orange-600 py-3 text-center text-sm font-bold text-white">Đọc cẩm nang y khoa →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Health library + featured articles ---------------- */
const HEALTH_TAGS = ["Tất cả chuyên đề", "Phòng chữa bệnh", "Dinh dưỡng", "Người cao tuổi", "Tim mạch - Huyết áp", "Phục hồi sau tai biến", "Chương trình tầm soát", "Tin tức sức khỏe"];

export function HealthSection({ items }: { items: HomeFeatured[] }) {
  const [tag, setTag] = useState(HEALTH_TAGS[0]);
  const list = tag === HEALTH_TAGS[0] ? items : items.filter((x) => x.tag === tag);
  const [hero, ...rest] = list;
  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-3 md:mx-0 md:px-0">
        {HEALTH_TAGS.map((t) => <button key={t} onClick={() => setTag(t)} className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-extrabold transition ${t === tag ? "bg-orange-600 text-white shadow-[0_4px_12px_rgba(234,88,12,0.35)]" : "bg-white text-slate-600 hover:bg-orange-50"}`}>{t}</button>)}
      </div>
      {!hero ? (
        <p className="rounded-3xl bg-white p-10 text-center text-sm font-bold text-slate-500">Chưa có nội dung cho chuyên đề này. <button onClick={() => setTag(HEALTH_TAGS[0])} className="text-orange-600 underline">Xem tất cả</button></p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Link href={hero.href} className="group relative min-h-[320px] overflow-hidden rounded-[2rem] text-white shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-orange-600/20" />
            <div className="relative flex h-full min-h-[320px] flex-col justify-end p-6 md:p-8">
              <span className="w-fit rounded-full bg-orange-600 px-3 py-1 text-[11px] font-extrabold">{hero.tag}</span>
              <p className="mt-3 text-[11px] font-extrabold tracking-[0.16em] text-orange-200">{hero.kicker}</p>
              <h3 className="mt-1 text-2xl font-black leading-tight md:text-3xl">{hero.heading}</h3>
              {hero.subheading && <p className="mt-1 text-xs font-extrabold tracking-wide text-amber-200">{hero.subheading}</p>}
              {hero.body && <p className="mt-2 line-clamp-3 text-sm font-medium opacity-90">{hero.body}</p>}
            </div>
          </Link>
          <div className="grid gap-4">
            {rest.slice(0, 3).map((x) => (
              <Link key={x.heading} href={x.href} className="group flex gap-4 rounded-3xl bg-white p-3 shadow-sm transition hover:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.image} alt="" loading="lazy" className="h-24 w-28 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0 py-1"><span className="text-[10px] font-extrabold tracking-wider text-orange-600">{x.kicker}</span><h4 className="mt-0.5 line-clamp-2 text-sm font-black leading-snug text-slate-900 group-hover:text-orange-600">{x.heading}</h4><span className="mt-1 inline-block rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-extrabold text-orange-700">{x.tag}</span></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Prevention by age / season ---------------- */
export function PreventionTabs() {
  const [mode, setMode] = useState<"age" | "season">("age");
  const list = mode === "age" ? PREVENTION_AGE : PREVENTION_SEASON;
  return (
    <div>
      <div className="mb-4 inline-flex rounded-2xl bg-white p-1.5 shadow-sm">
        <button onClick={() => setMode("age")} className={`rounded-xl px-5 py-2.5 text-sm font-extrabold ${mode === "age" ? "bg-orange-600 text-white" : "text-slate-600"}`}>Phòng ngừa theo độ tuổi</button>
        <button onClick={() => setMode("season")} className={`rounded-xl px-5 py-2.5 text-sm font-extrabold ${mode === "season" ? "bg-orange-600 text-white" : "text-slate-600"}`}>Phòng ngừa theo mùa & lối sống</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((g) => (
          <div key={g.group} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.image} alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-4 right-4 text-sm font-black text-white">{g.group}</span>
            </div>
            <ul className="flex-1 space-y-2 p-4 text-[13px] font-semibold text-slate-600">
              {g.items.map((t) => <li key={t} className="flex gap-2"><span className="text-orange-500">●</span>{t}</li>)}
            </ul>
            <Link href="/education" className="m-4 mt-0 rounded-2xl bg-[#FFF5EB] py-2.5 text-center text-[13px] font-extrabold text-orange-600 hover:bg-orange-100">Tìm hiểu thêm</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
