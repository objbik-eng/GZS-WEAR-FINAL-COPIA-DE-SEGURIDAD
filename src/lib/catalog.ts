import snapshot from "@/lib/data/catalog.json";
import type { Locale } from "@/i18n/dict";

export type ProductType = "tee" | "oversize" | "crewneck" | "hoodie" | "cap" | "beanie";

export interface SizeGuide {
  unit: string;
  sizes: string[];
  rows: { labelEs: string; labelEn: string; values: (number | string)[] }[];
  toleranceEs: string;
  toleranceEn: string;
}

export interface ProductColor {
  id: string;
  nameEn: string;
  nameEs: string;
  hex: string;
  variants: Record<string, number>;
  variantIds: number[];
  images: { front: string | null; back: string | null; gallery: string[] };
}

export interface Product {
  productId: string;
  blueprintId: number;
  providerId: number;
  type: ProductType;
  collection: string;
  slug: { es: string; en: string };
  name: { es: string; en: string };
  description: { es: string; en: string };
  fabric: { es: string; en: string };
  fit: { es: string; en: string };
  priceEurCents: number;
  currency: string;
  unisex: boolean;
  sizes: string[];
  colors: ProductColor[];
  sizeGuide: SizeGuide;
  gpsr: Record<string, string> | null;
  modelImage: string | null;
  tags: string[];
  updatedAt: string;
}

export const PRODUCTS: Product[] = (snapshot as { products: Product[] }).products;
export const SHOP_ID = (snapshot as { shopId: string }).shopId;

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string, locale: Locale): Product | undefined {
  return PRODUCTS.find((p) => p.slug[locale] === slug);
}

export function getProductByProductId(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.productId === id);
}

export function getProductsByType(types: ProductType[]): Product[] {
  return PRODUCTS.filter((p) => types.includes(p.type));
}

/** Slugs ES de la sección "Más vendidos" (orden fijo decidido por la marca). */
const BEST_SELLER_SLUGS = [
  "camiseta-florece-donde-estes",
  "camiseta-street-league",
  "oversize-alas-silencio",
  "sudadera-good-vibes",
  "sudadera-silencio-rojo",
  "hoodie-cerezas-less-noise",
];

export function getBestSellers(): Product[] {
  return BEST_SELLER_SLUGS.map((slug) => PRODUCTS.find((p) => p.slug.es === slug)).filter(
    (p): p is Product => Boolean(p),
  );
}

/** Mapas de slugs para el cambio de idioma en fichas de producto. */
export const SLUG_ES_TO_EN: Record<string, string> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug.es, p.slug.en]),
);
export const SLUG_EN_TO_ES: Record<string, string> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug.en, p.slug.es]),
);

/** Productos relacionados aleatorios de entre TODAS las categorías. */
export function getRelatedRandom(product: Product, n = 4): Product[] {
  const pool = PRODUCTS.filter((p) => p.productId !== product.productId);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

export const TYPE_FILTERS: { id: ProductType | "all"; labelKey: string }[] = [
  { id: "all", labelKey: "shop.filter.all" },
  { id: "tee", labelKey: "shop.filter.tees" },
  { id: "oversize", labelKey: "shop.filter.oversize" },
  { id: "crewneck", labelKey: "shop.filter.crewneck" },
  { id: "hoodie", labelKey: "shop.filter.hoodie" },
  { id: "cap", labelKey: "shop.filter.cap" },
  { id: "beanie", labelKey: "shop.filter.beanie" },
];

export function localizeName(p: Product, locale: Locale): string {
  return p.name[locale];
}

export function primaryImage(p: Product): string {
  return p.colors[0]?.images.front || p.colors[0]?.images.gallery[0] || "";
}

export function backImage(p: Product): string | null {
  return p.colors[0]?.images.back || null;
}

/** Variante de Printify para una combinación color/talla (con fallback al primer color). */
export function resolveVariantId(p: Product, colorId: string, size: string): number | null {
  const color = p.colors.find((c) => c.id === colorId) || p.colors[0];
  return color?.variants[size] ?? null;
}
