import { Activity, Check, ShoppingBag, Smartphone, Gift } from "lucide-react";

export const metadata = { title: "Tải ứng dụng — TNStrokeGuard" };

export default function DownloadApp() {
  const perks = ["Đồng bộ lịch sử tầm soát đột quỵ & sổ đo huyết áp cá nhân.", "Nhận Voucher ưu đãi sản phẩm bảo vệ mạch máu & gói khám MRI.", "Kết nối trực tiếp Dược sĩ & Chuyên gia tim mạch 24/7."];
  const features = [[Activity, "Theo dõi Chỉ số Sinh học"], [ShoppingBag, "Mua sắm Dược phẩm Chính hãng"], [Gift, "Tích điểm Đổi Gói khám"]] as const;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 text-white md:grid-cols-[1.3fr_1fr] md:p-12">
        <div>
          <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em]">Phân hệ PH-06 · Hệ sinh thái di động</span>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">Ứng dụng Chăm sóc Sức khỏe Chủ động TN Mall</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="rounded-2xl bg-black px-5 py-3 text-left"><span className="block text-[10px] font-semibold opacity-70">DOWNLOAD ON THE</span><span className="text-lg font-black">App Store</span></a>
            <a href="#" className="rounded-2xl bg-black px-5 py-3 text-left"><span className="block text-[10px] font-semibold opacity-70">GET IT ON</span><span className="text-lg font-black">Google Play</span></a>
          </div>
        </div>
        <div className="flex justify-center"><div className="flex h-56 w-36 items-center justify-center rounded-[2rem] border-4 border-white/60 bg-white/10"><Smartphone className="h-16 w-16" /></div></div>
      </div>
      <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
        <h2 className="text-lg font-black">Đặc quyền Thành viên App</h2>
        <ul className="mt-4 space-y-3">{perks.map((p) => <li key={p} className="flex gap-3 text-sm font-semibold text-slate-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"><Check className="h-4 w-4" /></span>{p}</li>)}</ul>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {features.map(([I, t]) => <div key={t} className="rounded-3xl bg-white p-6 text-center shadow-sm"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><I className="h-7 w-7" /></span><p className="mt-3 font-black text-slate-900">{t}</p></div>)}
      </div>
    </div>
  );
}
