"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { BEFAST } from "@/lib/store/content";

export function BefastCards({ withToggle = true }: { withToggle?: boolean }) {
  const [marked, setMarked] = useState<string[]>([]);
  const toggle = (l: string) => setMarked((m) => (m.includes(l) ? m.filter((x) => x !== l) : [...m, l]));
  const alarm = marked.length > 0;
  return (
    <div>
      {alarm && (
        <div className="mb-4 flex flex-col items-center gap-3 rounded-3xl bg-red-600 p-5 text-white shadow-[0_8px_24px_rgba(220,38,38,0.4)] sm:flex-row">
          <p className="flex-1 text-sm font-bold">Bạn đã đánh dấu {marked.length} dấu hiệu. Dù chỉ 1 dấu hiệu xuất hiện đột ngột, hãy GỌI NGAY 115 và ghi lại giờ khởi phát.</p>
          <a href="tel:115" className="rounded-2xl bg-white px-6 py-3 text-sm font-black text-red-600">GỌI CẤP CỨU 115</a>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BEFAST.map((b) => {
          const on = marked.includes(b.letter);
          return (
            <div key={b.letter} className={`flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-2 transition ${on ? "ring-red-500" : "ring-transparent"}`}>
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-4xl font-black text-white shadow-[0_6px_16px_rgba(234,88,12,0.4)]">{b.letter}</span>
                <div><div className="text-xs font-extrabold tracking-[0.2em] text-orange-600">{b.word}</div><div className="text-lg font-black leading-tight text-slate-900">{b.title}</div></div>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">{b.description}</p>
              <div className="mt-4 rounded-2xl bg-orange-50 p-3.5 text-[13px] font-medium text-slate-700"><b className="text-orange-700">Cách kiểm tra nhanh: </b>{b.checkHow}</div>
              {withToggle && (
                <button onClick={() => toggle(b.letter)} className={`mt-auto flex items-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-bold transition ${on ? "bg-red-600 text-white" : "mt-4 bg-slate-100 text-slate-600 hover:bg-orange-100"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${on ? "border-white bg-white text-red-600" : "border-slate-300"}`}>{on && <Check className="h-3.5 w-3.5" />}</span>
                  {on ? "Đã đánh dấu - nên gọi 115" : "Nhấn để đánh dấu nếu gặp biểu hiện này"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
