import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { pageMetadata } from "@/lib/seo";
import CartView from "./CartView";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "Tu cesta",
    titleEn: "Your cart",
    descriptionEs: "Revisa tu cesta en GZS WEAR y finaliza tu compra con pago seguro.",
    descriptionEn: "Review your GZS WEAR cart and check out securely.",
    esPath: "/carrito",
    enPath: "/en/cart",
    noindex: true,
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  return <CartView locale={lang === "en" ? "en" : "es"} />;
}
