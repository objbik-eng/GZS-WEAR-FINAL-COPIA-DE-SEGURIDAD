"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, cartKey } from "@/context/CartContext";
import { t, formatPrice, type Locale } from "@/i18n/dict";
import { checkoutPath, shopPath } from "@/lib/routes";

export default function CartView({ locale }: { locale: Locale }) {
  const { items, subtotal, remove, setQty, ready } = useCart();
  const remaining = Math.max(0, 6000 - subtotal);
  const progress = Math.min(100, (subtotal / 6000) * 100);

  if (ready && items.length === 0) {
    return (
      <div className="container-gzs py-28 text-center">
        <ShoppingBag size={56} className="mx-auto text-forest mb-6" strokeWidth={1.4} />
        <h1 className="text-3xl font-black">{t("cart.empty", locale)}</h1>
        <Link href={shopPath(locale)} className="btn btn-primary mt-8">{t("cart.emptyCta", locale)}</Link>
      </div>
    );
  }

  return (
    <div className="container-gzs py-10 lg:py-14 max-w-6xl">
      <h1 className="text-[clamp(28px,4vw,44px)] font-black mb-8">{t("cart.title", locale)}</h1>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10">
        <div className="space-y-5">
          {items.map((item) => (
            <div key={cartKey(item)} className="flex gap-4 border-b border-line pb-5">
              <Link href={locale === "es" ? `/producto/${item.slugEs}` : `/en/product/${item.slugEn}`} className="shrink-0">
                <Image src={item.image} alt="" width={110} height={138} className="w-24 h-[138px] object-cover rounded-xl bg-cream" />
              </Link>
              <div className="flex-1">
                <p className="font-display font-bold text-base">{locale === "es" ? item.nameEs : item.nameEn}</p>
                <p className="text-sm text-smoke mt-1">{locale === "es" ? item.colorEs : item.colorEn} · {item.size}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-line rounded-full">
                    <button className="px-3.5 py-2" onClick={() => setQty(cartKey(item), item.qty - 1)} aria-label="−"><Minus size={15} /></button>
                    <span className="px-2 font-bold w-8 text-center text-sm">{item.qty}</span>
                    <button className="px-3.5 py-2" onClick={() => setQty(cartKey(item), item.qty + 1)} aria-label="+"><Plus size={15} /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold">{formatPrice(item.price * item.qty, locale)}</span>
                    <button onClick={() => remove(cartKey(item))} className="text-smoke hover:text-red-600" aria-label={t("cart.remove", locale)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl bg-cream p-6 lg:sticky lg:top-32">
          <p className="text-xs font-bold text-smoke mb-2">
            {remaining > 0
              ? t("cart.freeProgress", locale).replace("{amount}", formatPrice(remaining, locale))
              : t("cart.freeUnlocked", locale)}
          </p>
          <div className="h-1.5 bg-line rounded-full overflow-hidden mb-6">
            <div className="h-full bg-forest transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-smoke">{t("cart.subtotal", locale)}</span>
            <span className="font-bold">{formatPrice(subtotal, locale)}</span>
          </div>
          <p className="text-xs text-smoke mb-5">{t("checkout.shippingNote", locale)}</p>
          <Link href={checkoutPath(locale)} className="btn btn-dark w-full">{t("cart.checkout", locale)}</Link>
          <Link href={shopPath(locale)} className="block text-center text-sm font-semibold text-forest hover:underline mt-4">
            {t("cart.continue", locale)}
          </Link>
        </aside>
      </div>
    </div>
  );
}
