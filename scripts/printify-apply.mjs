/* Aplica en Printify (tienda 29488386):
 *  - desactiva XS y tallas >2XL
 *  - título y descripción en español con tabla de tallas métrica (cm)
 *  - safety_information (GPSR)
 * Uso: npm run printify:apply -- [--dry] [--id=PRODUCT_ID]
 * Requiere PRINTIFY_TOKEN en entorno y los JSON fuente en scripts/source. */
import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "source");
const SHOP_ID = "29488386";
const TOKEN = process.env.PRINTIFY_TOKEN;
const DRY = process.argv.includes("--dry");
const idArg = process.argv.find((a) => a.startsWith("--id="))?.split("=")[1];

const curations = JSON.parse(readFileSync(join(ROOT, "src/lib/data/curations.json"), "utf8"));
const catalog = JSON.parse(readFileSync(join(ROOT, "src/lib/data/catalog.json"), "utf8"));
const ALLOWED = new Set(["S", "M", "L", "XL", "2XL", "One size"]);

function parseSize(title) {
  const parts = title.split(" / ").map((s) => s.trim());
  const sizes = new Set(["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "One size"]);
  return parts.find((p) => sizes.has(p)) || "One size";
}

function sizeTableHtml(p) {
  const g = p.sizeGuide;
  const head = g.sizes.map((s) => `<th>${s}</th>`).join("");
  const rows = g.rows
    .map((r) => `<tr><td>${r.labelEs}</td>${r.values.map((v) => `<td>${v}</td>`).join("")}</tr>`)
    .join("");
  return `<h3>Guía de tallas (cm)</h3><table style="border-collapse:collapse;min-width:320px">
<thead><tr><th>Medida</th>${head}</tr></thead><tbody>${rows}</tbody></table>
<p style="color:#666;font-size:13px">${g.toleranceEs}</p>`;
}

function gpsrText(gpsr) {
  if (!gpsr) return "";
  return Object.entries(gpsr).map(([k, v]) => `${k}: ${v}`).join("\n");
}

function descriptionHtml(p, c) {
  const parts = [
    `<p>${c.descEs}</p>`,
    `<p><strong>Composición:</strong> ${c.fabricEs}</p>`,
    `<p><strong>Fit:</strong> ${c.fitEs}</p>`,
    sizeTableHtml(p),
  ];
  return parts.join("\n");
}

function api(method, path, body) {
  const tmp = join(__dirname, ".tmp-req.json");
  const args = ["-s", "-X", method, "-H", `Authorization: Bearer ${TOKEN}`, "-H", "Content-Type: application/json", "-H", "User-Agent: gzs-web"];
  if (body) {
    writeFileSync(tmp, JSON.stringify(body));
    args.push("--data-binary", `@${tmp}`);
  }
  args.push(`https://api.printify.com/v1/shops/${SHOP_ID}/${path}`);
  const out = execFileSync("curl", args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(out);
}

const files = existsSync(SOURCE) ? readdirSync(SOURCE).filter((f) => f.endsWith(".json")) : [];
let updated = 0;
for (const file of files) {
  const raw = JSON.parse(readFileSync(join(SOURCE, file), "utf8"));
  if (idArg && raw.id !== idArg) continue;
  const c = curations[raw.id];
  const cat = catalog.products.find((p) => p.productId === raw.id);
  if (!c || !cat) { console.warn("saltar (sin curaduría):", raw.id); continue; }

  const variants = raw.variants.map((v) => {
    const size = parseSize(v.title);
    return {
      id: v.id,
      is_enabled: v.is_enabled && ALLOWED.has(size),
      is_default: v.is_default,
      price: v.price,
      sku: v.sku,
    };
  });
  const disabled = variants.filter((v, i) => !v.is_enabled && raw.variants[i].is_enabled).length;

  const payload = {
    title: c.nameEs,
    description: descriptionHtml(cat, c),
    safety_information: gpsrText(cat.gpsr),
    variants,
  };

  console.log(`→ ${raw.id} | ${c.nameEs} | variantes desactivadas: ${disabled}`);
  if (DRY) {
    console.log("   (dry-run, no se envía nada)");
    continue;
  }
  const res = api("PUT", `products/${raw.id}.json`, payload);
  if (res.id) {
    console.log("   OK ✓", res.title || res.id);
    updated++;
  } else {
    console.error("   ERROR ✗", JSON.stringify(res).slice(0, 300));
  }
}
console.log(`Finalizado. Productos actualizados: ${updated}`);
