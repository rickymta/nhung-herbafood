import Link from "next/link";
import { Activity, Brain, Droplet, Dumbbell, Headset, HeartPulse, Leaf, Pill, ShieldCheck, ArrowRight, FileSearch } from "lucide-react";
import { BefastTabs, FlashSale, HealthSection, HeroCarousel, PreventionTabs, VideoRail } from "@/components/store/HomeClient";
import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORY_TILES, FEATURE_TILES } from "@/lib/store/content";
import { featuredProducts, flashProducts, getSettings, homeFeatured, listVideos } from "@/lib/store/queries";

const ICONS = { shield: ShieldCheck, pill: Pill, headset: Headset, activity: Activity, brain: Brain, heart: HeartPulse, droplet: Droplet, leaf: Leaf, dumbbell: Dumbbell } as const;

function SectionHead({ title, href, kicker }: { title: string; href?: string; kicker?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>{kicker && <div className="text-[11px] font-extrabold tracking-[0.18em] text-orange-600">{kicker}</div>}<h2 className="text-xl font-black text-slate-900 md:text-2xl">{title}</h2></div>
      {href && <Link href={href} className="whitespace-nowrap text-sm font-extrabold text-orange-600 hover:underline">Xem tất cả ›</Link>}
    </div>
  );
}

