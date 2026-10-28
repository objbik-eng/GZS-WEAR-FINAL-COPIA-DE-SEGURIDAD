"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag, Globe } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { t, type Locale } from "@/i18n/dict";
import { shopPath, cartPath, contactPath, categoryPath, type CategoryId } from "@/lib/routes";
import { SLUG_ES_TO_EN, SLUG_EN_TO_ES } from "@/lib/catalog";

/* Mapas explícitos en ambos sentidos para que el cambio de idioma nunca genere
   una ruta inválida (la causa de que el interruptor se "quedase pillado"). */
const ES_SEG_TO_EN: Record<string, string> = {
  tienda: "shop",
  producto: "product",
  carrito: "cart",
  contacto: "contact",
  legal: "legal",
  camisetas: "t-shirts",
  sudaderas: "sweatshirts",
  accesorios: "accessories",
};
const EN_SEG_TO_ES: Record<string, string> = {
  shop: "tienda",
  product: "producto",
  cart: "carrito",
  contact: "contacto",
  legal: "legal",
  "t-shirts": "camisetas",
  sweatshirts: "sudaderas",
  accessories: "accesorios",
};
const LEGAL_ES_TO_EN: Record<string, string> = {
  "aviso-legal": "legal-notice",
  privacidad: "privacy",
  terminos: "terms",
  cookies: "cookies",
  "envios-devoluciones": "shipping-returns",
};
const LEGAL_EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(LEGAL_ES_TO_EN).map(([es, en]) => [en, es]),
);

function buildTarget(pathname: string, locale: Locale): string {
  const clean = pathname.split("?")[0].split("#")[0];
  if (locale === "es") {
    if (clean === "/" || clean === "") return "/en";
    const seg = clean.split("/").filter(Boolean);
    if (seg[0]) seg[0] = ES_SEG_TO_EN[seg[0]] || seg[0];
    if (seg[0] === "legal" && seg[1]) seg[1] = LEGAL_ES_TO_EN[seg[1]] || seg[1];
    if (seg[0] === "product" && seg[1]) seg[1] = SLUG_ES_TO_EN[seg[1]] || seg[1];
    return `/en/${seg.join("/")}`;
  }
  const rest = clean.replace(/^\/en\/?/, "");
  if (!rest) return "/";
  const seg = rest.split("/").filter(Boolean);
  if (seg[0]) seg[0] = EN_SEG_TO_ES[seg[0]] || seg[0];
  if (seg[0] === "legal" && seg[1]) seg[1] = LEGAL_EN_TO_ES[seg[1]] || seg[1];
  if (seg[0] === "producto" && seg[1]) seg[1] = SLUG_EN_TO_ES[seg[1]] || seg[1];
  return `/${seg.join("/")}`;
}

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  const target = buildTarget(pathname, locale);
  const nextLocale: Locale = locale === "es" ? "en" : "es";
  return (
    <Link
      href={target}
      hrefLang={nextLocale}
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

const NAV_CATS: { cat: CategoryId; key: "nav.tees" | "nav.sweatshirts" | "nav.accessories" }[] = [
  { cat: "camisetas", key: "nav.tees" },
  { cat: "sudaderas", key: "nav.sweatshirts" },
  { cat: "accesorios", key: "nav.accessories" },
];

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
              <span className="font-ahsing text-xl text-ink tracking-wide">GZS WEAR</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar menú" className="p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1 text-[15px] font-semibold overflow-y-auto">
              <Link href={shopPath(locale)} onClick={() => setOpen(false)} className="py-3 border-b border-line">
                {t("nav.shop", locale)}
              </Link>
              {NAV_CATS.map(({ cat, key }) => (
                <Link key={cat} href={categoryPath(cat, locale)} onClick={() => setOpen(false)} className="py-3 border-b border-line">
                  {t(key, locale)}
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
