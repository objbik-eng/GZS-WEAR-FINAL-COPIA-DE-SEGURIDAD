import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { pageMetadata } from "@/lib/seo";
import CheckoutClient from "./CheckoutClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "Finalizar compra",
    titleEn: "Checkout",
    descriptionEs: "Finaliza tu compra en GZS WEAR BRANDS con pago seguro Stripe.",
    descriptionEn: "Complete your GZS WEAR BRANDS purchase with secure Stripe checkout.",
    esPath: "/checkout",
    enPath: "/en/checkout",
    noindex: true,
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  return <CheckoutClient locale={lang === "en" ? "en" : "es"} />;
}
