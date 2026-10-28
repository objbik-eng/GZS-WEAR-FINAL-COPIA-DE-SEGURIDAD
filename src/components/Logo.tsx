import Image from "next/image";
import { homePath } from "@/lib/routes";
import type { Locale } from "@/i18n/dict";

export default function Logo({ locale, variant = "verde", compact = false }: {
  locale: Locale;
  variant?: "verde" | "blanco";
  compact?: boolean;
}) {
  const src = variant === "blanco" ? "/brand/logo-blanco.png" : "/brand/logo-verde.png";
  return (
    <a href={homePath(locale)} aria-label="GZS WEAR — inicio" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
      <Image
        src={src}
        alt="Logotipo GZS WEAR"
        width={compact ? 44 : 56}
        height={compact ? 44 : 56}
        priority
        className={
          compact
            ? "h-11 w-11 object-contain"
            : "h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain"
        }
      />
      <span
        className={`font-ahsing leading-none text-[17px] sm:text-xl lg:text-2xl tracking-wide whitespace-nowrap ${
          variant === "blanco" ? "text-white" : "text-ink"
        }`}
      >
        GZS WEAR
      </span>
    </a>
  );
}
