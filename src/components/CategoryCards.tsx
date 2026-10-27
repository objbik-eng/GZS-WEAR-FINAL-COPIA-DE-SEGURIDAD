import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/dict";
import { t } from "@/i18n/dict";
import { categoryPath, type CategoryId } from "@/lib/routes";

const CARDS: { id: CategoryId; image: string; labelKey: string; descKey: string }[] = [
  { id: "camisetas", image: "/images/categorias/camisetas.jpg", labelKey: "cat.camisetas", descKey: "cat.camisetas.desc" },
  { id: "sudaderas", image: "/images/categorias/sudaderas.jpg", labelKey: "cat.sudaderas", descKey: "cat.sudaderas.desc" },
  { id: "accesorios", image: "/images/categorias/accesorios.jpg", labelKey: "cat.accesorios", descKey: "cat.accesorios.desc" },
];

export default function CategoryCards({ locale }: { locale: Locale }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {CARDS.map((card) => (
        <Link
          key={card.id}
          href={categoryPath(card.id, locale)}
          className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-cream block"
          aria-label={t(card.labelKey, locale)}
        >
          <Image
            src={card.image}
            alt={`${t(card.labelKey, locale)} — GZS WEAR`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white drop-shadow">
              {t(card.labelKey, locale)}
            </h3>
            <p className="text-white/85 text-sm mt-1.5 max-w-[16rem]">{t(card.descKey, locale)}</p>
            <span className="inline-block mt-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              GZS WEAR*
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
