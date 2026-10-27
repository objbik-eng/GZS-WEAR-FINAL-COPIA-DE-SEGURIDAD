/* Genera src/lib/data/catalog.json a partir de los productos de Printify
   (tienda GZS WEAR BRANDS, id 29488386) + curations.json.
   Ejecutar: npm run catalog  (requiere los JSON fuente en scripts/source) */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "source");
const SHOP_ID = "29488386";
const OUT = join(ROOT, "src/lib/data/catalog.json");

const curations = JSON.parse(readFileSync(join(ROOT, "src/lib/data/curations.json"), "utf8"));

/* Precios finales EUR (céntimos) por tipo de prenda */
const PRICE = { tee: 2795, oversize: 3995, crewneck: 4495, hoodie: 4995, cap: 3295, beanie: 2895 };
const ALLOWED_SIZES = ["S", "M", "L", "XL", "2XL"];

const COLOR_META = {
  Black: ["Negro", "#151515"], "Blanc White": ["Blanco", "#FFFFFF"], White: ["Blanco", "#FFFFFF"],
  "Light Blue": ["Azul claro", "#BFDCEC"], Red: ["Rojo", "#B5272D"], "Light Pink": ["Rosa claro", "#F3CCDC"],
  Pink: ["Rosa", "#F3CCDC"], Sand: ["Arena", "#D8C8AE"], Olive: ["Oliva", "#6B6F4E"],
  Oyster: ["Crudo Oyster", "#E8E0D2"], Charcoal: ["Gris carbón", "#3C3C3C"], "Dark Heather": ["Gris oscuro jaspeado", "#4C4C4C"],
  Navy: ["Marino", "#202C47"], "Sport Grey": ["Gris sport", "#A6A9AB"], "Forest Green": ["Verde bosque", "#2F4D37"],
  "Military Green": ["Verde militar", "#545B4B"], Maroon: ["Granate", "#6E2B3B"], Orange: ["Naranja", "#DF7B2A"],
  Royal: ["Azul real", "#2C4D9E"], Purple: ["Morado", "#6E3F8F"], Gold: ["Oro", "#C9A227"], Natural: ["Natural", "#EFE9DC"],
  "Dark Chocolate": ["Chocolate", "#4A3428"], "Dark Grey": ["Gris oscuro", "#565656"], "Heather Grey": ["Gris jaspeado", "#B5B3B0"],
  Brown: ["Marrón", "#7A5230"], "Baby Pink": ["Rosa bebé", "#F4C9D4"], Spruce: ["Abeto", "#2F5D50"],
  Jungle: ["Jungla", "#4A5D3A"], Pacific: ["Pacífico", "#4A7A8C"], Lilac: ["Lila", "#C7B8E0"],
  "Viola Blue": ["Azul viola", "#5C6BC0"], Magnet: ["Magnet", "#5B5B66"], "Charcoal Heather": ["Gris carbón jaspeado", "#555555"],
};

