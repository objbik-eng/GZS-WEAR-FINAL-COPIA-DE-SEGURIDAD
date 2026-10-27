import { NextRequest, NextResponse } from "next/server";
import { findOrderBySession } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id requerido" }, { status: 400 });
  try {
    const order = await findOrderBySession(sessionId);
    if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    return NextResponse.json({
      id: order.id,
      email: order.email,
      customer_name: order.customer_name,
      amount_total_cents: order.amount_total_cents,
      status: order.status,
      fulfillment_status: order.fulfillment_status || null,
      tracking_info: order.tracking_info || null,
      created_at: (order as { created_at?: string }).created_at || null,
    });
  } catch (err) {
    console.error("order get:", err);
    return NextResponse.json({ error: "No se pudo consultar el pedido" }, { status: 500 });
  }
}
