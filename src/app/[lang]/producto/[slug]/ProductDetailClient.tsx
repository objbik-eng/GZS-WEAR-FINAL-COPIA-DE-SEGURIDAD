"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ShieldCheck, Truck, RotateCcw, User2 } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { t, formatPrice, type Locale } from "@/i18n/dict";
import { useCart } from "@/context/CartContext";
import { checkoutPath, shopPath } from "@/lib/routes";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailClient({
  product,
  related,
  locale,
}: {
  product: Product;
  related: Product[];
  locale: Locale;
}) {
  const router = useRouter();
  const { add } = useCart();
  const [colorId, setColorId] = useState(product.colors[0].id);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const color = product.colors.find((c) => c.id === colorId) || product.colors[0];
  const gallery = useMemo(() => {
    const imgs = color.images.gallery.filter(Boolean);
    return [...new Set(imgs)];
  }, [color]);
  const [active, setActive] = useState(0);

  const cartPayload = () => ({
    id: product.printifyId,
    slugEs: product.slug.es,
    slugEn: product.slug.en,
    nameEs: product.name.es,
    nameEn: product.name.en,
    price: product.priceEurCents,
    type: product.type,
    qty,
    colorId: color.id,
    colorEs: color.nameEs,
    colorEn: color.nameEn,
    size: size || product.sizes[0],
    image: color.images.front || gallery[0],
    variantId: color.variants[size || product.sizes[0]],
  });

  function validateSize() {
    if (!size) {
      setError(locale === "es" ? "Selecciona una talla" : "Please select a size");
      return false;
    }
    setError("");
    return true;
  }

  function handleAdd() {
    if (!validateSize()) return;
    add(cartPayload());
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  function handleBuyNow() {
    if (!validateSize()) return;
    add(cartPayload());
    router.push(checkoutPath(locale));
  }

  return (
    <div className="container-gzs py-8 lg:py-12">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* GALERÍA */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3 overflow-x-auto no-scrollbar sm:w-20 shrink-0">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActive(i)}
                className={`relative w-20 h-24 rounded-lg overflow-hidden bg-cream border-2 shrink-0 ${
                  active === i ? "border-forest" : "border-transparent"
                }`}
                aria-label={`Imagen ${i + 1}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-cream">
            {gallery[active] && (
              <Image
                src={gallery[active]}
                alt={`${product.name[locale]} — ${active === 0 ? (locale === "es" ? "vista frontal" : "front view") : locale === "es" ? "vista trasera" : "back view"}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            <span className="absolute top-4 left-4 bg-gold text-ink text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full">
              {t("product.unisex", locale)}
            </span>
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="eyebrow">{product.collection}</p>
          <h1 className="text-[clamp(26px,3.4vw,40px)] font-black mt-2 leading-tight">{product.name[locale]}</h1>
          <p className="text-2xl font-extrabold mt-3">{formatPrice(product.priceEurCents, locale)}</p>
          <p className="text-xs text-smoke mt-1">{t("product.taxNote", locale)}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/85">{product.description[locale]}</p>

          {/* COLORES */}
          {product.colors.length > 1 && (
            <div className="mt-7">
              <p className="field-label">{t("product.color", locale)}: <span className="text-ink normal-case">{locale === "es" ? color.nameEs : color.nameEn}</span></p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setColorId(c.id); setActive(0); }}
                    title={locale === "es" ? c.nameEs : c.nameEn}
                    aria-label={locale === "es" ? c.nameEs : c.nameEn}
                    className={`swatch ${colorId === c.id ? "swatch-active" : ""}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TALLAS */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="field-label mb-0">{t("product.size", locale)}</p>
              <details className="group">
                <summary className="text-xs font-bold text-forest cursor-pointer list-none flex items-center gap-1">
                  {t("product.sizeGuide", locale)} <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                </summary>
              </details>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSize(s); setError(""); }}
                  className={`size-pill ${size === s ? "size-pill-active" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm font-semibold mt-2">{error}</p>}

            <details className="group mt-4 rounded-xl border border-line overflow-hidden">
              <summary className="cursor-pointer list-none px-5 py-4 font-bold text-sm flex items-center gap-2 bg-cream">
                <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
                {t("product.sizeGuide", locale)}
              </summary>
              <div className="p-5 overflow-x-auto">
                <table className="size-table">
                  <thead>
                    <tr>
                      <th>{locale === "es" ? "Medida (cm)" : "Measurement (cm)"}</th>
                      {product.sizeGuide.sizes.map((s) => <th key={s}>{s}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeGuide.rows.map((row) => (
                      <tr key={row.labelEn}>
                        <td>{locale === "es" ? row.labelEs : row.labelEn}</td>
                        {row.values.map((v, i) => <td key={i}>{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-smoke mt-3">
                  {locale === "es" ? product.sizeGuide.toleranceEs : product.sizeGuide.toleranceEn}
                </p>
              </div>
            </details>
          </div>

          {/* CANTIDAD + ACCIONES */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-line rounded-full">
              <button className="px-4 py-3 font-bold" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="-">−</button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button className="px-4 py-3 font-bold" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="+">+</button>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
              <Check size={16} /> {t("product.inStock", locale)}
            </span>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <button onClick={handleAdd} className="btn btn-primary">
              {added ? `✓ ${locale === "es" ? "Añadido" : "Added"}` : t("product.addToCart", locale)}
            </button>
            <button onClick={handleBuyNow} className="btn btn-dark">{t("product.buyNow", locale)}</button>
          </div>

          {/* VENTAJAS */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Truck, k: "home.values.1" as const },
              { icon: RotateCcw, k: "home.values.4" as const },
              { icon: ShieldCheck, k: "home.values.3" as const },
            ].map(({ icon: Icon, k }) => (
              <div key={k} className="rounded-xl bg-forest-soft p-4">
                <Icon size={20} className="mx-auto text-forest mb-2" />
                <p className="text-[11px] font-bold leading-tight">{t(`${k}.t`, locale)}</p>
              </div>
            ))}
          </div>

          {/* DETALLES */}
          <div className="mt-8 space-y-3 text-sm">
            <p><b>{t("product.details", locale)}:</b> <span className="text-smoke">{product.fabric[locale]}</span></p>
            <p><b>{locale === "es" ? "Fit" : "Fit"}:</b> <span className="text-smoke">{product.fit[locale]}</span></p>
            <p><b>{t("product.shipping", locale)}:</b>{" "}
              <span className="text-smoke">
                {locale === "es"
                  ? "UE: gratis desde 60 €, si no 4,95 €. Irlanda, Reino Unido, EE. UU. y EFTA: tarifa real según zona. Devoluciones 30 días."
                  : "EU: free over €60, otherwise €4.95. Ireland, UK, US and EFTA: real zone rate. 30-day returns."}
              </span>
            </p>
          </div>

          {/* GPSR */}
          {product.gpsr && (
            <details className="group mt-6 gpsr-box" open>
              <summary className="cursor-pointer list-none font-bold text-sm flex items-center gap-2">
                <ShieldCheck size={17} className="text-forest" />
                {t("product.safety", locale)}
              </summary>
              <dl className="mt-3 space-y-2">
                {Object.entries(product.gpsr).map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-bold text-forest-deep">{k}</dt>
                    <dd className="text-smoke">{v}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
        </div>
      </div>

      {/* MODELO IA (placeholder para siguientes fases) */}
      <div className="mt-14 rounded-2xl border border-dashed border-forest/40 bg-forest-soft p-8 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0">
          <User2 size={26} className="text-forest" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-lg">
            {locale === "es" ? "Fotografía de modelo en camino" : "Model photography on the way"}
          </h2>
          <p className="text-sm text-smoke mt-1">
            {locale === "es"
              ? "Muy pronto verás esta prenda llevada por modelos reales en entorno urbano. Mientras tanto, las imágenes de producto muestran el diseño exacto por delante y por detrás."
              : "Real-model urban lifestyle shots are coming very soon. Meanwhile, the product images show the exact front and back design."}
          </p>
        </div>
      </div>

      {/* RELACIONADOS */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-[clamp(22px,2.8vw,32px)] font-black mb-8">{t("product.related", locale)}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.printifyId} product={p} locale={locale} />
            ))}
          </div>
          <Link href={shopPath(locale)} className="btn btn-outline mt-10">
            {t("cart.continue", locale)}
          </Link>
        </section>
      )}
    </div>
  );
}
