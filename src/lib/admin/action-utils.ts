import "server-only";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { safeBack } from "./common";

export function backOf(fd: FormData, fallback: string) {
  return safeBack(fd.get("_back"), fallback);
}
/** Revalidate the whole admin tree + storefront, then redirect back with a toast message. */
export function finish(back: string, ok?: string, storefront = false): never {
  revalidatePath("/admin", "layout");
  if (storefront) revalidatePath("/", "layout");
  const u = new URL(back, "http://x");
  if (ok) u.searchParams.set("ok", ok);
  redirect(u.pathname + u.search);
}
export const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
export const int = (fd: FormData, k: string, d = 0) => {
  const n = Math.round(Number(String(fd.get(k) ?? "").replace(/[^\d.-]/g, "")));
  return Number.isFinite(n) ? n : d;
};
export const flt = (fd: FormData, k: string, d = 0) => {
  const n = Number(String(fd.get(k) ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : d;
};
