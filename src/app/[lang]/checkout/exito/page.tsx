import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { pageMetadata } from "@/lib/seo";
import SuccessClient from "./SuccessClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "Pedido confirmado",
    titleEn: "Order confirmed",
    descriptionEs: "Tu pedido en GZS WEAR ha sido confirmado correctamente.",
    descriptionEn: "Your GZS WEAR order has been confirmed.",
    esPath: "/checkout/exito",
    enPath: "/en/checkout/exito",
    noindex: true,
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  return <SuccessClient locale={lang === "en" ? "en" : "es"} />;
}
