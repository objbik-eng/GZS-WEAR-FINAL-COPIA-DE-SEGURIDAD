import Link from "next/link";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/i18n/dict";
import { shopPath, contactPath, categoryPath, type CategoryId } from "@/lib/routes";
import Logo from "@/components/Logo";
import { CartButton, LanguageSwitch, MobileMenu } from "@/components/HeaderClient";

const NAV_CATS: CategoryId[] = ["camisetas", "sudaderas", "accesorios"];
const NAV_KEYS = ["nav.tees", "nav.sweatshirts", "nav.accessories"] as const;

export default async function Header() {
  const locale = await getLocale();
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="bg-forest text-white">
        <div className="overflow-hidden py-2">
          <div className="marquee-track text-[12px] font-semibold tracking-wide">
            {[0, 1].map((half) => (
              <div key={half} className="marquee-half" aria-hidden={half === 1}>
                {[0, 1, 2, 3].map((r) => (
                  <div key={r} className="marquee-group">
                    <span>✦ {t("shipping.banner", locale)}</span>
                    <span>✦ {t("newsletter.title", locale)}</span>
                    <span>✦ {t("hero.badge", locale)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container-gzs flex items-center justify-between gap-4 py-3.5">
        <Logo locale={locale} />
        <nav className="hidden lg:flex items-center gap-8">
          <Link href={shopPath(locale)} className="header-link">{t("nav.shop", locale)}</Link>
          {NAV_CATS.map((cat, i) => (
            <Link key={cat} href={categoryPath(cat, locale)} className="header-link">{t(NAV_KEYS[i], locale)}</Link>
          ))}
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
