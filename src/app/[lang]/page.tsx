import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { LOCALES, t, type Locale } from "@/i18n/dict";
import { getBestSellers, type Product } from "@/lib/catalog";
import { shopPath } from "@/lib/routes";
import { pageMetadata, itemListJsonLd, faqJsonLd } from "@/lib/seo";
import ProductCard from "@/components/ProductCard";
import CategoryCards from "@/components/CategoryCards";
import NewsletterForm from "@/components/NewsletterForm";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "GZS WEAR — Streetwear exclusivo. Colección DISRUPTIVE",
    titleEn: "GZS WEAR — Exclusive streetwear. The DISRUPTIVE collection",
    descriptionEs:
      "Camisetas, sudaderas, gorras y gorros unisex de diseño exclusivo. Colección DISRUPTIVE: envío gratis desde 60 € en la UE y devoluciones 14 días.",
    descriptionEn:
      "Exclusive unisex t-shirts, sweatshirts, caps and beanies. The DISRUPTIVE collection: free EU shipping over €60 and 14-day returns.",
    esPath: "/",
    enPath: "/en",
    image: "/brand/og-default.jpg",
  });
}

function faqs(locale: Locale) {
  const es = [
    { q: "¿Cuánto tarda el envío?", a: "En la Unión Europea, de 5 a 10 días laborables. Recibirás el seguimiento por email." },
    { q: "¿Cuándo es gratis el envío?", a: "El envío estándar es gratis para pedidos de la Unión Europea a partir de 60 €. En Irlanda, Reino Unido, EE. UU. y EFTA se aplica la tarifa real de la zona." },
    { q: "¿Puedo devolver una prenda?", a: "Sí, tienes 14 días desde la recepción. La prenda debe estar sin usar y con su etiquetado. Escríbenos a gzswear@roadshop.online con tu número de pedido." },
    { q: "¿Las prendas son unisex?", a: "Toda la colección DISRUPTIVE es unisex, en tallas de la S a la 2XL. En cada ficha tienes una guía de tallas en centímetros." },
  ];
  const en = [
    { q: "How long does shipping take?", a: "Within the European Union, 5–10 business days. Tracking is sent by email." },
    { q: "When is shipping free?", a: "Standard shipping is free for EU orders over €60. Ireland, the UK, the US and EFTA pay the real zone rate." },
    { q: "Can I return a garment?", a: "Yes, you have 14 days from delivery. Items must be unworn with tags attached. Email gzswear@roadshop.online with your order number." },
    { q: "Are the garments unisex?", a: "The entire DISRUPTIVE collection is unisex, sizes S to 2XL. Every product page includes a size guide in centimetres." },
  ];
  return locale === "es" ? es : en;
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale: Locale = lang === "en" ? "en" : "es";
  const bestSellers = getBestSellers();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white min-h-[88vh] flex items-center">
        <Image
          src="/images/hero-home.jpg"
          alt="Modelos vistiendo prendas GZS WEAR en un entorno urbano streetwear"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-gzs relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl animate-fadeUp">
            <h1 className="text-[clamp(44px,8.5vw,104px)] leading-[0.95] font-black text-white uppercase tracking-tight">
              {locale === "es" ? (
                <>
                  El arte
                  <br />
                  <span className="text-gold">se viste</span>
                </>
              ) : (
                <>
                  Art
                  <br />
                  <span className="text-gold">is worn</span>
                </>
              )}
            </h1>
            <p className="mt-6 text-brand-red font-display font-extrabold uppercase tracking-[0.22em] text-[clamp(16px,2.2vw,24px)]">
              {t("hero.collection", locale)}
            </p>
            <div className="mt-10">
              <Link href={shopPath(locale)} className="btn btn-gold text-base px-9 py-4">
                {t("hero.cta", locale)} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS (sin título) */}
      <section className="container-gzs py-16 lg:py-24">
        <CategoryCards locale={locale} />
      </section>

      {/* MÁS VENDIDOS */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="container-gzs">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <span className="eyebrow">DISRUPTIVE</span>
              <h2 className="text-[clamp(26px,3.4vw,40px)] font-black mt-2">{t("home.featTitle", locale)}</h2>
            </div>
            <Link
              href={`${shopPath(locale)}#todos`}
              className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-forest hover:underline"
            >
              {t("shop.viewAll", locale)} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
            {bestSellers.map((p: Product, i: number) => (
              <ProductCard key={p.productId} product={p} locale={locale} priority={i < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* VALORES (sin título) */}
      <section className="container-gzs py-16 lg:py-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Truck, k: "home.values.1" as const },
            { icon: ShieldCheck, k: "home.values.3" as const },
            { icon: RotateCcw, k: "home.values.4" as const },
          ].map(({ icon: Icon, k }) => (
            <div key={k} className="rounded-2xl border border-line p-7 text-center hover:border-forest transition-colors">
              <div className="w-12 h-12 rounded-full bg-forest-soft flex items-center justify-center mb-4 mx-auto">
                <Icon size={22} className="text-forest" />
              </div>
              <h3 className="font-display font-bold text-base">{t(`${k}.t`, locale)}</h3>
              <p className="text-sm text-smoke mt-2 leading-relaxed">{t(`${k}.d`, locale)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-gzs max-w-3xl">
          <h2 className="text-[clamp(24px,3vw,34px)] font-black mb-8">FAQ</h2>
          <div className="space-y-3">
            {faqs(locale).map((f) => (
              <details key={f.q} className="group bg-white rounded-xl border border-line p-5">
                <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-gold text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-smoke leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER (pegada al footer, sin separación blanca) */}
      <section className="bg-ink text-white py-16 lg:py-20">
        <div className="container-gzs text-center">
          <h2 className="font-display text-[clamp(24px,3.4vw,38px)] font-black text-white">{t("newsletter.title", locale)}</h2>
          <p className="mt-3 text-white/75 max-w-xl mx-auto">{t("newsletter.subtitle", locale)}</p>
          <div className="mt-8 max-w-xl mx-auto">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            itemListJsonLd(bestSellers, locale),
            faqJsonLd(faqs(locale)),
          ]),
        }}
      />
    </>
  );
}
