import "server-only";
import { SHOP_ID, getProductByProductId } from "@/lib/catalog";

export interface PrintifyLine {
  product_id: string;
  colorId: string;
  colorLabel: string;
  size: string;
  qty: number;
}

export interface PrintifyOrderResult {
  id?: string;
  estado?: string;
  aProduccion: boolean;
  sinMapear: string[];
  skipped?: string;
}

/** Crea el pedido en Printify y lo envía a producción (salvo variantes sin mapear). */
export async function createPrintifyOrder(opts: {
  externalId: string;
  email: string;
  name: string;
  phone?: string;
  address: {
    country?: string; state?: string; city?: string;
    line1?: string; line2?: string; postal_code?: string;
  };
  items: PrintifyLine[];
}): Promise<PrintifyOrderResult> {
  const token = process.env.PRINTIFY_TOKEN;
  if (!token) return { aProduccion: false, sinMapear: [], skipped: "PRINTIFY_TOKEN no configurado" };

  const lineItems: { product_id: string; variant_id: number; quantity: number }[] = [];
  const sinMapear: string[] = [];

  for (const it of opts.items) {
    const product = getProductByProductId(it.product_id);
    if (!product) { sinMapear.push(it.product_id); continue; }
    const color = product.colors.find((c) => c.id === it.colorId) || product.colors[0];
    const variantId = color?.variants[it.size];
    if (!variantId) { sinMapear.push(`${product.slug.es} ${it.colorId}/${it.size}`); continue; }
    lineItems.push({ product_id: it.product_id, variant_id: variantId, quantity: it.qty });
  }

  if (!lineItems.length) return { aProduccion: false, sinMapear, skipped: "sin variantes válidas" };
  if (sinMapear.length) console.error("printify: variantes sin mapear:", sinMapear);

  const auto = sinMapear.length === 0 && process.env.PRINTIFY_AUTO_PRODUCTION !== "false";
  const parts = String(opts.name || "").trim().split(/\s+/);
  const body = {
    external_id: opts.externalId,
    label: `GZS ${String(opts.externalId).slice(-8)}`,
    line_items: lineItems,
    shipping_method: 1,
    send_shipping_notification: true,
    send_to_production: auto,
    address_to: {
      first_name: parts[0] || "Cliente",
      last_name: parts.slice(1).join(" ") || "-",
      email: opts.email || "",
      phone: opts.phone || "",
      country: opts.address.country || "ES",
      region: opts.address.state || "",
      city: opts.address.city || "",
      address1: opts.address.line1 || "",
      address2: opts.address.line2 || "",
      zip: opts.address.postal_code || "",
    },
  };

  const r = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "gzs-web" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Printify ${r.status}: ${JSON.stringify(data).slice(0, 220)}`);
  return {
    id: (data as { id?: string }).id,
    estado: (data as { status?: string }).status,
    aProduccion: auto,
    sinMapear,
  };
}
