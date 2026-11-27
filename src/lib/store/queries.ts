import "server-only";
import { all, get, parseJson } from "@/lib/db";
import { slugify } from "@/lib/format";
import type { Article, Product, VideoItem, Variant } from "./types";

type ProductRow = {
  id: number; slug: string; sku: string; name: string; brand: string; category: string; origin: string;
  price: number; original_price: number | null; unit: string; pack_size: string | null; image: string | null;
  gallery: string; variants: string; badges: string; has_gift: number; rating: number; review_count: number;
  short_description: string | null; description: string | null; ingredients: string | null; usage: string | null;
  stock: number; sold_count: number; flash_sale: number; flash_limit: number; flash_sold: number;
};

function mapProduct(r: ProductRow): Product {
  const image = r.image ?? "";
  const variants = parseJson<Variant[]>(r.variants, []);
  return {
    id: r.id, slug: r.slug, sku: r.sku, name: r.name, brand: r.brand, category: r.category, origin: r.origin,
    price: r.price, originalPrice: r.original_price, unit: r.unit, packSize: r.pack_size ?? "", image,
    gallery: parseJson<string[]>(r.gallery, [image]),
    variants: variants.length ? variants : [{ label: r.pack_size ?? r.unit, price: r.price }],
    badges: parseJson<string[]>(r.badges, []), hasGift: !!r.has_gift, rating: r.rating, reviewCount: r.review_count,
    shortDescription: r.short_description ?? "", description: r.description ?? "", ingredients: r.ingredients ?? "",
    usage: r.usage ?? "", stock: r.stock, soldCount: r.sold_count, flashSale: !!r.flash_sale,
    flashLimit: r.flash_limit, flashSold: r.flash_sold,
  };
}

const norm = (s: string) => slugify(s).replace(/-/g, " ");

export type ProductFilter = {
  q?: string;
  category?: string;
  sort?: "bestseller" | "price_asc" | "price_desc";
  price?: string; // under100 | 100-300 | 300-500 | over500
  brand?: string;
  origin?: string;
};

export function listProducts(f: ProductFilter = {}): Product[] {
  let rows = all<ProductRow>("SELECT * FROM products WHERE status = 'active' ORDER BY sort, id").map(mapProduct);
  if (f.category) rows = rows.filter((p) => p.category === f.category);
  if (f.brand) rows = rows.filter((p) => p.brand === f.brand);
  if (f.origin) rows = rows.filter((p) => p.origin === f.origin);
  if (f.q?.trim()) {
    const terms = norm(f.q).split(" ").filter(Boolean);
    rows = rows.filter((p) => {
      const hay = norm(`${p.name} ${p.brand} ${p.shortDescription} ${p.ingredients} ${p.sku}`);
      return terms.every((t) => hay.includes(t));
    });
  }
  const ranges: Record<string, [number, number]> = {
    under100: [0, 100000], "100-300": [100000, 300000], "300-500": [300000, 500000], over500: [500000, Infinity],
  };
  if (f.price && ranges[f.price]) {
    const [lo, hi] = ranges[f.price];
    rows = rows.filter((p) => p.price >= lo && p.price < hi);
  }
  if (f.sort === "price_asc") rows.sort((a, b) => a.price - b.price);
  else if (f.sort === "price_desc") rows.sort((a, b) => b.price - a.price);
  else if (f.sort === "bestseller") rows.sort((a, b) => b.soldCount - a.soldCount);
  return rows;
}

export function getProduct(slug: string): Product | undefined {
  const r = get<ProductRow>("SELECT * FROM products WHERE slug = ? AND status = 'active'", [slug]);
  return r ? mapProduct(r) : undefined;
}

export function relatedProducts(p: Product, limit = 4): Product[] {
  return all<ProductRow>("SELECT * FROM products WHERE status='active' AND id != ? ORDER BY (category = ?) DESC, sold_count DESC LIMIT ?", [p.id, p.category, limit]).map(mapProduct);
}

export function flashProducts(): Product[] {
  return all<ProductRow>("SELECT * FROM products WHERE status='active' AND flash_sale = 1 ORDER BY sort").map(mapProduct);
}

