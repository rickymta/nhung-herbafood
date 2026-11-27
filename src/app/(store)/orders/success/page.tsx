import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ClearCartOnMount } from "@/components/store/OrderBits";
import { vnd } from "@/lib/format";
import { getOrder, getSettings } from "@/lib/store/queries";

export const metadata = { title: "Đặt hàng thành công — TNStrokeGuard" };

export default async function SuccessPage({ searchParams }: PageProps<"/orders/success">) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code : "";
  const order = code ? getOrder(code) : undefined;
  if (!order) notFound();
  const s = getSettings();
  const bank = order.paymentMethod === "bank_transfer";
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ClearCartOnMount />
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-black text-slate-900">Đặt hàng thành công!</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Dược sĩ sẽ gọi điện xác nhận đơn hàng với bạn trong ít phút.</p>
        <div className="mx-auto mt-6 w-fit rounded-2xl bg-orange-50 px-8 py-4">
          <div className="text-xs font-bold text-orange-700">MÃ ĐƠN HÀNG</div>
          <div className="text-3xl font-black tracking-wider text-orange-600">{order.code}</div>
        </div>
        <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-left text-sm">
          {order.items.map((i, k) => (
            <li key={k} className="flex justify-between gap-3"><span className="font-semibold">{i.name} <span className="text-slate-400">× {i.quantity}</span></span><span className="font-black">{vnd(i.price * i.quantity)}</span></li>
          ))}
          <li className="flex justify-between border-t border-slate-100 pt-2 text-slate-500"><span>Phí vận chuyển</span><span className="font-bold">{order.shippingFee ? vnd(order.shippingFee) : "Miễn phí"}</span></li>
          <li className="flex justify-between text-base"><span className="font-extrabold">Tổng thanh toán</span><span className="text-xl font-black text-orange-600">{vnd(order.total)}</span></li>
        </ul>
        {bank && (
          <div className="mt-5 rounded-2xl border border-dashed border-orange-300 bg-orange-50/60 p-4 text-left text-sm">
            <div className="font-black text-orange-700">Thông tin chuyển khoản</div>
            <dl className="mt-2 space-y-1 font-semibold text-slate-700">
              <div>Ngân hàng: <b>{s.bank_name}</b></div><div>Số tài khoản: <b>{s.bank_account}</b></div>
              <div>Chủ tài khoản: <b>{s.bank_holder}</b></div><div>Nội dung: <b>{order.code}</b></div>
            </dl>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/orders/lookup?code=${order.code}`} className="rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)]">Tra cứu đơn hàng</Link>
          <Link href="/products" className="rounded-2xl bg-[#FFF5EB] px-6 py-3 text-sm font-bold text-orange-600">Tiếp tục mua sắm</Link>
        </div>
      </div>
    </div>
  );
}
