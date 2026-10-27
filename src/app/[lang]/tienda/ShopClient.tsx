"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const [open, setOpen] = useState(initialFilter !== "all");
  const [filter, setFilter] = useState<ProductType | "all">(initialFilter);
  const [sort, setSort] = useState<Sort>("featured");

  // Al volver desde una tarjeta con #todos, desplegar automáticamente.
  useEffect(() => {
    if (window.location.hash === "#todos") setOpen(true);
  }, []);

  const visible = useMemo(() => {
    const list = filter === "all" ? [...products] : products.filter((p) => p.type === filter);
    switch (sort) {
      case "priceAsc": list.sort((a, b) => a.priceEurCents - b.priceEurCents); break;
      case "priceDesc": list.sort((a, b) => b.priceEurCents - a.priceEurCents); break;
      case "name": list.sort((a, b) => a.name[locale].localeCompare(b.name[locale])); break;
    }
    return list;
  }, [products, filter, sort, locale]);

  return (
    <div id="todos" className="scroll-mt-28">
      <div className="text-center py-10">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 text-forest font-display font-extrabold text-lg lg:text-xl underline underline-offset-8 decoration-2 hover:text-forest-deep transition-colors"
        >
          {open ? t("shop.hideAll", locale) : t("shop.viewAll", locale)}
          <ChevronDown size={20} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
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
              <ProductCard key={p.productId} product={p} locale={locale} priority={i < 4} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
