import type { ProductType } from "@/lib/catalog";

/* Tabla de tarifas de los proveedores (EUR), extraída de los datos oficiales
   de Printify/Printful. first = primer artículo, add = artículo adicional. */
interface Rate { first: number; add: number; }

const EU_RATES: Record<ProductType, Rate> = {
  tee: { first: 4.08, add: 1.04 },        // Atelier Katanga — European countries
  oversize: { first: 4.34, add: 1.04 },   // Textildruck Europa — European Countries
  crewneck: { first: 6.78, add: 2.08 },   // Atelier Katanga
  hoodie: { first: 6.78, add: 2.08 },
  cap: { first: 4.17, add: 1.26 },        // Printful — European
  beanie: { first: 4.17, add: 1.26 },
};

const IE_RATES: Record<ProductType, Rate> = {
  tee: { first: 6.78, add: 1.04 },
  oversize: { first: 6.78, add: 1.04 },
  crewneck: { first: 7.04, add: 2.08 },
  hoodie: { first: 7.04, add: 2.08 },
  cap: { first: 4.17, add: 1.26 },
  beanie: { first: 4.17, add: 1.26 },
};

const UK_RATES: Record<ProductType, Rate> = {
  tee: { first: 6.78, add: 1.04 },
  oversize: { first: 6.78, add: 1.04 },
  crewneck: { first: 7.04, add: 2.08 },
  hoodie: { first: 7.04, add: 2.08 },
  cap: { first: 3.99, add: 1.38 },
  beanie: { first: 3.99, add: 1.38 },
};

const US_RATES: Record<ProductType, Rate> = {
  tee: { first: 20.87, add: 7.47 },
  oversize: { first: 23.13, add: 5.73 },
  crewneck: { first: 27.14, add: 12.17 },
  hoodie: { first: 27.14, add: 12.17 },
  cap: { first: 4.43, add: 1.91 },
  beanie: { first: 4.43, add: 1.91 },
};

const EFTA_RATES: Record<ProductType, Rate> = {
  tee: { first: 6.34, add: 1.04 },
  oversize: { first: 6.34, add: 1.73 },
  crewneck: { first: 9.47, add: 2.08 },
  hoodie: { first: 9.47, add: 2.08 },
  cap: { first: 9.04, add: 0.96 },
  beanie: { first: 9.04, add: 0.96 },
};

export type ShippingZone = "eu" | "ie" | "uk" | "us" | "efta";

/* Países de la UE-27 con tarifa plana subvencionada (Irlanda se trata aparte) */
export const EU_COUNTRIES = new Set([
  "ES", "PT", "FR", "DE", "IT", "NL", "BE", "AT", "LU", "DK", "SE", "FI", "PL",
  "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "EE", "LV", "LT", "MT", "CY", "GR",
]);

const IE = new Set(["IE"]);
const UK = new Set(["GB"]);
const US = new Set(["US"]);
const EFTA = new Set(["NO", "IS", "LI", "CH"]);

export const ALLOWED_COUNTRIES: { code: string; zone: ShippingZone }[] = [
  ...[...EU_COUNTRIES].map((code) => ({ code, zone: "eu" as const })),
  ...[...IE].map((code) => ({ code, zone: "ie" as const })),
  ...[...UK].map((code) => ({ code, zone: "uk" as const })),
  ...[...US].map((code) => ({ code, zone: "us" as const })),
  ...[...EFTA].map((code) => ({ code, zone: "efta" as const })),
].sort((a, b) => a.code.localeCompare(b.code));

export function zoneForCountry(code: string): ShippingZone {
  if (IE.has(code)) return "ie";
  if (UK.has(code)) return "uk";
  if (US.has(code)) return "us";
  if (EFTA.has(code)) return "efta";
  return "eu";
}

function ratesFor(zone: ShippingZone): Record<ProductType, Rate> {
  switch (zone) {
    case "ie": return IE_RATES;
    case "uk": return UK_RATES;
    case "us": return US_RATES;
    case "efta": return EFTA_RATES;
    default: return EU_RATES;
  }
}

