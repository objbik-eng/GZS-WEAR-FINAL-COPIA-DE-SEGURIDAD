import "server-only";
import { getProductByPrintifyId, PRODUCTS, type Product } from "@/lib/catalog";
import { quoteShipping, type CartLine, type ShippingQuote } from "@/lib/shipping";
import type { Locale } from "@/i18n/dict";
import { ApiError } from "@/lib/supabase";

export interface RawCartItem {
  id: string;          // printify product id
  qty: number | string;
  colorId: string;
  size: string;
}

export interface PricedLine {
  product_id: string;
  slug: { es: string; en: string };
  name: { es: string; en: string };
  type: Product["type"];
  unit_price_cents: number;
  qty: number;
  colorId: string;
  colorLabel: { es: string; en: string };
  size: string;
  variant_id: number;
}

const MAX_QTY = 10;

export function validateCart(rawItems: unknown): PricedLine[] {
  if (!Array.isArray(rawItems) || !rawItems.length) throw new ApiError(400, "La cesta está vacía");
  if (rawItems.length > 30) throw new ApiError(400, "Demasiadas líneas en la cesta");
  const lines: PricedLine[] = [];
  for (const raw of rawItems as RawCartItem[]) {
    const product = getProductByPrintifyId(String(raw?.id || ""));
    if (!product) throw new ApiError(400, "Producto no disponible");
    const qty = Number(raw.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new ApiError(400, "Cantidad no válida");
    const color = product.colors.find((c) => c.id === raw.colorId) || product.colors[0];
    const size = String(raw.size || "");
    const variantId = color?.variants[size];
    if (!variantId) throw new ApiError(400, `Variante no disponible: ${product.slug.es}`);
    lines.push({
      product_id: product.printifyId,
      slug: product.slug,
      name: product.name,
      type: product.type,
      unit_price_cents: product.priceEurCents,
      qty,
      colorId: color.id,
      colorLabel: { es: color.nameEs, en: color.nameEn },
      size,
      variant_id: variantId,
    });
  }
  return lines;
}

export function computeOrder(lines: PricedLine[], countryCode: string) {
  const subtotal = lines.reduce((s, l) => s + l.unit_price_cents * l.qty, 0);
  const cartLines: CartLine[] = lines.map((l) => ({ type: l.type, qty: l.qty }));
  const shipping: ShippingQuote = quoteShipping(cartLines, subtotal, countryCode);
  return {
    subtotal,
    shippingCents: shipping.costCents,
    total: subtotal + shipping.costCents,
    shipping,
  };
}

export function catalogSummary(locale: Locale) {
  return PRODUCTS.map((p) => ({
    id: p.printifyId,
    slug: p.slug[locale],
    name: p.name[locale],
    price: p.priceEurCents,
    type: p.type,
  }));
}
