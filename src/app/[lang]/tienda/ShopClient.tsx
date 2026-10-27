"use client";

import { useMemo, useState } from "react";
import type { Product, ProductType } from "@/lib/catalog";
import { TYPE_FILTERS } from "@/lib/catalog";
import { t, type Locale } from "@/i18n/dict";
import ProductCard from "@/components/ProductCard";

type Sort = "featured" | "priceAsc" | "priceDesc" | "name";

export default function ShopClient({
  products,
  locale,
  initialFilter,
}: {
  products: Product[];
  locale: Locale;
  initialFilter: ProductType | "all";
}) {
  const [filter, setFilter] = useState<ProductType | "all">(initialFilter);
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    let list = filter === "all" ? [...products] : products.filter((p) => p.type === filter);
    switch (sort) {
      case "priceAsc": list.sort((a, b) => a.priceEurCents - b.priceEurCents); break;
      case "priceDesc": list.sort((a, b) => b.priceEurCents - a.priceEurCents); break;
      case "name": list.sort((a, b) => a.name[locale].localeCompare(b.name[locale])); break;
    }
    return list;
  }, [products, filter, sort, locale]);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtros">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`chip ${filter === f.id ? "chip-active" : ""}`}
            >
              {t(f.labelKey, locale)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-smoke">
          {t("shop.sort", locale)}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="field py-2.5 pr-8 w-auto text-sm font-semibold"
          >
            <option value="featured">{locale === "es" ? "Destacados" : "Featured"}</option>
            <option value="priceAsc">{t("shop.sort.priceAsc", locale)}</option>
            <option value="priceDesc">{t("shop.sort.priceDesc", locale)}</option>
            <option value="name">{t("shop.sort.name", locale)}</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-smoke mb-6">
        {visible.length} {t("shop.results", locale)}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        {visible.map((p, i) => (
          <ProductCard key={p.printifyId} product={p} locale={locale} priority={i < 4} />
        ))}
      </div>
    </>
  );
}
