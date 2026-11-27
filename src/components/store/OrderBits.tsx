"use client";

import { useEffect } from "react";
import { Check, Circle, XCircle } from "lucide-react";
import { useCart } from "./cart";

export function ClearCartOnMount() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  return null;
}

const STEPS = [
  ["pending", "Đã tiếp nhận", "Đơn hàng đã được ghi nhận"],
  ["confirmed", "Đã xác nhận", "Dược sĩ đã xác nhận đơn"],
  ["shipping", "Đang giao hàng", "Đơn đang trên đường giao"],
  ["completed", "Hoàn tất", "Giao hàng thành công"],
] as const;

export function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled" || status === "returned") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700">
        <XCircle className="h-6 w-6" />
        <div><div className="font-black">{status === "cancelled" ? "Đơn hàng đã hủy" : "Đơn hàng đã hoàn trả"}</div><div className="text-xs font-medium">Liên hệ tổng đài 1900 6789 nếu cần hỗ trợ.</div></div>
      </div>
    );
  }
  const idx = Math.max(0, STEPS.findIndex((s) => s[0] === status));
  return (
    <ol className="grid gap-4 sm:grid-cols-4">
      {STEPS.map(([k, t, d], i) => {
        const done = i <= idx;
        return (
          <li key={k} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-orange-600 text-white shadow-[0_4px_12px_rgba(234,88,12,0.4)]" : "bg-slate-100 text-slate-300"}`}>{done ? <Check className="h-5 w-5" /> : <Circle className="h-4 w-4" />}</span>
            <span><span className={`block text-sm font-extrabold ${done ? "text-slate-900" : "text-slate-400"}`}>{t}</span><span className="block text-[11.5px] text-slate-500">{d}</span></span>
          </li>
        );
      })}
    </ol>
  );
}
