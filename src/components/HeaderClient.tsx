"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag, Globe } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { t, type Locale } from "@/i18n/dict";
import { shopPath, cartPath, contactPath } from "@/lib/routes";

const ES_TO_EN: Record<string, string> = {
  tienda: "shop",
  producto: "product",
  carrito: "cart",
  contacto: "contact",
  legal: "legal",
};
const EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(ES_TO_EN).map(([es, en]) => [en, es]),
);
const LEGAL_EN_TO_ES: Record<string, string> = {
  "legal-notice": "aviso-legal",
  privacy: "privacidad",
  terms: "terminos",
  cookies: "cookies",
  "shipping-returns": "envios-devoluciones",
};
const LEGAL_ES_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(LEGAL_EN_TO_ES).map(([en, es]) => [es, en]),
);

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  let target: string;
  if (locale === "es") {
    const seg = pathname.split("/").filter(Boolean);
    if (seg[0]) seg[0] = ES_TO_EN[seg[0]] || seg[0];
    if (seg[0] === "legal" && seg[1]) seg[1] = LEGAL_ES_TO_EN[seg[1]] || seg[1];
    target = `/en/${seg.join("/")}`;
  } else {
    const seg = pathname.replace(/^\/en\/?/, "").split("/").filter(Boolean);
    if (seg[0]) seg[0] = EN_TO_ES[seg[0]] || seg[0];
    if (seg[0] === "legal" && seg[1]) seg[1] = LEGAL_EN_TO_ES[seg[1]] || seg[1];
    target = `/${seg.join("/")}`;
  }
  return (
    <Link
      href={target}
      hrefLang={locale === "es" ? "en" : "es"}
      className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide hover:text-forest transition-colors"
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
    >
      <Globe size={17} strokeWidth={2.2} />
      {locale === "es" ? "EN" : "ES"}
    </Link>
  );
}

export function CartButton({ locale }: { locale: Locale }) {
  const { count, openDrawer, ready } = useCart();
  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative p-2 hover:text-forest transition-colors"
      aria-label={t("nav.cart", locale)}
    >
      <ShoppingBag size={22} strokeWidth={2} />
      {ready && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[10px] font-extrabold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 animate-pop">
          {count}
        </span>
      )}
    </button>
  );
}

const NAV_TYPES = [
  { key: "nav.tees", href: "/tienda?f=tee" },
  { key: "nav.sweatshirts", href: "/tienda?f=hoodie" },
  { key: "nav.accessories", href: "/tienda?f=cap" },
] as const;

export function MobileMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menú">
        <Menu size={24} strokeWidth={2} />
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/45 animate-fade" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl animate-drawer flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <span className="font-display font-800 text-lg">GZS WEAR<span className="text-gold">*</span></span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar menú" className="p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1 text-[15px] font-semibold">
              <Link href={shopPath(locale)} onClick={() => setOpen(false)} className="py-3 border-b border-line">
                {t("nav.shop", locale)}
              </Link>
              {NAV_TYPES.map((n) => (
                <Link key={n.key} href={n.href} onClick={() => setOpen(false)} className="py-3 border-b border-line">
                  {t(n.key, locale)}
                </Link>
              ))}
              <Link href={contactPath(locale)} onClick={() => setOpen(false)} className="py-3 border-b border-line">
                {t("nav.contact", locale)}
              </Link>
              <Link href={cartPath(locale)} onClick={() => setOpen(false)} className="py-3 border-b border-line">
                {t("nav.cart", locale)}
              </Link>
              <div className="pt-5">
                <LanguageSwitch locale={locale} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
