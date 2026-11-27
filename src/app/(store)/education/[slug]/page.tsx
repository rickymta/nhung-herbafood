import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { dateVN } from "@/lib/format";
import { getArticle, listArticles } from "@/lib/store/queries";

export async function generateMetadata({ params }: PageProps<"/education/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  return { title: a ? `${a.title} — TNStrokeGuard` : "Bài viết" };
}

export default async function ArticlePage({ params }: PageProps<"/education/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const related = listArticles().filter((x) => x.id !== a.id).sort((x, y) => Number(y.topic === a.topic) - Number(x.topic === a.topic)).slice(0, 3);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/education?topic=${a.topic}`} className="flex items-center gap-1 text-sm font-bold text-orange-600"><ArrowLeft className="h-4 w-4" />Quay lại chuyên mục {a.topicLabel}</Link>
      <article className="mt-4 rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700"><BadgeCheck className="h-4 w-4" />Kiểm duyệt: {a.reviewer}</span>
          <span className="text-slate-400">Cập nhật {dateVN(a.publishedAt)} · {a.readMinutes} phút đọc</span>
        </div>
        <h1 className="mt-4 text-2xl font-black leading-tight text-slate-900 md:text-[32px]">{a.title}</h1>
        <p className="mt-3 text-base font-medium leading-relaxed text-slate-600">{a.excerpt}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.image} alt="" className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" />
        {a.keyPoints.length > 0 && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="text-xs font-extrabold tracking-[0.14em] text-orange-700">TÓM TẮT Y KHOA QUAN TRỌNG</div>
            <ol className="mt-3 space-y-2.5">{a.keyPoints.map((k, i) => <li key={i} className="flex gap-3 text-sm font-semibold text-slate-800"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-black text-white">{i + 1}</span>{k}</li>)}</ol>
          </div>
        )}
        <div className="rich mt-6 text-[15px] text-slate-700" dangerouslySetInnerHTML={{ __html: a.body }} />
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <p className="text-lg font-black">Kiểm tra ngay mức nguy cơ đột quỵ cá nhân của bạn</p>
          <Link href="/assessment/general" className="mt-3 inline-block rounded-2xl bg-white px-6 py-3 text-sm font-black text-orange-600">Làm bài đánh giá ngay →</Link>
        </div>
      </article>
      <h2 className="mb-3 mt-10 text-xl font-black text-slate-900">Bài viết cùng chuyên khoa</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {related.map((r) => (
          <Link key={r.id} href={`/education/${r.slug}`} className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-lg">
            <span className="text-[11px] font-extrabold text-orange-600">{r.topicLabel}</span>
            <p className="mt-1 line-clamp-3 text-sm font-black leading-snug text-slate-900">{r.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
