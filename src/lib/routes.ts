import type { Locale } from "@/i18n/dict";
import type { Product } from "@/lib/catalog";

/* Rutas internas (físicas bajo app/[lang]) y alias públicos por idioma. */
export const ROUTE_ALIASES: Record<string, { es: string; en: string }> = {
  shop: { es: "tienda", en: "shop" },
  product: { es: "producto", en: "product" },
  cart: { es: "carrito", en: "cart" },
  contact: { es: "contacto", en: "contact" },
  legal: { es: "legal", en: "legal" },
};

export const LEGAL_SLUGS: Record<string, { es: string; en: string }> = {
  "aviso-legal": { es: "aviso-legal", en: "legal-notice" },
  privacidad: { es: "privacidad", en: "privacy" },
  terminos: { es: "terminos", en: "terms" },
  cookies: { es: "cookies", en: "cookies" },
  "envios-devoluciones": { es: "envios-devoluciones", en: "shipping-returns" },
};

export type CategoryId = "camisetas" | "sudaderas" | "accesorios";

export const CATEGORY_SLUGS: Record<CategoryId, { es: string; en: string }> = {
  camisetas: { es: "camisetas", en: "t-shirts" },
  sudaderas: { es: "sudaderas", en: "sweatshirts" },
  accesorios: { es: "accesorios", en: "accessories" },
};

export const CATEGORY_TYPES: Record<CategoryId, Product["type"][]> = {
  camisetas: ["tee", "oversize"],
  sudaderas: ["crewneck", "hoodie"],
  accesorios: ["cap", "beanie"],
};

export function homePath(locale: Locale): string {
  return locale === "es" ? "/" : "/en";
}

export function categoryPath(cat: CategoryId, locale: Locale): string {
  const slug = CATEGORY_SLUGS[cat][locale === "es" ? "es" : "en"];
  return locale === "es" ? `/${slug}` : `/en/${slug}`;
}

export function shopPath(locale: Locale): string {
  return locale === "es" ? "/tienda" : "/en/shop";
}

export function cartPath(locale: Locale): string {
  return locale === "es" ? "/carrito" : "/en/cart";
}

export function checkoutPath(locale: Locale): string {
  return locale === "es" ? "/checkout" : "/en/checkout";
}

export function contactPath(locale: Locale): string {
  return locale === "es" ? "/contacto" : "/en/contact";
}

export function productPath(p: Product, locale: Locale): string {
  const slug = p.slug[locale];
  return locale === "es" ? `/producto/${slug}` : `/en/product/${slug}`;
}

export function legalPath(key: string, locale: Locale): string {
  const slug = LEGAL_SLUGS[key]?.[locale === "es" ? "es" : "en"] || key;
  return locale === "es" ? `/legal/${slug}` : `/en/legal/${slug}`;
}

/** URL canónica absoluta de una ruta pública. */
export function absoluteUrl(publicPath: string): string {
  const base = (process.env.SITE_URL || "https://gzswear.roadshop.online").replace(/\/$/, "");
  return `${base}${publicPath === "/" ? "" : publicPath}`;
}

/** Par alternante hreflang de una ruta interna para es/en. */
export function alternatesFor(esPath: string, enPath: string) {
  return {
    canonical: absoluteUrl(esPath),
    languages: {
      "es-ES": absoluteUrl(esPath),
      "en-US": absoluteUrl(enPath),
      en: absoluteUrl(enPath),
      "x-default": absoluteUrl(esPath),
    },
  };
}
