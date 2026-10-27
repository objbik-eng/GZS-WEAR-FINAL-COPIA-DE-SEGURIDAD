import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { contactPath, homePath } from "@/lib/routes";
import ContactClient from "./ContactClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "Contacto",
    titleEn: "Contact",
    descriptionEs: "Contacta con GZS WEAR: dudas sobre pedidos, tallas, envíos y devoluciones. Escríbenos y te ayudamos.",
    descriptionEn: "Contact GZS WEAR about orders, sizing, shipping and returns. Write to us and we'll help.",
    esPath: "/contacto",
    enPath: "/en/contact",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale: Locale = lang === "en" ? "en" : "es";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: locale === "es" ? "Inicio" : "Home", path: homePath(locale) },
              { name: locale === "es" ? "Contacto" : "Contact", path: contactPath(locale) },
            ]),
          ),
        }}
      />
      <ContactClient locale={locale} />
    </>
  );
}
