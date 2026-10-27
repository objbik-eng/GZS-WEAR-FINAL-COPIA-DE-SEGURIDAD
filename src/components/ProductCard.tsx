import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { primaryImage, backImage } from "@/lib/catalog";
import { productPath } from "@/lib/routes";
import { formatPrice, t, type Locale } from "@/i18n/dict";

const TYPE_LABEL: Record<string, { es: string; en: string }> = {
  tee: { es: "Camiseta", en: "T-shirt" },
  oversize: { es: "Camiseta oversize", en: "Oversized tee" },
  crewneck: { es: "Sudadera", en: "Crewneck" },
  hoodie: { es: "Sudadera con capucha", en: "Hoodie" },
  cap: { es: "Gorra", en: "Cap" },
  beanie: { es: "Gorro", en: "Beanie" },
};

export default function ProductCard({ product, locale, priority = false }: {
  product: Product;
  locale: Locale;
  priority?: boolean;
}) {
  const front = primaryImage(product);
  const back = backImage(product) || front;
  return (
    <a href={productPath(product, locale)} className="product-card group" aria-label={product.name[locale]}>
      <div className="pc-media">
        <span className="pc-badge">{t("common.new", locale)}</span>
        <Image
          src={front}
          alt={`${product.name[locale]} — vista frontal`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="pc-front object-cover"
          priority={priority}
        />
        <Image
          src={back}
          alt={`${product.name[locale]} — vista trasera`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="pc-back object-cover"
        />
      </div>
      <div className="pt-3 px-0.5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-smoke font-semibold">
          {TYPE_LABEL[product.type]?.[locale]} · {t("product.unisex", locale)}
        </p>
        <h3 className="font-display font-bold text-[15px] mt-1 leading-snug group-hover:text-forest transition-colors">
          {product.name[locale]}
        </h3>
        <p className="mt-1 font-bold text-[15px]">{formatPrice(product.priceEurCents, locale)}</p>
      </div>
    </a>
  );
}
