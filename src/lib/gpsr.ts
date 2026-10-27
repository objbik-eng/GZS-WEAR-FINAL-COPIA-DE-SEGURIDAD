import type { Locale } from "@/i18n/dict";

/* Traducción de la información GPSR que llega en inglés desde el catálogo. */

const KEY_LABELS: Record<string, { es: string; en: string }> = {
  "EU representative": { es: "Representante en la UE", en: "EU representative" },
  "Product information": { es: "Información del producto", en: "Product information" },
  "Warnings, Hazard": { es: "Advertencias y riesgos", en: "Warnings and hazards" },
  "Care instructions": { es: "Instrucciones de cuidado", en: "Care instructions" },
};

const VALUE_ES: Record<string, string> = {
  "For adults": "Solo para personas adultas.",
  "Machine wash: cold (max 30C or 90F), Non-chlorine: bleach as needed, Tumble dry: low heat, Do not iron, Do not dryclean":
    "Lavar a máquina en frío (máx. 30 °C). Usar solo lejía sin cloro si es necesario. Secadora a baja temperatura. No planchar. No lavar en seco.",
  "Machine wash: cold (max 30C or 90F), Non-chlorine: bleach as needed, Tumble dry: medium, Iron, steam or dry: low heat, Do not dryclean":
    "Lavar a máquina en frío (máx. 30 °C). Usar solo lejía sin cloro si es necesario. Secadora a temperatura media. Planchar a baja temperatura, con vapor o en seco. No lavar en seco.",
  "Machine wash: cold (max 30C or 90F), with similar colors , Non-chlorine: bleach as needed, Tumble dry: low heat, Iron, steam or dry: low heat, do not iron on print, Do not dryclean, Keep away from fire":
    "Lavar a máquina en frío (máx. 30 °C), con colores similares. Usar solo lejía sin cloro si es necesario. Secadora a baja temperatura. Planchar a baja temperatura, con vapor o en seco, nunca sobre el estampado. No lavar en seco. Mantener alejado del fuego.",
  "Use warm water and dish soap and clean spots off your hat. It's not necessary to soak the whole item. For hard to clean spots use a soft bristled brush.":
    "Limpia las manchas con agua tibia y jabón lavavajillas; no es necesario sumergir toda la prenda. Para las manchas difíciles, utiliza un cepillo de cerdas suaves.",
};

const WARRANTY_RE = /^(.+), two year warranty in the EU and Northern Ireland\.?$/;

function translateValue(value: string, locale: Locale): string {
  if (locale === "en") return value;
  if (VALUE_ES[value]) return VALUE_ES[value];
  const m = value.match(WARRANTY_RE);
  if (m) return `${m[1]}, con garantía de dos años en la UE e Irlanda del Norte.`;
  return value; // p.ej. direcciones del representante (nombres propios)
}

export function localizeGpsr(
  gpsr: Record<string, string>,
  locale: Locale,
): { label: string; value: string }[] {
  return Object.entries(gpsr).map(([key, value]) => ({
    label: KEY_LABELS[key]?.[locale] || key,
    value: translateValue(value, locale),
  }));
}
