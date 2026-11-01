"use client";

/* Última frontera: se muestra si falla el propio layout raíz. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#fff", color: "#141414" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Algo no ha cargado bien / Something went wrong</h1>
          <p style={{ color: "#6b726b", lineHeight: 1.6 }}>
            Vuelve a intentarlo en unos segundos. Si el problema continúa, escríbenos a gzswear@roadshop.online.
          </p>
          <p style={{ color: "#6b726b", lineHeight: 1.6 }}>
            Please try again in a few seconds. If it keeps happening, email gzswear@roadshop.online.
          </p>
          <button
            onClick={reset}
            style={{ marginTop: 28, background: "#5E845F", color: "#fff", border: 0, borderRadius: 999, padding: "14px 26px", fontWeight: 700, cursor: "pointer" }}
          >
            Reintentar / Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: 20, fontSize: 12, color: "#9aa19a" }}>Ref: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
