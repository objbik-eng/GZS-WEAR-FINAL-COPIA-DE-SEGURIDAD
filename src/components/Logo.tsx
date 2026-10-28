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
    <a href={homePath(locale)} aria-label="GZS WEAR — inicio" className="flex items-center gap-2.5 shrink-0">
      <Image
        src={src}
        alt="Logotipo GZS WEAR"
        width={compact ? 44 : 56}
        height={compact ? 44 : 56}
        priority
        className={compact ? "h-11 w-11 object-contain" : "h-14 w-14 object-contain"}
      />
      <span
        className={`font-ahsing leading-none text-[22px] lg:text-2xl tracking-wide ${
          variant === "blanco" ? "text-white" : "text-ink"
        }`}
      >
        GZS WEAR
      </span>
    </a>
  );
}
