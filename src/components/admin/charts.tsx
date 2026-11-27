"use client";
import { useState } from "react";
import {
  Area, Bar, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const nf = new Intl.NumberFormat("vi-VN");
const nf1 = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 });

type Pt = { label: string; gmv: number; orders: number };

export function GmvChart({ daily, weekly, title, height = 320 }: { daily: Pt[]; weekly: Pt[]; title: string; height?: number }) {
  const [mode, setMode] = useState<"d" | "w">("d");
  const data = mode === "d" ? daily : weekly;
  const max = Math.max(...daily.map((d) => d.gmv), ...weekly.map((d) => d.gmv), 1);
  const [div, unit] = max >= 1e9 ? [1e9, "tỷ đ"] : [1e6, "triệu đ"];
  const rows = data.map((d) => ({ ...d, g: d.gmv / div }));
  return (
    <div>
      <div className="adm-ch">
        <h3>{title}</h3>
        <div className="adm-seg">
          <button type="button" className={mode === "d" ? "on" : ""} onClick={() => setMode("d")}>Theo ngày</button>
          <button type="button" className={mode === "w" ? "on" : ""} onClick={() => setMode("w")}>Theo tuần</button>
        </div>
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gmvFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="1" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f6" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={18} />
            <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={46} tickFormatter={(v) => nf1.format(v)} label={{ value: `Doanh số (${unit})`, angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8", dx: 8 }} />
            <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={36} allowDecimals={false} />
            <Tooltip formatter={(v, n) => (n === "Đơn hàng hợp lệ" ? [nf.format(Number(v)), n] : [`${nf1.format(Number(v))} ${unit}`, n])} />
            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="r" dataKey="orders" name="Đơn hàng hợp lệ" fill="#3b82f6" opacity={0.85} radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Area yAxisId="l" type="monotone" dataKey="g" name="Doanh số (GMV)" stroke="#10b981" strokeWidth={2} fill="url(#gmvFill)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export type Series = { key: string; name: string; color: string; axis?: "l" | "r" };
export function MixChart({ data, xKey, bars, lines, height = 280, rightSuffix = "", leftSuffix = "" }: {
  data: Record<string, string | number>[]; xKey: string; bars: Series[]; lines?: Series[]; height?: number; rightSuffix?: string; leftSuffix?: string;
}) {
  const hasRight = [...bars, ...(lines ?? [])].some((s) => s.axis === "r");
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ComposedChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} interval={0} />
          <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => nf1.format(v) + leftSuffix} />
          {hasRight && <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => nf1.format(v) + rightSuffix} />}
          <Tooltip formatter={(v) => nf1.format(Number(v))} />
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {bars.map((b) => <Bar key={b.key} yAxisId={b.axis ?? "l"} dataKey={b.key} name={b.name} fill={b.color} radius={[4, 4, 0, 0]} maxBarSize={26} />)}
          {(lines ?? []).map((l) => <Line key={l.key} yAxisId={l.axis ?? "l"} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.4} dot={{ r: 3 }} />)}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Donut({ items, center, sub, size = 190 }: { items: { name: string; value: number; color: string }[]; center: string; sub?: string; size?: number }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  const data = total ? items : [{ name: "Chưa có dữ liệu", value: 1, color: "#e2e8f0" }];
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <PieChart width={size} height={size}>
        <Pie data={data} dataKey="value" innerRadius={size * 0.33} outerRadius={size * 0.47} stroke="none" paddingAngle={total ? 2 : 0}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        {total > 0 && <Tooltip formatter={(v) => nf.format(Number(v))} />}
      </PieChart>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", pointerEvents: "none" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{center}</div>
          {sub && <div style={{ fontSize: 12, color: "#64748b" }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}
