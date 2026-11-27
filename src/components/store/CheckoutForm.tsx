"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Banknote, Landmark } from "lucide-react";
import { vnd } from "@/lib/format";
import { placeOrder, type CheckoutState } from "@/app/(store)/checkout/actions";
import { useCart } from "./cart";

const PROVINCES = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "An Giang", "Bắc Ninh", "Cà Mau", "Đắk Lắk", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hưng Yên", "Khánh Hòa", "Lâm Đồng", "Nghệ An", "Quảng Ninh", "Tây Ninh", "Thanh Hóa", "Tỉnh/Thành phố khác"];

const input = "w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-orange-500";

export function CheckoutForm({ threshold, shipFee }: { threshold: number; shipFee: number }) {
  const { lines, subtotal, ready } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const shipping = subtotal >= threshold ? 0 : shipFee;
  const f = state.fields ?? {};

  if (ready && lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-xl font-black">Giỏ hàng đang trống</p>
        <Link href="/products" className="mt-5 inline-block rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white">Đến Nhà thuốc & Gói khám →</Link>
      </div>
    );
  }
  const items = JSON.stringify(lines.map((l) => ({ productId: l.productId, variant: l.variant, quantity: l.quantity })));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link href="/cart" className="flex items-center gap-1 text-sm font-bold text-orange-600"><ArrowLeft className="h-4 w-4" />Quay lại giỏ hàng</Link>
      <h1 className="mt-3 text-2xl font-black text-slate-900">Thông tin đặt hàng</h1>

      <form action={action} className="mt-5 grid gap-6 lg:grid-cols-[1fr_380px]">
        <input type="hidden" name="items" value={items} />
        <div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
          {state.error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{state.error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Họ và tên *</span><input name="name" required defaultValue={f.name} placeholder="Ví dụ: Nguyễn Văn An" className={input} /></label>
            <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Số điện thoại *</span><input name="phone" required inputMode="tel" defaultValue={f.phone} placeholder="0901 234 567" className={input} /></label>
            <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Email (không bắt buộc)</span><input name="email" type="email" defaultValue={f.email} placeholder="email@example.com" className={input} /></label>
            <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Địa chỉ nhận hàng *</span><input name="address" required defaultValue={f.address} placeholder="Số nhà, tên đường, phường/xã, quận/huyện" className={input} /></label>
            <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Tỉnh / Thành phố *</span>
              <select name="province" required defaultValue={f.province ?? ""} className={input}><option value="" disabled>Chọn Tỉnh/Thành phố</option>{PROVINCES.map((p) => <option key={p}>{p}</option>)}</select>
            </label>
            <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Ghi chú</span><textarea name="note" rows={3} defaultValue={f.note} placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..." className={input} /></label>
          </div>

          <div>
            <div className="mb-2 text-xs font-extrabold text-slate-600">Phương thức thanh toán</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-slate-200 p-4 has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50">
                <input type="radio" name="payment" value="cod" defaultChecked={f.payment !== "bank"} className="accent-orange-600" />
                <Banknote className="h-6 w-6 text-orange-600" />
                <span><span className="block text-sm font-extrabold">Thanh toán khi nhận hàng (COD)</span><span className="text-xs text-slate-500">Kiểm tra hàng trước khi thanh toán</span></span>
              </label>
              <label className="relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-slate-200 p-4 has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50">
                <input type="radio" name="payment" value="bank" defaultChecked={f.payment === "bank"} className="accent-orange-600" />
                <Landmark className="h-6 w-6 text-orange-600" />
                <span><span className="block text-sm font-extrabold">Chuyển khoản ngân hàng</span><span className="text-xs text-slate-500">Thông tin chuyển khoản hiện sau khi đặt</span></span>
              </label>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-6 shadow-sm lg:self-start">
          <h2 className="text-lg font-black">Đơn hàng ({lines.length} mặt hàng)</h2>
          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.image} alt="" className="h-14 w-14 shrink-0 rounded-xl bg-[#F6F7FA] object-contain p-1" />
                <div className="min-w-0 flex-1"><p className="line-clamp-2 text-[12.5px] font-bold">{l.name}</p><p className="text-[11px] text-slate-500">{l.variant} × {l.quantity}</p></div>
                <span className="text-[13px] font-black">{vnd(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600">
            <div className="flex justify-between"><dt>Tạm tính</dt><dd className="font-black text-slate-900">{vnd(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Phí vận chuyển</dt><dd className="font-black text-slate-900">{shipping === 0 ? "Miễn phí" : vnd(shipping)}</dd></div>
            <div className="flex justify-between pt-1"><dt className="font-extrabold text-slate-900">Thành tiền</dt><dd className="text-xl font-black text-orange-600">{vnd(subtotal + shipping)}</dd></div>
          </dl>
          <button disabled={pending || lines.length === 0} className="mt-5 w-full rounded-2xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] transition hover:bg-orange-700 disabled:opacity-60">{pending ? "Đang xử lý..." : "Đặt hàng"}</button>
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">Bằng việc đặt hàng, bạn đồng ý với <Link href="/terms" className="font-bold text-orange-600">Điều khoản sử dụng</Link> và <Link href="/privacy" className="font-bold text-orange-600">Chính sách bảo mật</Link>. Dược sĩ sẽ gọi xác nhận đơn trong ít phút.</p>
        </aside>
      </form>
    </div>
  );
}
