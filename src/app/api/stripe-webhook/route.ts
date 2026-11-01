import { NextRequest, NextResponse } from "next/server";
import { stripe, verifyStripeSignature } from "@/lib/stripe";
import { upsertOrder, insertOrderItems, sb, type OrderRow } from "@/lib/supabase";
import { createPrintifyOrder, type PrintifyLine } from "@/lib/printify";
import { sendOrderConfirmation } from "@/lib/mail";

export const runtime = "nodejs";

interface StripeLineItem {
  quantity: number;
  description?: string;
  price?: {
    unit_amount?: number | null;
    product?: {
      name?: string;
      metadata?: Record<string, string>;
    };
  };
}

async function handlePaidSession(sessionId: string) {
  const session = await stripe<{
    id: string;
    payment_status: string;
    amount_total: number;
    currency: string;
    customer_email?: string | null;
    customer_details?: { email?: string | null; name?: string | null; phone?: string | null };
    metadata?: Record<string, string>;
    shipping_details?: { name?: string; address?: Record<string, string> };
    payment_intent?: string | { id?: string };
    line_items?: { data: StripeLineItem[] };
  }>(`/checkout/sessions/${sessionId}?expand[]=line_items`);

  const meta = session.metadata || {};
  const items: PrintifyLine[] = [];
  const dbItems = [];

  for (const li of session.line_items?.data || []) {
    const md = li.price?.product?.metadata || {};
    if (!md.product_id) continue;
    const qty = li.quantity || 1;
    items.push({
      product_id: md.product_id,
      colorId: md.color_id,
      colorLabel: md.color_label || "",
      size: md.size,
      qty,
    });
    dbItems.push({
      product_id: md.product_id,
      name: li.price?.product?.name || li.description || "Artículo",
      qty,
      color: md.color_label || "",
      size: md.size || "",
      unit_price_cents: li.price?.unit_amount || 0,
    });
  }

  const email = session.customer_details?.email || session.customer_email || null;
  const name = session.customer_details?.name || meta.cliente || null;
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;

  const row: OrderRow = {
    stripe_session_id: session.id,
    stripe_payment_intent: paymentIntent,
    email,
    customer_name: name,
    amount_total_cents: session.amount_total,
    shipping_cents: Number(meta.envio_cents || 0),
    discount_cents: 0,
    currency: session.currency || "eur",
    status: "paid",
    shipping_address: session.shipping_details?.address
      ? { ...session.shipping_details.address, name: session.shipping_details.name }
      : null,
    promo_code: null,
  };

  const order = await upsertOrder(row);
  if (order?.id) {
    try {
      /* Stripe puede reenviar el mismo evento: no duplicar las líneas del pedido. */
      const existing = await sb<{ id: string }[]>(
        `order_items?order_id=eq.${encodeURIComponent(order.id)}&select=id&limit=1`,
      );
      if (!existing?.length) await insertOrderItems(order.id, dbItems);
    } catch (e) {
      console.error("order_items:", (e as Error).message);
    }
  }

  /* Producción automática en Printify */
  if (order?.id && items.length) {
    try {
      const addr = session.shipping_details?.address || {};
      const pr = await createPrintifyOrder({
        externalId: session.id,
        email: email || "",
        name: name || "",
        phone: session.customer_details?.phone || "",
        address: {
          country: addr.country,
          state: addr.state,
          city: addr.city,
          line1: addr.line1,
          line2: addr.line2,
          postal_code: addr.postal_code,
        },
        items,
      });
      if (pr.id) {
        await sb(`orders?id=eq.${order.id}`, {
          method: "PATCH",
          body: {
            printify_order_id: pr.id,
            printify_status: pr.estado,
            fulfillment_status: pr.aProduccion ? "submitted" : "draft-review",
          },
          prefer: "return=minimal",
        });
      }
    } catch (e) {
      console.error("printify order:", (e as Error).message);
    }

    /* Email de confirmación */
    if (process.env.EMAILS_ENABLED === "true" && email && !order.confirmation_email_sent_at) {
      try {
        await sendOrderConfirmation({
          to: email,
          name: name || "",
          sessionId: session.id,
          items: dbItems.map((i) => ({ name: i.name, qty: i.qty, colorLabel: i.color, size: i.size })),
          totalCents: session.amount_total,
        });
        await sb(`orders?id=eq.${order.id}`, {
          method: "PATCH",
          body: { confirmation_email_sent_at: new Date().toISOString(), email_last_error: null },
          prefer: "return=minimal",
        });
      } catch (e) {
        await sb(`orders?id=eq.${order.id}`, {
          method: "PATCH",
          body: { email_last_error: String((e as Error).message).slice(0, 500) },
          prefer: "return=minimal",
        }).catch(() => {});
        throw e; // Stripe reintenta; el alta de Printify no se duplica por external_id
      }
    }
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  const ok = await verifyStripeSignature(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || "");
  if (!ok) return NextResponse.json({ error: "Firma no válida" }, { status: 400 });

  let event: { type?: string; data?: { object?: { id: string; payment_status?: string } } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "JSON no válido" }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const s = event.data?.object;
      if (s?.id && (event.type === "checkout.session.async_payment_succeeded" || s.payment_status === "paid")) {
        await handlePaidSession(s.id);
      }
    } else if (event.type === "charge.refunded") {
      const pi = (event.data?.object as { payment_intent?: string } | undefined)?.payment_intent;
      if (pi) {
        await sb(`orders?stripe_payment_intent=eq.${encodeURIComponent(pi)}`, {
          method: "PATCH",
          body: { status: "refunded" },
          prefer: "return=minimal",
        });
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("stripe webhook:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
