export function PageHead({ code, title, sub, center }: { code: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <span className="inline-block rounded-full bg-orange-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-700">{code}</span>
      <h1 className="mt-3 text-2xl font-black leading-tight text-slate-900 md:text-[32px]">{title}</h1>
      {sub && <p className="mt-2 max-w-3xl text-[15px] font-medium leading-relaxed text-slate-600">{sub}</p>}
    </div>
  );
}
