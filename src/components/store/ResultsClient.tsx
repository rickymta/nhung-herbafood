"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readRecent, addRecentAssessment, type RecentAssessment } from "./results-storage";
import { TYPE_LABEL } from "@/lib/store/assessment";

export function RecordSession({ code, type }: { code: string; type: string }) {
  useEffect(() => addRecentAssessment({ code, type, at: Date.now() }), [code, type]);
  return null;
}

export function ResultsLookup() {
  const router = useRouter();
  const [v, setV] = useState("");
  const [recent, setRecent] = useState<RecentAssessment[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(readRecent());
  }, []);
  function open(e: React.FormEvent) {
    e.preventDefault();
    const m = v.match(/TNA-[A-Z0-9]+/i);
    const code = (m ? m[0] : v.trim().split("/").pop() || "").toUpperCase();
    if (code) router.push(`/results/${code}`);
  }
  return (
    <>
      <form onSubmit={open} className="mt-6 flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm sm:flex-row">
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Tra cứu báo cáo đã lưu bằng Mã phiên (Session ID) hoặc Link chia sẻ" className="flex-1 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500" />
        <button className="rounded-2xl bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)]">Mở báo cáo →</button>
      </form>
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-black text-slate-900">Kết quả thực hiện trong phiên này ({recent.length})</h2>
        {recent.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-bold text-slate-700">Chưa có bài đánh giá nào trong phiên hiện tại</p>
            <Link href="/assessment/general" className="mt-4 inline-block rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white">Làm Bài Test Toàn diện</Link>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recent.map((r) => (
              <li key={r.code}><Link href={`/results/${r.code}`} className="flex items-center justify-between py-3 hover:text-orange-600"><span><span className="block text-sm font-extrabold">{TYPE_LABEL[r.type] ?? r.type}</span><span className="text-xs text-slate-500">{r.code} · {new Date(r.at).toLocaleString("vi-VN")}</span></span><span className="text-sm font-black text-orange-600">Xem →</span></Link></li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/assessment/general" className="rounded-full bg-orange-50 px-4 py-2 text-xs font-extrabold text-orange-700 hover:bg-orange-100">+ Đánh giá Toàn diện</Link>
          <Link href="/assessment/afib" className="rounded-full bg-orange-50 px-4 py-2 text-xs font-extrabold text-orange-700 hover:bg-orange-100">+ Tầm soát Rung nhĩ</Link>
        </div>
      </div>
    </>
  );
}
