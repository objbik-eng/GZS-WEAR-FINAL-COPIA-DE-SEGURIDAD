import { NextRequest, NextResponse } from "next/server";
import { addNewsletterEmail, ApiError } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 160) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }
    await addNewsletterEmail(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status });
  }
}
