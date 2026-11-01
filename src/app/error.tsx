"use client";

import Link from "next/link";
import { useEffect } from "react";

/* Frontera de error bilingüe: si una página falla, el cliente ve una salida
   clara (reintentar / seguir comprando) en lugar de la pantalla en blanco. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("app error:", error);
  }, [error]);

  return (
    <div className="container-gzs py-28 text-center max-w-xl">
      <p className="font-logo text-7xl text-gold">!</p>
      <h1 className="text-2xl sm:text-3xl font-black mt-4">
        Algo no ha cargado bien / Something went wrong
      </h1>
      <p className="text-smoke mt-3">
        Vuelve a intentarlo. Si el problema continúa, escríbenos a gzswear@roadshop.online.
      </p>
      <p className="text-smoke mt-1">
        Please try again. If it keeps happening, email us at gzswear@roadshop.online.
      </p>
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button onClick={reset} className="btn btn-primary">
          Reintentar / Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Inicio / Home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-smoke break-all">Ref: {error.digest}</p>
      )}
    </div>
  );
}
