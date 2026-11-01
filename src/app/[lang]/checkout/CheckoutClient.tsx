"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useCart, cartKey } from "@/context/CartContext";
import { t, formatPrice, type Locale } from "@/i18n/dict";
import { shopPath, legalPath } from "@/lib/routes";
import { ALLOWED_COUNTRIES, quoteShipping } from "@/lib/shipping";
import type { ProductType } from "@/lib/catalog";

export default function CheckoutClient({ locale }: { locale: Locale }) {
  const { items, subtotal, ready } = useCart();
  const [country, setCountry] = useState("ES");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Mismo cálculo que el servidor: el cliente ve el total exacto de su zona
     antes de ir a pagar, en lugar de un importe pendiente. */
  const shippingPreview = useMemo(() => {
    const quote = quoteShipping(
      items.map((i) => ({ type: i.type as ProductType, qty: i.qty })),
      subtotal,
      country,
    );
    return {
      cost: quote.costCents,
      label: locale === "es" ? quote.labelEs : quote.labelEn,
    };
  }, [country, items, subtotal, locale]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError(locale === "es" ? "Debes aceptar los términos." : "You must accept the terms.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          country,
          customer: { email, name },
          consent,
          items: items.map((i) => ({
            id: i.id,
            qty: i.qty,
            colorId: i.colorId,
            size: i.size,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("checkout.error", locale));
      setLoading(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <div className="container-gzs py-28 text-center">
        <h1 className="text-3xl font-black">{t("cart.empty", locale)}</h1>
        <Link href={shopPath(locale)} className="btn btn-primary mt-8">{t("cart.emptyCta", locale)}</Link>
      </div>
    );
  }

  return (
    <div className="container-gzs py-10 lg:py-14 max-w-6xl">
      <h1 className="text-[clamp(28px,4vw,42px)] font-black mb-8">{t("checkout.title", locale)}</h1>
      <form onSubmit={submit} className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <div className="space-y-6">
          <div>
            <label className="field-label">{t("checkout.email", locale)}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="tu@email.com" />
          </div>
          <div>
            <label className="field-label">{t("checkout.name", locale)}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="field" />
          </div>
          <div>
            <label className="field-label">{t("checkout.country", locale)}</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="field">
              {ALLOWED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {new Intl.DisplayNames([locale === "es" ? "es" : "en"], { type: "region" }).of(c.code)} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-[#5E845F]" />
            <span>
              {t("checkout.consent", locale)}{" "}
              <Link href={legalPath("terminos", locale)} className="text-forest underline" target="_blank">
                {t("legal.terms", locale)}
              </Link>
            </span>
          </label>
          {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-dark w-full">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={17} />}
            {t("checkout.pay", locale)}
          </button>
          <p className="text-xs text-smoke flex items-center gap-2 justify-center">
            <ShieldCheck size={15} /> {t("checkout.secureNote", locale)}
          </p>
        </div>

        <aside className="h-fit rounded-2xl bg-cream p-6 lg:sticky lg:top-32">
          <h2 className="font-display font-extrabold text-lg mb-4">{t("cart.title", locale)}</h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={cartKey(i)} className="flex gap-3">
                <Image src={i.image} alt="" width={64} height={80} className="w-16 h-20 object-cover rounded-lg bg-white" />
                <div className="flex-1 text-sm">
                  <p className="font-bold leading-snug">{locale === "es" ? i.nameEs : i.nameEn}</p>
                  <p className="text-xs text-smoke">{locale === "es" ? i.colorEs : i.colorEn} · {i.size} · ×{i.qty}</p>
                </div>
                <span className="text-sm font-bold">{formatPrice(i.price * i.qty, locale)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-smoke">{t("cart.subtotal", locale)}</span>
              <span className="font-bold">{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-smoke">{t("cart.shipping", locale)}</span>
              <span className="font-bold">
                {shippingPreview.cost === 0 ? t("cart.free", locale) : formatPrice(shippingPreview.cost, locale)}
              </span>
            </div>
            <p className="text-xs text-smoke">{shippingPreview.label}</p>
            <div className="flex justify-between text-base border-t border-line pt-3">
              <span className="font-extrabold">{t("cart.total", locale)}</span>
              <span className="font-extrabold">
                {formatPrice(subtotal + shippingPreview.cost, locale)}
              </span>
            </div>
          </div>
          <p className="text-xs text-smoke mt-4">{t("checkout.shippingNote", locale)}</p>
        </aside>
      </form>
    </div>
  );
}
