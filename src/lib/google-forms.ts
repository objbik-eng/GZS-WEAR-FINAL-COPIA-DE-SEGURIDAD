import "server-only";

/* Integración servidor con Google Forms (el cliente nunca ve Google).
   El formulario actual solo contiene la pregunta de correo (entry.624944565).
   Si se añaden más preguntas al formulario, basta con ampliar FIELD_ENTRIES. */

const FORM_ID = "1FAIpQLSfq9K9NKywkqZ8sdAUaeosRebWTjzBJTFAdEl_kO3wiVpl9xA";
const FORM_VIEW = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`;
const FORM_POST = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

export const FIELD_ENTRIES = {
  email: "entry.624944565",
} as const;

let cachedFbzx: string | null = null;

async function freshFbzx(): Promise<string> {
  const r = await fetch(FORM_VIEW, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" });
  const html = await r.text();
  const m = html.match(/name="fbzx" value="(-?\d+)"/);
  return m ? m[1] : "-1";
}

/**
 * Envía una respuesta al Google Form. Devuelve true si Google acepta el envío.
 * Google responde 200 incluso con errores de validación, por eso se comprueba el marcador.
 */
export async function submitGoogleForm(fields: Record<string, string>): Promise<boolean> {
  const body = new URLSearchParams({
    fvv: "1",
    pageHistory: "0",
    submissionTimestamp: "-1",
    ...fields,
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    if (!cachedFbzx) cachedFbzx = await freshFbzx();
    body.set("fbzx", cachedFbzx);
    const r = await fetch(FORM_POST, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
      },
      body,
    });
    const text = await r.text();
    if (r.ok && (text.includes("Your response has been recorded") || text.includes("already been recorded"))) {
      return true;
    }
    // El token fbzx puede caducar: reintentar una vez con uno nuevo.
    cachedFbzx = null;
  }
  return false;
}

export async function submitEmailToGoogleForm(email: string): Promise<boolean> {
  return submitGoogleForm({ [FIELD_ENTRIES.email]: email });
}
