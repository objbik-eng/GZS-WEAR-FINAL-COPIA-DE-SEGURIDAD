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
    <a href={homePath(locale)} aria-label="GZS WEAR BRANDS — inicio" className="flex items-center gap-2 shrink-0">
      <Image
        src={src}
        alt="Logotipo GZS WEAR BRANDS"
        width={compact ? 40 : 52}
        height={compact ? 40 : 52}
        priority
        className={compact ? "h-9 w-9 object-contain" : "h-12 w-12 object-contain"}
      />
      {!compact && (
        <span className="hidden sm:flex flex-col leading-none">
          <span className={`font-display font-900 text-[15px] tracking-wide ${variant === "blanco" ? "text-white" : "text-ink"}`}>
            GZS WEAR<span className="text-gold">*</span>
          </span>
          <span className={`text-[10px] tracking-[0.3em] mt-1 ${variant === "blanco" ? "text-white/70" : "text-smoke"}`}>
            BRANDS
          </span>
        </span>
      )}
    </a>
  );
}
