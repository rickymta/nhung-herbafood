import Link from "next/link";
import { Phone } from "lucide-react";
import { BefastCards } from "@/components/store/BefastCards";
import { EMERGENCY_ACTIONS, EMERGENCY_DONOTS } from "@/lib/store/content";

export const metadata = { title: "Nhận biết B.E.F.A.S.T & Xử trí Giờ vàng — TNStrokeGuard" };

export default async function SymptomsPage({ searchParams }: PageProps<"/symptoms">) {
  const sp = await searchParams;
  const emergency = sp.tab === "emergency";
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <span className="inline-block rounded-full bg-red-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-red-700">Phân hệ PH-03 · Nhận diện & Cấp cứu đột quỵ cấp</span>
      <h1 className="mt-3 text-2xl font-black leading-tight text-slate-900 md:text-[34px]">Nhận biết B.E.F.A.S.T & Phác đồ Xử trí Giờ vàng</h1>
      <p className="mt-2 max-w-3xl text-[15px] font-medium leading-relaxed text-slate-600">Mỗi phút trôi qua khi đột quỵ làm tổn thương gần 1,9 triệu tế bào thần kinh. Đưa người bệnh tới bệnh viện có đơn vị đột quỵ trong &quot;Giờ vàng&quot; (3 – 4,5 giờ đầu).</p>
      <a href="tel:115" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-7 py-3.5 text-sm font-black text-white shadow-[0_6px_20px_rgba(220,38,38,0.4)] hover:bg-red-700"><Phone className="h-5 w-5" />GỌI CẤP CỨU 115</a>

      <div className="mt-6 inline-flex rounded-2xl bg-white p-1.5 shadow-sm">
        <Link href="/symptoms" className={`rounded-xl px-5 py-2.5 text-sm font-extrabold ${!emergency ? "bg-orange-600 text-white" : "text-slate-600"}`}>1. 6 Dấu hiệu Vàng B.E.F.A.S.T</Link>
        <Link href="/symptoms?tab=emergency" className={`rounded-xl px-5 py-2.5 text-sm font-extrabold ${emergency ? "bg-orange-600 text-white" : "text-slate-600"}`}>2. Xử trí Giờ vàng & Sai lầm cần tránh</Link>
      </div>

      <div className="mt-6">
        {!emergency ? (
          <BefastCards />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-xs font-extrabold tracking-[0.14em] text-emerald-700">KHUYẾN CÁO BỘ Y TẾ · 5 VIỆC CẦN LÀM NGAY TRONG LÚC CHỜ 115</div>
              <ol className="mt-4 space-y-3">
                {EMERGENCY_ACTIONS.map((a, i) => (
                  <li key={a} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white">{i + 1}</span><span className="pt-1 text-sm font-semibold leading-relaxed text-slate-700">{a}</span></li>
                ))}
              </ol>
            </section>
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-2 ring-red-100">
              <div className="text-xs font-extrabold tracking-[0.14em] text-red-700">LƯU Ý AN TOÀN NGƯỜI BỆNH · 4 SAI LẦM TUYỆT ĐỐI KHÔNG LÀM TẠI NHÀ</div>
              <ul className="mt-4 space-y-3">
                {EMERGENCY_DONOTS.map((a) => (
                  <li key={a} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">✕</span><span className="pt-1 text-sm font-semibold leading-relaxed text-slate-700">{a}</span></li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-7 text-white">
        <p className="text-lg font-black">Chưa có triệu chứng cấp tính nhưng muốn kiểm tra nguy cơ dự phòng?</p>
        <p className="mt-1 text-sm font-medium opacity-90">Bài đánh giá 10 năm miễn phí, kết quả sau 3 phút.</p>
        <Link href="/assessment" className="mt-4 inline-block rounded-2xl bg-white px-6 py-3 text-sm font-black text-orange-600">Làm bài tầm soát phòng ngừa →</Link>
      </div>
    </div>
  );
}
