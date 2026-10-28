import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { getAllProducts, TYPE_FILTERS, type ProductType } from "@/lib/catalog";
import { pageMetadata, itemListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { shopPath, homePath } from "@/lib/routes";
import ShopClient from "./ShopClient";
import CategoryCards from "@/components/CategoryCards";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "Tienda — Colección DISRUPTIVE | GZS WEAR",
    titleEn: "Shop — DISRUPTIVE Collection | GZS WEAR",
    descriptionEs:
      "Compra la colección DISRUPTIVE de GZS WEAR: camisetas regulares y oversize, sudaderas con y sin capucha, gorras y gorros unisex de diseño exclusivo.",
    descriptionEn:
      "Shop the GZS WEAR DISRUPTIVE collection: regular and oversized tees, hoodies and crewnecks, caps and beanies with exclusive designs.",
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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* PORTADA */}
      <section className="relative overflow-hidden bg-ink text-white min-h-[60vh] lg:min-h-[70vh] flex items-center">
        <Image
          src="/images/hero-tienda.jpg"
          alt="Colección DISRUPTIVE de GZS WEAR"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/28 to-black/10" />
        <div className="container-gzs relative z-10 py-20">
          <h1 className="font-ahsing font-normal text-[clamp(40px,7.5vw,88px)] uppercase leading-none text-white">
            {t(locale)}
          </h1>
          <p className="mt-3 text-brand-red font-garet font-[850] uppercase tracking-[0.16em] text-[clamp(20px,3vw,32px)]">
            Disruptive
          </p>
        </div>
      </section>

      <div className="container-gzs py-14 lg:py-20">
        <nav aria-label="breadcrumb" className="text-xs text-smoke mb-6">
          <a href={homePath(locale)}>{locale === "es" ? "Inicio" : "Home"}</a>
          <span className="mx-2">/</span>
          <span className="text-ink font-semibold">{locale === "es" ? "Tienda" : "Shop"}</span>
        </nav>

        <CategoryCards locale={locale} />

        <ShopClient products={products} locale={locale} initialFilter={initialFilter} />
      </div>
    </div>
  );
}

function t(locale: Locale) {
  return locale === "es" ? "Colección" : "Collection";
}
