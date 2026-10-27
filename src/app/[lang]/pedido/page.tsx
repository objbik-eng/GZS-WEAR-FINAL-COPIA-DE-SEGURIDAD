import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { pageMetadata } from "@/lib/seo";
import OrderStatus from "./OrderStatus";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "Estado del pedido",
    titleEn: "Order status",
    descriptionEs: "Consulta el estado y el seguimiento de tu pedido en GZS WEAR BRANDS.",
    descriptionEn: "Check the status and tracking of your GZS WEAR BRANDS order.",
    esPath: "/pedido",
    enPath: "/en/pedido",
    noindex: true,
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  return <OrderStatus locale={lang === "en" ? "en" : "es"} />;
}
