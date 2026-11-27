import { get } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  const v = get<{ v: string }>("SELECT sqlite_version() AS v");
  const p = get<{ n: number }>("SELECT COUNT(*) AS n FROM products");
  return Response.json({ ok: true, sqlite: v?.v, products: p?.n });
}
