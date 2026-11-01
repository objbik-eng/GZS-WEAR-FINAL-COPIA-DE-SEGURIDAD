import Link from "next/link";
import { Mail } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/i18n/dict";
import { shopPath, contactPath, cartPath, legalPath, categoryPath, orderStatusPath } from "@/lib/routes";
import Logo from "@/components/Logo";
import NewsletterForm from "@/components/NewsletterForm";

export default async function Footer() {
  const locale = await getLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white/90">
      <div className="container-gzs py-16 grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">
        <div>
          <Logo locale={locale} variant="blanco" />
          <p className="mt-5 text-sm leading-relaxed text-white/70 max-w-xs">{t("footer.tagline", locale)}</p>
          <a href="mailto:gzswear@roadshop.online" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
            <Mail size={16} /> gzswear@roadshop.online
          </a>
        </div>

        <nav aria-label="Tienda">
          <h3 className="font-display text-sm tracking-[0.2em] uppercase text-gold mb-4">{t("footer.shop", locale)}</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href={shopPath(locale)} className="hover:text-gold transition-colors">{t("nav.shop", locale)}</Link></li>
            <li><Link href={categoryPath("camisetas", locale)} className="hover:text-gold transition-colors">{t("nav.tees", locale)}</Link></li>
            <li><Link href={categoryPath("sudaderas", locale)} className="hover:text-gold transition-colors">{t("nav.sweatshirts", locale)}</Link></li>
            <li><Link href={categoryPath("accesorios", locale)} className="hover:text-gold transition-colors">{t("nav.accessories", locale)}</Link></li>
            <li><Link href={cartPath(locale)} className="hover:text-gold transition-colors">{t("nav.cart", locale)}</Link></li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h3 className="font-display text-sm tracking-[0.2em] uppercase text-gold mb-4">{t("footer.legal", locale)}</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href={legalPath("aviso-legal", locale)} className="hover:text-gold transition-colors">{t("legal.legalNotice", locale)}</Link></li>
            <li><Link href={legalPath("privacidad", locale)} className="hover:text-gold transition-colors">{t("legal.privacy", locale)}</Link></li>
            <li><Link href={legalPath("terminos", locale)} className="hover:text-gold transition-colors">{t("legal.terms", locale)}</Link></li>
            <li><Link href={legalPath("cookies", locale)} className="hover:text-gold transition-colors">{t("legal.cookies", locale)}</Link></li>
            <li><Link href={legalPath("envios-devoluciones", locale)} className="hover:text-gold transition-colors">{t("legal.shipping", locale)}</Link></li>
            <li><Link href={orderStatusPath(locale)} className="hover:text-gold transition-colors">{t("legal.orderStatus", locale)}</Link></li>
            <li><Link href={contactPath(locale)} className="hover:text-gold transition-colors">{t("legal.contact", locale)}</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-lg font-extrabold text-white leading-tight">{t("newsletter.title", locale)}</h3>
          <p className="mt-2 text-sm text-white/70 mb-5">{t("newsletter.subtitle", locale)}</p>
          <NewsletterForm locale={locale} variant="footer" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-gzs py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/55">
          <span>© {year} GZS WEAR. {t("footer.rights", locale)}</span>
          <span>{t("footer.secure", locale)}</span>
        </div>
      </div>
    </footer>
  );
}
