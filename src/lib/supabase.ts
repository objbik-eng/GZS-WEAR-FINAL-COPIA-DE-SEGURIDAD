import "server-only";

const url = () => process.env.SUPABASE_URL;
const key = () => process.env.SUPABASE_SECRET;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function sb<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; prefer?: string } = {},
): Promise<T> {
  if (!url() || !key()) throw new ApiError(503, "Base de datos no configurada");
  const secret = key() as string;
  const headers: Record<string, string> = {
    apikey: secret,
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  };
  if (options.prefer) headers.Prefer = options.prefer;
  const r = await fetch(`${url()}/rest/v1/${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  const text = await r.text();
  if (!r.ok) throw new ApiError(502, `Supabase ${r.status}: ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : null) as T;
}

export interface OrderRow {
  id?: string;
  stripe_session_id: string;
  stripe_payment_intent?: string | null;
  email: string | null;
  customer_name: string | null;
  amount_total_cents: number;
  shipping_cents: number;
  discount_cents: number;
  currency: string;
  status: string;
  shipping_address?: unknown;
  promo_code?: string | null;
  printify_order_id?: string | null;
  printify_status?: string | null;
  fulfillment_status?: string | null;
  tracking_info?: unknown;
  confirmation_email_sent_at?: string | null;
  shipment_email_sent_at?: string | null;
  email_last_error?: string | null;
}

export async function findOrderBySession(sessionId: string) {
  const rows = await sb<OrderRow[]>(
    `orders?stripe_session_id=eq.${encodeURIComponent(sessionId)}&select=*`,
  );
  return rows?.[0] || null;
}

export async function upsertOrder(row: OrderRow): Promise<OrderRow | null> {
  const existing = await findOrderBySession(row.stripe_session_id);
  if (existing?.id) {
    await sb(`orders?id=eq.${existing.id}`, {
      method: "PATCH",
      body: row,
      prefer: "return=minimal",
    });
    return { ...existing, ...row };
  }
  const created = await sb<OrderRow[]>("orders", {
    method: "POST",
    body: row,
    prefer: "return=representation",
  });
  return created?.[0] || null;
}

export async function insertOrderItems(orderId: string, items: Record<string, unknown>[]) {
  if (!items.length) return;
  await sb("order_items", {
    method: "POST",
    body: items.map((i) => ({ ...i, order_id: orderId })),
    prefer: "return=minimal",
  });
}

export async function addNewsletterEmail(email: string) {
  await sb("newsletter?on_conflict=email", {
    method: "POST",
    body: { email: email.toLowerCase(), source: "web" },
    prefer: "resolution=ignore-duplicates,return=minimal",
  });
}
