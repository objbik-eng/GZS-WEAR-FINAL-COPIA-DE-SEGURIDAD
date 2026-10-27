import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { LOCALES, t, type Locale } from "@/i18n/dict";
import { getAllProducts, getProductsByType, primaryImage, type Product } from "@/lib/catalog";
import { shopPath } from "@/lib/routes";
import { pageMetadata, itemListJsonLd, faqJsonLd } from "@/lib/seo";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return pageMetadata({
    locale,
    titleEs: "GZS WEAR BRANDS — Streetwear exclusivo hecho en Europa",
    titleEn: "GZS WEAR BRANDS — Exclusive streetwear made in Europe",
    descriptionEs:
      "Camisetas, sudaderas, gorras y gorros unisex de diseño exclusivo. Colección DISRUPTIVE: fabricación bajo pedido en Europa, envío gratis desde 60 € y devoluciones 30 días.",
    descriptionEn:
      "Exclusive unisex t-shirts, sweatshirts, caps and beanies. The DISRUPTIVE collection: made to order in Europe, free shipping over €60 and 30-day returns.",
    esPath: "/",
    enPath: "/en",
    image: "/brand/og-default.jpg",
  });
}

const CATEGORIES = [
  { filter: "tee", icon: "👕", key: "nav.tees" as const, types: ["tee", "oversize"] as const },
  { filter: "hoodie", icon: "🧥", key: "nav.sweatshirts" as const, types: ["crewneck", "hoodie"] as const },
  { filter: "cap", icon: "🧢", key: "nav.accessories" as const, types: ["cap", "beanie"] as const },
];

