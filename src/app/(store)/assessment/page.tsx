import Link from "next/link";
import { Activity, HeartPulse } from "lucide-react";

export const metadata = { title: "Tầm soát Nguy cơ Đột quỵ — TNStrokeGuard" };

export default function AssessmentHub() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900">Tầm soát Nguy cơ Đột quỵ</h1>
        <p className="mt-2 text-base font-medium text-slate-600">Bạn muốn thực hiện bài kiểm tra tầm soát nào?</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link href="/assessment/general" className="group rounded-3xl bg-white p-7 shadow-sm ring-2 ring-transparent transition hover:-translate-y-1 hover:ring-orange-500 hover:shadow-xl">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white"><Activity className="h-7 w-7" /></span>
          <h2 className="mt-5 text-xl font-black text-slate-900">Đánh giá Nguy cơ Đột quỵ Toàn diện</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">Đánh giá tổng quát nguy cơ đột quỵ 10 năm qua chỉ số huyết áp, bệnh nền và lối sống (Framingham · INTERSTROKE · AHA LE8).</p>
          <span className="mt-5 inline-block text-sm font-black text-orange-600 group-hover:translate-x-1">Bắt đầu →</span>
        </Link>
        <Link href="/assessment/afib" className="group rounded-3xl bg-white p-7 shadow-sm ring-2 ring-transparent transition hover:-translate-y-1 hover:ring-orange-500 hover:shadow-xl">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white"><HeartPulse className="h-7 w-7" /></span>
          <h2 className="mt-5 text-xl font-black text-slate-900">Tầm soát Rung nhĩ & Huyết khối (AFib)</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">Dành cho người có rối loạn nhịp tim, hồi hộp hoặc rung nhĩ; đánh giá nguy cơ huyết khối theo thang CHA₂DS₂-VASc.</p>
          <span className="mt-5 inline-block text-sm font-black text-orange-600 group-hover:translate-x-1">Bắt đầu →</span>
        </Link>
      </div>
      <div className="mt-6 text-center"><Link href="/" className="text-sm font-bold text-slate-500 hover:text-orange-600">Huỷ</Link></div>
    </div>
  );
}
