"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, cartKey } from "@/context/CartContext";
import { t, formatPrice, type Locale } from "@/i18n/dict";
import { cartPath, checkoutPath, shopPath } from "@/lib/routes";

export default function CartDrawer({ locale }: { locale: Locale }) {
  const loc = locale;
  const { items, subtotal, drawerOpen, closeDrawer, remove, setQty } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const remaining = Math.max(0, 6000 - subtotal);
  const progress = Math.min(100, (subtotal / 6000) * 100);

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden" role="dialog" aria-modal="true" aria-label={t("cart.title", loc)}>
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={closeDrawer} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-drawer flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-display text-lg font-extrabold">{t("cart.title", loc)} <span className="text-smoke font-medium">({items.length})</span></h2>
          <button onClick={closeDrawer} aria-label="Cerrar" className="p-2 hover:text-forest"><X size={22} /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-smoke">{t("cart.empty", loc)}</p>
            <Link href={shopPath(loc)} onClick={closeDrawer} className="btn btn-primary">{t("cart.emptyCta", loc)}</Link>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4">
              <p className="text-xs font-semibold text-smoke mb-2">
                {remaining > 0
                  ? t("cart.freeProgress", loc).replace("{amount}", formatPrice(remaining, loc))
                  : t("cart.freeUnlocked", loc)}
              </p>
              <div className="h-1.5 bg-line rounded-full overflow-hidden">
                <div className="h-full bg-forest transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={cartKey(item)} className="flex gap-3">
                  <Link href={loc === "es" ? `/producto/${item.slugEs}` : `/en/product/${item.slugEn}`} onClick={closeDrawer} className="shrink-0">
                    <Image src={item.image} alt={loc === "es" ? item.nameEs : item.nameEn} width={84} height={105} className="w-20 h-[105px] object-cover rounded-lg bg-cream" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-snug truncate">{loc === "es" ? item.nameEs : item.nameEn}</p>
                    <p className="text-xs text-smoke mt-0.5">{loc === "es" ? item.colorEs : item.colorEn} · {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-line rounded-full">
                        <button className="p-1.5" onClick={() => setQty(cartKey(item), item.qty - 1)} aria-label="Menos"><Minus size={14} /></button>
                        <span className="px-2 text-sm font-bold w-7 text-center">{item.qty}</span>
                        <button className="p-1.5" onClick={() => setQty(cartKey(item), item.qty + 1)} aria-label="Más"><Plus size={14} /></button>
                      </div>
                      <span className="font-bold text-sm">{formatPrice(item.price * item.qty, loc)}</span>
                    </div>
                  </div>
                  <button onClick={() => remove(cartKey(item))} className="self-start p-1 text-smoke hover:text-red-600" aria-label={t("cart.remove", loc)}>
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-line p-5 space-y-3">
              <div className="flex justify-between font-bold">
                <span>{t("cart.subtotal", loc)}</span>
                <span>{formatPrice(subtotal, loc)}</span>
              </div>
              <p className="text-xs text-smoke">{t("product.taxNote", loc)}</p>
              <Link href={checkoutPath(loc)} onClick={closeDrawer} className="btn btn-dark w-full">{t("cart.checkout", loc)}</Link>
              <Link href={cartPath(loc)} onClick={closeDrawer} className="block text-center text-sm font-semibold text-forest hover:underline">
                {t("cart.continue", loc)}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
