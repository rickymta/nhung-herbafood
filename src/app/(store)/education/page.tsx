import Link from "next/link";
import { Clock } from "lucide-react";
import { PageHead } from "@/components/store/PageHead";
import { articleTopics, listArticles } from "@/lib/store/queries";

export const metadata = { title: "Cẩm nang y khoa phòng ngừa đột quỵ — TNStrokeGuard" };

export default async function EducationPage({ searchParams }: PageProps<"/education">) {
  const sp = await searchParams;
  const topic = typeof sp.topic === "string" ? sp.topic : undefined;
  const topics = articleTopics();
  const items = listArticles(topic);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageHead code="Phân hệ PH-05 · Góc Sức khỏe Tim mạch – Đột quỵ" title="Cẩm Nang Y Khoa Phòng Ngừa Đột Quỵ" sub="Nội dung biên soạn dễ hiểu dành cho người trung niên, cao tuổi và gia đình chăm sóc." />
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        <Link href="/education" className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-extrabold ${!topic ? "bg-orange-600 text-white shadow-[0_4px_12px_rgba(234,88,12,0.35)]" : "bg-white text-slate-600 hover:bg-orange-50"}`}>Tất cả chuyên đề</Link>
        {topics.map((t) => <Link key={t.topic} href={`/education?topic=${t.topic}`} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-extrabold ${topic === t.topic ? "bg-orange-600 text-white shadow-[0_4px_12px_rgba(234,88,12,0.35)]" : "bg-white text-slate-600 hover:bg-orange-50"}`}>{t.label}</Link>)}
      </div>
      {items.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-white p-10 text-center font-bold text-slate-500">Chưa có bài viết trong chuyên đề này.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <Link key={a.id} href={`/education/${a.slug}`} className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="aspect-[16/9] overflow-hidden bg-slate-100"><img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between text-[11px] font-extrabold"><span className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700">{a.topicLabel}</span><span className="flex items-center gap-1 text-slate-400"><Clock className="h-3 w-3" />{a.readMinutes} phút đọc</span></div>
                <h2 className="mt-3 text-lg font-black leading-snug text-slate-900 group-hover:text-orange-600">{a.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-slate-600">{a.excerpt}</p>
                <div className="mt-auto pt-4 text-xs font-semibold text-slate-400">Tham vấn: {a.reviewer}</div>
                <span className="mt-2 text-sm font-black text-orange-600">Đọc chi tiết →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
