import { NextResponse } from "next/server";
import { PRODUCTS, SHOP_ID } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "gzs-wear-brands",
    time: new Date().toISOString(),
    catalog: PRODUCTS.length,
    printifyShop: SHOP_ID,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    printifyConfigured: Boolean(process.env.PRINTIFY_TOKEN),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET),
    emailsEnabled: process.env.EMAILS_ENABLED === "true",
  });
}
