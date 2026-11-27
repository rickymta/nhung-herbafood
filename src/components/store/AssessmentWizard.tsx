"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { AFIB_QUESTIONS, GENERAL_QUESTIONS } from "@/lib/store/assessment";
import { submitAssessment } from "@/app/(store)/assessment/actions";
import { addRecentAssessment } from "./results-storage";

const input = "w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-orange-500";

export function AssessmentWizard({ type }: { type: "general" | "afib" }) {
  const router = useRouter();
  const questions = type === "general" ? GENERAL_QUESTIONS : AFIB_QUESTIONS;
  const [step, setStep] = useState(0); // 0 = basic, 1..n = question
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  const [b, setB] = useState({ name: "", phone: "", birthYear: "", sex: "" as "" | "male" | "female", height: "", weight: "", consent: false });
  const [ans, setAns] = useState<Record<string, string>>({});

  const total = questions.length;
  const stepLabels = type === "general" ? ["Hồ sơ hành chính", "Câu hỏi lâm sàng & lối sống"] : ["Hồ sơ hành chính (Tuổi & Giới)", "5 câu hỏi bệnh sử CHA₂DS₂-VASc"];

  function next() {
    setErr("");
    const y = Number(b.birthYear);
    const now = new Date().getFullYear();
    if (!/^\d{4}$/.test(b.birthYear) || y < now - 110 || y > now - 10) return setErr("Vui lòng nhập năm sinh hợp lệ (ví dụ 1965).");
    if (!b.sex) return setErr("Vui lòng chọn giới tính sinh học.");
    if (!b.consent) return setErr("Vui lòng đồng ý Điều khoản & Chính sách bảo mật.");
    setStep(1);
  }

  function pick(id: string, value: string) {
    const na = { ...ans, [id]: value };
    setAns(na);
    if (step < total) setTimeout(() => setStep((s) => s + 1), 180);
  }

  function submit() {
    setErr("");
    start(async () => {
      const r = await submitAssessment({
        type,
        basic: { name: b.name, phone: b.phone, birthYear: Number(b.birthYear), sex: b.sex as "male", heightCm: Number(b.height) || undefined, weightKg: Number(b.weight) || undefined },
        answers: ans,
      });
      if (r.error || !r.code) return setErr(r.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
      addRecentAssessment({ code: r.code, type, at: Date.now() });
      router.push(`/results/${r.code}`);
    });
  }

  const q = step >= 1 ? questions[step - 1] : null;
  const allDone = step > total || (step === total && !!ans[questions[total - 1].id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/assessment" className="flex items-center gap-1 text-sm font-bold text-orange-600"><ArrowLeft className="h-4 w-4" />Chọn bài tầm soát khác</Link>
      <span className="mt-4 inline-block rounded-full bg-orange-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-700">{type === "general" ? "PH-02.1 · Sàng lọc Tổng quát" : "PH-02.2 · Chuyên khoa Tim mạch"}</span>
      <h1 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">{type === "general" ? "Đánh giá Nguy cơ Đột quỵ Toàn diện" : "Tầm soát Huyết khối Rung nhĩ (CHA₂DS₂-VASc)"}</h1>
      <p className="mt-2 text-[15px] font-medium text-slate-600">{type === "general" ? "Kết hợp 3 thang đo quốc tế: Framingham (10 năm) · INTERSTROKE · AHA Life's Essential 8" : "5 câu hỏi bệnh sử kết hợp tự động tính điểm Tuổi & Giới tính theo khuyến cáo ESC"}</p>

      <ol className="mt-6 flex items-center gap-3">
        {stepLabels.map((l, i) => {
          const active = (i === 0) === (step === 0);
          const done = i === 0 && step > 0;
          return (
            <li key={l} className="flex flex-1 items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${done ? "bg-emerald-500 text-white" : active ? "bg-orange-600 text-white shadow-[0_4px_12px_rgba(234,88,12,0.4)]" : "bg-slate-200 text-slate-500"}`}>{done ? <Check className="h-4 w-4" /> : i + 1}</span>
              <span className={`text-xs font-extrabold ${active || done ? "text-slate-900" : "text-slate-400"}`}>{l}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 rounded-3xl bg-white p-6 shadow-sm md:p-8">
        {err && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{err}</div>}

        {step === 0 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Họ và tên (không bắt buộc)</span><input value={b.name} onChange={(e) => setB((p) => ({ ...p, name: e.target.value }))} placeholder="Ví dụ: Nguyễn Văn An" className={input} /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Số điện thoại (không bắt buộc)</span><input value={b.phone} onChange={(e) => setB((p) => ({ ...p, phone: e.target.value }))} inputMode="tel" placeholder="0901 234 567" className={input} /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Năm sinh *</span><input value={b.birthYear} onChange={(e) => setB((p) => ({ ...p, birthYear: e.target.value }))} inputMode="numeric" maxLength={4} placeholder="Ví dụ: 1965" className={input} /></label>
              {type === "general" && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Chiều cao (cm)</span><input value={b.height} onChange={(e) => setB((p) => ({ ...p, height: e.target.value }))} inputMode="numeric" placeholder="165" className={input} /></label>
                  <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Cân nặng (kg)</span><input value={b.weight} onChange={(e) => setB((p) => ({ ...p, weight: e.target.value }))} inputMode="decimal" placeholder="60" className={input} /></label>
                </div>
              )}
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-extrabold text-slate-600">Giới tính sinh học *</span>
              <div className="grid grid-cols-2 gap-3">
                {([["male", "Nam giới", "Hệ số chuẩn nam"], ["female", "Nữ giới", "Hệ số chuẩn nữ"]] as const).map(([v, t, s]) => (
                  <button type="button" key={v} onClick={() => setB((p) => ({ ...p, sex: v }))} className={`rounded-2xl border-2 p-4 text-left transition ${b.sex === v ? "border-orange-600 bg-orange-50" : "border-slate-200 hover:border-orange-300"}`}>
                    <div className="font-extrabold text-slate-900">{t}</div><div className="text-xs font-medium text-slate-500">{s}</div>
                  </button>
                ))}
              </div>
            </div>
            <label className="flex gap-3 text-[13px] font-medium leading-relaxed text-slate-600">
              <input type="checkbox" checked={b.consent} onChange={(e) => setB((p) => ({ ...p, consent: e.target.checked }))} className="mt-1 h-4 w-4 accent-orange-600" />
              <span>Tôi xác nhận đã đọc, hiểu và đồng ý với <Link href="/terms" className="font-bold text-orange-600">Điều khoản sử dụng</Link> và <Link href="/privacy" className="font-bold text-orange-600">Chính sách bảo mật dữ liệu y tế</Link> của TNStrokeGuard. *</span>
            </label>
            <button onClick={next} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:bg-orange-700">Tiếp tục vào câu hỏi sàng lọc <ArrowRight className="h-4 w-4" /></button>
            <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500"><b className="text-slate-700">Mục đích thu thập & Bảo mật thông tin (Nghị định 13/2023/NĐ-CP).</b> Thông tin hành chính & y tế chỉ dùng để hiệu chỉnh thuật toán nguy cơ lâm sàng (Framingham, CHA₂DS₂-VASc) và lưu mã phiên để bạn tra cứu lại.</p>
          </div>
        )}

        {q && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-extrabold text-slate-400">
              <span>CÂU {Math.min(step, total)}/{total} · {q.group}</span><span>{Math.round((Math.min(step, total) / total) * 100)}%</span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all" style={{ width: `${(Math.min(step, total) / total) * 100}%` }} /></div>
            <h2 className="text-lg font-black text-slate-900">{q.text}</h2>
            {q.hint && <p className="mt-1 text-xs font-medium text-slate-500">{q.hint}</p>}
            <div className="mt-4 grid gap-2.5">
              {q.options.map((o) => {
                const sel = ans[q.id] === o.value;
                return (
                  <button key={o.value} onClick={() => pick(q.id, o.value)} className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-bold transition ${sel ? "border-orange-600 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-700 hover:border-orange-300"}`}>
                    {o.label}{sel && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-orange-600"><ArrowLeft className="h-4 w-4" />Quay lại</button>
              {allDone ? (
                <button onClick={submit} disabled={pending} className="rounded-2xl bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] disabled:opacity-60">{pending ? "Đang tính điểm..." : "Xem kết quả →"}</button>
              ) : ans[q.id] ? (
                <button onClick={() => setStep((s) => s + 1)} className="text-sm font-bold text-orange-600">Câu tiếp →</button>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-3 rounded-2xl bg-sky-50 p-4 text-[13px] font-medium leading-relaxed text-sky-900">
        <Info className="mt-0.5 h-5 w-5 shrink-0" />
        {type === "general" ? "Đây là công cụ sàng lọc tham khảo dựa trên hướng dẫn lâm sàng quốc tế, không thay thế cho chẩn đoán trực tiếp của bác sĩ chuyên khoa." : "Thang điểm CHA₂DS₂-VASc dùng để ước tính nguy cơ đột quỵ ở người rung nhĩ. Tuyệt đối không tự ý dùng hoặc ngưng thuốc chống đông khi chưa có chỉ định bác sĩ."}
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-slate-600">
        {type === "general" ? <>Bạn đã được chẩn đoán Rung nhĩ? <Link href="/assessment/afib" className="font-black text-orange-600">Chuyển sang Tầm soát Rung nhĩ →</Link></> : <>Muốn đánh giá cả lối sống & mỡ máu? <Link href="/assessment/general" className="font-black text-orange-600">Làm thêm Bài Đánh giá Toàn diện →</Link></>}
      </p>
    </div>
  );
}
