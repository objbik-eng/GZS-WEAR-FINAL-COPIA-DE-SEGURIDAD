import type { Metadata } from "next";
import type { Product } from "@/lib/catalog";
import type { Locale } from "@/i18n/dict";
import { absoluteUrl, productPath } from "@/lib/routes";
import { primaryImage } from "@/lib/catalog";

const SITE_NAME = "GZS WEAR BRANDS";

export function pageMetadata(opts: {
  locale: Locale;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  esPath: string;
  enPath: string;
  noindex?: boolean;
  image?: string;
}): Metadata {
  const title = opts.locale === "es" ? opts.titleEs : opts.titleEn;
  const description = opts.locale === "es" ? opts.descriptionEs : opts.descriptionEn;
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(opts.locale === "es" ? opts.esPath : opts.enPath),
      languages: {
        "es-ES": absoluteUrl(opts.esPath),
        "en-US": absoluteUrl(opts.enPath),
        en: absoluteUrl(opts.enPath),
        "x-default": absoluteUrl(opts.esPath),
      },
    },
    robots: opts.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      type: "website",
      locale: opts.locale === "es" ? "es_ES" : "en_US",
      alternateLocale: opts.locale === "es" ? "en_US" : "es_ES",
      url: absoluteUrl(opts.locale === "es" ? opts.esPath : opts.enPath),
      images: opts.image ? [{ url: opts.image, width: 1200, height: 1200, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/logo-verde.png"),
    email: "gzswear@roadshop.online",
    description:
      "Marca de streetwear de diseño exclusivo. Camisetas, sudaderas, gorras y gorros unisex fabricados bajo pedido en Europa.",
    areaServed: ["ES", "EU", "GB", "US"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    inLanguage: ["es-ES", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/tienda")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(p: Product, locale: Locale) {
  const path = productPath(p, locale);
  const images = p.colors.flatMap((c) => c.images.gallery).filter(Boolean).slice(0, 8);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name[locale],
    description: p.description[locale],
    image: images,
    sku: `GZS-${p.printifyId.slice(-8).toUpperCase()}`,
    category: p.type,
    brand: { "@type": "Brand", name: SITE_NAME },
    url: absoluteUrl(path),
    inLanguage: locale === "es" ? "es-ES" : "en-US",
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
      applicableCountry: ["ES", "DE", "FR", "IT", "PT", "NL", "BE", "IE"],
    },
    shippingDetails: [
      {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "ES" },
        shippingRate: { "@type": "MonetaryAmount", value: "4.95", currency: "EUR" },
      },
    ],
    offers: {
      "@type": "Offer",
      price: (p.priceEurCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(path),
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function itemListJsonLd(products: Product[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(productPath(p, locale)),
      name: p.name[locale],
      image: primaryImage(p),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
