import Link from "next/link";
import { POLICY_PAGES } from "@/lib/store/content";

export function PolicyPage({ id }: { id: keyof typeof POLICY_PAGES }) {
  const d = POLICY_PAGES[id];
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <span className="inline-block rounded-full bg-orange-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-700">{d.eyebrow}</span>
      <h1 className="mt-3 text-3xl font-black text-slate-900">{d.title}</h1>
      <p className="mt-2 text-[15px] font-medium text-slate-600">{d.intro}</p>
      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-relaxed text-amber-900">
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Nội dung trên website không phải là chẩn đoán hay chỉ định điều trị.</li>
          <li>Thực phẩm bảo vệ sức khỏe không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.</li>
          <li>Khi nghi ngờ đột quỵ (méo miệng, yếu liệt, nói khó), hãy gọi ngay 115.</li>
        </ol>
      </div>
      <div className="mt-6 space-y-4">
        {d.sections.map((s) => (
          <section key={s.h} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">{s.h}</h2>
            {s.p.map((t) => <p key={t} className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{t}</p>)}
          </section>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
        <span className="text-slate-400">Xem thêm:</span>
        {d.links.map(([l, h]) => <Link key={h} href={h} className="text-orange-600 hover:underline">{l}</Link>)}
      </div>
    </div>
  );
}