export function featuredProducts(limit = 12): Product[] {
  return all<ProductRow>("SELECT * FROM products WHERE status='active' AND featured = 1 ORDER BY sort LIMIT ?", [limit]).map(mapProduct);
}

export function productFacets() {
  const rows = listProducts();
  const brands = [...new Set(rows.map((p) => p.brand).filter(Boolean))];
  const origins = [...new Set(rows.map((p) => p.origin).filter(Boolean))];
  return { brands, origins };
}

type ArticleRow = {
  id: number; slug: string; title: string; topic: string; topic_label: string; excerpt: string | null; image: string | null;
  body: string | null; reviewer: string | null; read_minutes: number; key_points: string; published_at: string;
};
function mapArticle(r: ArticleRow): Article {
  return {
    id: r.id, slug: r.slug, title: r.title, topic: r.topic, topicLabel: r.topic_label, excerpt: r.excerpt ?? "",
    image: r.image ?? "", body: r.body ?? "", reviewer: r.reviewer ?? "", readMinutes: r.read_minutes,
    keyPoints: parseJson<string[]>(r.key_points, []), publishedAt: r.published_at,
  };
}
export function listArticles(topic?: string): Article[] {
  const rows = topic
    ? all<ArticleRow>("SELECT * FROM articles WHERE status='published' AND topic = ? ORDER BY published_at DESC", [topic])
    : all<ArticleRow>("SELECT * FROM articles WHERE status='published' ORDER BY published_at DESC");
  return rows.map(mapArticle);
}
export function getArticle(slug: string): Article | undefined {
  const r = get<ArticleRow>("SELECT * FROM articles WHERE slug = ? AND status='published'", [slug]);
  return r ? mapArticle(r) : undefined;
}
export function articleTopics(): { topic: string; label: string }[] {
  return all<{ topic: string; label: string }>(
    "SELECT topic, MIN(topic_label) AS label FROM articles WHERE status='published' GROUP BY topic ORDER BY MIN(id)",
  );
}

export function listVideos(): VideoItem[] {
  return all<{ id: number; title: string; tag: string | null; overlay_title: string | null; overlay_subtitle: string | null; image: string | null }>(
    "SELECT * FROM videos ORDER BY sort, id",
  ).map((v) => ({
    id: v.id, title: v.title, tag: v.tag ?? "", overlayTitle: v.overlay_title ?? v.title,
    overlaySubtitle: v.overlay_subtitle ?? "", image: v.image ?? "",
  }));
}

export function getSettings(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of all<{ key: string; value: string }>("SELECT key, value FROM settings")) out[r.key] = r.value;
  return out;
}

export type HomeFeatured = { kicker: string; heading: string; subheading?: string; tag: string; body?: string; image: string; href: string };
export function homeFeatured(): HomeFeatured[] {
  return parseJson<HomeFeatured[]>(getSettings().home_featured, []);
}

export type OrderView = {
  code: string; status: string; paymentMethod: string; paymentStatus: string; total: number; subtotal: number;
  shippingFee: number; createdAt: string; customerName: string; phone: string; address: string; province: string;
  items: { name: string; variant: string | null; image: string | null; price: number; quantity: number }[];
};
export function getOrder(code: string, phone?: string): OrderView | undefined {
  const o = get<{
    id: number; code: string; status: string; payment_method: string; payment_status: string; total: number;
    subtotal: number; shipping_fee: number; created_at: string; customer_name: string; customer_phone: string;
    shipping_address: string | null; province: string | null;
  }>("SELECT * FROM orders WHERE UPPER(code) = UPPER(?)", [code.trim()]);
  if (!o) return undefined;
  if (phone !== undefined && o.customer_phone.replace(/\D/g, "") !== phone.replace(/\D/g, "")) return undefined;
  const items = all<{ name: string; variant: string | null; image: string | null; price: number; quantity: number }>(
    "SELECT name, variant, image, price, quantity FROM order_items WHERE order_id = ?", [o.id],
  );
  return {
    code: o.code, status: o.status, paymentMethod: o.payment_method, paymentStatus: o.payment_status, total: o.total,
    subtotal: o.subtotal, shippingFee: o.shipping_fee, createdAt: o.created_at, customerName: o.customer_name,
    phone: o.customer_phone, address: o.shipping_address ?? "", province: o.province ?? "", items,
  };
}