export default function HomePage() {
  const s = getSettings();
  const flash = flashProducts();
  const featured = featuredProducts(8);
  const videos = listVideos();
  const articles = homeFeatured();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6">
      <HeroCarousel />

      {/* service tiles */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {FEATURE_TILES.map((t) => {
          const I = ICONS[t.icon];
          const Tag = t.href.startsWith("tel:") ? "a" : Link;
          return (
            <Tag key={t.title} href={t.href} className="group rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_6px_14px_rgba(234,88,12,0.35)]"><I className="h-6 w-6" /></span>
              <div className="mt-3 text-[13px] font-black text-slate-900 md:text-sm">{t.title}</div>
              <div className="text-xs font-semibold text-slate-500">{t.sub}</div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-black text-orange-600">{t.cta}<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></div>
            </Tag>
          );
        })}
      </section>

      {/* assessment cards */}
      <section>
        <div className="mb-3 text-[11px] font-extrabold tracking-[0.18em] text-orange-600">SÀNG LỌC TIM MẠCH & ĐỘT QUỴ</div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/assessment/general" className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-700 p-7 text-white shadow-[0_12px_32px_rgba(234,88,12,0.3)]">
            <Activity className="absolute -right-4 -top-4 h-32 w-32 opacity-15" />
            <h3 className="relative text-xl font-black leading-tight">Đánh giá Nguy cơ Đột quỵ 10 năm</h3>
            <p className="relative mt-2 text-sm font-semibold opacity-90">Tích hợp 3 thang đo Quốc tế Framingham · INTERSTROKE · AHA LE8</p>
            <div className="relative mt-4 flex flex-wrap gap-2 text-[11px] font-extrabold"><span className="rounded-full bg-white/20 px-3 py-1">Miễn phí 100%</span><span className="rounded-full bg-white/20 px-3 py-1">Không cần đăng ký</span></div>
            <span className="relative mt-5 inline-block rounded-2xl bg-white px-5 py-2.5 text-sm font-black text-orange-600">Làm bài đánh giá →</span>
          </Link>
          <Link href="/assessment/afib" className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-950 p-7 text-white shadow-[0_12px_32px_rgba(15,23,42,0.3)]">
            <HeartPulse className="absolute -right-4 -top-4 h-32 w-32 opacity-10" />
            <h3 className="relative text-xl font-black leading-tight">Bài kiểm tra sàng lọc nguy cơ Đột quỵ do Rung nhĩ (AFib)</h3>
            <p className="relative mt-2 text-sm font-semibold opacity-80">Thang điểm CHA₂DS₂-VASc theo khuyến cáo ESC, 5 câu hỏi bệnh sử.</p>
            <span className="relative mt-5 inline-block rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-black text-white">Bắt đầu →</span>
          </Link>
        </div>
      </section>

      {/* product promo + records lookup */}
      <section className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <Link href="/products" className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-100 to-orange-200 p-7 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://tn-stroke-guard.vercel.app/images/products/prod-nattokinase.jpg" alt="" className="absolute -right-6 bottom-0 h-44 w-44 rotate-6 object-contain mix-blend-multiply md:h-52 md:w-52" />
          <div className="relative max-w-[65%]">
            <h3 className="text-xl font-black leading-tight text-slate-900">DƯỢC PHẨM & DINH DƯỠNG MẠCH NÃO</h3>
            <p className="mt-1 text-sm font-semibold text-slate-700">Nattokinase, Ginkgo, Omega-3</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-extrabold text-orange-800"><span className="rounded-full bg-white/70 px-3 py-1">Chính hãng 100%</span><span className="rounded-full bg-white/70 px-3 py-1">Tư vấn Dược sĩ 1:1</span></div>
            <span className="mt-4 inline-block rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)]">Khám phá ngay →</span>
          </div>
        </Link>
        <Link href="/orders/lookup" className="flex flex-col justify-between rounded-[2rem] bg-white p-7 shadow-sm transition hover:shadow-xl">
          <FileSearch className="h-10 w-10 text-orange-600" />
          <div><h3 className="mt-4 text-lg font-black text-slate-900">HỒ SƠ KHÁM & ĐƠN HÀNG</h3><p className="mt-1 text-sm font-medium text-slate-500">Theo dõi tiến độ đơn hàng và lịch hẹn của bạn.</p></div>
          <span className="mt-4 text-sm font-black text-orange-600">Tra cứu ngay →</span>
        </Link>
      </section>

      {/* quick chips */}
      <section className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {[["Test Đột quỵ 10 năm", "/assessment/general"], ["Tầm soát Rung nhĩ", "/assessment/afib"], ["Thực phẩm bảo vệ", "/products?category=supplement"], ["Dấu hiệu B.E.F.A.S.T", "/symptoms"], ["Gói khám tầm soát", "/products?category=package"], ["Góc sức khỏe Y khoa", "/education"], ["Xem thể lệ ›", "/terms"]].map(([l, h]) => (
          <Link key={l} href={h} className="whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-[13px] font-extrabold text-slate-700 shadow-sm hover:bg-orange-600 hover:text-white">{l}</Link>
        ))}
      </section>

      <FlashSale products={flash} startHour={Number(s.flash_start_hour || 8)} endHour={Number(s.flash_end_hour || 22)} />

      <section>
        <SectionHead title="Sản phẩm nổi bật" kicker="SẢN PHẨM PHÒNG NGỪA ĐỘT QUỴ" href="/products" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section>
        <SectionHead title="Danh mục nổi bật" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_TILES.map((c) => {
            const I = ICONS[c.icon];
            return (
              <Link key={c.title} href={c.href} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.color} p-5 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl`}>
                <I className="absolute -bottom-3 -right-3 h-20 w-20 opacity-20 transition group-hover:scale-110" />
                <I className="relative h-7 w-7" />
                <div className="relative mt-6 text-sm font-black leading-tight">{c.title}</div>
                <div className="relative text-xs font-semibold opacity-90">{c.sub}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 grid gap-4 rounded-[2rem] bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <div className="text-xs font-extrabold tracking-[0.2em] opacity-80">DẤU HIỆU B.E.F.A.S.T</div>
            <h2 className="mt-1 text-2xl font-black md:text-3xl">6 Dấu hiệu vàng cấp cứu</h2>
            <Link href="/assessment" className="mt-3 inline-block text-sm font-extrabold underline">Kiểm tra sức khỏe</Link>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur"><div className="text-sm font-black">Khẩn cấp gọi 115</div><Link href="/symptoms?tab=emergency" className="text-xs font-bold underline">Khám phá phác đồ xử trí</Link><div className="mt-1 text-[11px] font-semibold opacity-80">Thời gian vàng 115</div></div>
        </div>
        <BefastTabs />
      </section>

      <section>
        <SectionHead title="Video ngắn nổi bật" href="/education" />
        <VideoRail videos={videos} />
      </section>

      <section>
        <SectionHead title="Thư viện video & cẩm nang y khoa" kicker="GÓC SỨC KHỎE" href="/education" />
        <HealthSection items={articles} />
      </section>

      <section>
        <SectionHead title="Phòng ngừa theo độ tuổi" />
        <PreventionTabs />
      </section>
    </div>
  );
}
