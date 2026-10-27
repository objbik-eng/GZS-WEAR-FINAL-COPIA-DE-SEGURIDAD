import "server-only";
import { ApiError } from "@/lib/supabase";

const API = "https://api.stripe.com/v1";

function encodeForm(obj: Record<string, unknown>, prefix = "", out: [string, string][] = []): string {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item !== null && typeof item === "object") {
          encodeForm(item as Record<string, unknown>, `${key}[${i}]`, out);
        } else out.push([`${key}[${i}]`, String(item)]);
      });
    } else if (typeof v === "object") {
      encodeForm(v as Record<string, unknown>, key, out);
    } else {
      out.push([key, String(v)]);
    }
  }
  return new URLSearchParams(out).toString();
}

export async function stripe<T = unknown>(
  path: string,
  params: Record<string, unknown> | null = null,
  method?: string,
): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new ApiError(500, "Stripe no configurado");
  const r = await fetch(`${API}${path}`, {
    method: method || (params ? "POST" : "GET"),
    headers: {
      Authorization: `Bearer ${key}`,
      "Stripe-Version": "2024-06-20",
      ...(params ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: params ? encodeForm(params) : undefined,
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (data as { error?: { message?: string } })?.error?.message || `Stripe ${r.status}`;
    throw new ApiError(502, msg);
  }
  return data as T;
}

/* Verificación de firma de webhook mediante Web Crypto (edge-compatible). */
export async function verifyStripeSignature(payload: string, sigHeader: string | null, secret: string) {
  if (!sigHeader || !secret) return false;
  let timestamp: string | null = null;
  const signatures: string[] = [];
  for (const part of sigHeader.split(",")) {
    const [k, v] = part.split("=");
    if (k === "t") timestamp = v;
    if (k === "v1") signatures.push(v);
  }
  if (!timestamp || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return signatures.some((s) => {
    if (s.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < s.length; i++) diff |= s.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}
