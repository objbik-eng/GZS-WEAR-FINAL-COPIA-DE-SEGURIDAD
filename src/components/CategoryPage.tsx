import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { getProductsByType } from "@/lib/catalog";
import {
  CATEGORY_SLUGS,
  CATEGORY_TYPES,
  categoryPath,
  homePath,
  type CategoryId,
} from "@/lib/routes";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import CategoryShowcase from "@/components/CategoryShowcase";

const TITLES: Record<CategoryId, { es: string; en: string }> = {
  camisetas: { es: "Camisetas colección Disruptive", en: "T-Shirts — Disruptive collection" },
  sudaderas: { es: "Sudaderas colección Disruptive", en: "Sweatshirts — Disruptive collection" },
  accesorios: { es: "Accesorios colección Disruptive", en: "Accessories — Disruptive collection" },
};

const DESCRIPTIONS: Record<CategoryId, { es: string; en: string }> = {
  camisetas: {
    es: "Camisetas regulares y oversize unisex de la colección DISRUPTIVE de GZS WEAR. Diseño exclusivo, tallas S a 2XL.",
    en: "Unisex regular and oversized t-shirts from the GZS WEAR DISRUPTIVE collection. Exclusive designs, sizes S to 2XL.",
  },
  sudaderas: {
    es: "Sudaderas con y sin capucha unisex de la colección DISRUPTIVE de GZS WEAR. Diseño exclusivo, tallas S a 2XL.",
    en: "Unisex hoodies and crewneck sweatshirts from the GZS WEAR DISRUPTIVE collection. Exclusive designs, sizes S to 2XL.",
  },
  accesorios: {
    es: "Gorras y gorros unisex de talla única de la colección DISRUPTIVE de GZS WEAR.",
    en: "One-size unisex caps and beanies from the GZS WEAR DISRUPTIVE collection.",
  },
};

export function categoryStaticParams() {
  const out: { lang: string; cat: string }[] = [];
  for (const lang of LOCALES) {
    for (const cat of Object.keys(CATEGORY_SLUGS) as CategoryId[]) {
      out.push({ lang, cat });
    }
  }
  return out;
}

export function categoryMetadata(cat: CategoryId, lang: string): Metadata {
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: `${TITLES[cat].es} | GZS WEAR`,
    titleEn: `${TITLES[cat].en} | GZS WEAR`,
    descriptionEs: DESCRIPTIONS[cat].es,
    descriptionEn: DESCRIPTIONS[cat].en,
    esPath: categoryPath(cat, "es"),
    enPath: categoryPath(cat, "en"),
  });
}

export default function CategoryPage({ cat, lang }: { cat: CategoryId; lang: string }) {
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale: Locale = lang === "en" ? "en" : "es";
  const products = getProductsByType(CATEGORY_TYPES[cat]);
  if (!products.length) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: locale === "es" ? "Inicio" : "Home", path: homePath(locale) },
    { name: TITLES[cat][locale], path: categoryPath(cat, locale) },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {(
        <header className="bg-forest text-white">
          <div className="container-gzs pt-12 lg:pt-16 pb-10 lg:pb-14">
            <nav aria-label={locale === "es" ? "Ruta de navegación" : "Breadcrumb"} className="text-xs text-white/80 mb-5">
              <a href={homePath(locale)}>{locale === "es" ? "Inicio" : "Home"}</a>
              <span className="mx-2">/</span>
              <span className="text-white font-semibold">{cat === "camisetas" ? (locale === "es" ? "Camisetas" : "T-shirts") : cat === "sudaderas" ? (locale === "es" ? "Sudaderas" : "Sweatshirts") : (locale === "es" ? "Accesorios" : "Accessories")}</span>
            </nav>
            <h1 className="font-ahsing font-normal text-white text-[clamp(32px,5.5vw,64px)] uppercase leading-[1.02]">
              {cat === "camisetas" ? (locale === "es" ? "Camisetas colección" : "T-shirts collection") : cat === "sudaderas" ? (locale === "es" ? "Sudaderas colección" : "Sweatshirts collection") : (locale === "es" ? "Accesorios colección" : "Accessories collection")}
              <span className="block mt-3 font-garet font-[850] text-brand-red text-[clamp(20px,3vw,32px)] tracking-[0.16em]">Disruptive</span>
            </h1>
            <p className="text-white/85 mt-3 max-w-2xl">{DESCRIPTIONS[cat][locale]}</p>
          </div>
        </header>
      )}
      <CategoryShowcase products={products} locale={locale} alternating />
    </>
  );
}