/* Guía de tallas métrica (cm) por tipo, generada al convertir las tablas en pulgadas de Printify */
const SIZE_GUIDES = {
  tee: {
    unit: "cm",
    sizes: ["S", "M", "L", "XL", "2XL"],
    rows: [
      { labelEs: "Ancho de pecho", labelEn: "Chest width", values: [46, 51, 56, 61, 66] },
      { labelEs: "Largo total", labelEn: "Total length", values: [71, 74, 76, 79, 81] },
      { labelEs: "Largo de manga (desde centro espalda)", labelEn: "Sleeve length (center back)", values: [38, 42, 46, 50, 53] },
    ],
    toleranceEs: "Tolerancia aproximada ±4 cm", toleranceEn: "Approx. tolerance ±4 cm",
  },
  oversize: {
    unit: "cm",
    sizes: ["S", "M", "L", "XL", "2XL"],
    rows: [
      { labelEs: "Largo total", labelEn: "Total length", values: [76, 78, 80, 82, 84] },
      { labelEs: "Ancho de pecho", labelEn: "Chest width", values: [57, 60, 63, 66, 69] },
      { labelEs: "Largo de manga", labelEn: "Sleeve length", values: [21, 22, 23, 24, 25] },
    ],
    toleranceEs: "Tolerancia aproximada ±2,5 cm · Corte oversize con hombro caído", toleranceEn: "Approx. tolerance ±2.5 cm · Oversize dropped-shoulder cut",
  },
  crewneck: {
    unit: "cm",
    sizes: ["S", "M", "L", "XL", "2XL"],
    rows: [
      { labelEs: "Ancho de pecho", labelEn: "Chest width", values: [51, 56, 61, 66, 71] },
      { labelEs: "Largo total", labelEn: "Total length", values: [69, 71, 74, 76, 79] },
      { labelEs: "Largo de manga (desde centro espalda)", labelEn: "Sleeve length (center back)", values: [85, 88, 90, 93, 95] },
    ],
    toleranceEs: "Tolerancia aproximada ±4 cm", toleranceEn: "Approx. tolerance ±4 cm",
  },
  hoodie: {
    unit: "cm",
    sizes: ["S", "M", "L", "XL", "2XL"],
    rows: [
      { labelEs: "Ancho de pecho", labelEn: "Chest width", values: [51, 56, 61, 66, 71] },
      { labelEs: "Largo total", labelEn: "Total length", values: [69, 71, 74, 76, 79] },
      { labelEs: "Largo de manga (desde centro espalda)", labelEn: "Sleeve length (center back)", values: [85, 88, 90, 93, 95] },
    ],
    toleranceEs: "Tolerancia aproximada ±4 cm", toleranceEn: "Approx. tolerance ±4 cm",
  },
  cap: {
    unit: "cm",
    sizes: ["Única"],
    rows: [
      { labelEs: "Contorno ajustable", labelEn: "Adjustable circumference", values: ["52–60"] },
      { labelEs: "Altura de copa", labelEn: "Crown height", values: [11] },
      { labelEs: "Ancho de visera", labelEn: "Visor width", values: [18] },
      { labelEs: "Largo de visera", labelEn: "Visor length", values: [7] },
    ],
    toleranceEs: "Cierre metálico regulable", toleranceEn: "Adjustable metal closure",
  },
  beanie: {
    unit: "cm",
    sizes: ["Única"],
    rows: [
      { labelEs: "Largo sin doblar", labelEn: "Length uncuffed", values: [30] },
      { labelEs: "Largo con puño", labelEn: "Length cuffed", values: [23] },
      { labelEs: "Ancho", labelEn: "Width", values: [21] },
      { labelEs: "Contorno (punto elástico)", labelEn: "Circumference (stretch knit)", values: ["44–47"] },
    ],
    toleranceEs: "Tejido elástico, se adapta al contorno", toleranceEn: "Stretch knit adapts to head size",
  },
};

