import Link from "next/link";
import { OrderTimeline } from "@/components/store/OrderBits";
import { PageHead } from "@/components/store/PageHead";
import { dateVN, vnd } from "@/lib/format";
import { getOrder } from "@/lib/store/queries";

export const metadata = { title: "Tra cứu đơn hàng — TNStrokeGuard" };

const PAY: Record<string, string> = { cod: "Thanh toán khi nhận hàng (COD)", bank_transfer: "Chuyển khoản ngân hàng" };

export default async function LookupPage({ searchParams }: PageProps<"/orders/lookup">) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code.trim() : "";
  const phone = typeof sp.phone === "string" ? sp.phone.trim() : "";
  const searched = !!(code || phone);
  const order = code && phone ? getOrder(code, phone) : undefined;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead code="PH-04.6 · Tra cứu Đơn hàng" title="Kiểm Tra Trạng Thái Đơn Hàng" sub="Nhập Mã đơn hàng (ví dụ: TNSG-123456) và Số điện thoại đặt hàng để kiểm tra tiến độ xử lý." />
      <form className="mt-6 grid gap-3 rounded-3xl bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto]">
        <input name="code" defaultValue={code} placeholder="Mã đơn hàng: TNSG-123456" className="rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500" />
        <input name="phone" defaultValue={phone} placeholder="Số điện thoại đặt hàng" className="rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500" />
        <button className="rounded-2xl bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)]">Tra cứu</button>
      </form>

      {order ? (
        <div className="mt-6 space-y-5 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><div className="text-xs font-bold text-slate-400">MÃ ĐƠN HÀNG</div><div className="text-2xl font-black text-orange-600">{order.code}</div></div>
            <div className="text-right text-sm font-semibold text-slate-500">Đặt ngày {dateVN(order.createdAt, true)}</div>
          </div>
          <OrderTimeline status={order.status} />
          <div className="grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2">
            <div><div className="text-xs font-bold text-slate-400">NGƯỜI NHẬN</div><div className="font-bold">{order.customerName}</div><div className="text-slate-500">{order.address}, {order.province}</div></div>
            <div><div className="text-xs font-bold text-slate-400">THANH TOÁN</div><div className="font-bold">{PAY[order.paymentMethod] ?? order.paymentMethod}</div><div className="text-slate-500">{order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}</div></div>
          </div>
          <ul className="space-y-2 border-t border-slate-100 pt-4 text-sm">
            {order.items.map((i, k) => <li key={k} className="flex justify-between gap-3"><span className="font-semibold">{i.name} <span className="text-slate-400">({i.variant}) × {i.quantity}</span></span><span className="font-black">{vnd(i.price * i.quantity)}</span></li>)}
            <li className="flex justify-between pt-2 text-base"><span className="font-extrabold">Tổng cộng</span><span className="text-xl font-black text-orange-600">{vnd(order.total)}</span></li>
          </ul>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="font-extrabold text-slate-800">{searched ? (code && phone ? "Chưa tìm thấy đơn hàng nào khớp thông tin" : "Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại") : "Nhập thông tin để tra cứu đơn hàng của bạn"}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Nếu bạn vừa đặt mua qua tổng đài Zalo OA, dược sĩ sẽ gửi mã vận đơn trực tiếp tới số điện thoại của bạn.</p>
          <Link href="/products" className="mt-5 inline-block rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white">Đến Nhà thuốc & Gói khám →</Link>
        </div>
      )}
    </div>
  );
}
