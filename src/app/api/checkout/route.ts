import { NextRequest, NextResponse } from "next/server";
import { validateCart, computeOrder, type PricedLine } from "@/lib/cart-server";
import { ALLOWED_COUNTRIES } from "@/lib/shipping";
import { stripe } from "@/lib/stripe";
import { upsertOrder } from "@/lib/supabase";
import type { Locale } from "@/i18n/dict";

export const runtime = "nodejs";

interface CheckoutBody {
  locale?: Locale;
  country?: string;
  customer?: { email?: string; name?: string };
  consent?: boolean;
  items?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const locale: Locale = body.locale === "en" ? "en" : "es";
    const country = String(body.country || "ES").toUpperCase();
    if (!ALLOWED_COUNTRIES.some((c) => c.code === country)) {
      return NextResponse.json({ error: "País de envío no permitido" }, { status: 400 });
    }
    const email = String(body.customer?.email || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }
    const name = String(body.customer?.name || "").trim().slice(0, 120);
    if (name.length < 2) return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
    if (body.consent !== true) return NextResponse.json({ error: "Debes aceptar los términos" }, { status: 400 });

    const lines: PricedLine[] = validateCart(body.items);
    const order = computeOrder(lines, country);

    const siteUrl = (process.env.SITE_URL || "https://gzswear.roadshop.online").replace(/\/$/, "");
    const successBase = locale === "en" ? "/en/checkout/exito" : "/checkout/exito";
    const cancelBase = locale === "en" ? "/en/checkout" : "/checkout";

    const lineItems = lines.map((l) => ({
      quantity: l.qty,
      price_data: {
        currency: "eur",
        unit_amount: l.unit_price_cents,
        product_data: {
          name: l.name[locale],
          description: [l.colorLabel[locale], l.size].filter(Boolean).join(" · "),
          metadata: {
            product_id: l.product_id,
            color_id: l.colorId,
            color_label: l.colorLabel[locale],
            size: l.size,
            slug: l.slug[locale],
          },
        },
      },
    }));

    const session = await stripe<{ id: string; url: string }>("/checkout/sessions", {
      mode: "payment",
      locale: locale === "en" ? "en" : "es",
      customer_email: email,
      client_reference_id: `GZS-${Date.now().toString(36).toUpperCase()}`,
      line_items: lineItems,
      success_url: `${siteUrl}${successBase}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${cancelBase}?cancelado=1`,
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ALLOWED_COUNTRIES.map((c) => c.code),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: order.shippingCents, currency: "eur" },
            display_name: locale === "en" ? order.shipping.labelEn : order.shipping.labelEs,
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: order.shipping.zone === "us" ? 30 : 15 },
            },
          },
        },
      ],
      metadata: {
        origen: "web",
        locale,
        cliente: name,
        country,
        subtotal_cents: String(order.subtotal),
        envio_cents: String(order.shippingCents),
        shipping_zone: order.shipping.zone,
      },
      payment_intent_data: {
        receipt_email: email,
        description: "GZS WEAR BRANDS — Colección DISRUPTIVE",
        metadata: { origen: "web", locale },
      },
    });

    try {
      await upsertOrder({
        stripe_session_id: session.id,
        email,
        customer_name: name,
        amount_total_cents: order.total,
        shipping_cents: order.shippingCents,
        discount_cents: 0,
        currency: "eur",
        status: "pending",
        promo_code: null,
      });
    } catch (e) {
      console.error("supabase pending order:", (e as Error).message);
    }

    return NextResponse.json({
      url: session.url,
      session_id: session.id,
      subtotal_cents: order.subtotal,
      shipping_cents: order.shippingCents,
      total_cents: order.total,
    });
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    const message = err instanceof Error ? err.message : "Error al crear el pago";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
