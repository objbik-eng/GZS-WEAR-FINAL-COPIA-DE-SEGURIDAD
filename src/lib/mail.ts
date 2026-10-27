import "server-only";

const GREEN = "#5E845F";
const GOLD = "#D39905";
const INK = "#141414";

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

const eur = (cents: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format((Number(cents) || 0) / 100);

const site = () => process.env.SITE_URL || "https://gzswear.roadshop.online";
const from = () => process.env.RESEND_FROM || "GZS WEAR BRANDS <gzswear@roadshop.online>";

async function send({ to, subject, html, text, idempotencyKey }: {
  to: string; subject: string; html: string; text: string; idempotencyKey?: string;
}) {
  if (process.env.EMAILS_ENABLED !== "true") return { skipped: "emails_disabled" };
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY no configurada");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify({ from: from(), to: [to], subject, html, text }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(data as { message?: string }).message || "error"}`);
  return data;
}

function shell(title: string, body: string): string {
  return `<div style="margin:0;background:#f4f6f4;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:${INK}">
  <div style="max-width:620px;margin:auto;background:#ffffff;border:1px solid #e3e8e3;border-radius:14px;overflow:hidden">
    <div style="background:${GREEN};padding:26px 30px;color:#fff">
      <div style="font-size:13px;letter-spacing:4px;font-weight:700">GZS WEAR<span style="color:${GOLD}">*</span></div>
      <div style="font-size:11px;opacity:.85;margin-top:4px;letter-spacing:2px">COLECCIÓN DISRUPTIVE</div>
    </div>
    <div style="padding:32px 30px">
      <h1 style="font-size:28px;margin:0 0 14px;color:${INK}">${esc(title)}</h1>
      ${body}
    </div>
    <div style="padding:22px 30px;background:#fafafa;border-top:1px solid #eee;font-size:12px;color:#6b726b">
      GZS WEAR BRANDS · Moda de diseño exclusivo fabricada bajo pedido en Europa.<br>
      Ayuda: <a href="mailto:gzswear@roadshop.online" style="color:${GREEN}">gzswear@roadshop.online</a>
    </div>
  </div>
</div>`;
}

export interface MailItem { name: string; qty: number; colorLabel?: string; size?: string; }

export async function sendOrderConfirmation(opts: {
  to: string; name: string; sessionId: string; items: MailItem[]; totalCents: number;
}) {
  const { to, name, sessionId, items, totalCents } = opts;
  const rows = items.map((i) => {
    const details = [i.colorLabel, i.size].filter(Boolean).map(esc).join(" · ");
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #eee"><b>${esc(i.name)}</b>${
      details ? `<br><span style="color:#777;font-size:12px">${details}</span>` : ""
    }</td><td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right">×${Number(i.qty) || 1}</td></tr>`;
  }).join("");
  const link = `${site()}/pedido?session_id=${encodeURIComponent(sessionId)}`;
  const html = shell("Pedido confirmado", `
    <p>Hola${name ? ` ${esc(name)}` : ""}, hemos recibido tu pago y tu pedido ya está en producción en nuestro taller europeo.</p>
    <p style="color:#777;font-size:13px">Referencia: <b>${esc(sessionId)}</b></p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">${rows}
      <tr><td style="padding:16px 0"><b>Total pagado</b></td><td style="padding:16px 0;text-align:right"><b>${eur(totalCents)}</b></td></tr>
    </table>
    <p>Te avisaremos por email cuando el paquete salga con su seguimiento.</p>
    <p style="margin:26px 0"><a href="${esc(link)}" style="background:${GREEN};color:#fff;padding:14px 22px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700">Consultar mi pedido</a></p>`);
  const text = `GZS WEAR BRANDS — Pedido confirmado\nHola${name ? ` ${name}` : ""}, tu pago está confirmado y el pedido en producción.\nTotal: ${eur(totalCents)}\nEstado: ${link}\nAyuda: gzswear@roadshop.online`;
  return send({ to, subject: "Pedido confirmado · GZS WEAR BRANDS", html, text, idempotencyKey: `gzs-order-${sessionId}` });
}

export async function sendShipmentNotification(opts: {
  to: string; name: string; sessionId: string;
  shipments: { carrier?: string; tracking_number?: string; tracking_url?: string }[];
}) {
  const { to, name, sessionId, shipments } = opts;
  const tracking = shipments.map((s) => {
    const carrier = esc(s.carrier || "Transportista");
    const number = esc(s.tracking_number || "");
    const href = s.tracking_url ? ` · <a href="${esc(s.tracking_url)}" style="color:${GREEN}">Ver seguimiento</a>` : "";
    return `<li style="margin:10px 0"><b>${carrier}</b>${number ? ` · ${number}` : ""}${href}</li>`;
  }).join("");
  const link = `${site()}/pedido?session_id=${encodeURIComponent(sessionId)}`;
  const html = shell("Tu pedido está en camino", `
    <p>Hola${name ? ` ${esc(name)}` : ""}, tu pedido ha salido del taller.</p>
    <p style="color:#777;font-size:13px">Referencia: <b>${esc(sessionId)}</b></p>
    ${tracking ? `<ul style="padding-left:18px">${tracking}</ul>` : "<p>El transportista está preparando el enlace de seguimiento; consulta esta página más tarde.</p>"}
    <p style="margin:26px 0"><a href="${esc(link)}" style="background:${GREEN};color:#fff;padding:14px 22px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700">Ver estado del pedido</a></p>`);
  const text = `GZS WEAR BRANDS — Pedido en camino\nReferencia: ${sessionId}\nEstado: ${link}`;
  return send({
    to,
    subject: "Tu pedido está en camino · GZS WEAR BRANDS",
    html,
    text,
    idempotencyKey: `gzs-shipment-${sessionId}-${shipments.map((s) => s.tracking_number || "x").join("-")}`.slice(0, 180),
  });
}

export async function sendContactMessage(opts: { fromEmail: string; name: string; subject: string; message: string }) {
  const html = shell("Nuevo mensaje de contacto", `
    <p><b>Nombre:</b> ${esc(opts.name)}</p>
    <p><b>Email:</b> ${esc(opts.fromEmail)}</p>
    <p><b>Asunto:</b> ${esc(opts.subject)}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
    <p style="white-space:pre-wrap">${esc(opts.message)}</p>`);
  const text = `Mensaje de contacto de ${opts.name} <${opts.fromEmail}>\nAsunto: ${opts.subject}\n\n${opts.message}`;
  return send({ to: "gzswear@roadshop.online", subject: `Contacto web · ${opts.subject || opts.name}`, html, text });
}
