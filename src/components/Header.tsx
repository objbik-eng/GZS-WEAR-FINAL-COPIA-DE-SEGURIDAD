import Link from "next/link";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/i18n/dict";
import { shopPath, contactPath } from "@/lib/routes";
import Logo from "@/components/Logo";
import { CartButton, LanguageSwitch, MobileMenu } from "@/components/HeaderClient";

export default async function Header() {
  const locale = await getLocale();
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="bg-forest text-white">
        <div className="container-gzs overflow-hidden py-2">
          <div className="flex whitespace-nowrap animate-marquee gap-10 text-[12px] font-semibold tracking-wide w-max">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-10">
                <span>✦ {t("shipping.banner", locale)}</span>
                <span>✦ {t("newsletter.title", locale)}</span>
                <span>✦ {t("hero.badge", locale)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="container-gzs flex items-center justify-between gap-4 py-3.5">
        <Logo locale={locale} />
        <nav className="hidden lg:flex items-center gap-8">
          <Link href={shopPath(locale)} className="header-link">{t("nav.shop", locale)}</Link>
          <Link href="/tienda?f=tee" className="header-link">{t("nav.tees", locale)}</Link>
          <Link href="/tienda?f=hoodie" className="header-link">{t("nav.sweatshirts", locale)}</Link>
          <Link href="/tienda?f=cap" className="header-link">{t("nav.accessories", locale)}</Link>
          <Link href={contactPath(locale)} className="header-link">{t("nav.contact", locale)}</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <LanguageSwitch locale={locale} />
          </div>
          <CartButton locale={locale} />
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}
