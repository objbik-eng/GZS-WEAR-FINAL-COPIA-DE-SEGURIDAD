import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sb } from "@/lib/supabase";
import { SHOP_ID } from "@/lib/catalog";
import { sendShipmentNotification } from "@/lib/mail";

export const runtime = "nodejs";

interface Shipment {
  carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  shipped_at?: string | null;
}

interface OrderContact {
  id: string;
  email: string | null;
  customer_name: string | null;
  fulfillment_status?: string | null;
  shipment_email_sent_at?: string | null;
}

function validSignature(raw: string, signature: string | null, secret: string) {
  if (!signature || !secret || !signature.startsWith("sha256=")) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function getPrintifyOrder(id: string) {
  const r = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/orders/${encodeURIComponent(id)}.json`, {
    headers: { Authorization: `Bearer ${process.env.PRINTIFY_TOKEN}`, "User-Agent": "gzs-web" },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Printify ${r.status}`);
  return r.json() as Promise<{
    external_id?: string;
    status?: string;
    shipments?: Shipment[];
  }>;
}

function normalize(pOrder: { shipments?: Shipment[] }, fallback?: Partial<Shipment>): Shipment[] {
  const raw = pOrder.shipments?.length ? pOrder.shipments : fallback ? [fallback] : [];
  return raw
    .map((s) => ({
      carrier: typeof s.carrier === "string" ? s.carrier : "",
      tracking_number: s.tracking_number || "",
      tracking_url: s.tracking_url || "",
      shipped_at: s.shipped_at || null,
    }))
    .filter((s) => s.tracking_number || s.tracking_url || s.carrier);
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("x-pfy-signature"), process.env.PRINTIFY_WEBHOOK_SECRET || "")) {
    return NextResponse.json({ error: "Firma no válida" }, { status: 401 });
  }
  let event: {
    type?: string;
    topic?: string;
    resource?: { id?: string };
    data?: Record<string, unknown>;
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON no válido" }, { status: 400 });
  }

  try {
    const topic = event.type || event.topic || "";
    const providerOrderId = event.resource?.id || (event.data as { id?: string } | undefined)?.id;
    if (!providerOrderId) return NextResponse.json({ received: true, ignored: "sin id" });

    const pOrder = await getPrintifyOrder(providerOrderId);
    const sessionId = pOrder.external_id;
    const COLS = "id,email,customer_name,fulfillment_status,shipment_email_sent_at";
    let rows: OrderContact[] = [];
    if (sessionId) {
      rows = await sb(
        `orders?stripe_session_id=eq.${encodeURIComponent(sessionId)}&select=${COLS}`,
      );
    }
    if (!rows.length) {
      rows = await sb(
        `orders?printify_order_id=eq.${encodeURIComponent(providerOrderId)}&select=${COLS}`,
      );
    }
    const order = rows[0];
    if (!order) return NextResponse.json({ received: true, ignored: "pedido no asociado" });

    const base: Record<string, unknown> = { printify_status: pOrder.status || topic };

    if (topic === "order:sent-to-production") {
      base.fulfillment_status = "in-production";
    } else if (topic === "order:shipment:delivered") {
      base.fulfillment_status = "delivered";
    } else if (topic === "order:shipment:created") {
      const shipments = normalize(pOrder, event.data as Partial<Shipment> | undefined);
      base.fulfillment_status = "shipped";
      base.tracking_info = shipments;
    } else if (topic === "order:updated") {
      const status = String(pOrder.status || "").toLowerCase();
      if (status.includes("delivered")) base.fulfillment_status = "delivered";
      else if (status.includes("ship") || status.includes("fulfill")) base.fulfillment_status = "shipped";
      else if (status.includes("production")) base.fulfillment_status = "in-production";
    }

    await sb(`orders?id=eq.${order.id}`, { method: "PATCH", body: base, prefer: "return=minimal" });

    /* Aviso de envío con seguimiento (una sola vez por pedido). */
    let emailSent = false;
    if (
      base.fulfillment_status === "shipped" &&
      sessionId &&
      order.email &&
      !order.shipment_email_sent_at &&
      process.env.EMAILS_ENABLED === "true"
    ) {
      const shipments = (base.tracking_info as Shipment[] | undefined) || [];
      try {
        await sendShipmentNotification({
          to: order.email,
          name: order.customer_name || "",
          sessionId,
          shipments,
        });
        await sb(`orders?id=eq.${order.id}`, {
          method: "PATCH",
          body: { shipment_email_sent_at: new Date().toISOString(), email_last_error: null },
          prefer: "return=minimal",
        });
        emailSent = true;
      } catch (e) {
        console.error("shipment email:", (e as Error).message);
        await sb(`orders?id=eq.${order.id}`, {
          method: "PATCH",
          body: { email_last_error: String((e as Error).message).slice(0, 500) },
          prefer: "return=minimal",
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      received: true,
      updated: base.fulfillment_status || "ok",
      ...(emailSent ? { email: "shipment_notification_sent" } : {}),
    });
  } catch (err) {
    console.error("printify webhook:", err);
    return NextResponse.json({ error: "No se pudo procesar la actualización" }, { status: 500 });
  }
}