function faqs(locale: Locale) {
  const es = [
    { q: "¿Cuánto tarda el envío?", a: "En la UE, de 5 a 10 días laborables (producción incluida). Irlanda y Reino Unido, de 5 a 15; Estados Unidos, de 10 a 30. Recibirás seguimiento por email." },
    { q: "¿Cuándo es gratis el envío?", a: "El envío estándar es gratis para pedidos de la Unión Europea a partir de 60 €. Por debajo, la tarifa plana es de 4,95 €. En Irlanda, Reino Unido, EE. UU. y EFTA se aplica la tarifa real de la zona." },
    { q: "¿Puedo devolver una prenda?", a: "Sí, tienes 30 días desde la recepción. La prenda debe estar sin usar y con su etiquetado. Escríbenos a gzswear@roadshop.online con tu número de pedido." },
    { q: "¿Las prendas son unisex?", a: "Toda la colección DISRUPTIVE es unisex, en tallas de la S a la 2XL. En cada ficha tienes una guía de tallas en centímetros." },
    { q: "¿Cómo se fabrican las prendas?", a: "Cada pieza se produce bajo pedido en talleres europeos especializados en impresión DTG y bordado, lo que evita sobrestock y desperdicio textil." },
  ];
  const en = [
    { q: "How long does shipping take?", a: "Within the EU, 5–10 business days including production. Ireland and the UK 5–15 days; the US 10–30 days. Tracking is sent by email." },
    { q: "When is shipping free?", a: "Standard shipping is free for EU orders over €60. Below that, a flat €4.95 rate applies. Ireland, the UK, the US and EFTA pay the real zone rate." },
    { q: "Can I return a garment?", a: "Yes, you have 30 days from delivery. Items must be unworn with tags attached. Email gzswear@roadshop.online with your order number." },
    { q: "Are the garments unisex?", a: "The entire DISRUPTIVE collection is unisex, sizes S to 2XL. Every product page includes a size guide in centimetres." },
    { q: "How are the garments made?", a: "Each piece is made to order in European workshops specialised in DTG printing and embroidery, avoiding overstock and textile waste." },
  ];
  return locale === "es" ? es : en;
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale: Locale = lang === "en" ? "en" : "es";
  const featured = getAllProducts().slice(0, 8);

  const catImage = (types: Product["type"][]): string =>
    primaryImage(getProductsByType(types)[0]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="container-gzs grid lg:grid-cols-2 items-center gap-10 py-16 lg:py-24">
          <div className="animate-fadeUp">
            <span className="eyebrow text-gold">{t("hero.badge", locale)}</span>
            <h1 className="mt-4 text-[clamp(34px,5.5vw,68px)] leading-[1.02] font-black text-white">
              {locale === "es" ? (
                <>El arte no se cuelga,<br /> <span className="text-gold">se viste.</span></>
              ) : (
                <>Art isn&apos;t hung.<br /> <span className="text-gold">It&apos;s worn.</span></>
              )}
            </h1>
            <p className="mt-6 text-white/80 text-lg max-w-md leading-relaxed">{t("hero.subtitle", locale)}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={shopPath(locale)} className="btn btn-gold">
                {t("hero.cta", locale)} <ArrowRight size={17} />
              </Link>
              <Link href="/tienda?f=tee" className="btn border-white/40 text-white hover:bg-white hover:text-ink">
                {t("hero.cta2", locale)}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
              <span className="flex items-center gap-2"><Truck size={17} className="text-gold" /> {t("home.values.1.t", locale)}</span>
              <span className="flex items-center gap-2"><RotateCcw size={17} className="text-gold" /> {t("home.values.4.t", locale)}</span>
              <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-gold" /> Stripe</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-white/5 blur-2xl" />
            <Image
              src="/brand/logo-blanco.png"
              alt="GZS WEAR BRANDS — monograma"
              width={620}
              height={620}
              priority
              className="relative w-full max-w-[520px] mx-auto drop-shadow-2xl animate-zoomSlow"
            />
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="container-gzs py-16 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-[clamp(26px,3.4vw,40px)] font-black">{t("home.catTitle", locale)}</h2>
          <Link href={shopPath(locale)} className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-forest hover:underline">
            {t("nav.shop", locale)} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.filter}
              href={`/tienda?f=${cat.filter}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-cream"
            >
              <Image
                src={catImage([...cat.types])}
                alt={t(cat.key, locale)}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-3xl mb-1">{cat.icon}</p>
                <h3 className="font-display text-xl font-extrabold">{t(cat.key, locale)}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold mt-1">
                  {t("nav.shop", locale)} <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="container-gzs">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="eyebrow">DISRUPTIVE</span>
              <h2 className="text-[clamp(26px,3.4vw,40px)] font-black mt-2">{t("home.featTitle", locale)}</h2>
            </div>
            <Link href={shopPath(locale)} className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-forest hover:underline">
              {t("nav.shop", locale)} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {featured.map((p, i) => (
              <ProductCard key={p.printifyId} product={p} locale={locale} priority={i < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="container-gzs py-16 lg:py-24">
        <h2 className="text-[clamp(24px,3vw,36px)] font-black text-center mb-12">{t("home.valuesTitle", locale)}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, k: "home.values.1" as const },
            { icon: Sparkles, k: "home.values.2" as const },
            { icon: ShieldCheck, k: "home.values.3" as const },
            { icon: RotateCcw, k: "home.values.4" as const },
          ].map(({ icon: Icon, k }) => (
            <div key={k} className="rounded-2xl border border-line p-6 hover:border-forest transition-colors">
              <div className="w-11 h-11 rounded-full bg-forest-soft flex items-center justify-center mb-4">
                <Icon size={20} className="text-forest" />
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

      {/* NEWSLETTER */}
      <section className="bg-forest text-white py-16 lg:py-20">
        <div className="container-gzs text-center">
          <h2 className="font-display text-[clamp(24px,3.4vw,38px)] font-black text-white">{t("newsletter.title", locale)}</h2>
          <p className="mt-3 text-white/75 max-w-xl mx-auto">{t("newsletter.subtitle", locale)}</p>
          <div className="mt-8">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            itemListJsonLd(featured, locale),
            faqJsonLd(faqs(locale)),
          ]),
        }}
      />
    </>
  );
}
