import { NextRequest, NextResponse } from "next/server";
import { submitEmailToGoogleForm } from "@/lib/google-forms";
import { addNewsletterEmail } from "@/lib/supabase";

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
    /* Doble registro: base de datos propia (consultable y exportable) y Google
       Forms (respaldo histórico). Basta con que uno de los dos confirme. */
    const [db, form] = await Promise.allSettled([
      addNewsletterEmail(email),
      submitEmailToGoogleForm(email),
    ]);
    if (db.status === "rejected") console.error("newsletter supabase:", db.reason);
    if (form.status === "rejected") console.error("newsletter google form:", form.reason);

    const stored = db.status === "fulfilled";
    const formOk = form.status === "fulfilled" && form.value === true;
    if (!stored && !formOk) {
      return NextResponse.json({ error: "No se pudo registrar la suscripción" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, stored });
  } catch (err) {
    console.error("newsletter:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
