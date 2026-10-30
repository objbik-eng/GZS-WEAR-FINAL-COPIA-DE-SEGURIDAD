"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { t, formatPrice, type Locale } from "@/i18n/dict";
import { useCart } from "@/context/CartContext";
import { productPath } from "@/lib/routes";

function Section({ product, locale, flip, index, alternating }: { product: Product; locale: Locale; flip: boolean; index: number; alternating: boolean }) {
  const { add } = useCart();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  const gallery = useMemo(() => {
    const imgs = product.colors[0].images.gallery.filter(Boolean);
    const all = product.modelImage ? [product.modelImage, ...imgs] : imgs;
    return [...new Set(all)];
  }, [product]);

  const current = gallery[active] || gallery[0];

  function handleAdd() {
    if (!size) {
      setError(true);
      return;
    }
    const color = product.colors[0];
    add({
      id: product.productId,
      slugEs: product.slug.es,
      slugEn: product.slug.en,
      nameEs: product.name.es,
      nameEn: product.name.en,
      price: product.priceEurCents,
      type: product.type,
      qty: 1,
      colorId: color.id,
      colorEs: color.nameEs,
      colorEn: color.nameEn,
      size,
      image: color.images.front || gallery[0],
      variantId: color.variants[size],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Fondo: foto principal con oscurecimiento fijo del 60% */}
      <div className="absolute inset-0">
        <Image
          src={alternating ? (product.modelImage || gallery[0]) : current}
          alt=""
          fill
          priority={index < 2}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container-gzs relative z-10 py-16 lg:py-24 min-h-[72vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 w-full items-center">
          {/* La imagen aparece primero en móvil; en escritorio alterna con el texto. */}
          <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden ${alternating ? (flip ? "lg:order-1" : "lg:order-2") : "lg:hidden"}`}>
            <Image src={current} alt={`${product.name[locale]} — ${locale === "es" ? "vista de producto" : "product view"}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority={index < 2} />
          </div>

          <div className={`text-white ${alternating ? (flip ? "lg:order-2" : "lg:order-1") : ""}`}>
            <p className="text-gold text-[11px] font-extrabold uppercase tracking-[0.25em]">{product.collection}</p>
            <h2 className="font-display font-black text-[clamp(26px,3.6vw,42px)] leading-tight mt-2 text-white">
              {product.name[locale]}
            </h2>
            <p className="text-2xl font-extrabold mt-3 text-white">{formatPrice(product.priceEurCents, locale)}</p>
            <p className="mt-4 text-white/85 text-[15px] leading-relaxed max-w-lg">{product.description[locale]}</p>

            {/* Tallas */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2.5">{t("product.size", locale)}</p>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSize(s); setError(false); }}
                    className={`min-w-[46px] px-3 py-2.5 rounded-[10px] font-bold text-sm border transition-colors ${
                      size === s
                        ? "bg-gold border-gold text-ink"
                        : "bg-white/10 border-white/30 text-white hover:border-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && (
                <p className="text-red-300 text-sm font-semibold mt-2">
                  {locale === "es" ? "Selecciona una talla" : "Please select a size"}
                </p>
              )}
            </div>

            {/* Añadir al carrito */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="button" onClick={handleAdd} className="btn btn-gold">
                {added ? (
                  <>
                    <Check size={17} /> {t("product.added", locale)}
                  </>
                ) : (
                  t("product.addToCart", locale)
                )}
              </button>
              <Link
                href={productPath(product, locale)}
                className="text-sm font-bold text-white underline underline-offset-4 hover:text-gold transition-colors"
              >
                {locale === "es" ? "Ver ficha completa" : "View full details"}
              </Link>
            </div>

            {/* Selector de imágenes */}
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2.5">{t("product.gallery", locale)}</p>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${locale === "es" ? "Ver imagen" : "View image"} ${i + 1}`}
                    aria-pressed={active === i}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      active === i ? "border-gold" : "border-white/25 hover:border-white/60"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <details className="group mt-6 max-w-lg">
              <summary className="cursor-pointer list-none font-bold text-sm flex items-center gap-2 text-white/90">
                <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
                {t("product.sizeGuide", locale)}
              </summary>
              <div className="mt-3 overflow-x-auto rounded-xl bg-white/10 p-4">
                <table className="w-full border-collapse text-sm text-white">
                  <thead>
                    <tr>
                      <th className="px-2 py-1.5 text-left">{locale === "es" ? "Medida (cm)" : "Measurement (cm)"}</th>
                      {product.sizeGuide.sizes.map((s) => <th key={s} className="px-2 py-1.5">{s}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeGuide.rows.map((row) => (
                      <tr key={row.labelEn}>
                        <td className="px-2 py-1.5 text-white/75">{locale === "es" ? row.labelEs : row.labelEn}</td>
                        {row.values.map((v, i) => <td key={i} className="px-2 py-1.5 text-center">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CategoryShowcase({ products, locale, alternating = false }: { products: Product[]; locale: Locale; alternating?: boolean }) {
  return (
    <div>
      {products.map((p, i) => (
        <Section key={p.productId} product={p} locale={locale} flip={i % 2 === 1} index={i} alternating={alternating} />
      ))}
    </div>
  );
}
