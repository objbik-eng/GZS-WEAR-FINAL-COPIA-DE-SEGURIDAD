import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { getAllProducts, TYPE_FILTERS, type ProductType } from "@/lib/catalog";
import { pageMetadata, itemListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { shopPath, homePath } from "@/lib/routes";
import ShopClient from "./ShopClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "Tienda — Colección DISRUPTIVE",
    titleEn: "Shop — DISRUPTIVE Collection",
    descriptionEs:
      "Compra la colección DISRUPTIVE de GZS WEAR: camisetas regulares y oversize, sudaderas con y sin capucha, gorras y gorros unisex. Diseño exclusivo, fabricación bajo pedido en Europa.",
    descriptionEn:
      "Shop the GZS WEAR DISRUPTIVE collection: regular and oversized tees, hoodies and crewnecks, caps and beanies. Exclusive designs made to order in Europe.",
    esPath: "/tienda",
    enPath: "/en/shop",
  });
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ f?: string }>;
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale: Locale = lang === "en" ? "en" : "es";
  const { f } = await searchParams;
  const initialFilter = (TYPE_FILTERS.some((x) => x.id === f) ? f : "all") as ProductType | "all";
  const products = getAllProducts();

  const jsonLd = [
    itemListJsonLd(products, locale),
    breadcrumbJsonLd([
      { name: locale === "es" ? "Inicio" : "Home", path: homePath(locale) },
      { name: locale === "es" ? "Tienda" : "Shop", path: shopPath(locale) },
    ]),
  ];

  return (
    <div className="container-gzs py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="text-xs text-smoke mb-4">
        <a href={homePath(locale)}>{locale === "es" ? "Inicio" : "Home"}</a>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">{locale === "es" ? "Tienda" : "Shop"}</span>
      </nav>
      <header className="mb-8">
        <span className="eyebrow">DISRUPTIVE</span>
        <h1 className="text-[clamp(30px,4.5vw,52px)] font-black mt-2">
          {locale === "es" ? "Tienda — Colección DISRUPTIVE" : "Shop — DISRUPTIVE Collection"}
        </h1>
        <p className="text-smoke mt-2 max-w-2xl">
          {locale === "es"
            ? "20 piezas unisex de streetwear. Sin relleno, solo identidad. Todas las prendas se fabrican bajo pedido en talleres europeos."
            : "20 unisex streetwear pieces. No filler, just identity. Every garment is made to order in European workshops."}
        </p>
      </header>
      <ShopClient products={products} locale={locale} initialFilter={initialFilter} />
    </div>
  );
}