export interface CartLine { type: ProductType; qty: number; }

export const FREE_SHIPPING_THRESHOLD = 6000; // 60 € (céntimos)
export const EU_FLAT_RATE = 495;            // 4,95 €

/** Coste real de envío Printify (consolidado): first más alto + adicionales. */
export function realShippingCost(lines: CartLine[], zone: ShippingZone): number {
  const rates = ratesFor(zone);
  let maxFirst = 0;
  let additionals = 0;
  let maxFirstType: ProductType | null = null;
  for (const line of lines) {
    const r = rates[line.type];
    if (r.first > maxFirst) { maxFirst = r.first; maxFirstType = line.type; }
  }
  for (const line of lines) {
    additionals += rates[line.type].add * line.qty;
  }
  if (maxFirstType) additionals -= rates[maxFirstType].add; // el primer artículo paga tarifa first
  return Math.round((maxFirst + Math.max(0, additionals)) * 100);
}

export interface ShippingQuote {
  zone: ShippingZone;
  costCents: number;
  free: boolean;
  labelEs: string;
  labelEn: string;
}

export interface ZonePreview {
  zone: Exclude<ShippingZone, "eu">;
  labelEs: string;
  labelEn: string;
  firstItemCents: number;
  windowEs: string;
  windowEn: string;
}

const ZONE_META: Record<Exclude<ShippingZone, "eu">, { labelEs: string; labelEn: string; windowEs: string; windowEn: string }> = {
  ie: { labelEs: "Irlanda", labelEn: "Ireland", windowEs: "5–15 días laborables", windowEn: "5–15 business days" },
  uk: { labelEs: "Reino Unido", labelEn: "United Kingdom", windowEs: "5–15 días laborables", windowEn: "5–15 business days" },
  us: { labelEs: "Estados Unidos", labelEn: "United States", windowEs: "10–30 días laborables", windowEn: "10–30 business days" },
  efta: { labelEs: "EFTA (Noruega, Islandia, Suiza, Liechtenstein)", labelEn: "EFTA (Norway, Iceland, Switzerland, Liechtenstein)", windowEs: "5–15 días laborables", windowEn: "5–15 business days" },
};

/** Tarifa real del primer artículo de un tipo de prenda en cada zona fuera de la UE. */
export function internationalPreview(type: ProductType): ZonePreview[] {
  return (["ie", "uk", "us", "efta"] as const).map((zone) => ({
    zone,
    ...ZONE_META[zone],
    firstItemCents: Math.round(ratesFor(zone)[type].first * 100),
  }));
}

export function quoteShipping(lines: CartLine[], subtotalCents: number, countryCode: string): ShippingQuote {
  const zone = zoneForCountry(countryCode);
  if (zone === "eu") {
    const free = subtotalCents >= FREE_SHIPPING_THRESHOLD;
    return {
      zone,
      costCents: free ? 0 : EU_FLAT_RATE,
      free,
      labelEs: free ? "Envío estándar gratuito (5–10 días laborables)" : "Envío estándar UE (5–10 días laborables)",
      labelEn: free ? "Free standard shipping (5–10 business days)" : "EU standard shipping (5–10 business days)",
    };
  }
  const cost = realShippingCost(lines, zone);
  const labels: Record<Exclude<ShippingZone, "eu">, [string, string]> = {
    ie: ["Envío Irlanda (5–15 días laborables)", "Ireland shipping (5–15 business days)"],
    uk: ["Envío Reino Unido (5–15 días laborables)", "UK shipping (5–15 business days)"],
    us: ["Envío Estados Unidos (10–30 días laborables)", "US shipping (10–30 business days)"],
    efta: ["Envío EFTA / Europa del Norte (5–15 días laborables)", "EFTA / Northern Europe shipping (5–15 business days)"],
  };
  const [labelEs, labelEn] = labels[zone as Exclude<ShippingZone, "eu">];
  return { zone, costCents: cost, free: false, labelEs, labelEn };
}
