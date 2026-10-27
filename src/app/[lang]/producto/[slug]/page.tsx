import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { getAllProducts, getProductBySlug, getRelatedRandom, primaryImage } from "@/lib/catalog";
import { productPath, shopPath, homePath, absoluteUrl } from "@/lib/routes";
import { pageMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    for (const p of getAllProducts()) {
      params.push({ lang, slug: p.slug[lang] });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  const product = getProductBySlug(slug, locale);
  if (!product) return {};
  return pageMetadata({
    locale,
    titleEs: `${product.name.es} — ${product.collection}`,
    titleEn: `${product.name.en} — ${product.collection}`,
    descriptionEs: `${product.name.es}. ${product.description.es.slice(0, 170)}`,
    descriptionEn: `${product.name.en}. ${product.description.en.slice(0, 170)}`,
    esPath: productPath(product, "es"),
    enPath: productPath(product, "en"),
    image: primaryImage(product),
  });
}

export default async function ProductPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale: Locale = lang === "en" ? "en" : "es";
  const product = getProductBySlug(slug, locale);
  if (!product) notFound();

  const fallbackRelated = getRelatedRandom(product, 4);

  const jsonLd = [
    productJsonLd(product, locale),
    breadcrumbJsonLd([
      { name: locale === "es" ? "Inicio" : "Home", path: homePath(locale) },
      { name: locale === "es" ? "Tienda" : "Shop", path: shopPath(locale) },
      { name: product.name[locale], path: productPath(product, locale) },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <meta property="og:url" content={absoluteUrl(productPath(product, locale))} />
      <ProductDetailClient product={product} related={fallbackRelated} locale={locale} />
    </>
  );
}
