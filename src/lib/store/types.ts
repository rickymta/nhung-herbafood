export type Variant = { label: string; price: number };

export type Product = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: "supplement" | "package" | "device" | string;
  origin: string;
  price: number;
  originalPrice: number | null;
  unit: string;
  packSize: string;
  image: string;
  gallery: string[];
  variants: Variant[];
  badges: string[];
  hasGift: boolean;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  ingredients: string;
  usage: string;
  stock: number;
  soldCount: number;
  flashSale: boolean;
  flashLimit: number;
  flashSold: number;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  topic: string;
  topicLabel: string;
  excerpt: string;
  image: string;
  body: string;
  reviewer: string;
  readMinutes: number;
  keyPoints: string[];
  publishedAt: string;
};

export type VideoItem = {
  id: number;
  title: string;
  tag: string;
  overlayTitle: string;
  overlaySubtitle: string;
  image: string;
};

export type CartLine = {
  key: string;
  productId: number;
  slug: string;
  name: string;
  image: string;
  variant: string;
  unit: string;
  price: number;
  originalPrice: number | null;
  quantity: number;
  category: string;
};

export const CATEGORY_LABEL: Record<string, string> = {
  supplement: "Thực phẩm chức năng",
  package: "Gói khám tầm soát",
  device: "Thiết bị y tế",
};

export const COUNTRY_FLAG: Record<string, string> = {
  "Nhật Bản": "🇯🇵",
  "Việt Nam": "🇻🇳",
  "Hoa Kỳ": "🇺🇸",
  "Hàn Quốc": "🇰🇷",
};
