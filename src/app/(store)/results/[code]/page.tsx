import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CheckCircle2, ShieldAlert, Siren } from "lucide-react";
import { get, parseJson } from "@/lib/db";
import { dateVN } from "@/lib/format";
import { RISK_LABEL, scoreAfib, scoreGeneral, TYPE_LABEL, type RiskLevel, type StoredAnswers } from "@/lib/store/assessment";
import { RecordSession } from "@/components/store/ResultsClient";
import { listProducts } from "@/lib/store/queries";
import { ProductCard } from "@/components/store/ProductCard";

export const metadata = { title: "Báo cáo tầm soát — TNStrokeGuard" };

const RISK_STYLE: Record<RiskLevel, { bg: string; text: string; bar: string; Icon: typeof CheckCircle2 }> = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "from-emerald-400 to-emerald-600", Icon: CheckCircle2 },
  moderate: { bg: "bg-amber-50", text: "text-amber-700", bar: "from-amber-400 to-orange-500", Icon: AlertTriangle },
  high: { bg: "bg-red-50", text: "text-red-700", bar: "from-orange-500 to-red-600", Icon: ShieldAlert },
};

export default async function ResultPage({ params }: PageProps<"/results/[code]">) {
  const { code } = await params;
  const row = get<{ code: string; type: string; answers: string; created_at: string; name: string | null }>(
    "SELECT code, type, answers, created_at, name FROM assessments WHERE UPPER(code) = UPPER(?)", [code],
  );
  if (!row) notFound();
  const data = parseJson<StoredAnswers | null>(row.answers, null);
  if (!data?.basic) notFound();
  const r = row.type === "afib" ? scoreAfib(data) : scoreGeneral(data);
  const st = RISK_STYLE[r.risk];
  const suggestions = listProducts({ sort: "bestseller" }).filter((p) => (row.type === "afib" ? p.category === "device" : p.category === "supplement")).slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <RecordSession code={row.code} type={row.type} />
      <span className="inline-block rounded-full bg-orange-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-700">Báo cáo tầm soát · {TYPE_LABEL[row.type]}</span>
      <h1 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">Kết quả đánh giá{row.name ? ` của ${row.name}` : ""}</h1>
      <p className="mt-1 text-sm font-semibold text-slate-500">Mã phiên: <b className="text-slate-800">{row.code}</b> · {dateVN(row.created_at, true)} · {r.age} tuổi, {data.basic.sex === "male" ? "nam" : "nữ"}</p>

      <div className={`mt-6 rounded-3xl p-6 ${st.bg}`}>
        <div className={`flex items-center gap-3 ${st.text}`}><st.Icon className="h-9 w-9" /><div><div className="text-xs font-extrabold uppercase tracking-wider opacity-80">Mức độ nguy cơ</div><div className="text-3xl font-black">{RISK_LABEL[r.risk]}</div></div></div>
        {r.type === "general" ? (
          <p className="mt-3 text-sm font-semibold text-slate-700">Ước tính nguy cơ đột quỵ 10 năm: <b className="text-xl">{r.framingham.probability}%</b> (mô hình lấy cảm hứng Framingham, {r.framingham.points} điểm)</p>
        ) : (
          <p className="mt-3 text-sm font-semibold text-slate-700">Điểm CHA₂DS₂-VASc: <b className="text-xl">{r.score}/9</b> · Nguy cơ đột quỵ ước tính khoảng <b>{r.annualRisk}%/năm</b> nếu không điều trị</p>
        )}
      </div>

      {r.type === "general" ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold tracking-wider text-slate-400">AHA LIFE&apos;S ESSENTIAL 8</div>
            <div className="mt-1 text-4xl font-black text-orange-600">{r.le8.score}<span className="text-lg text-slate-400">/100</span></div>
            <div className="mt-4 space-y-2.5">
              {r.le8.parts.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs font-bold text-slate-600"><span>{p.label}</span><span>{p.score}</span></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full bg-gradient-to-r ${p.score >= 70 ? "from-emerald-400 to-emerald-600" : p.score >= 40 ? "from-amber-400 to-orange-500" : "from-orange-500 to-red-600"}`} style={{ width: `${p.score}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold tracking-wider text-slate-400">INTERSTROKE · YẾU TỐ CÓ THỂ ĐIỀU CHỈNH</div>
            <div className="mt-1 text-4xl font-black text-orange-600">{r.interstroke.count}<span className="text-lg text-slate-400">/{r.interstroke.total}</span></div>
            <ul className="mt-4 space-y-2">
              {r.interstroke.factors.map((f) => (
                <li key={f.label} className={`flex items-center gap-2 text-sm font-semibold ${f.present ? "text-red-700" : "text-slate-400"}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black ${f.present ? "bg-red-100" : "bg-slate-100"}`}>{f.present ? "!" : "✓"}</span>{f.label}</li>
              ))}
            </ul>
            {r.bmi !== null && <p className="mt-4 text-xs font-semibold text-slate-500">BMI của bạn: {r.bmi}</p>}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold tracking-wider text-slate-400">CẤU TRÚC ĐIỂM CHA₂DS₂-VASc</div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {r.breakdown.map((b) => (
              <li key={b.key} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${b.points ? "bg-orange-50" : "bg-slate-50"}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black ${b.points ? "bg-orange-600 text-white" : "bg-slate-200 text-slate-500"}`}>{b.key}</span>
                <span className="flex-1 text-sm font-bold text-slate-800">{b.label}</span><span className="text-sm font-black text-orange-600">+{b.points}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-700">{r.recommendation}</p>
        </div>
      )}

      {r.type === "general" && (
        <div className="mt-5 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900">Khuyến nghị dành cho bạn</h2>
          <ul className="mt-3 space-y-2.5 text-sm font-medium leading-relaxed text-slate-700">
            {r.advice.map((a) => <li key={a} className="flex gap-2"><span className="text-orange-600">●</span>{a}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-col items-center gap-3 rounded-3xl bg-slate-900 p-6 text-white sm:flex-row">
        <Siren className="h-8 w-8 text-red-400" />
        <p className="flex-1 text-sm font-medium">Nếu đột ngột méo miệng, yếu liệt tay chân, nói khó: <b>gọi ngay 115</b>. Kết quả này chỉ mang tính sàng lọc, không thay thế chẩn đoán của bác sĩ.</p>
        <Link href="/symptoms" className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-bold">Dấu hiệu B.E.F.A.S.T</Link>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-black text-slate-900">Sản phẩm hỗ trợ dự phòng</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{suggestions.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </section>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold">
        <Link href="/assessment" className="rounded-2xl bg-orange-600 px-6 py-3 text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)]">Làm lại bài đánh giá</Link>
        <Link href="/results" className="rounded-2xl bg-[#FFF5EB] px-6 py-3 text-orange-600">Lịch sử kết quả</Link>
      </div>
    </div>
  );
}