function parseVariant(v) {
  const parts = v.title.split(" / ").map((s) => s.trim());
  const sizeTokens = new Set(["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "One size"]);
  let size = parts.find((p) => sizeTokens.has(p));
  let color = parts.find((p) => !sizeTokens.has(p));
  if (!size) size = "One size";
  return { color: color || "Unique", size };
}

function gpsrFor(productId) {
  const token = process.env.PRINTIFY_TOKEN || "";
  if (!token) return null;
  try {
    const raw = execSync(
      `curl -s --max-time 20 -H "Authorization: Bearer ${token}" -H "User-Agent: gzs-web" "https://api.printify.com/v1/shops/${SHOP_ID}/products/${productId}/gpsr.json"`,
      { encoding: "utf8" },
    );
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    const out = {};
    for (const block of data) out[block.title] = block.text;
    return out;
  } catch {
    return null;
  }
}

function pickImages(product, variantIdsByColor) {
  const result = {};
  for (const [color, vids] of Object.entries(variantIdsByColor)) {
    const pool = product.images.filter((im) => im.variant_ids?.some((id) => vids.includes(id)));
    const front = pool.find((im) => im.position === "front" && im.is_default)
      || pool.find((im) => im.position === "front")
      || pool.find((im) => im.position === "other")
      || product.images[0];
    const back = pool.find((im) => im.position === "back" && im.is_default)
      || pool.find((im) => im.position === "back")
      || null;
    const others = pool.filter((im) => im.position === "other" && im.src !== front?.src && im.src !== back?.src).slice(0, 2);
    const gallery = [front, back, ...others].filter(Boolean).map((im) => im.src);
    result[color] = {
      front: front?.src || null,
      back: back?.src || null,
      gallery: [...new Set(gallery)],
    };
  }
  return result;
}

const files = existsSync(SOURCE)
  ? readdirSync(SOURCE).filter((f) => f.endsWith(".json"))
  : [];

if (!files.length) {
  console.error("No se encontraron JSON fuente en scripts/source. Descarga primero los productos.");
  process.exit(1);
}

const products = [];
const warnings = [];

for (const file of files) {
  const p = JSON.parse(readFileSync(join(SOURCE, file), "utf8"));
  const c = curations[p.id];
  if (!c) { warnings.push(`Sin curaduría: ${p.id} ${p.title}`); continue; }

  /* variantes habilitadas y dentro del rango de tallas permitido */
  const colorMap = {};
  for (const v of p.variants) {
    if (!v.is_enabled) continue;
    const { color, size } = parseVariant(v);
    if (!ALLOWED_SIZES.includes(size) && size !== "One size") continue;
    if (!colorMap[color]) colorMap[color] = { variants: {}, variantIds: [] };
    const webSize = size === "One size" ? "Única" : size;
    colorMap[color].variants[webSize] = v.id;
    colorMap[color].variantIds.push(v.id);
  }

  const colors = Object.entries(colorMap).map(([en, data]) => {
    const [nameEs, hex] = COLOR_META[en] || [en, "#888888"];
    return { id: en, nameEn: en, nameEs, hex, variants: data.variants, variantIds: data.variantIds };
  });
  if (!colors.length) { warnings.push(`Sin variantes válidas: ${p.id}`); continue; }

  const imagesByColor = pickImages(p, Object.fromEntries(colors.map((c2) => [c2.id, c2.variantIds])));
  for (const col of colors) col.images = imagesByColor[col.id] || { front: null, back: null, gallery: [] };

  const oneSize = colors.some((c2) => "Única" in c2.variants);
  const gpsr = gpsrFor(p.id);

  products.push({
    printifyId: p.id,
    blueprintId: p.blueprint_id,
    providerId: p.print_provider_id,
    type: c.type,
    collection: "DISRUPTIVE",
    slug: { es: c.slugEs, en: c.slugEn },
    name: { es: c.nameEs, en: c.nameEn },
    description: { es: c.descEs, en: c.descEn },
    fabric: { es: c.fabricEs, en: c.fabricEn },
    fit: { es: c.fitEs, en: c.fitEn },
    priceEurCents: PRICE[c.type],
    currency: "EUR",
    unisex: true,
    sizes: oneSize ? ["Única"] : ALLOWED_SIZES,
    colors,
    sizeGuide: SIZE_GUIDES[c.type],
    gpsr,
    modelImage: null, // reserva para las fotos de modelo generadas por IA en siguientes fases
    tags: (p.tags || []).slice(0, 8),
    updatedAt: p.updated_at,
  });
}

/* orden fijo de la colección */
const order = { tee: 1, oversize: 2, crewneck: 3, hoodie: 4, cap: 5, beanie: 6 };
products.sort((a, b) => order[a.type] - order[b.type] || a.name.es.localeCompare(b.name.es));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ shopId: SHOP_ID, generatedAt: new Date().toISOString(), products }, null, 2));
console.log(`Catálogo generado: ${products.length} productos → ${OUT}`);
for (const w of warnings) console.warn("⚠", w);
const counts = products.reduce((acc, p) => ((acc[p.type] = (acc[p.type] || 0) + 1), acc), {});
console.log("Resumen por tipo:", JSON.stringify(counts));
