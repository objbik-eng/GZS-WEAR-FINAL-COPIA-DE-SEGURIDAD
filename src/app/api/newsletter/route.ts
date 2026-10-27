import { NextRequest, NextResponse } from "next/server";
import { submitEmailToGoogleForm } from "@/lib/google-forms";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const consent = body?.consent === true;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 160) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Debes aceptar la política de privacidad" }, { status: 400 });
    }
    const ok = await submitEmailToGoogleForm(email);
    if (!ok) return NextResponse.json({ error: "No se pudo registrar la suscripción" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
