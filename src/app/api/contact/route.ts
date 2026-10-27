import { NextRequest, NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim().slice(0, 120);
    const fromEmail = String(body?.email || "").trim().toLowerCase();
    const subject = String(body?.subject || "").trim().slice(0, 160);
    const message = String(body?.message || "").trim().slice(0, 4000);

    if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fromEmail) || message.length < 5) {
      return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
    }

    await sendContactMessage({ fromEmail, name, subject: subject || "Mensaje web", message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact:", err);
    return NextResponse.json({ error: "No se pudo enviar el mensaje" }, { status: 500 });
  }
}
